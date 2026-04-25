// ============================================
// StyleVu - Start Screen
// Welcome + photo capture/upload options
// ============================================

import { useRef, useState } from 'react';
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
  const [isUploading, setIsUploading] = useState(false);

  if (!config) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(language === 'bn' ? 'ছবি 10MB এর কম হতে হবে' : 'Image must be under 10MB');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setIsUploading(false);
      onPhotoUpload(reader.result as string);
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert(language === 'bn' ? 'ছবি লোড করতে সমস্যা হয়েছে' : 'Failed to load image');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="sv-start sv-fade-in">
      <div className="sv-start-hero">
        <div className="sv-start-icon" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="16" fill={config.colors.primary} fillOpacity="0.1"/>
            <path d="M32 14C26.5 14 22 18.5 22 24C22 29.5 26.5 34 32 34C37.5 34 42 29.5 42 24C42 18.5 37.5 14 32 14Z" stroke={config.colors.primary} strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M20 50C20 43.4 25.4 38 32 38C38.6 38 44 43.4 44 50" stroke={config.colors.primary} strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M46 22L52 28M52 22L46 28" stroke={config.colors.accent} strokeWidth="2.5" strokeLinecap="round"/>
            <rect x="14" y="38" width="8" height="12" rx="2" stroke={config.colors.primary} strokeWidth="2" strokeDasharray="2 2"/>
          </svg>
        </div>
        <h2 className="sv-start-title">{t('start.title')}</h2>
        <p className="sv-start-subtitle">{t('start.subtitle')}</p>
      </div>

      <div className="sv-start-actions">
        <button
          className="sv-btn sv-btn-primary"
          onClick={onPhotoCapture}
          style={{ backgroundColor: config.colors.primary }}
          aria-label={t('start.takePhoto')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          {t('start.takePhoto')}
        </button>

        <button
          className="sv-btn sv-btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          style={{ borderColor: config.colors.primary, color: config.colors.primary }}
          disabled={isUploading}
          aria-label={t('start.uploadPhoto')}
        >
          {isUploading ? (
            <div className="sv-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          )}
          {isUploading ? (language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...') : t('start.uploadPhoto')}
        </button>

        <button 
          className="sv-btn sv-btn-ghost" 
          onClick={onBrowse}
          aria-label={t('start.browseCollection')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {t('start.browseCollection')}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="sv-hidden"
          aria-hidden="true"
        />
      </div>

      <div className="sv-start-steps">
        <h3>{t('start.howItWorks')}</h3>
        <div className="sv-steps-grid">
          <div className="sv-step">
            <span className="sv-step-num" style={{ backgroundColor: config.colors.primary }}>1</span>
            <p>{t('start.step1')}</p>
          </div>
          <div className="sv-step">
            <span className="sv-step-num" style={{ backgroundColor: config.colors.primary }}>2</span>
            <p>{t('start.step2')}</p>
          </div>
          <div className="sv-step">
            <span className="sv-step-num" style={{ backgroundColor: config.colors.primary }}>3</span>
            <p>{t('start.step3')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
