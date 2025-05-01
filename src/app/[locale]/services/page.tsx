// src/app/[locale]/services/page.tsx
'use client'; // Make this a client component to use hooks

import { ServiceList } from '@/components/service-list';
import { Card, CardContent } from '@/components/ui/card'; // Removed CardHeader, Title, Desc
import { type Service } from '@/lib/services'; // Import type
import { useI18n } from '@/locales/client'; // Use client-side i18n hook
import { MotionDiv } from '@/components/motion-provider'; // Import MotionDiv
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading states
import { useMemo } from 'react'; // Import React hooks
import { Loader2 } from 'lucide-react'; // Import Loader2
import { useFetchServices } from '@/hooks/use-fetch-services'; // Import the hook from its new location

// Helper function to group services by category key
const groupServicesByCategoryKey = (services: Service[], t: ReturnType<typeof useI18n>) => {
  return services.reduce((acc, service) => {
    // Generate a consistent key from the category name (lowercase, underscore, no accents)
    const categoryKey = (service.category || 'other_services') // Use 'other_services' as default key
        .trim()
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/[^\w-]+/g, ''); // Remove non-alphanumeric characters except underscore/hyphen

    const defaultCategoryName = t('services_page.category_other_services'); // Get default name here

    if (!acc[categoryKey]) {
      acc[categoryKey] = { originalName: service.category || defaultCategoryName, services: [] };
    }
    acc[categoryKey].services.push(service);
    return acc;
  }, {} as Record<string, { originalName: string, services: Service[] }>);
};


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Enhanced hover effect for service cards
const cardHoverEffect = {
  boxShadow: "0px 10px 25px hsla(var(--primary) / 0.1), 0px 5px 10px hsla(var(--primary) / 0.05)", // Refined shadow using theme colors
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] } // Custom ease
};


export default function ServicesPage() {
  const t = useI18n(); // Get translation function
  const { services: allServices, isLoading: isLoadingServices, error: servicesError } = useFetchServices();

  // Filter and categorize services after fetching
  const activeServices = useMemo(() => allServices.filter(service => service.active), [allServices]);
  const categorizedServicesData = useMemo(() => groupServicesByCategoryKey(activeServices, t), [activeServices, t]); // Pass t
  const categoryKeys = useMemo(() => Object.keys(categorizedServicesData).sort(), [categorizedServicesData]);

  return (
    <MotionDiv
      className="container mx-auto px-4 py-16 sm:py-24" // Increased padding
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <MotionDiv variants={itemVariants} className="text-center mb-16 sm:mb-20"> {/* Increased margin */}
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">{t('services_page.title')}</h1>
        <p className="text-lg text-muted-foreground">{t('services_page.subtitle')}</p>
      </MotionDiv>

      <MotionDiv className="space-y-16" variants={containerVariants}> {/* Increased space between categories */}
        {isLoadingServices && (
            <MotionDiv variants={itemVariants} className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-accent"/>
            </MotionDiv>
        )}
        {servicesError && (
          <MotionDiv variants={itemVariants} className="text-center text-destructive text-lg py-10">
             {servicesError}
          </MotionDiv>
        )}

        {!isLoadingServices && !servicesError && categoryKeys.length === 0 && (
          <MotionDiv variants={itemVariants} className="text-center text-muted-foreground text-lg py-10">
            {t('services_page.no_services_available')}
          </MotionDiv>
        )}

        {!isLoadingServices && !servicesError && categoryKeys.map((categoryKey) => {
          const categoryData = categorizedServicesData[categoryKey];
          // Construct the translation key
          const translationKey = `services_page.category_${categoryKey}` as any;
          // Attempt to translate, use original name as fallback
          const translatedCategoryName = t(translationKey, {}, { fallback: categoryData.originalName });

          return (
            <MotionDiv key={categoryKey} variants={itemVariants}>
              <h2 className="text-3xl font-semibold text-primary mb-8 pb-3 border-b-2 border-accent flex items-center gap-2"> {/* Increased margin bottom */}
                 {/* Display the potentially translated category name */}
                 {translatedCategoryName}
              </h2>
              <MotionDiv
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" // Adjusted grid columns for responsiveness
                  variants={containerVariants}
              >
                {categoryData.services.map(service => (
                  <MotionDiv key={service.id} variants={itemVariants} whileHover={cardHoverEffect}>
                    {/* Use Card component for each service */}
                    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 bg-card/90 backdrop-blur-sm border-border/50 overflow-hidden h-full flex flex-col rounded-xl">
                      <CardContent className="flex-grow flex flex-col justify-between p-5 sm:p-6"> {/* Ensure padding here */}
                         {/* Pass the single service to ServiceList */}
                         <ServiceList services={[service]} />
                      </CardContent>
                    </Card>
                  </MotionDiv>
                ))}
              </MotionDiv>
            </MotionDiv>
          );
        })}
      </MotionDiv>

      <MotionDiv variants={itemVariants} className="mt-20 sm:mt-24 pt-10 border-t border-border/30 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} {t('home.title')}. {t('home.footer_rights')}</p>
      </MotionDiv>
    </MotionDiv>
  );
}
