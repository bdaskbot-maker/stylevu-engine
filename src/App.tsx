// ============================================
// StyleVu - Main App Component
// Configurable white-label virtual try-on app
// ============================================

import { useBrand } from './BrandContext';
import { useAppState } from './hooks/useAppState';
import { generateTryOn, fetchProductImageAsBase64 } from './services/geminiService';
import { Product, TryOnResult } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import StartScreen from './components/StartScreen';
import CameraView from './components/CameraView';
import WardrobePanel from './components/WardrobePanel';
import ResultScreen from './components/ResultScreen';
import ProcessingOverlay from './components/ProcessingOverlay';
import { t } from './i18n';

export default function App() {
  const { config, loading, error: configError } = useBrand();
  const {
    state,
    setScreen,
    setUserPhoto,
    selectProduct,
    setProcessing,
    setTryOnResult,
    setError,
    setCategory,
    reset,
  } = useAppState();

  // Loading state
  if (loading) {
    return (
      <div className="sv-loading-screen">
        <div className="sv-spinner" />
        <p>{t('general.loading')}</p>
      </div>
    );
  }

  // Config error
  if (configError || !config) {
    return (
      <div className="sv-error-screen">
        <h2>{t('general.error')}</h2>
        <p>{configError || 'Failed to load configuration'}</p>
        <button className="sv-btn sv-btn-primary" onClick={() => window.location.reload()}>
          {t('general.retry')}
        </button>
      </div>
    );
  }

  // Handle try-on process
  const handleTryOn = async (product: Product) => {
    if (!state.userPhoto) {
      setError('Please take or upload a photo first');
      return;
    }

    // Check session limit
    if (state.sessionTryOns >= config.maxTryOns) {
      setError(t('tryOn.limitReached'));
      return;
    }

    selectProduct(product);
    setProcessing(true);
    setScreen('result');

    try {
      // Fetch product image as base64
      const productImageBase64 = await fetchProductImageAsBase64(product.imageUrl);

      // Call AI proxy
      const response = await generateTryOn(
        config.brandId,
        state.userPhoto,
        productImageBase64,
        product.category
      );

      if (!response.success) {
        if (response.error === 'rate_limit') {
          setError(t('tryOn.limitReached'));
        } else {
          setError(response.error || t('tryOn.error'));
        }
        return;
      }

      // Create result object
      const result: TryOnResult = {
        id: `${Date.now()}-${product.id}`,
        imageUrl: `data:image/jpeg;base64,${response.resultImage}`,
        productId: product.id,
        productName: product.name,
        timestamp: Date.now(),
        brandId: config.brandId,
      };

      setTryOnResult(result);
    } catch (err) {
      console.error('Try-on error:', err);
      setError(t('tryOn.error'));
    }
  };

  // Render current screen
  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'start':
        return (
          <StartScreen
            onPhotoCapture={() => setScreen('camera')}
            onPhotoUpload={(photo) => setUserPhoto(photo)}
            onBrowse={() => setScreen('wardrobe')}
          />
        );

      case 'camera':
        return (
          <CameraView
            onCapture={(photo) => setUserPhoto(photo)}
            onBack={() => setScreen('start')}
          />
        );

      case 'wardrobe':
        return (
          <WardrobePanel
            userPhoto={state.userPhoto || ''}
            activeCategory={state.activeCategory}
            onCategoryChange={setCategory}
            onTryOn={handleTryOn}
            onBack={() => {
              if (state.userPhoto) {
                setScreen('start');
              } else {
                setScreen('start');
              }
            }}
          />
        );

      case 'result':
        if (state.isProcessing) {
          return <ProcessingOverlay />;
        }

        if (state.error) {
          return (
            <div className="sv-error-screen">
              <h2>{t('general.error')}</h2>
              <p>{state.error}</p>
              <div className="sv-error-actions">
                <button
                  className="sv-btn sv-btn-primary"
                  onClick={() => {
                    setError(null);
                    setScreen('wardrobe');
                  }}
                  style={{ backgroundColor: config.colors.primary }}
                >
                  {t('general.retry')}
                </button>
                <button className="sv-btn sv-btn-ghost" onClick={reset}>
                  {t('general.back')}
                </button>
              </div>
            </div>
          );
        }

        if (state.tryOnResult && state.selectedProduct) {
          return (
            <ResultScreen
              result={state.tryOnResult}
              product={state.selectedProduct}
              onTryAnother={() => {
                reset();
                setScreen('wardrobe');
              }}
              onBack={() => setScreen('wardrobe')}
            />
          );
        }

        return <ProcessingOverlay />;

      default:
        return <StartScreen onPhotoCapture={() => setScreen('camera')} onPhotoUpload={setUserPhoto} onBrowse={() => setScreen('wardrobe')} />;
    }
  };

  return (
    <div
      className="sv-app"
      style={{ backgroundColor: config.colors.background, color: config.colors.text }}
    >
      <Header />
      <main className="sv-main">{renderScreen()}</main>
      <Footer />
    </div>
  );
}
