// src/locales/client.ts
'use client';
import { createI18nClient } from 'next-international/client';

// Import the specific locale variant if needed, e.g., pt-BR
export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, useCurrentLocale } = createI18nClient({
  en: () => import('./en'),
  es: () => import('./es'),
  pt: () => import('./pt'), // Keep 'pt' key, but import the pt file (can contain pt-BR specifics)
});
