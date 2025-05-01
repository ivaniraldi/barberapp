// src/components/locale-provider.tsx
'use client';

import React, { useEffect, useState, type ReactNode } from 'react';
import { I18nProviderClient, useChangeLocale, useCurrentLocale } from '@/locales/client';
import { Skeleton } from './ui/skeleton'; // Import Skeleton for fallback

interface LocaleProviderProps {
  initialLocale: 'en' | 'es' | 'pt'; // Locale from server params
  children: ReactNode;
}

// Basic fallback skeleton for Suspense during locale loading/sync
function LocaleLoadingFallback() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Simplified Navbar Skeleton */}
            <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 h-16 flex items-center justify-between container px-4">
                <Skeleton className="h-7 w-32" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-20 hidden md:block" />
                    <Skeleton className="h-8 w-24 hidden md:block" />
                    <Skeleton className="h-8 w-8 md:hidden" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
            {/* Main Content Skeleton */}
            <main className="flex-grow container mx-auto px-4 py-16 sm:py-24">
                <Skeleton className="h-64 w-full rounded-lg" />
            </main>
        </div>
    );
}


export function LocaleProvider({ initialLocale, children }: LocaleProviderProps) {
  const [isClient, setIsClient] = useState(false);
  // These hooks use useSearchParams internally, hence the need for Suspense boundary
  const changeLocale = useChangeLocale({ preserveSearchParams: true });
  const currentLocale = useCurrentLocale(); // Gets locale from URL

  // Effect to sync localStorage and potentially redirect on initial client load if mismatch
  useEffect(() => {
    setIsClient(true); // Mark as client-side hydrated

    const savedLocale = localStorage.getItem('locale') as 'en' | 'es' | 'pt' | null;
    const validLocales: ('en' | 'es' | 'pt')[] = ['en', 'es', 'pt'];

    // Only attempt to change locale if there's a valid saved locale that differs from the current URL
    if (savedLocale && validLocales.includes(savedLocale) && savedLocale !== currentLocale) {
        // console.log(`LocaleProvider Initial Sync: Saved ${savedLocale}, URL ${currentLocale}. Changing URL.`);
        changeLocale(savedLocale);
        // The component will re-render with the new `currentLocale` from the URL after redirection
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on initial mount

  // Effect to update localStorage when the URL locale changes *after* initial mount
  useEffect(() => {
    // Only run after the initial hydration and check for changes
    if (isClient) {
      const savedLocale = localStorage.getItem('locale') as 'en' | 'es' | 'pt' | null;
      const validLocales: ('en' | 'es' | 'pt')[] = ['en', 'es', 'pt'];

      if (validLocales.includes(currentLocale) && currentLocale !== savedLocale) {
        // console.log(`LocaleProvider URL Update: URL is now ${currentLocale}. Updating localStorage.`);
        localStorage.setItem('locale', currentLocale);
      }
    }
  }, [currentLocale, isClient]); // Re-run when URL locale changes or after client hydration

  // Determine the effective locale: Use the URL locale once hydrated, otherwise initial server locale
  const effectiveLocale = isClient ? currentLocale : initialLocale;

  // Key the provider with the effectiveLocale to ensure it re-initializes correctly on locale change
  // Render a fallback while waiting for client hydration
  return (
     <>
        {!isClient && <LocaleLoadingFallback />}
        {isClient && (
            <I18nProviderClient locale={effectiveLocale} key={effectiveLocale}>
                {children}
            </I18nProviderClient>
        )}
     </>
  );
}
