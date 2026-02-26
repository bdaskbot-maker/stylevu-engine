// ============================================
// StyleVu - Footer Component
// Powered by badge + WhatsApp support link
// ============================================

import { useBrand } from '../BrandContext';
import { t } from '../i18n';

export default function Footer() {
  const { config } = useBrand();
  if (!config) return null;

  return (
    <footer className="sv-footer">
      {config.contactWhatsApp && (
        <a
          href={`https://wa.me/${config.contactWhatsApp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="sv-footer-support"
        >
          💬 WhatsApp Support
        </a>
      )}
      {config.poweredByBadge && (
        <a
          href="https://stylevu.com?ref=badge"
          target="_blank"
          rel="noopener noreferrer"
          className="sv-footer-badge"
        >
          {t('start.poweredBy')} ⚡
        </a>
      )}
    </footer>
  );
}
