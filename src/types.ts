// ============================================
// StyleVu - Core Types
// White-label Virtual Try-On Platform
// ============================================

export type Language = 'en' | 'bn';
export type BuyLinkType = 'website' | 'whatsapp' | 'facebook' | 'messenger';
export type PlanTier = 'starter' | 'growth' | 'premium';

export interface BrandColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export interface BrandSocialShare {
  facebook: boolean;
  whatsapp: boolean;
  instagram: boolean;
  download: boolean;
}

export interface BrandWatermark {
  enabled: boolean;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  opacity: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  buyLink: string;
  isActive: boolean;
  sortOrder: number;
}

export interface BrandConfig {
  brandId: string;
  brandName: string;
  brandNameBn?: string;
  logo: string;
  tagline: string;
  taglineBn?: string;
  colors: BrandColors;
  language: Language;
  contactWhatsApp: string;
  buyLinkType: BuyLinkType;
  products: Product[];
  categories: ProductCategory[];
  socialShare: BrandSocialShare;
  watermark: BrandWatermark;
  plan: PlanTier;
  customDomain?: string;
  poweredByBadge: boolean;
  maxTryOns: number;
  analyticsId?: string;
}

export interface TryOnResult {
  id: string;
  imageUrl: string;
  productId: string;
  productName: string;
  timestamp: number;
  brandId: string;
}

export interface AppState {
  currentScreen: 'start' | 'camera' | 'wardrobe' | 'result' | 'share';
  selectedProduct: Product | null;
  userPhoto: string | null;
  tryOnResult: TryOnResult | null;
  isProcessing: boolean;
  error: string | null;
  activeCategory: string;
  language: Language;
  sessionTryOns: number;
}

export interface ProxyRequest {
  brandId: string;
  userImage: string;
  productImage: string;
  prompt?: string;
}

export interface ProxyResponse {
  success: boolean;
  resultImage?: string;
  error?: string;
  usage?: {
    brandId: string;
    tryOnsUsed: number;
    tryOnsLimit: number;
  };
}

export interface ShareData {
  image: string;
  brandName: string;
  productName: string;
  brandUrl: string;
  watermarked: boolean;
}
