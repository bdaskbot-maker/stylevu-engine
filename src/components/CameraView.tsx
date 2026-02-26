// ============================================
// StyleVu - Camera View
// Capture user photo from device camera
// ============================================

import { useRef, useState, useEffect, useCallback } from 'react';
import { useBrand } from '../BrandContext';
import { t } from '../i18n';

interface CameraViewProps {
  onCapture: (photo: string) => void;
  onBack: () => void;
}

export default function CameraView({ onCapture, onBack }: CameraViewProps) {
  const { config } = useBrand();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 1920 },
        },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setError(
        'Camera access denied. Please allow camera access or upload a photo instead.'
      );
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode]);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;

    // Mirror if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);
    const photo = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(photo);
  };

  const retake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const usePhoto = () => {
    if (capturedPhoto) {
      stream?.getTracks().forEach((track) => track.stop());
      onCapture(capturedPhoto);
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  if (error) {
    return (
      <div className="sv-camera sv-camera-error">
        <p>{error}</p>
        <button className="sv-btn sv-btn-primary" onClick={onBack}>
          {t('general.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="sv-camera">
      <div className="sv-camera-header">
        <button className="sv-btn-icon" onClick={onBack}>
          ← {t('general.back')}
        </button>
        <h2>{t('camera.title')}</h2>
        <button className="sv-btn-icon" onClick={switchCamera}>
          🔄 {t('camera.switch')}
        </button>
      </div>

      <div className="sv-camera-viewport">
        {capturedPhoto ? (
          <img src={capturedPhoto} alt="Captured" className="sv-camera-preview" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="sv-camera-feed"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          />
        )}
        <canvas ref={canvasRef} className="sv-hidden" />

        {/* Guide overlay */}
        {!capturedPhoto && (
          <div className="sv-camera-guide">
            <div className="sv-camera-guide-body" />
          </div>
        )}
      </div>

      <p className="sv-camera-tips">{t('camera.tips')}</p>

      <div className="sv-camera-controls">
        {capturedPhoto ? (
          <>
            <button className="sv-btn sv-btn-secondary" onClick={retake}>
              🔄 {t('camera.retake')}
            </button>
            <button
              className="sv-btn sv-btn-primary"
              onClick={usePhoto}
              style={{ backgroundColor: config?.colors.primary }}
            >
              ✅ {t('camera.use')}
            </button>
          </>
        ) : (
          <button
            className="sv-btn sv-btn-capture"
            onClick={capture}
            style={{ borderColor: config?.colors.primary }}
          >
            <span className="sv-capture-inner" style={{ backgroundColor: config?.colors.primary }} />
          </button>
        )}
      </div>
    </div>
  );
}
