// src/locales/server.ts
import { createI18nServer } from 'next-international/server';

// Import the specific locale variant if needed, e.g., pt-BR
export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } = createI18nServer({
  en: () => import('./en'),
  es: () => import('./es'),
  pt: () => import('./pt'), // Keep 'pt' key, but import the pt file (can contain pt-BR specifics)
});
