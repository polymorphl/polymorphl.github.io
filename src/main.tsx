import './global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initI18n } from '@lib/i18n';
import App from './App';

initI18n().then(() => {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
