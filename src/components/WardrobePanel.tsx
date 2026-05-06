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
    <div className="sv-wardrobe sv-fade-in">
      {/* Top bar */}
      <div className="sv-wardrobe-header">
        <button className="sv-btn-icon" onClick={onBack} aria-label={t('general.back')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h2>{t('wardrobe.title')}</h2>
        <div style={{ width: 32 }} />
      </div>

      {/* User photo thumbnail */}
      {userPhoto && (
        <div className="sv-wardrobe-user">
          <img 
            src={userPhoto} 
            alt={language === 'bn' ? 'আপনার ছবি' : 'Your photo'} 
            className="sv-wardrobe-user-photo" 
          />
          <div>
            <span className="sv-wardrobe-user-label">
              {language === 'bn' ? 'আপনার ছবি' : 'Your Photo'}
            </span>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: 2 }}>
              {language === 'bn' ? 'নিচে পোশাক বাছাই করুন' : 'Select an outfit below'}
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="sv-wardrobe-search">
        <div style={{ position: 'relative' }}>
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="var(--color-gray-400)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder={t('wardrobe.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sv-search-input"
            style={{ paddingLeft: 44 }}
            aria-label={t('wardrobe.search')}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="sv-category-tabs" role="tablist" aria-label={t('wardrobe.filterBy')}>
        {config.categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            className={`sv-category-tab ${activeCategory === cat.id ? 'sv-category-active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
            style={
              activeCategory === cat.id
                ? { backgroundColor: config.colors.primary, color: '#fff' }
                : {}
            }
          >
            <span className="sv-category-icon" aria-hidden="true">{cat.icon}</span>
            <span className="sv-category-name">{getCategoryName(cat)}</span>
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="sv-product-grid" role="list">
        {filteredProducts.length === 0 ? (
          <div className="sv-no-products">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <p>{t('wardrobe.noProducts')}</p>
          </div>
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
    <article className="sv-product-card" role="listitem">
      <div className="sv-product-image-wrap">
        {!imageLoaded && !imageError && <div className="sv-product-skeleton" />}
        {imageError ? (
          <div className="sv-product-error" aria-label="Image unavailable">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`sv-product-image ${imageLoaded ? 'sv-loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
            crossOrigin="anonymous"
          />
        )}
      </div>
      <div className="sv-product-info">
        <h3 className="sv-product-name">{getProductName(product)}</h3>
        <p className="sv-product-price">{formatPrice(product.price, product.currency || '৳')}</p>
      </div>
      <button
        className="sv-btn sv-btn-tryon"
        onClick={onTryOn}
        style={{ backgroundColor: primaryColor }}
        aria-label={`${t('wardrobe.tryOn')} ${product.name}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
        </svg>
        {t('wardrobe.tryOn')}
      </button>
    </article>
  );
}
