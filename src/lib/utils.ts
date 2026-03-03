/**
 * StyleVu — Utility Functions
 */

import { getBrandConfig } from '../brandConfig';

// ─── Error Handling ───────────────────────────────────────────

export const getFriendlyErrorMessage = (err: unknown, context: string): string => {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('blocked') || msg.includes('safety')) {
      return 'Request was blocked by safety filters. Please try a different image.';
    }
    if (msg.includes('rate limit') || msg.includes('429')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    if (msg.includes('limit reached') || msg.includes('402')) {
      return 'Monthly try-on limit reached. Please upgrade your plan.';
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return 'Network error. Please check your internet connection.';
    }
    return err.message;
  }
  return `${context}. Please try again.`;
};

// ─── Image Helpers ────────────────────────────────────────────

/**
 * Convert a URL to a File object (handles CORS via canvas)
 */
export const urlToFile = (url: string, filename: string): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Could not get canvas context.'));
      ctx.drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas toBlob failed.'));
        resolve(new File([blob], filename, { type: blob.type || 'image/png' }));
      }, 'image/png');
    };
    image.onerror = () => reject(new Error(`Could not load image from: ${url}`));
    image.src = url;
  });
};

/**
 * Add brand watermark to an image data URL
 */
export const addWatermark = async (imageDataUrl: string): Promise<string> => {
  const brandConfig = getBrandConfig();
  if (!brandConfig.watermark) return imageDataUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(imageDataUrl); return; }

      ctx.drawImage(img, 0, 0);

      // Semi-transparent watermark at bottom-right
      const padding = 20;
      const fontSize = Math.max(14, img.width * 0.025);

      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.font = `600 ${fontSize}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      const text = brandConfig.poweredByBadge
        ? `${brandConfig.brandName} • StyleVu`
        : brandConfig.brandName;

      ctx.fillText(text, canvas.width - padding, canvas.height - padding);
      ctx.restore();

      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageDataUrl;
  });
};

/**
 * Download an image with watermark
 */
export const downloadImage = async (imageDataUrl: string, filename?: string): Promise<void> => {
  const brandConfig = getBrandConfig();
  const watermarked = await addWatermark(imageDataUrl);
  const link = document.createElement('a');
  link.download = filename || `${brandConfig.brandId}-tryon-${Date.now()}.png`;
  link.href = watermarked;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ─── Sharing Helpers ──────────────────────────────────────────

export const shareToFacebook = (url?: string): void => {
  const shareUrl = url || window.location.href;
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    '_blank',
    'width=600,height=400'
  );
};

export const shareToWhatsApp = (text?: string): void => {
  const brandConfig = getBrandConfig();
  const message = text || `Check out my virtual try-on look from ${brandConfig.brandName}! ${window.location.href}`;
  window.open(
    `https://wa.me/?text=${encodeURIComponent(message)}`,
    '_blank'
  );
};

export const orderViaWhatsApp = (
  productName: string,
  productPrice: string
): void => {
  const brandConfig = getBrandConfig();
  if (!brandConfig.contactWhatsApp) return;
  const phone = brandConfig.contactWhatsApp.replace(/[^0-9]/g, '');
  const message = `Hi! I'd like to order: ${productName} (${productPrice}). I tried it on using your virtual try-on app!`;
  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    '_blank'
  );
};

// ─── CSS Class Helper ─────────────────────────────────────────

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
