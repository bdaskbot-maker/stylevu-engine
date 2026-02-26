// ============================================
// StyleVu - Internationalization (i18n)
// Bengali + English support
// ============================================

import { Language } from './types';

type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    // Start Screen
    'start.title': 'Virtual Try-On',
    'start.subtitle': 'See how clothes look on you with AI',
    'start.takePhoto': 'Take a Photo',
    'start.uploadPhoto': 'Upload Photo',
    'start.browseCollection': 'Browse Collection',
    'start.poweredBy': 'Powered by StyleVu',
    'start.howItWorks': 'How It Works',
    'start.step1': 'Take or upload your photo',
    'start.step2': 'Choose a clothing item',
    'start.step3': 'See it on you instantly!',

    // Camera
    'camera.title': 'Take Your Photo',
    'camera.instruction': 'Stand facing the camera with arms slightly away from body',
    'camera.capture': 'Capture',
    'camera.retake': 'Retake',
    'camera.use': 'Use This Photo',
    'camera.switch': 'Switch Camera',
    'camera.uploading': 'Uploading...',
    'camera.tips': 'Tips: Good lighting, plain background, full body visible',

    // Wardrobe
    'wardrobe.title': 'Choose Your Outfit',
    'wardrobe.search': 'Search products...',
    'wardrobe.tryOn': 'Try This On',
    'wardrobe.price': 'Price',
    'wardrobe.noProducts': 'No products in this category',
    'wardrobe.allCategories': 'All',
    'wardrobe.filterBy': 'Filter by category',

    // Try-On / Processing
    'tryOn.processing': 'Creating your look...',
    'tryOn.pleaseWait': 'This usually takes 5-10 seconds',
    'tryOn.result': 'Your Look',
    'tryOn.tryAnother': 'Try Another',
    'tryOn.buyNow': 'Buy Now',
    'tryOn.share': 'Share',
    'tryOn.save': 'Save Image',
    'tryOn.error': 'Something went wrong. Please try again.',
    'tryOn.limitReached': 'Daily try-on limit reached. Please try again tomorrow.',

    // Share
    'share.title': 'Share Your Look',
    'share.facebook': 'Share on Facebook',
    'share.whatsapp': 'Share on WhatsApp',
    'share.instagram': 'Share on Instagram',
    'share.download': 'Download Image',
    'share.copied': 'Link copied!',
    'share.shareText': 'Check out my look from',

    // Buy
    'buy.buyNow': 'Buy Now',
    'buy.orderWhatsApp': 'Order via WhatsApp',
    'buy.visitStore': 'Visit Store',
    'buy.orderFacebook': 'Order via Facebook',

    // General
    'general.back': 'Back',
    'general.close': 'Close',
    'general.loading': 'Loading...',
    'general.error': 'Error',
    'general.retry': 'Retry',
    'general.language': 'বাংলা',
    'general.changeLanguage': 'Change Language',
  },

  bn: {
    // Start Screen
    'start.title': 'ভার্চুয়াল ট্রাই-অন',
    'start.subtitle': 'AI দিয়ে দেখুন জামাকাপড় আপনার গায়ে কেমন লাগবে',
    'start.takePhoto': 'ছবি তুলুন',
    'start.uploadPhoto': 'ছবি আপলোড করুন',
    'start.browseCollection': 'কালেকশন দেখুন',
    'start.poweredBy': 'StyleVu দ্বারা পরিচালিত',
    'start.howItWorks': 'কিভাবে কাজ করে',
    'start.step1': 'আপনার ছবি তুলুন বা আপলোড করুন',
    'start.step2': 'একটি পোশাক বাছাই করুন',
    'start.step3': 'সাথে সাথে দেখুন আপনার গায়ে!',

    // Camera
    'camera.title': 'আপনার ছবি তুলুন',
    'camera.instruction': 'ক্যামেরার দিকে মুখ করে দাঁড়ান, হাত শরীর থেকে একটু দূরে রাখুন',
    'camera.capture': 'ছবি তুলুন',
    'camera.retake': 'আবার তুলুন',
    'camera.use': 'এই ছবি ব্যবহার করুন',
    'camera.switch': 'ক্যামেরা পরিবর্তন',
    'camera.uploading': 'আপলোড হচ্ছে...',
    'camera.tips': 'টিপস: ভালো আলো, সাদা ব্যাকগ্রাউন্ড, পুরো শরীর দেখা যাক',

    // Wardrobe
    'wardrobe.title': 'আপনার পোশাক বাছাই করুন',
    'wardrobe.search': 'পণ্য খুঁজুন...',
    'wardrobe.tryOn': 'এটি পরে দেখুন',
    'wardrobe.price': 'দাম',
    'wardrobe.noProducts': 'এই ক্যাটাগরিতে কোনো পণ্য নেই',
    'wardrobe.allCategories': 'সব',
    'wardrobe.filterBy': 'ক্যাটাগরি অনুযায়ী ফিল্টার',

    // Try-On / Processing
    'tryOn.processing': 'আপনার লুক তৈরি হচ্ছে...',
    'tryOn.pleaseWait': 'সাধারণত ৫-১০ সেকেন্ড লাগে',
    'tryOn.result': 'আপনার লুক',
    'tryOn.tryAnother': 'আরেকটি পরুন',
    'tryOn.buyNow': 'এখনই কিনুন',
    'tryOn.share': 'শেয়ার করুন',
    'tryOn.save': 'ছবি সেভ করুন',
    'tryOn.error': 'কিছু ভুল হয়েছে। আবার চেষ্টা করুন।',
    'tryOn.limitReached': 'আজকের ট্রাই-অন লিমিট শেষ। আগামীকাল আবার চেষ্টা করুন।',

    // Share
    'share.title': 'আপনার লুক শেয়ার করুন',
    'share.facebook': 'ফেসবুকে শেয়ার করুন',
    'share.whatsapp': 'হোয়াটসঅ্যাপে শেয়ার করুন',
    'share.instagram': 'ইনস্টাগ্রামে শেয়ার করুন',
    'share.download': 'ছবি ডাউনলোড করুন',
    'share.copied': 'লিংক কপি হয়েছে!',
    'share.shareText': 'দেখুন আমার লুক',

    // Buy
    'buy.buyNow': 'এখনই কিনুন',
    'buy.orderWhatsApp': 'হোয়াটসঅ্যাপে অর্ডার করুন',
    'buy.visitStore': 'দোকানে যান',
    'buy.orderFacebook': 'ফেসবুকে অর্ডার করুন',

    // General
    'general.back': 'পেছনে',
    'general.close': 'বন্ধ করুন',
    'general.loading': 'লোড হচ্ছে...',
    'general.error': 'ত্রুটি',
    'general.retry': 'আবার চেষ্টা',
    'general.language': 'English',
    'general.changeLanguage': 'ভাষা পরিবর্তন করুন',
  },
} as const;

