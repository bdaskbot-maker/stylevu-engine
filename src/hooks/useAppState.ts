// ============================================
// StyleVu - App State Hook
// Central state management
// ============================================

import { useState, useCallback } from 'react';
import { AppState, Product, TryOnResult, Language } from '../types';

const initialState: AppState = {
  currentScreen: 'start',
  selectedProduct: null,
  userPhoto: null,
  tryOnResult: null,
  isProcessing: false,
  error: null,
  activeCategory: 'all',
  language: 'bn',
  sessionTryOns: 0,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);

  const setScreen = useCallback((screen: AppState['currentScreen']) => {
    setState((prev) => ({ ...prev, currentScreen: screen, error: null }));
  }, []);

  const setUserPhoto = useCallback((photo: string) => {
    setState((prev) => ({ ...prev, userPhoto: photo, currentScreen: 'wardrobe' }));
  }, []);

  const selectProduct = useCallback((product: Product) => {
    setState((prev) => ({ ...prev, selectedProduct: product }));
  }, []);

  const setProcessing = useCallback((isProcessing: boolean) => {
    setState((prev) => ({ ...prev, isProcessing }));
  }, []);

  const setTryOnResult = useCallback((result: TryOnResult) => {
    setState((prev) => ({
      ...prev,
      tryOnResult: result,
      currentScreen: 'result',
      isProcessing: false,
      sessionTryOns: prev.sessionTryOns + 1,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isProcessing: false }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setState((prev) => ({ ...prev, activeCategory: category }));
  }, []);

  const setLanguage = useCallback((language: Language) => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const goToShare = useCallback(() => {
    setState((prev) => ({ ...prev, currentScreen: 'share' }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...initialState,
      userPhoto: prev.userPhoto, // Keep user photo for trying more items
      language: prev.language,
      sessionTryOns: prev.sessionTryOns,
    }));
  }, []);

  const fullReset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    setScreen,
    setUserPhoto,
    selectProduct,
    setProcessing,
    setTryOnResult,
    setError,
    setCategory,
    setLanguage,
    goToShare,
    reset,
    fullReset,
  };
}
