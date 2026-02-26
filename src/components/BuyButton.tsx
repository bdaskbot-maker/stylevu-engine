// ============================================
// StyleVu - Buy Button
// Configurable purchase redirect
// ============================================

import { useBrand } from '../BrandContext';
import { t } from '../i18n';
import { Product } from '../types';

interface BuyButtonProps {
  product: Product;
  className?: string;
}

export default function BuyButton({ product, className = '' }: BuyButtonProps) {
  const { config, language } = useBrand();
  if (!config) return null;

  const handleBuy = () => {
    const { buyLinkType, contactWhatsApp, brandName } = config;

    switch (buyLinkType) {
      case 'whatsapp': {
        const productName = language === 'bn' && product.nameBn ? product.nameBn : product.name;
        const message =
          language === 'bn'
            ? `আসসালামু আলাইকুম! ${brandName} থেকে আমি "${productName}" (৳${product.price}) অর্ডার করতে চাই। StyleVu তে পরে দেখে পছন্দ হয়েছে!`
            : `Hi! I'd like to order "${product.name}" (৳${product.price}) from ${brandName}. I tried it on StyleVu and loved it!`;
        const phone = contactWhatsApp.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        break;
      }

      case 'facebook':
      case 'messenger': {
        window.open(product.buyLink, '_blank');
        break;
      }

      case 'website':
      default: {
        window.open(product.buyLink, '_blank');
        break;
      }
    }

    // Track conversion event
    trackConversion(config.brandId, product.id);
  };

  const getButtonLabel = () => {
    switch (config.buyLinkType) {
      case 'whatsapp':
        return t('buy.orderWhatsApp');
      case 'facebook':
      case 'messenger':
        return t('buy.orderFacebook');
      default:
        return t('buy.buyNow');
    }
  };

  const getButtonIcon = () => {
    switch (config.buyLinkType) {
      case 'whatsapp':
        return '💬';
      case 'facebook':
      case 'messenger':
        return '📘';
      default:
        return '🛒';
    }
  };

  return (
    <button
      className={`sv-btn sv-btn-buy ${className}`}
      onClick={handleBuy}
      style={{ backgroundColor: config.colors.accent }}
    >
      {getButtonIcon()} {getButtonLabel()}
    </button>
  );
}

/**
 * Track conversion event (send to proxy for analytics)
 */
function trackConversion(brandId: string, productId: string) {
  try {
    const proxyUrl = import.meta.env.VITE_PROXY_URL || 'https://gemini-proxy.stylevu.com';
    navigator.sendBeacon(
      `${proxyUrl}/api/track`,
      JSON.stringify({
        event: 'conversion_click',
        brandId,
        productId,
        timestamp: Date.now(),
      })
    );
  } catch {
    // Silent fail for analytics
  }
}
