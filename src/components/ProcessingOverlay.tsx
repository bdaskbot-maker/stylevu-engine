// ============================================
// StyleVu - Processing Overlay
// Shows while AI generates the try-on
// ============================================

import { useBrand } from '../BrandContext';
import { t } from '../i18n';

export default function ProcessingOverlay() {
  const { config } = useBrand();
  if (!config) return null;

  return (
    <div 
      className="sv-processing-overlay sv-fade-in" 
      role="alert" 
      aria-live="polite"
      aria-busy="true"
    >
      <div className="sv-processing-content">
        <div className="sv-spinner" style={{ borderTopColor: config.colors.primary }} />
        <h3>{t('tryOn.processing')}</h3>
        <p>{t('tryOn.pleaseWait')}</p>
        <div className="sv-processing-dots" aria-hidden="true">
          <span style={{ backgroundColor: config.colors.primary }} />
          <span style={{ backgroundColor: config.colors.primary }} />
          <span style={{ backgroundColor: config.colors.primary }} />
        </div>
      </div>
    </div>
  );
}
