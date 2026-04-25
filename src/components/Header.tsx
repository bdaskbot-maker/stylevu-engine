// ============================================
// StyleVu - Header Component
// Brand logo + name + language toggle
// ============================================

import { useBrand } from '../BrandContext';
import { t } from '../i18n';

export default function Header() {
  const { config, language, toggleLanguage } = useBrand();
  if (!config) return null;

  return (
    <header
      className="sv-header"
      style={{
        background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
      }}
      role="banner"
    >
      <div className="sv-header-inner">
        <div className="sv-header-brand">
          <img
            src={config.logo}
            alt={`${config.brandName} logo`}
            className="sv-header-logo"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div>
            <h1 className="sv-header-title">
              {language === 'bn' && config.brandNameBn ? config.brandNameBn : config.brandName}
            </h1>
            <p className="sv-header-tagline">
              {language === 'bn' && config.taglineBn ? config.taglineBn : config.tagline}
            </p>
          </div>
        </div>
        <button 
          className="sv-lang-toggle" 
          onClick={toggleLanguage} 
          title={t('general.changeLanguage')}
          aria-label={t('general.changeLanguage')}
        >
          {t('general.language')}
        </button>
      </div>
    </header>
  );
}
