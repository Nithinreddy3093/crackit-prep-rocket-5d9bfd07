import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

// ── Suppress benign Lovable dev-overlay noise ──
// The external lovable.js dev helper emits "Unknown message type: SELECTEXT_URL_RESPONSE"
// which is harmless but clutters the console. We filter it out in development only.
if (import.meta.env.DEV) {
  const SUPPRESS_PATTERN = /SELECTEXT_URL_RESPONSE/;
  ['warn', 'error', 'log'].forEach((level) => {
    const original = (console as any)[level];
    (console as any)[level] = (...args: any[]) => {
      if (args.some((a) => typeof a === 'string' && SUPPRESS_PATTERN.test(a))) return;
      original.apply(console, args);
    };
  });
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
