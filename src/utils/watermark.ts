// ============================================
// StyleVu - Watermark Utility
// Adds brand watermark to try-on images
// ============================================

import { BrandWatermark } from '../types';

interface WatermarkOptions extends BrandWatermark {
  logoUrl: string;
  brandName: string;
}

/**
 * Add watermark to an image (brand logo + "Powered by StyleVu")
 */
export async function addWatermark(
  imageBase64: string,
  options: WatermarkOptions
): Promise<string> {
  if (!options.enabled) return imageBase64;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Calculate watermark position
      const padding = 20;
      const textHeight = 16;
      const watermarkHeight = 40;

      let x: number, y: number;
      switch (options.position) {
        case 'top-left':
          x = padding;
          y = padding;
          break;
        case 'top-right':
          x = img.width - padding;
          y = padding;
          break;
        case 'bottom-left':
          x = padding;
          y = img.height - watermarkHeight - padding;
          break;
        case 'bottom-right':
        default:
          x = img.width - padding;
          y = img.height - watermarkHeight - padding;
          break;
      }

      ctx.globalAlpha = options.opacity;

      // Draw semi-transparent background
      const text = `${options.brandName} × StyleVu`;
      ctx.font = `${textHeight}px -apple-system, BlinkMacSystemFont, sans-serif`;
      const textWidth = ctx.measureText(text).width;

      const isRight = options.position.includes('right');
      const bgX = isRight ? x - textWidth - 20 : x;
      const bgWidth = textWidth + 20;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.roundRect(bgX, y, bgWidth, watermarkHeight, 8);
      ctx.fill();

      // Draw text
      ctx.globalAlpha = options.opacity + 0.3;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = isRight ? 'right' : 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, isRight ? x - 10 : x + 10, y + watermarkHeight / 2);

      ctx.globalAlpha = 1;

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => resolve(imageBase64); // Return original if watermark fails
    img.src = imageBase64;
  });
}

/**
 * Create a simple text watermark (fallback)
 */
export function addTextWatermark(
  imageBase64: string,
  text: string,
  opacity: number = 0.3
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(text, img.width - 15, img.height - 15);
      ctx.globalAlpha = 1;

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => resolve(imageBase64);
    img.src = imageBase64;
  });
}
