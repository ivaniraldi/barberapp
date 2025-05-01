// src/app/[locale]/services/page.tsx
import { ServiceList } from '@/components/service-list';
import { Card, CardContent } from '@/components/ui/card';
import { getServices, type Service } from '@/lib/services';
import { getI18n } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { MotionDiv } from '@/components/motion-provider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to group services by category key
const groupServicesByCategoryKey = (services: Service[]) => {
  return services.reduce((acc, service) => {
    // Generate a consistent key from the category name (lowercase, underscores, default to 'other')
    const categoryKey = (service.category || 'other').toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, ''); // Sanitize key further
    if (!acc[categoryKey]) {
      acc[categoryKey] = { originalName: service.category || 'Other Services', services: [] }; // Store original name
    }
    acc[categoryKey].services.push(service);
    return acc;
  }, {} as Record<string, { originalName: string, services: Service[] }>); // Adjusted type
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
    transition: { duration: 0.4, ease: "easeOut" }, // Adjusted duration
  },
};

// Enhanced hover effect for service cards (removed scale)
const cardHoverEffect = {
  boxShadow: "0px 10px 25px hsla(var(--primary) / 0.1), 0px 5px 10px hsla(var(--primary) / 0.05)", // Refined shadow using theme colors
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] } // Custom ease
};


export default async function ServicesPage({ params }: { params: { locale: string } }) {
   // Set locale for static generation (important for build)
   setStaticParamsLocale(params.locale);

  const t = await getI18n(); // Get translation function
  const allServices = getServices();
  const activeServices = allServices.filter(service => service.active); // Only show active services

  const categorizedServicesData = groupServicesByCategoryKey(activeServices);
  const categoryKeys = Object.keys(categorizedServicesData).sort(); // Sort category keys alphabetically

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
        {categoryKeys.length === 0 && (
          <MotionDiv variants={itemVariants} className="text-center text-muted-foreground text-lg py-10">
            {t('services_page.no_services')}
          </MotionDiv>
        )}

        {categoryKeys.map((categoryKey) => {
          const categoryData = categorizedServicesData[categoryKey];
          // Construct the translation key
          const translationKey = `services_page.category_${categoryKey}` as any; // e.g., services_page.category_haircuts
          // Get the translated category name, using the original name as fallback
          const translatedCategoryName = t(translationKey, {}, { fallback: categoryData.originalName });

          return (
            <MotionDiv key={categoryKey} variants={itemVariants}>
              {/* Display the translated category name */}
              <h2 className="text-3xl font-semibold text-primary mb-6 pb-2 border-b-2 border-accent flex items-center gap-2">
                 {translatedCategoryName}
              </h2>
              {/* Use MotionDiv for the grid as well to stagger card appearance */}
              <MotionDiv
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants} // Stagger children (cards)
              >
                {categoryData.services.map(service => (
                  <MotionDiv key={service.id} variants={itemVariants} whileHover={cardHoverEffect}>
                    {/* Wrap card content for better structure and apply hover effect */}
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden h-full flex flex-col rounded-lg"> {/* Added rounded-lg */}
                      <CardContent className="p-6 flex-grow flex flex-col justify-between">
                        {/* Pass single service as an array to ServiceList */}
                        <ServiceList services={[service]} />
                        {/* Optional: Add a "Book Now" button specific to this service if desired */}
                      </CardContent>
                       {/* Footer for category badge */}
                       {service.category && (
                          <div className="p-4 pt-0 mt-auto">
                              {/* Translate the badge content using the translated category name */}
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
