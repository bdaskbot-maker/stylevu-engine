// ============================================
// StyleVu - Brand Configuration Loader
// Loads brand-specific config at runtime
// ============================================

import { BrandConfig, BrandColors, ProductCategory } from './types';

// Default colors if brand doesn't specify
const DEFAULT_COLORS: BrandColors = {
  primary: '#059669',
  secondary: '#064e3b',
  background: '#ffffff',
  text: '#1f2937',
  accent: '#d97706',
};

// Default product categories for Bangladesh fashion
const DEFAULT_CATEGORIES: ProductCategory[] = [
  { id: 'all', name: 'All', nameBn: 'সব', icon: '👗' },
  { id: 'panjabi', name: 'Panjabi', nameBn: 'পাঞ্জাবি', icon: '🧥' },
  { id: 'saree', name: 'Saree', nameBn: 'শাড়ি', icon: '👘' },
  { id: 'salwar-kameez', name: 'Salwar Kameez', nameBn: 'সালোয়ার কামিজ', icon: '👚' },
  { id: 'shirt', name: 'Shirt', nameBn: 'শার্ট', icon: '👔' },
  { id: 'tshirt', name: 'T-Shirt', nameBn: 'টি-শার্ট', icon: '👕' },
  { id: 'jeans', name: 'Jeans', nameBn: 'জিন্স', icon: '👖' },
  { id: 'kurta', name: 'Kurta', nameBn: 'কুর্তা', icon: '🥻' },
  { id: 'lehenga', name: 'Lehenga', nameBn: 'লেহেঙ্গা', icon: '💃' },
  { id: 'abaya', name: 'Abaya', nameBn: 'আবায়া', icon: '🧕' },
  { id: 'western', name: 'Western Dress', nameBn: 'ওয়েস্টার্ন ড্রেস', icon: '👗' },
  { id: 'eid-collection', name: 'Eid Collection', nameBn: 'ঈদ কালেকশন', icon: '🌙' },
];

// Plan limits
const PLAN_LIMITS: Record<string, number> = {
  starter: 300,
  growth: 1500,
  premium: 5000,
};

/**
 * Load brand configuration from the embedded config
 * In production, this reads from /brands/{brandId}/config.json
 * During build, Vite injects the config based on BRAND_ID env var
 */
export async function loadBrandConfig(): Promise<BrandConfig> {
  const brandId = import.meta.env.VITE_BRAND_ID || 'demo';

  try {
    // Dynamic import of brand config
    const configModule = await import(`./brands/${brandId}/config.json`);
    const rawConfig = configModule.default || configModule;
    return normalizeBrandConfig(rawConfig);
  } catch (error) {
    console.warn(`Failed to load config for brand "${brandId}", using demo config`);
    // Fallback to demo config
    const demoConfig = await import('./brands/demo/config.json');
    return normalizeBrandConfig(demoConfig.default || demoConfig);
  }
}

/**
 * Normalize and validate brand config with defaults
 */
function normalizeBrandConfig(raw: Partial<BrandConfig>): BrandConfig {
  const plan = raw.plan || 'starter';

  return {
    brandId: raw.brandId || 'demo',
    brandName: raw.brandName || 'StyleVu Demo',
    brandNameBn: raw.brandNameBn,
    logo: raw.logo || '/logo.png',
    tagline: raw.tagline || 'Try Before You Buy with AI',
    taglineBn: raw.taglineBn || 'AI দিয়ে কেনার আগে পরে দেখুন',
    colors: { ...DEFAULT_COLORS, ...raw.colors },
    language: raw.language || 'bn',
    contactWhatsApp: raw.contactWhatsApp || '',
    buyLinkType: raw.buyLinkType || 'website',
    products: (raw.products || []).filter(p => p.isActive !== false),
    categories: raw.categories || DEFAULT_CATEGORIES,
    socialShare: {
      facebook: true,
      whatsapp: true,
      instagram: true,
      download: true,
      ...raw.socialShare,
    },
    watermark: {
      enabled: plan !== 'premium',
      position: 'bottom-right',
      opacity: 0.3,
      ...raw.watermark,
    },
    plan,
    customDomain: raw.customDomain,
    poweredByBadge: plan !== 'premium',
    maxTryOns: PLAN_LIMITS[plan] || 300,
    analyticsId: raw.analyticsId,
  };
}

/**
 * Apply brand colors as CSS custom properties on :root
 */
export function applyBrandTheme(config: BrandConfig): void {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', config.colors.primary);
  root.style.setProperty('--color-secondary', config.colors.secondary);
  root.style.setProperty('--color-background', config.colors.background);
  root.style.setProperty('--color-text', config.colors.text);
  root.style.setProperty('--color-accent', config.colors.accent);

  // Set page title
  document.title = `${config.brandName} - Virtual Try-On`;

  // Set favicon if logo available
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (favicon && config.logo) {
    favicon.href = config.logo;
  }
}

/**
 * Get the proxy URL for API calls
 */
export function getProxyUrl(): string {
  return import.meta.env.VITE_PROXY_URL || 'https://gemini-proxy.stylevu.com';
}

/**
 * Get image base URL (R2 bucket)
 */
export function getImageBaseUrl(): string {
  return import.meta.env.VITE_IMAGE_BASE_URL || 'https://images.stylevu.com';
}

// Cached brand config for synchronous access (must call loadBrandConfig first)
let cachedBrandConfig: BrandConfig | null = null;

/**
 * Get the cached brand config (synchronous)
 * Must call loadBrandConfig() first during app initialization
 */
export function getBrandConfig(): BrandConfig {
  if (!cachedBrandConfig) {
    // Return default config if not loaded yet
    return {
      brandId: 'demo',
      brandName: 'StyleVu Demo',
      brandNameBn: undefined,
      logo: '/logo.png',
      tagline: 'Try Before You Buy with AI',
      taglineBn: 'AI দিয়ে কেনার আগে পরে দেখুন',
      colors: DEFAULT_COLORS,
      language: 'bn',
      contactWhatsApp: '',
      buyLinkType: 'website',
      products: [],
      categories: DEFAULT_CATEGORIES,
      socialShare: {
        facebook: true,
        whatsapp: true,
        instagram: true,
        download: true,
      },
      watermark: {
        enabled: true,
        position: 'bottom-right',
        opacity: 0.3,
      },
      plan: 'starter',
      poweredByBadge: true,
      maxTryOns: 300,
    };
  }
  return cachedBrandConfig;
}

/**
 * Set the cached brand config (called after loadBrandConfig resolves)
 */
export function setBrandConfig(config: BrandConfig): void {
  cachedBrandConfig = config;
}

// Export the brandConfig as a getter for legacy usage
export const brandConfig = new Proxy({} as BrandConfig, {
  get: (_target, prop) => {
    const config = getBrandConfig();
    return config[prop as keyof BrandConfig];
  },
});
