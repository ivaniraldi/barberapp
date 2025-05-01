// src/app/[locale]/services/page.tsx
import { ServiceList } from '@/components/service-list';
import { Card, CardContent } from '@/components/ui/card'; // Only Card and CardContent needed here
import { getServices, type Service } from '@/lib/services'; // Import function and type
import { getI18n } from '@/locales/server'; // Import server-side i18n
import { setStaticParamsLocale } from 'next-international/server'; // Import setStaticParamsLocale
import { MotionDiv } from '@/components/motion-provider'; // Import MotionDiv
import { Badge } from '@/components/ui/badge'; // Import Badge for category display
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for potential loading states

// Helper function to group services by category key
const groupServicesByCategoryKey = (services: Service[]) => {
  return services.reduce((acc, service) => {
    // Generate a consistent key from the category name (lowercase, underscores, default to 'other')
    // Ensure accents are removed for simpler key matching if desired, or handle them in locale files.
    // Sticking to basic replacement for now.
    const categoryKey = (service.category || 'other')
        .toLowerCase()
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents for key generation
        .replace(/[^\w-]+/g, ''); // Remove remaining non-alphanumeric characters except hyphen
    if (!acc[categoryKey]) {
      acc[categoryKey] = { originalName: service.category || 'Other Services', services: [] }; // Store original name
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
  const allServices = await getServices(); // Await the promise
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
            {/* Ensure this key exists in all locale files */}
            {t('services_page.no_services_available')}
          </MotionDiv>
        )}

        {categoryKeys.map((categoryKey) => {
          const categoryData = categorizedServicesData[categoryKey];
          // Construct the translation key (ensure this matches keys in locale files)
          const translationKey = `services_page.category_${categoryKey}` as any;
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
                         {/* REMOVED H3 title here - ServiceList handles display */}
                         {/* Pass only the single service to the list */}
                         <ServiceList services={[service]} />
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
