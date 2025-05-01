// src/components/locale-provider.tsx
'use client';

import React, { useEffect, useState, createContext, useContext, type ReactNode, Suspense } from 'react'; // Import Suspense
import { I18nProviderClient, useChangeLocale, useCurrentLocale } from '@/locales/client';

interface LocaleProviderProps {
  initialLocale: 'en' | 'es' | 'pt';
  children: ReactNode;
}

// Although next-international provides useChangeLocale and useCurrentLocale,
// we create a simple context to easily pass the determined locale down
// without needing to call useCurrentLocale everywhere after the initial setup.
const LocaleContext = createContext<{ effectiveLocale: 'en' | 'es' | 'pt' }>({ effectiveLocale: 'pt' });

export const useEffectiveLocale = () => useContext(LocaleContext);

export function LocaleProvider({ initialLocale, children }: LocaleProviderProps) {
  const [effectiveLocale, setEffectiveLocale] = useState<'en' | 'es' | 'pt'>(initialLocale);
  const [isClient, setIsClient] = useState(false);
  const changeLocale = useChangeLocale({ preserveSearchParams: true }); // Keep search params on locale change
  const currentLocale = useCurrentLocale(); // Get locale managed by next-international

  useEffect(() => {
    setIsClient(true);
    const savedLocale = localStorage.getItem('locale') as 'en' | 'es' | 'pt' | null;
    const validLocales: ('en' | 'es' | 'pt')[] = ['en', 'es', 'pt'];

    if (savedLocale && validLocales.includes(savedLocale)) {
      // If a valid locale is saved and it's different from the current URL locale, update the URL
      if (savedLocale !== currentLocale) {
        changeLocale(savedLocale); // This will trigger a navigation and update the `currentLocale` hook
        setEffectiveLocale(savedLocale); // Optimistically update state
      } else {
        setEffectiveLocale(savedLocale);
      }
    } else {
      // No valid locale saved, use the one from the URL (or default if URL has none)
      setEffectiveLocale(currentLocale);
       // Optionally save the current/default locale if none was stored
        if (validLocales.includes(currentLocale)) { // Only save valid locales
          localStorage.setItem('locale', currentLocale);
        }
    }
  }, [changeLocale, currentLocale]); // Rerun when currentLocale changes (due to navigation)

  // Use a key on the I18nProviderClient to force re-render when locale changes
  // This ensures the context provided by next-international is up-to-date
  return (
    <I18nProviderClient locale={effectiveLocale} key={effectiveLocale}>
        <LocaleContext.Provider value={{ effectiveLocale }}>
           {/* Wrap children with Suspense to handle client-side hooks like useSearchParams */}
           <Suspense fallback={null}> {/* Use null or a minimal loading indicator */}
              {isClient ? children : null /* Avoid rendering children until locale is determined */}
           </Suspense>
        </LocaleContext.Provider>
    </I18nProviderClient>
  );
}
