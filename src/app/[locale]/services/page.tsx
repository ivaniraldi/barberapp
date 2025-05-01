// src/app/[locale]/services/page.tsx
'use client'; // Make this a client component to use hooks

import { ServiceList } from '@/components/service-list';
import { Card, CardContent } from '@/components/ui/card'; // Only Card and CardContent needed here
import { getServices, type Service } from '@/lib/services'; // Import function and type
import { useI18n } from '@/locales/client'; // Use client-side i18n hook
// Removed setStaticParamsLocale import
import { MotionDiv } from '@/components/motion-provider'; // Import MotionDiv
import { Badge } from '@/components/ui/badge'; // Import Badge for category display
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading states
import { useEffect, useState, useMemo } from 'react'; // Import React hooks
import { Loader2 } from 'lucide-react'; // Import Loader2

// Helper function to group services by category key
const groupServicesByCategoryKey = (services: Service[]) => {
  return services.reduce((acc, service) => {
    const categoryKey = (service.category || 'other')
        .toLowerCase()
        .replace(/\s+/g, '_')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w-]+/g, '');
    if (!acc[categoryKey]) {
      acc[categoryKey] = { originalName: service.category || 'Other Services', services: [] };
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

// Enhanced hover effect for service cards (removed scale)
const cardHoverEffect = {
  boxShadow: "0px 10px 25px hsla(var(--primary) / 0.1), 0px 5px 10px hsla(var(--primary) / 0.05)", // Refined shadow using theme colors
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] } // Custom ease
};

// Custom hook to fetch services client-side (can be moved to a separate hooks file)
function useFetchServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadServices = async () => {
            try {
                setIsLoading(true);
                const fetchedServices = await getServices(); // Call the API function
                setServices(fetchedServices);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch services:", err);
                setError("Failed to load services. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        loadServices();
    }, []); // Empty dependency array ensures this runs once on mount

    return { services, isLoading, error };
}


export default function ServicesPage() {
  // Removed params prop and setStaticParamsLocale call

  const t = useI18n(); // Get translation function
  const { services: allServices, isLoading: isLoadingServices, error: servicesError } = useFetchServices();

  // Filter and categorize services after fetching
  const activeServices = useMemo(() => allServices.filter(service => service.active), [allServices]);
  const categorizedServicesData = useMemo(() => groupServicesByCategoryKey(activeServices), [activeServices]);
  const categoryKeys = useMemo(() => Object.keys(categorizedServicesData).sort(), [categorizedServicesData]);

  return (
    <MotionDiv
      className="container mx-auto px-4 py-12 sm:py-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <MotionDiv variants={itemVariants} className="text-center mb-12 sm:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">{t('services_page.title')}</h1>
        <p className="text-lg text-muted-foreground">{t('services_page.subtitle')}</p>
      </MotionDiv>

      <MotionDiv className="space-y-12" variants={containerVariants}>
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
          const translationKey = `services_page.category_${categoryKey}` as any;
          const translatedCategoryName = t(translationKey, {}, { fallback: categoryData.originalName });

          return (
            <MotionDiv key={categoryKey} variants={itemVariants}>
              <h2 className="text-3xl font-semibold text-primary mb-6 pb-2 border-b-2 border-accent flex items-center gap-2">
                 {translatedCategoryName}
              </h2>
              <MotionDiv
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
              >
                {categoryData.services.map(service => (
                  <MotionDiv key={service.id} variants={itemVariants} whileHover={cardHoverEffect}>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden h-full flex flex-col rounded-lg">
                      <CardContent className="p-6 flex-grow flex flex-col justify-between">
                         <ServiceList services={[service]} />
                      </CardContent>
                       {service.category && (
                          <div className="p-4 pt-0 mt-auto">
                              <Badge variant="secondary" className="text-xs">{translatedCategoryName}</Badge>
                          </div>
                       )}
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
