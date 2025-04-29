// src/components/service-list.tsx
'use client'; // Add this directive

import type { FC } from 'react';
import { Scissors, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/locales/client'; // Import i18n hook for client component
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

const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

export const ServiceList: FC<ServiceListProps> = ({ services }) => {
  const t = useI18n(); // Get translation function
  const isSingleService = services.length === 1;

  return (
    <div className={isSingleService ? '' : 'space-y-4'}>
      {services.map((service, index) => (
        <MotionDiv
            key={service.id}
            variants={listItemVariants}
            // Apply variants only if part of a list (not single display)
            initial={isSingleService ? undefined : "hidden"}
            animate={isSingleService ? undefined : "visible"}
            // Stagger children if it's a list
            custom={index}
            transition={isSingleService ? undefined : { delay: index * 0.05 }}
        >
          {/* Use Card styling implicitly via parent or keep transparent */}
          <div className={isSingleService ? "p-0" : "p-0"}> {/* Adjusted padding */}
              <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
                <h3 className="text-lg font-semibold flex items-center text-primary">
                  {!isSingleService && <Scissors className="mr-2 h-5 w-5 text-primary shrink-0" />}
                   {service.name}
                </h3>
                <span className="text-lg font-semibold text-primary flex items-center shrink-0">
                  <DollarSign className="mr-1 h-4 w-4 text-accent" />
                  {service.price.toFixed(2)}
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
