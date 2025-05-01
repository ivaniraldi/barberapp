// src/app/[locale]/layout.tsx
import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from '@/components/navbar';
import type { ReactNode, Suspense as ReactSuspense } from 'react'; // Renamed Suspense to avoid conflict
import { Suspense } from 'react'; // Import Suspense from react
import { MotionProvider } from '@/components/motion-provider';
import { getStaticParams } from '@/locales/server'; // Import getStaticParams for locale generation
import { setStaticParamsLocale } from 'next-international/server'; // Import setStaticParamsLocale
import { LocaleProvider } from '@/components/locale-provider'; // Import the new LocaleProvider

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
    // Ensure no extra whitespace or comments directly inside the html tag
    <html lang={validLocale} className={`dark`}>
       <body className="antialiased bg-gradient-to-br from-background via-background/95 to-secondary/10 text-foreground min-h-screen flex flex-col">
        {/* Wrap content with LocaleProvider */}
        <LocaleProvider initialLocale={validLocale}>
           {/* Wrap with Suspense to handle client hooks like useSearchParams */}
           <Suspense>
             {/* Wrap with MotionProvider */}
             <MotionProvider>
                <Navbar />
                <main className="flex-grow"> {/* Changed div to main for semantic HTML */}
                  {children}
                </main>
                <Toaster />
             </MotionProvider>
           </Suspense>
        </LocaleProvider>
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