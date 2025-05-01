// src/components/service-list.tsx
'use client'; // Add this directive

import type { FC } from 'react';
import { Clock } from 'lucide-react'; // Removed Scissors, DollarSign, Euro - handled by formatCurrency
import { Separator } from '@/components/ui/separator';
import { useI18n, useCurrentLocale } from '@/locales/client'; // Import i18n hook for client component
import { MotionDiv } from './motion-provider'; // Import MotionDiv

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
    <div className={isSingleService ? '' : 'space-y-4'}>
      {services.map((service, index) => (
        <MotionDiv
            key={service.id}
            variants={listItemVariants}
            // Apply variants only if part of a list (not single display)
            initial={isSingleService ? undefined : "hidden"}
            animate={isSingleService ? undefined : "visible"}
            // Pass index for stagger delay
            custom={index}
        >
          {/* Use Card styling implicitly via parent or keep transparent */}
          <div className="p-0"> {/* Adjusted padding */}
              <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
                {/* Always display the service name as the primary heading within the list item */}
                <h3 className="text-lg font-semibold text-primary">
                   {service.name}
                </h3>
                <span className="text-lg font-semibold text-primary flex items-center shrink-0">
                   {/* Use formatted currency */}
                   {formatCurrency(service.price, currentLocale)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {/* Use translation for duration */}
                <span>{t('booking_form.duration_minutes', { duration: service.duration })}</span>
              </div>
          </div>
          {/* Add separator only if there are multiple services and it's not the last one */}
          {!isSingleService && index < services.length - 1 && <Separator className="my-4 border-border/50" />}
        </MotionDiv>
      ))}
    </div>
  );
};
