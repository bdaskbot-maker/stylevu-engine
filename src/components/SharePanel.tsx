// ============================================
// StyleVu - Share Panel
// Share try-on results (Facebook, WhatsApp, Download)
// ============================================

import { useState } from 'react';
import { useBrand } from '../BrandContext';
import { t, getProductName } from '../i18n';
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

  const getShareUrl = () => {
    const domain = config.customDomain || `${config.brandId}.stylevu.com`;
    return `https://${domain}`;
  };

  const getShareText = () => {
    const productName = result.productName;
    const brandName = language === 'bn' && config.brandNameBn ? config.brandNameBn : config.brandName;

    return language === 'bn'
      ? `${brandName} এর "${productName}" পরে দেখলাম StyleVu তে! 😍 তুমিও পরে দেখো 👉 ${getShareUrl()}`
      : `Tried on "${productName}" from ${brandName} on StyleVu! 😍 Try it yourself 👉 ${getShareUrl()}`;
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
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
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
    <div className="sv-share-overlay" onClick={onClose}>
      <div className="sv-share-panel" onClick={(e) => e.stopPropagation()}>
        <div className="sv-share-header">
          <h3>{t('share.title')}</h3>
          <button className="sv-btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sv-share-preview">
          <img src={result.imageUrl} alt="Try-on result" className="sv-share-image" />
        </div>

        <div className="sv-share-buttons">
          {config.socialShare.facebook && (
            <button className="sv-share-btn sv-share-facebook" onClick={shareToFacebook}>
              📘 {t('share.facebook')}
            </button>
          )}

          {config.socialShare.whatsapp && (
            <button className="sv-share-btn sv-share-whatsapp" onClick={shareToWhatsApp}>
              💬 {t('share.whatsapp')}
            </button>
          )}

          {config.socialShare.instagram && (
            <button className="sv-share-btn sv-share-instagram" onClick={shareToInstagram}>
              📸 {t('share.instagram')}
            </button>
          )}

          {config.socialShare.download && (
            <button
              className="sv-share-btn sv-share-download"
              onClick={downloadImage}
              disabled={isProcessing}
            >
              💾 {isProcessing ? '...' : t('share.download')}
            </button>
          )}

          <button className="sv-share-btn sv-share-link" onClick={copyLink}>
            🔗 {copied ? t('share.copied') : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
