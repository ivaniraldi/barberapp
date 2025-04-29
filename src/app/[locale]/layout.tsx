// src/app/[locale]/layout.tsx
import type { Metadata } from 'next';
// Removed Geist font imports as the dependency is not installed
// import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from '@/components/navbar';
import { I18nProviderClient } from '@/locales/client'; // Import client provider
import type { ReactNode } from 'react';
import { MotionProvider } from '@/components/motion-provider'; // Import MotionProvider
import { getStaticParams } from '@/locales/server'; // Import getStaticParams for locale generation

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

export default function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  // Validate locale or fall back to default ('pt')
  const validLocale = ['en', 'es', 'pt'].includes(locale) ? locale : 'pt';

  return (
    // Removed Geist font variables from html tag
    <html lang={validLocale} className={`dark`}> {/* Use validated locale */}
      <body className="antialiased bg-gradient-to-br from-background via-background/95 to-secondary/10 text-foreground min-h-screen flex flex-col">
        {/* Wrap content with I18nProviderClient */}
        <I18nProviderClient locale={validLocale}> {/* Pass validated locale */}
           {/* Wrap with MotionProvider */}
           <MotionProvider>
              <Navbar />
              <main className="flex-grow"> {/* Changed div to main for semantic HTML */}
                {children}
              </main>
              <Toaster />
           </MotionProvider>
        </I18nProviderClient>
      </body>
    </html>
  );
}

// Function to generate static params for supported locales
// Re-enable generateStaticParams if using full static export or SSG for locales
// export { generateStaticParams };

// If not using full static export, this function is not strictly necessary
// unless you want to pre-render specific locale pages during build.
// Next.js dynamic routing will handle non-pre-rendered locales.
 export function generateStaticParams() {
   return getStaticParams(); // Use the function exported from locales/server
 }
