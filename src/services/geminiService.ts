// ============================================
// StyleVu - Gemini AI Service
// Calls Cloudflare Worker proxy for try-on
// ============================================

import { ProxyRequest, ProxyResponse } from '../types';
import { getProxyUrl } from '../brandConfig';

const PROXY_URL = getProxyUrl();

/**
 * Generate virtual try-on image via AI proxy
 */
export async function generateTryOn(
  brandId: string,
  userImage: string,
  productImage: string,
  productCategory?: string
): Promise<ProxyResponse> {
  const categoryPrompts: Record<string, string> = {
    panjabi:
      'The person is wearing this Panjabi/Punjabi kurta. Show the garment fitting naturally on the person body. Keep the person face, pose, and background exactly the same. The Panjabi should look realistic with proper draping and fit.',
    saree:
      'The person is wearing this saree draped in traditional Bengali style. Show the saree wrapped elegantly around the person. Keep the person face, pose, and background unchanged. The saree should look realistic with natural folds and draping.',
    'salwar-kameez':
      'The person is wearing this salwar kameez outfit. Show the kameez and salwar fitting naturally. Keep the person face, pose unchanged. The outfit should look realistic and well-fitted.',
    shirt:
      'The person is wearing this shirt. Show the shirt fitting naturally on the person torso. Keep the person face, pose, and lower body unchanged. The shirt should look realistic.',
    tshirt:
      'The person is wearing this t-shirt. Show it fitting naturally and casually. Keep face, pose, and lower body unchanged.',
    jeans:
      'The person is wearing these jeans. Show the jeans fitting naturally on the lower body. Keep everything else unchanged.',
    kurta:
      'The person is wearing this kurta. Show it fitting naturally. Keep face, pose unchanged. Natural draping and fit.',
    lehenga:
      'The person is wearing this lehenga. Show the skirt and blouse fitting elegantly. Keep face, pose unchanged. Realistic draping.',
    abaya:
      'The person is wearing this abaya. Show it draped naturally over the body. Keep face unchanged. Modest and elegant fit.',
    western:
      'The person is wearing this dress. Show it fitting naturally and elegantly. Keep face, pose unchanged.',
    'eid-collection':
      'The person is wearing this Eid outfit. Show the garment fitting elegantly for the festive occasion. Keep face, pose unchanged. Rich, festive look.',
  };

  const prompt =
    categoryPrompts[productCategory || ''] ||
    'The person is wearing this clothing item. Show the garment fitting naturally on the person. Keep the person face, pose, and background exactly the same. Make it look realistic.';

  const request: ProxyRequest = {
    brandId,
    userImage: stripBase64Prefix(userImage),
    productImage: stripBase64Prefix(productImage),
    prompt,
  };

  try {
    const response = await fetch(`${PROXY_URL}/api/try-on`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Brand-ID': brandId,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 429) {
        return {
          success: false,
          error: 'rate_limit',
          usage: errorData.usage,
        };
      }

      return {
        success: false,
        error: errorData.error || `Server error: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      resultImage: data.resultImage,
      usage: data.usage,
    };
  } catch (error) {
    console.error('Try-on API error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
}

/**
 * Fetch a product image and convert to base64
 */
export async function fetchProductImageAsBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to fetch product image:', error);
    throw new Error('Failed to load product image');
  }
}

/**
 * Strip base64 prefix (data:image/...;base64,)
 */
function stripBase64Prefix(base64: string): string {
  const commaIndex = base64.indexOf(',');
  return commaIndex > -1 ? base64.substring(commaIndex + 1) : base64;
}

/**
 * Check usage status for a brand
 */
export async function checkUsage(brandId: string): Promise<{
  used: number;
  limit: number;
  remaining: number;
} | null> {
  try {
    const response = await fetch(`${PROXY_URL}/api/usage/${brandId}`, {
      headers: { 'X-Brand-ID': brandId },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
