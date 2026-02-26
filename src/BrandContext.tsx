// ============================================
// StyleVu - Brand Context Provider
// Makes brand config available to all components
// ============================================

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrandConfig, Language } from './types';
import { loadBrandConfig, applyBrandTheme } from './brandConfig';
import { setLanguage } from './i18n';

interface BrandContextType {
  config: BrandConfig | null;
  loading: boolean;
  error: string | null;
  language: Language;
  toggleLanguage: () => void;
}

const BrandContext = createContext<BrandContextType>({
  config: null,
  loading: true,
  error: null,
  language: 'bn',
  toggleLanguage: () => {},
});

export function BrandProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<BrandConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLang] = useState<Language>('bn');

  useEffect(() => {
    loadBrandConfig()
      .then((cfg) => {
        setConfig(cfg);
        setLang(cfg.language);
        setLanguage(cfg.language);
        applyBrandTheme(cfg);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load brand config:', err);
        setError('Failed to load. Please refresh.');
        setLoading(false);
      });
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'bn' : 'en';
    setLang(newLang);
    setLanguage(newLang);
  };

  return (
    <BrandContext.Provider value={{ config, loading, error, language, toggleLanguage }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandContextType {
  return useContext(BrandContext);
}
