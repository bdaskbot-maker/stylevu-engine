// ============================================
// StyleVu - Wardrobe Panel
// Product catalog with categories + try-on
// ============================================

import { useState, useMemo } from 'react';
import { useBrand } from '../BrandContext';
import { t, formatPrice, getProductName, getCategoryName } from '../i18n';
import { Product } from '../types';

interface WardrobePanelProps {
  userPhoto: string;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onTryOn: (product: Product) => void;
  onBack: () => void;
}

export default function WardrobePanel({
  userPhoto,
  activeCategory,
  onCategoryChange,
  onTryOn,
  onBack,
}: WardrobePanelProps) {
  const { config, language } = useBrand();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!config) return [];

    let products = config.products.filter((p) => p.isActive !== false);

    // Filter by category
    if (activeCategory !== 'all') {
      products = products.filter((p) => p.category === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameBn?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort by sortOrder
    return products.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [config, activeCategory, searchQuery]);

  if (!config) return null;

  return (
    <div className="sv-wardrobe">
      {/* Top bar */}
      <div className="sv-wardrobe-header">
        <button className="sv-btn-icon" onClick={onBack}>
          ← {t('general.back')}
        </button>
        <h2>{t('wardrobe.title')}</h2>
      </div>

      {/* User photo thumbnail */}
      <div className="sv-wardrobe-user">
        <img src={userPhoto} alt="You" className="sv-wardrobe-user-photo" />
        <span className="sv-wardrobe-user-label">
          {language === 'bn' ? 'আপনার ছবি' : 'Your Photo'}
        </span>
      </div>

      {/* Search */}
      <div className="sv-wardrobe-search">
        <input
          type="text"
          placeholder={t('wardrobe.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sv-search-input"
        />
      </div>

      {/* Category tabs */}
      <div className="sv-category-tabs">
        {config.categories.map((cat) => (
          <button
            key={cat.id}
            className={`sv-category-tab ${activeCategory === cat.id ? 'sv-category-active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
            style={
              activeCategory === cat.id
                ? { backgroundColor: config.colors.primary, color: '#fff' }
                : {}
            }
          >
            <span className="sv-category-icon">{cat.icon}</span>
            <span className="sv-category-name">{getCategoryName(cat)}</span>
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="sv-product-grid">
        {filteredProducts.length === 0 ? (
          <p className="sv-no-products">{t('wardrobe.noProducts')}</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              primaryColor={config.colors.primary}
              onTryOn={() => onTryOn(product)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ---------- Product Card ----------
function ProductCard({
  product,
  primaryColor,
  onTryOn,
}: {
  product: Product;
  primaryColor: string;
  onTryOn: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="sv-product-card">
      <div className="sv-product-image-wrap">
        {!imageLoaded && !imageError && <div className="sv-product-skeleton" />}
        {imageError ? (
          <div className="sv-product-error">📷</div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`sv-product-image ${imageLoaded ? 'sv-loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
      </div>
      <div className="sv-product-info">
        <p className="sv-product-name">{getProductName(product)}</p>
        <p className="sv-product-price">{formatPrice(product.price, product.currency || '৳')}</p>
      </div>
      <button
        className="sv-btn sv-btn-tryon"
        onClick={onTryOn}
        style={{ backgroundColor: primaryColor }}
      >
        👗 {t('wardrobe.tryOn')}
      </button>
    </div>
  );
}
