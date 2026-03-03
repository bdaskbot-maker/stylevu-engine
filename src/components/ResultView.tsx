import { useState } from 'react';
import { getBrandConfig } from '../brandConfig';
import { t } from '../i18n';
import type { Product } from '../types';
import SharePanel from './SharePanel';
import BuyButton from './BuyButton';

interface ResultViewProps {
  resultImage: string;
  product: Product;
  onTryAnother: () => void;
  onBack: () => void;
}

export default function ResultView({ resultImage, product, onTryAnother, onBack }: ResultViewProps) {
  const config = getBrandConfig();
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="sv-result">
      <div className="sv-result-image-container">
        <img
          src={resultImage.startsWith('data:') ? resultImage : `data:image/jpeg;base64,${resultImage}`}
          alt={`${product.name} try-on result`}
          className="sv-result-image"
        />
      </div>

      <div className="sv-result-info">
        <h2 className="sv-result-product-name">
          {config.language === 'bn' && product.nameBn ? product.nameBn : product.name}
        </h2>
        <p className="sv-result-product-price">
          {product.currency || '৳'}{product.price.toLocaleString()}
        </p>
      </div>

      <div className="sv-result-actions">
        <BuyButton product={product} className="sv-result-buy" />

        {(config.socialShare.facebook || config.socialShare.whatsapp || config.socialShare.instagram || config.socialShare.download) && (
          <button
            className="sv-btn sv-btn-outline"
            onClick={() => setShowShare(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            {t('result.share')}
          </button>
        )}

        <button className="sv-btn sv-btn-secondary" onClick={onTryAnother}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
          {t('result.tryAnother')}
        </button>
      </div>

      {showShare && (
        <SharePanel
          result={{
            id: product.id,
            imageUrl: resultImage.startsWith('data:') ? resultImage : `data:image/jpeg;base64,${resultImage}`,
            productId: product.id,
            productName: product.name,
            timestamp: Date.now(),
            brandId: config.brandId,
          }}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
