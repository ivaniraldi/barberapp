// src/components/locale-provider.tsx
'use client';

import React, { useEffect, useState, createContext, useContext, type ReactNode, Suspense } from 'react';
import { I18nProviderClient, useChangeLocale, useCurrentLocale } from '@/locales/client';

interface LocaleProviderProps {
  initialLocale: 'en' | 'es' | 'pt'; // Locale from server params
  children: ReactNode;
}

const LocaleContext = createContext<{ effectiveLocale: 'en' | 'es' | 'pt' }>({ effectiveLocale: 'pt' });
export const useEffectiveLocale = () => useContext(LocaleContext);

export function LocaleProvider({ initialLocale, children }: LocaleProviderProps) {
  const [isClient, setIsClient] = useState(false);
  const changeLocale = useChangeLocale({ preserveSearchParams: true });
  const currentLocale = useCurrentLocale(); // Locale derived from the URL by next-international

  // Effect 1: Sync URL with localStorage on initial client load
  useEffect(() => {
    setIsClient(true); // Mark as client-side hydrated

    const savedLocale = localStorage.getItem('locale') as 'en' | 'es' | 'pt' | null;
    const validLocales: ('en' | 'es' | 'pt')[] = ['en', 'es', 'pt'];

    if (savedLocale && validLocales.includes(savedLocale)) {
      // If saved locale is valid and differs from the URL locale, update the URL
      if (savedLocale !== currentLocale) {
        // console.log(`LocaleProvider: Mismatch found. Saved: ${savedLocale}, Current: ${currentLocale}. Changing URL.`);
        changeLocale(savedLocale);
        // No need to setEffectiveLocale here, I18nProviderClient will use currentLocale
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Effect 2: Sync localStorage with URL changes
  useEffect(() => {
    if (isClient) { // Only run after hydration
        const savedLocale = localStorage.getItem('locale') as 'en' | 'es' | 'pt' | null;
        const validLocales: ('en' | 'es' | 'pt')[] = ['en', 'es', 'pt'];

        // If the current URL locale is valid and different from saved, update localStorage
        if (validLocales.includes(currentLocale) && currentLocale !== savedLocale) {
            // console.log(`LocaleProvider: URL locale changed to ${currentLocale}. Updating localStorage.`);
            localStorage.setItem('locale', currentLocale);
        }
    }
  }, [currentLocale, isClient]); // Rerun when URL locale changes or hydration status changes

  // Determine the locale to use for the provider.
  // Before hydration, use initialLocale. After hydration, use the URL-derived currentLocale.
  const localeForProvider = isClient ? currentLocale : initialLocale;

  return (
    // Use the determined locale for the provider and context.
    // Keying the provider ensures it re-renders correctly when the locale changes.
    <I18nProviderClient locale={localeForProvider} key={localeForProvider}>
      <LocaleContext.Provider value={{ effectiveLocale: localeForProvider }}>
        <Suspense fallback={null}>
          {/* Render children only after hydration to avoid mismatches */}
          {isClient ? children : null}
        </Suspense>
      </LocaleContext.Provider>
    </I18nProviderClient>
  );
}
