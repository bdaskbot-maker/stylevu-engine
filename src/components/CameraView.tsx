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
  const [isLoading, setIsLoading] = useState(true);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      stopStream();

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
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
        };
      }
      setError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setIsLoading(false);
      setError(t('camera.permissionDenied'));
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
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
    const photo = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedPhoto(photo);
  };

  const retake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const usePhoto = () => {
    if (capturedPhoto) {
      stopStream();
      onCapture(capturedPhoto);
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleBack = () => {
    stopStream();
    onBack();
  };

  if (error) {
    return (
      <div className="sv-camera sv-camera-error sv-fade-in">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
        <p>{error}</p>
        <button 
          className="sv-btn sv-btn-primary" 
          onClick={handleBack}
          style={{ maxWidth: 200, backgroundColor: config?.colors.primary }}
        >
          {t('general.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="sv-camera sv-fade-in">
      <div className="sv-camera-header">
        <button className="sv-btn-icon" onClick={handleBack} aria-label={t('general.back')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {t('general.back')}
        </button>
        <h2>{t('camera.title')}</h2>
        <button className="sv-btn-icon" onClick={switchCamera} aria-label={t('camera.switch')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>
            <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5"/>
            <polyline points="16 5 19 8 16 11"/>
            <polyline points="8 19 5 16 8 13"/>
          </svg>
        </button>
      </div>

      <div className="sv-camera-viewport">
        {isLoading && !capturedPhoto && (
          <div style={{ position: 'absolute', zIndex: 5 }}>
            <div className="sv-spinner" style={{ borderTopColor: '#fff' }} />
          </div>
        )}
        
        {capturedPhoto ? (
          <img 
            src={capturedPhoto} 
            alt="Captured" 
            className="sv-camera-preview" 
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="sv-camera-feed"
            style={{ 
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease'
            }}
          />
        )}
        <canvas ref={canvasRef} className="sv-hidden" aria-hidden="true" />

        {/* Guide overlay */}
        {!capturedPhoto && !isLoading && (
          <div className="sv-camera-guide">
            <div className="sv-camera-guide-body" />
          </div>
        )}
      </div>

      <p className="sv-camera-tips">{t('camera.tips')}</p>

      <div className="sv-camera-controls">
        {capturedPhoto ? (
          <>
            <button 
              className="sv-btn sv-btn-secondary" 
              onClick={retake}
              style={{ borderColor: '#fff', color: '#fff' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
              {t('camera.retake')}
            </button>
            <button
              className="sv-btn sv-btn-primary"
              onClick={usePhoto}
              style={{ backgroundColor: config?.colors.primary }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {t('camera.use')}
            </button>
          </>
        ) : (
          <button
            className="sv-btn sv-btn-capture"
            onClick={capture}
            style={{ borderColor: config?.colors.primary }}
            disabled={isLoading}
            aria-label={t('camera.capture')}
          >
            <span 
              className="sv-capture-inner" 
              style={{ backgroundColor: config?.colors.primary }} 
            />
          </button>
        )}
      </div>
    </div>
  );
}
