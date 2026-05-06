// ============================================
// StyleVu - Result Screen
// Shows the AI try-on result
// ============================================

import { useState } from 'react';
import { useBrand } from '../BrandContext';
import { t, formatPrice, getProductName } from '../i18n';
import { TryOnResult, Product } from '../types';
import BuyButton from './BuyButton';
import SharePanel from './SharePanel';

interface ResultScreenProps {
  result: TryOnResult;
  product: Product;
  onTryAnother: () => void;
  onBack: () => void;
}

export default function ResultScreen({ result, product, onTryAnother, onBack }: ResultScreenProps) {
  const { config } = useBrand();
  const [showShare, setShowShare] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!config) return null;

  const hasShareOptions = config.socialShare.facebook || 
    config.socialShare.whatsapp || 
    config.socialShare.instagram || 
    config.socialShare.download;

  return (
    <div className="sv-result sv-fade-in">
      <div className="sv-result-header">
        <button className="sv-btn-icon" onClick={onBack} aria-label={t('general.back')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {t('general.back')}
        </button>
        <h2>{t('tryOn.result')}</h2>
        <div style={{ width: 60 }} />
      </div>

      {/* Result image */}
      <div className="sv-result-image-wrap">
        {!imageLoaded && (
          <div className="sv-result-skeleton">
            <div className="sv-spinner" style={{ borderTopColor: config.colors.primary }} />
          </div>
        )}
        <img
          src={result.imageUrl}
          alt={`${t('tryOn.result')} - ${product.name}`}
          className={`sv-result-image ${imageLoaded ? 'sv-loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          crossOrigin="anonymous"
        />
      </div>

      {/* Product info */}
      <div className="sv-result-product">
        <div className="sv-result-product-info">
          <h3>{getProductName(product)}</h3>
          <p className="sv-result-price">
            {formatPrice(product.price, product.currency || '৳')}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="sv-result-actions">
        <BuyButton product={product} className="sv-result-buy" />

        {hasShareOptions && (
          <button
            className="sv-btn sv-btn-share sv-btn-secondary"
            onClick={() => setShowShare(true)}
            style={{ borderColor: config.colors.primary, color: config.colors.primary }}
            aria-label={t('tryOn.share')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {t('tryOn.share')}
          </button>
        )}

        <button className="sv-btn sv-btn-ghost" onClick={onTryAnother}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
          </svg>
          {t('tryOn.tryAnother')}
        </button>
      </div>

      {/* Share panel */}
      {showShare && <SharePanel result={result} onClose={() => setShowShare(false)} />}
    </div>
  );
}
