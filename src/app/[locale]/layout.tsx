// src/app/[locale]/layout.tsx
import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from '@/components/navbar';
import type { ReactNode } from 'react';
import { Suspense } from 'react'; // Import Suspense from react
import { MotionProvider } from '@/components/motion-provider';
import { getStaticParams } from '@/locales/server'; // Import getStaticParams for locale generation
import { setStaticParamsLocale } from 'next-international/server'; // Import setStaticParamsLocale
import { LocaleProvider } from '@/components/locale-provider'; // Import the new LocaleProvider
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for fallback

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

// Note: Metadata generation needs to be adapted if you want localized titles/descriptions
// This basic example keeps it simple.
export const metadata: Metadata = {
  title: 'BarberApp',
  description: 'Agende seu próximo corte de cabelo ou barba facilmente.', // Updated description to Portuguese
};

// Basic fallback skeleton for Suspense
function LayoutFallback() {
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
            {/* Toaster placeholder */}
        </div>
    );
}


export default function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  // Validate locale or fall back to default ('pt')
  const validLocale = ['en', 'es', 'pt'].includes(locale) ? locale : 'pt';

  return (
    // Ensure no extra whitespace or comments directly inside the html tag
    <html lang={validLocale} className={`dark`}>
       <body className="antialiased bg-gradient-to-br from-background via-background/95 to-secondary/10 text-foreground min-h-screen flex flex-col">
        {/* Wrap with Suspense FIRST, before LocaleProvider, as LocaleProvider uses client hooks */}
        <Suspense fallback={<LayoutFallback />}>
          {/* LocaleProvider uses client hooks (useChangeLocale, useCurrentLocale), needs to be inside Suspense */}
          <LocaleProvider initialLocale={validLocale}>
            {/* MotionProvider can stay inside or outside LocaleProvider */}
            <MotionProvider>
               <Navbar />
               <main className="flex-grow"> {/* Changed div to main for semantic HTML */}
                 {children}
               </main>
               <Toaster />
            </MotionProvider>
          </LocaleProvider>
        </Suspense>
      </body>
    </html>
  );
}

// Function to generate static params for supported locales
 export function generateStaticParams() {
   const params = getStaticParams(); // Get locale objects like [{ locale: 'en' }, ...]
   // Set the locale for each param object during static generation
   params.forEach(({ locale }) => {
     setStaticParamsLocale(locale);
   });
   return params;
 }
