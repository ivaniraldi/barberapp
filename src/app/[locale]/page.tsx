// src/app/[locale]/page.tsx
import Link from 'next/link';
import { ServiceList } from '@/components/service-list';
import { BookingForm } from '@/components/booking-form';
import { GalleryGrid } from '@/components/gallery-grid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Images, CalendarCheck, ShoppingCart } from 'lucide-react'; // Added relevant icons
import { getServices } from '@/lib/services';
import { getI18n } from '@/locales/server'; // Import server-side i18n
import { MotionDiv } from '@/components/motion-provider'; // Import MotionDiv

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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
  boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
  transition: { duration: 0.3 }
};

export default async function Home() {
  const t = await getI18n(); // Get translation function
  const allServices = getServices();

  // TODO: Implement logic to get *actually* popular services (e.g., based on booking count)
  // For now, just taking the first 3 as before.
  const popularServices = allServices.slice(0, 3).filter(s => s.active); // Filter active popular services

  // Filter all active services for the booking form
  const bookableServices = allServices.filter(service => service.active);

  // Mock images for the gallery - replace with actual image URLs from your system
  const galleryImages = [
    { id: 'g1', src: 'https://picsum.photos/seed/hair1/400/600', alt: 'Stylish haircut 1', category: 'Haircuts' },
    { id: 'g2', src: 'https://picsum.photos/seed/beard2/500/350', alt: 'Beard trim style 2', category: 'Beard Care' },
    { id: 'g3', src: 'https://picsum.photos/seed/fade3/450/550', alt: 'Clean fade haircut 3', category: 'Haircuts' },
    { id: 'g4', src: 'https://picsum.photos/seed/classic4/400/500', alt: 'Classic men\'s cut 4', category: 'Haircuts' },
    { id: 'g5', src: 'https://picsum.photos/seed/long5/350/550', alt: 'Long hair style 5', category: 'Styling' },
    { id: 'g6', src: 'https://picsum.photos/seed/shave6/600/400', alt: 'Hot towel shave 6', category: 'Shaves' },
  ];

  return (
    <MotionDiv
      className="container mx-auto px-4 py-8 sm:py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <MotionDiv variants={itemVariants} className="text-center mb-16 sm:mb-24">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent mb-3 tracking-tight drop-shadow-md">
          {t('home.title')}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </MotionDiv>

      <MotionDiv
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mb-16 sm:mb-24"
        variants={containerVariants} // Stagger children within this grid too
      >
        {/* Services Section */}
        <MotionDiv variants={itemVariants} whileHover={cardHoverEffect}>
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden h-full flex flex-col">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-4">
              <CardTitle className="text-3xl flex items-center gap-2">
                <ShoppingCart className="w-7 h-7 text-accent"/> {t('home.popular_services')}
              </CardTitle>
              <CardDescription>{t('home.popular_services_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-grow flex flex-col justify-between">
               {popularServices.length > 0 ? (
                 <ServiceList services={popularServices} />
               ) : (
                 <p className="text-muted-foreground text-center py-4">{t('services_page.no_services')}</p>
               )}
               <Button asChild variant="link" className="mt-6 text-accent px-0 self-start hover:text-accent/80 transition-colors">
                <Link href="/services">
                  {t('home.view_all_services')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </MotionDiv>

        {/* Booking Section */}
        <MotionDiv variants={itemVariants} whileHover={cardHoverEffect}>
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden h-full flex flex-col">
            <CardHeader className="bg-gradient-to-l from-primary/10 to-accent/10 pb-4">
              <CardTitle className="text-3xl flex items-center gap-2">
                 <CalendarCheck className="w-7 h-7 text-accent"/> {t('home.book_appointment')}
              </CardTitle>
              <CardDescription>{t('home.book_appointment_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-grow">
              {/* Pass only active services and translation function to booking form */}
              <BookingForm services={bookableServices} />
            </CardContent>
          </Card>
        </MotionDiv>
      </MotionDiv>

      <MotionDiv variants={itemVariants}>
        <Separator className="my-16 sm:my-24 bg-gradient-to-r from-transparent via-border to-transparent h-[1px]" />
      </MotionDiv>

      {/* Our Work Gallery Section */}
      <MotionDiv variants={itemVariants} className="mb-16 sm:mb-24">
        <header className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-3 flex items-center justify-center gap-3">
            <Images className="h-8 w-8 text-accent animate-subtle-pulse" /> {/* Added subtle infinite animation */}
            {t('home.our_work')}
          </h2>
          <p className="text-lg text-muted-foreground">{t('home.our_work_desc')}</p>
        </header>
        {/* Pass images with category */}
        <GalleryGrid images={galleryImages} />
      </MotionDiv>

      <MotionDiv variants={itemVariants} className="mt-20 sm:mt-32 pt-10 border-t border-border/30 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} {t('home.title')}. {t('home.footer_rights')}</p>
        <p>{t('home.footer_address')}</p>
      </MotionDiv>
    </MotionDiv>
  );
}