let currentLanguage: Language = 'bn';

/**
 * Set the current language
 */
export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', 'ltr');
}

/**
 * Get the current language
 */
export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * Translate a key to the current language
 */
export function t(key: TranslationKey): string {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

/**
 * Translate with a specific language override
 */
export function tLang(key: TranslationKey, lang: Language): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

/**
 * Format price in BDT
 */
export function formatPrice(price: number, currency: string = '৳'): string {
  if (currentLanguage === 'bn') {
    return `${currency}${toBengaliNumber(price)}`;
  }
  return `${currency}${price.toLocaleString()}`;
}

/**
 * Convert number to Bengali digits
 */
export function toBengaliNumber(num: number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toLocaleString()
    .split('')
    .map(char => {
      const digit = parseInt(char);
      return isNaN(digit) ? char : bengaliDigits[digit];
    })
    .join('');
}

/**
 * Get product name in current language
 */
export function getProductName(product: { name: string; nameBn?: string }): string {
  if (currentLanguage === 'bn' && product.nameBn) {
    return product.nameBn;
  }
  return product.name;
}

/**
 * Get category name in current language
 */
export function getCategoryName(category: { name: string; nameBn: string }): string {
  return currentLanguage === 'bn' ? category.nameBn : category.name;
}

export { translations };
export type { TranslationKey };
