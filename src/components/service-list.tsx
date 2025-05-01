// src/components/service-list.tsx
'use client'; // Add this directive

import type { FC } from 'react';
import { Clock } from 'lucide-react'; // Removed Scissors, DollarSign, Euro - handled by formatCurrency
import { Separator } from '@/components/ui/separator';
import { useI18n, useCurrentLocale } from '@/locales/client'; // Import i18n hook for client component
import { MotionDiv } from './motion-provider'; // Import MotionDiv
import { CardTitle, CardDescription } from '@/components/ui/card'; // Import CardTitle and CardDescription

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface ServiceListProps {
  services: Service[];
}

// Helper to format currency based on locale
const formatCurrency = (price: number, locale: string): string => {
    const options: Intl.NumberFormatOptions = { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    let currencyCode = 'BRL'; // Default to BRL for Portuguese
    if (locale === 'en') currencyCode = 'USD';
    else if (locale === 'es') currencyCode = 'EUR';
    // Add more locales/currencies as needed

    options.currency = currencyCode;

    // Handle potential errors during formatting
    try {
        return new Intl.NumberFormat(locale, options).format(price);
    } catch (error) {
        console.error("Currency formatting error:", error);
        // Fallback to simple formatting
        const symbol = locale === 'pt' ? 'R$' : locale === 'es' ? '€' : '$';
        return `${symbol}${price.toFixed(2)}`;
    }
};


const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({ // Accept custom index for staggering
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.05, duration: 0.4 }
     })
};

export const ServiceList: FC<ServiceListProps> = ({ services }) => {
  const t = useI18n(); // Get translation function
  const currentLocale = useCurrentLocale() as 'en' | 'es' | 'pt'; // Get current locale
  const isSingleService = services.length === 1; // Check if only one service is being displayed

  return (
    // Remove the outer div, as the parent (ServicesPage) now provides the Card structure
    // Apply spacing directly to the elements if needed (e.g., using mb- on elements)
    <>
      {services.map((service, index) => (
        <MotionDiv
            key={service.id}
            variants={listItemVariants}
            initial={isSingleService ? undefined : "hidden"}
            animate={isSingleService ? undefined : "visible"}
            custom={index}
            // Add padding directly here if the parent CardContent doesn't provide enough
            className="py-4" // Added padding for separation within the card
        >
           {/* Service details are now rendered directly inside the parent CardContent */}
           <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
               {/* Use CardTitle for the service name */}
               <CardTitle className="text-lg"> {/* Adjust size as needed */}
                 {service.name}
               </CardTitle>
                <span className="text-lg font-semibold text-primary flex items-center shrink-0">
                   {/* Use formatted currency */}
                   {formatCurrency(service.price, currentLocale)}
                </span>
              </div>
              {/* Use CardDescription for the description */}
              <CardDescription className="mb-3">{service.description}</CardDescription>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="mr-1.5 h-4 w-4" /> {/* Slightly more margin */}
                {/* Use translation for duration */}
                <span>{t('booking_form.duration_minutes', { duration: service.duration })}</span>
              </div>

          {/* Add separator only if rendered as part of a list (e.g., popular services) and not the last one */}
          {!isSingleService && index < services.length - 1 && <Separator className="mt-4 mb-0 border-border/50" />}
        </MotionDiv>
      ))}
    </>
  );
};
