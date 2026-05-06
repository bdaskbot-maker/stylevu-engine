// ============================================
// StyleVu - Share Panel
// Share try-on results (Facebook, WhatsApp, Download)
// ============================================

import { useState, useEffect } from 'react';
import { useBrand } from '../BrandContext';
import { t } from '../i18n';
import { TryOnResult } from '../types';
import { addWatermark } from '../utils/watermark';

interface SharePanelProps {
  result: TryOnResult;
  onClose: () => void;
}

export default function SharePanel({ result, onClose }: SharePanelProps) {
  const { config, language } = useBrand();
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!config) return null;

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const getShareUrl = () => {
    const domain = config.customDomain || `${config.brandId}.stylevu.com`;
    return `https://${domain}`;
  };

  const getShareText = () => {
    const productName = result.productName;
    const brandName = language === 'bn' && config.brandNameBn ? config.brandNameBn : config.brandName;

    return language === 'bn'
      ? `${brandName} এর "${productName}" পরে দেখলাম StyleVu তে! তুমিও পরে দেখো ${getShareUrl()}`
      : `Tried on "${productName}" from ${brandName} on StyleVu! Try it yourself ${getShareUrl()}`;
  };

  const getWatermarkedImage = async (): Promise<string> => {
    return addWatermark(result.imageUrl, {
      ...config.watermark,
      logoUrl: config.logo,
      brandName: config.brandName,
    });
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareToInstagram = async () => {
    // Instagram doesn't support direct sharing via URL
    // Best approach: download image with instructions
    await downloadImage();
    alert(
      language === 'bn'
        ? 'ছবি ডাউনলোড হয়েছে! ইনস্টাগ্রাম খুলে স্টোরি বা পোস্টে শেয়ার করুন।'
        : 'Image downloaded! Open Instagram and share it as a Story or Post.'
    );
  };

  const downloadImage = async () => {
    setIsProcessing(true);
    try {
      const watermarkedImage = await getWatermarkedImage();

      const link = document.createElement('a');
      link.href = watermarkedImage;
      link.download = `stylevu-${config.brandId}-${result.productId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert(language === 'bn' ? 'ডাউনলোড ব্যর্থ হয়েছে' : 'Download failed');
    }
    setIsProcessing(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = getShareUrl();
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="sv-share-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
    >
      <div className="sv-share-panel sv-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sv-share-header">
          <h3 id="share-title">{t('share.title')}</h3>
          <button className="sv-btn-icon" onClick={onClose} aria-label={t('general.close')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="sv-share-preview">
          <img 
            src={result.imageUrl} 
            alt={`${t('tryOn.result')} - ${result.productName}`} 
            className="sv-share-image" 
            crossOrigin="anonymous"
          />
        </div>

        <div className="sv-share-buttons">
          {config.socialShare.facebook && (
            <button className="sv-share-btn sv-share-facebook" onClick={shareToFacebook}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {t('share.facebook')}
            </button>
          )}

          {config.socialShare.whatsapp && (
            <button className="sv-share-btn sv-share-whatsapp" onClick={shareToWhatsApp}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('share.whatsapp')}
            </button>
          )}

          {config.socialShare.instagram && (
            <button className="sv-share-btn sv-share-instagram" onClick={shareToInstagram}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              {t('share.instagram')}
            </button>
          )}

          {config.socialShare.download && (
            <button
              className="sv-share-btn sv-share-download"
              onClick={downloadImage}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="sv-spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#fff' }} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              )}
              {isProcessing ? (language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Downloading...') : t('share.download')}
            </button>
          )}

          <button className="sv-share-btn sv-share-link" onClick={copyLink}>
            {copied ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            )}
            {copied ? t('share.copied') : (language === 'bn' ? 'লিংক কপি করুন' : 'Copy Link')}
          </button>
        </div>
      </div>
    </div>
  );
}
