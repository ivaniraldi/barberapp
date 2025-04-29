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

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

// Note: Metadata generation needs to be adapted if you want localized titles/descriptions
// This basic example keeps it simple.
export const metadata: Metadata = {
  title: 'BarberApp',
  description: 'Schedule your next haircut or shave easily.',
};

export default function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  return (
    // Removed Geist font variables from html tag
    <html lang={locale} className={`dark`}>
      <body className="antialiased bg-gradient-to-br from-background via-background/95 to-secondary/10 text-foreground min-h-screen flex flex-col">
        {/* Wrap content with I18nProviderClient */}
        <I18nProviderClient locale={locale}>
           {/* Wrap with MotionProvider */}
           <MotionProvider>
              <Navbar />
              <div className="flex-grow">
                {children}
              </div>
              <Toaster />
           </MotionProvider>
        </I18nProviderClient>
      </body>
    </html>
  );
}

// Function to generate static params for supported locales
export function generateStaticParams() {
  return ['en', 'es', 'pt'].map(locale => ({ locale }));
}
