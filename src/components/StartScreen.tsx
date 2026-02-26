// ============================================
// StyleVu - Start Screen
// Welcome + photo capture/upload options
// ============================================

import { useRef } from 'react';
import { useBrand } from '../BrandContext';
import { t } from '../i18n';

interface StartScreenProps {
  onPhotoCapture: () => void;
  onPhotoUpload: (photo: string) => void;
  onBrowse: () => void;
}

export default function StartScreen({ onPhotoCapture, onPhotoUpload, onBrowse }: StartScreenProps) {
  const { config, language } = useBrand();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!config) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(language === 'bn' ? 'ছবি ১০MB এর কম হতে হবে' : 'Image must be under 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onPhotoUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="sv-start">
      <div className="sv-start-hero">
        <div className="sv-start-icon">👗✨</div>
        <h2 className="sv-start-title">{t('start.title')}</h2>
        <p className="sv-start-subtitle">{t('start.subtitle')}</p>
      </div>

      <div className="sv-start-actions">
        <button
          className="sv-btn sv-btn-primary"
          onClick={onPhotoCapture}
          style={{ backgroundColor: config.colors.primary }}
        >
          📸 {t('start.takePhoto')}
        </button>

        <button
          className="sv-btn sv-btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          style={{ borderColor: config.colors.primary, color: config.colors.primary }}
        >
          📁 {t('start.uploadPhoto')}
        </button>

        <button className="sv-btn sv-btn-ghost" onClick={onBrowse}>
          🛍️ {t('start.browseCollection')}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="sv-hidden"
        />
      </div>

      <div className="sv-start-steps">
        <h3>{t('start.howItWorks')}</h3>
        <div className="sv-steps-grid">
          <div className="sv-step">
            <span className="sv-step-num">1</span>
            <p>{t('start.step1')}</p>
          </div>
          <div className="sv-step">
            <span className="sv-step-num">2</span>
            <p>{t('start.step2')}</p>
          </div>
          <div className="sv-step">
            <span className="sv-step-num">3</span>
            <p>{t('start.step3')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
