import { useRef, useState, useEffect, useCallback } from 'react';
import { getBrandConfig } from '../brandConfig';
import { t } from '../i18n';
import type { CameraFacing } from '../types';

interface CameraProps {
  onCapture: (imageBase64: string) => void;
  onBack: () => void;
}

export default function Camera({ onCapture, onBack }: CameraProps) {
  const config = getBrandConfig();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facing, setFacing] = useState<CameraFacing>('user');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async (facingMode: CameraFacing) => {
    try {
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode === 'user' ? 'user' : 'environment',
          width: { ideal: 1080 },
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
      setError(t('camera.permissionDenied'));
    }
  }, [stream]);

  useEffect(() => {
    startCamera(facing);
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror for front camera
    if (facing === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(imageData);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleSwitchCamera = () => {
    const newFacing = facing === 'user' ? 'environment' : 'user';
    setFacing(newFacing);
    startCamera(newFacing);
  };

  if (error) {
    return (
      <div className="sv-camera-error">
        <p>{error}</p>
        <button className="sv-btn sv-btn-secondary" onClick={onBack}>
          {t('general.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="sv-camera">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {capturedImage ? (
        <div className="sv-camera-preview">
          <img src={capturedImage} alt="Captured" className="sv-camera-image" />
          <div className="sv-camera-actions">
            <button className="sv-btn sv-btn-secondary" onClick={handleRetake}>
              {t('camera.retake')}
            </button>
            <button
              className="sv-btn sv-btn-primary"
              onClick={handleUsePhoto}
              style={{ background: config.colors.primary }}
            >
              {t('camera.usePhoto')}
            </button>
          </div>
        </div>
      ) : (
        <div className="sv-camera-live">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="sv-camera-video"
            style={{ transform: facing === 'user' ? 'scaleX(-1)' : 'none' }}
          />

          <p className="sv-camera-instruction">{t('camera.instruction')}</p>

          <div className="sv-camera-controls">
            <button className="sv-camera-switch" onClick={handleSwitchCamera}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4m16 0l1.28-2.55a1 1 0 00-.9-1.45H3.62a1 1 0 00-.9 1.45L4 16" />
                <path d="M9 10a1 1 0 102 0 1 1 0 00-2 0" />
              </svg>
            </button>

            <button
              className="sv-camera-capture"
              onClick={handleCapture}
              style={{ borderColor: config.colors.primary }}
            >
              <span style={{ background: config.colors.primary }} />
            </button>

            <button className="sv-camera-back" onClick={onBack}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
