// ============================================
// StyleVu - Cloudflare Worker AI Proxy
// Routes: /api/try-on, /api/usage/:brandId, /api/track
// KV: BRAND_USAGE (per-brand counters), BRAND_CONFIG (config cache)
// Secret: GEMINI_API_KEY
// ============================================

const GEMINI_MODEL = 'gemini-2.5-flash-preview-native-audio-dialog';
const GEMINI_VISION_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Plan limits (monthly try-ons)
const PLAN_LIMITS = {
  starter: 300,
  growth: 1500,
  premium: 5000,
};

// CORS headers for brand apps
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Brand-ID',
  'Content-Type': 'application/json',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Route: POST /api/try-on
      if (path === '/api/try-on' && request.method === 'POST') {
        return await handleTryOn(request, env);
      }

      // Route: GET /api/usage/:brandId
      if (path.startsWith('/api/usage/') && request.method === 'GET') {
        const brandId = path.split('/').pop();
        return await handleUsage(brandId, env);
      }

      // Route: POST /api/track
      if (path === '/api/track' && request.method === 'POST') {
        return await handleTrack(request, env);
      }

      // Health check
      if (path === '/health') {
        return json({ status: 'ok', timestamp: Date.now() });
      }

      return json({ error: 'Not found' }, 404);
    } catch (error) {
      console.error('Worker error:', error);
      return json({ error: 'Internal server error' }, 500);
    }
  },
};

// ---------- Try-On Handler ----------
async function handleTryOn(request, env) {
  const body = await request.json();
  const { brandId, userImage, productImage, prompt } = body;

  if (!brandId || !userImage || !productImage) {
    return json({ error: 'Missing required fields: brandId, userImage, productImage' }, 400);
  }

  // Check rate limit
  const usageKey = `usage:${brandId}:${getCurrentMonth()}`;
  const currentUsage = parseInt((await env.BRAND_USAGE.get(usageKey)) || '0');
  
  // Get brand plan limit
  const configKey = `config:${brandId}`;
  const brandConfig = JSON.parse((await env.BRAND_CONFIG.get(configKey)) || '{}');
  const plan = brandConfig.plan || 'starter';
  const limit = PLAN_LIMITS[plan] || 300;

  if (currentUsage >= limit) {
    return json({
      success: false,
      error: 'rate_limit',
      usage: { brandId, tryOnsUsed: currentUsage, tryOnsLimit: limit },
    }, 429);
  }

  // Build Gemini request
  const geminiPrompt = prompt || 
    'The person is wearing this clothing item. Show the garment fitting naturally. Keep face and pose unchanged.';

  const geminiBody = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: userImage,
            },
          },
          {
            inline_data: {
              mime_type: 'image/png',
              data: productImage,
            },
          },
          {
            text: geminiPrompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      temperature: 0.4,
      maxOutputTokens: 4096,
    },
  };

  // Call Gemini API
  const geminiResponse = await fetch(`${GEMINI_VISION_URL}?key=${env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geminiBody),
  });

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    console.error('Gemini API error:', geminiResponse.status, errorText);
    return json({
      success: false,
      error: `AI service error: ${geminiResponse.status}`,
    }, 502);
  }

  const geminiData = await geminiResponse.json();

  // Extract generated image from response
  let resultImage = null;
  const candidates = geminiData.candidates || [];
  for (const candidate of candidates) {
    const parts = candidate.content?.parts || [];
    for (const part of parts) {
      if (part.inline_data?.mime_type?.startsWith('image/')) {
        resultImage = part.inline_data.data;
        break;
      }
    }
    if (resultImage) break;
  }

  if (!resultImage) {
    // Fallback: check if there's text describing why image wasn't generated
    const textPart = candidates[0]?.content?.parts?.find(p => p.text);
    console.error('No image in Gemini response:', textPart?.text || 'Unknown');
    return json({
      success: false,
      error: 'AI could not generate the try-on image. Please try a different photo or product.',
    }, 422);
  }

  // Increment usage counter
  await env.BRAND_USAGE.put(usageKey, String(currentUsage + 1), {
    expirationTtl: 60 * 60 * 24 * 35, // 35 days TTL
  });

  // Track event
  await trackEvent(env, brandId, 'try_on', { productId: body.productId });

  return json({
    success: true,
    resultImage,
    usage: {
      brandId,
      tryOnsUsed: currentUsage + 1,
      tryOnsLimit: limit,
    },
  });
}

// ---------- Usage Handler ----------
async function handleUsage(brandId, env) {
  const usageKey = `usage:${brandId}:${getCurrentMonth()}`;
  const currentUsage = parseInt((await env.BRAND_USAGE.get(usageKey)) || '0');

  const configKey = `config:${brandId}`;
  const brandConfig = JSON.parse((await env.BRAND_CONFIG.get(configKey)) || '{}');
  const plan = brandConfig.plan || 'starter';
  const limit = PLAN_LIMITS[plan] || 300;

  return json({
    used: currentUsage,
    limit,
    remaining: Math.max(0, limit - currentUsage),
  });
}

// ---------- Track Handler ----------
async function handleTrack(request, env) {
  try {
    const body = await request.json();
    await trackEvent(env, body.brandId, body.event, body);
    return json({ ok: true });
  } catch {
    return json({ ok: false }, 400);
  }
}

// ---------- Helpers ----------
function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

async function trackEvent(env, brandId, event, data = {}) {
  try {
    const key = `events:${brandId}:${getCurrentMonth()}:${event}`;
    const count = parseInt((await env.BRAND_USAGE.get(key)) || '0');
    await env.BRAND_USAGE.put(key, String(count + 1), {
      expirationTtl: 60 * 60 * 24 * 35,
    });
  } catch (e) {
    console.error('Track event error:', e);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}
