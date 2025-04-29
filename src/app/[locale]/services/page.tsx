// src/app/[locale]/services/page.tsx
import { ServiceList } from '@/components/service-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getServices, type Service } from '@/lib/services'; // Import function and type
import { getI18n } from '@/locales/server'; // Import server-side i18n
import { MotionDiv } from '@/components/motion-provider'; // Import MotionDiv
import { Badge } from '@/components/ui/badge'; // Import Badge for category display

// Helper function to group services by category
const groupServicesByCategory = (services: Service[]) => {
  return services.reduce((acc, service) => {
    // Use category directly if available, otherwise 'Other'
    const category = service.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
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
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardHoverEffect = {
  scale: 1.03,
  boxShadow: "0px 8px 15px rgba(0,0,0,0.15)",
  transition: { duration: 0.3 }
};

export default async function ServicesPage() {
  const t = await getI18n(); // Get translation function
  const allServices = getServices();
  const activeServices = allServices.filter(service => service.active); // Only show active services
  const categorizedServices = groupServicesByCategory(activeServices);
  const categories = Object.keys(categorizedServices).sort(); // Sort categories alphabetically

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
        {categories.length === 0 && (
          <MotionDiv variants={itemVariants} className="text-center text-muted-foreground text-lg py-10">
            {t('services_page.no_services')}
          </MotionDiv>
        )}

        {categories.map((category) => (
          <MotionDiv key={category} variants={itemVariants}>
            <h2 className="text-3xl font-semibold text-primary mb-6 pb-2 border-b-2 border-accent flex items-center gap-2">
               {/* Optionally add category icons */}
               {category}
            </h2>
             {/* Use MotionDiv for the grid as well to stagger card appearance */}
            <MotionDiv
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants} // Stagger children (cards)
            >
              {categorizedServices[category].map(service => (
                <MotionDiv key={service.id} variants={itemVariants} whileHover={cardHoverEffect}>
                  {/* Wrap card content for better structure and apply hover effect */}
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden h-full flex flex-col">
                    {/* Optional: Add an image or icon related to the service */}
                    <CardContent className="p-6 flex-grow flex flex-col justify-between">
                      <ServiceList services={[service]} /> {/* Pass single service as an array */}
                      {/* Can add a "Book Now" button specific to this service if desired */}
                    </CardContent>
                     {/* Footer for category badge */}
                     {service.category && (
                        <div className="p-4 pt-0 mt-auto">
                            <Badge variant="secondary" className="text-xs">{service.category}</Badge>
                        </div>
                     )}
                  </Card>
                </MotionDiv>
              ))}
            </MotionDiv>
          </MotionDiv>
        ))}
      </MotionDiv>

      <MotionDiv variants={itemVariants} className="mt-20 sm:mt-24 pt-10 border-t border-border/30 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} {t('home.title')}. {t('home.footer_rights')}</p>
      </MotionDiv>
    </MotionDiv>
  );
}
