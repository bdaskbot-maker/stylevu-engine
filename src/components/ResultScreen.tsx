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

  return (
    <div className="sv-result">
      <div className="sv-result-header">
        <button className="sv-btn-icon" onClick={onBack}>
          ← {t('general.back')}
        </button>
        <h2>{t('tryOn.result')}</h2>
        <div />
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
          alt="Try-on result"
          className={`sv-result-image ${imageLoaded ? 'sv-loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
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

        <button
          className="sv-btn sv-btn-share"
          onClick={() => setShowShare(true)}
          style={{ borderColor: config.colors.primary, color: config.colors.primary }}
        >
          📤 {t('tryOn.share')}
        </button>

        <button className="sv-btn sv-btn-ghost" onClick={onTryAnother}>
          👗 {t('tryOn.tryAnother')}
        </button>
      </div>

      {/* Share panel */}
      {showShare && <SharePanel result={result} onClose={() => setShowShare(false)} />}
    </div>
  );
}
