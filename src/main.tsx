// ============================================
// StyleVu - Entry Point
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrandProvider } from './BrandContext';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrandProvider>
      <App />
    </BrandProvider>
  </React.StrictMode>
);
