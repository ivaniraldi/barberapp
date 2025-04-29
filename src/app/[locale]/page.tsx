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
import { setStaticParamsLocale } from 'next-international/server'; // Correct import for setStaticParamsLocale
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
  scale: 1.03, // Slightly subtle scale
  boxShadow: "0px 10px 25px hsla(var(--primary) / 0.1), 0px 5px 10px hsla(var(--primary) / 0.05)", // Refined shadow using theme colors
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] } // Custom ease for smooth transition
};

export default async function Home({ params }: { params: { locale: string } }) {
   // Set locale for static generation (important for build)
   setStaticParamsLocale(params.locale);

  const t = await getI18n(); // Get translation function
  const allServices = getServices();

  // Get popular services (active only)
  const popularServices = allServices.filter(s => s.active).slice(0, 3); // Simplified logic, still takes first 3 active

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
      className="container mx-auto px-4 py-12 sm:py-16" // Increased padding
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <MotionDiv variants={itemVariants} className="text-center mb-20 sm:mb-32"> {/* Increased margin */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent mb-4 tracking-tighter drop-shadow-lg"> {/* Tighter tracking, larger size */}
          {t('home.title')}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"> {/* Wider max-width, relaxed leading */}
          {t('home.subtitle')}
        </p>
      </MotionDiv>

      <MotionDiv
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mb-20 sm:mb-32" // Increased gap and margin
        variants={containerVariants} // Stagger children within this grid too
      >
        {/* Services Section */}
        <MotionDiv variants={itemVariants} whileHover={cardHoverEffect}>
          <Card className="shadow-xl bg-card/80 backdrop-blur-md border-border/50 overflow-hidden h-full flex flex-col rounded-lg"> {/* Explicit rounded-lg */}
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-4 border-b border-border/30"> {/* Subtle header gradient and border */}
              <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2 text-primary"> {/* Responsive title size */}
                <ShoppingCart className="w-7 h-7 text-accent"/> {t('home.popular_services')}
              </CardTitle>
              <CardDescription className="text-base">{t('home.popular_services_desc')}</CardDescription> {/* Slightly larger desc */}
            </CardHeader>
            <CardContent className="pt-6 flex-grow flex flex-col justify-between p-6"> {/* Standard padding */}
               {popularServices.length > 0 ? (
                 <ServiceList services={popularServices} />
               ) : (
                 <p className="text-muted-foreground text-center py-4">{t('services_page.no_services')}</p>
               )}
               {/* CTA Button */}
                <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                   <Button asChild variant="link" className="mt-6 text-accent px-0 self-start group hover:text-accent/80 transition-colors font-semibold">
                    <Link href="/services">
                      {t('home.view_all_services')} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /> {/* Icon animation on hover */}
                    </Link>
                  </Button>
                </MotionDiv>
            </CardContent>
          </Card>
        </MotionDiv>

        {/* Booking Section */}
        <MotionDiv variants={itemVariants} whileHover={cardHoverEffect}>
          <Card className="shadow-xl bg-card/80 backdrop-blur-md border-border/50 overflow-hidden h-full flex flex-col rounded-lg"> {/* Explicit rounded-lg */}
            <CardHeader className="bg-gradient-to-l from-primary/5 to-accent/5 pb-4 border-b border-border/30"> {/* Subtle header gradient and border */}
              <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2 text-primary"> {/* Responsive title size */}
                 <CalendarCheck className="w-7 h-7 text-accent"/> {t('home.book_appointment')}
              </CardTitle>
              <CardDescription className="text-base">{t('home.book_appointment_desc')}</CardDescription> {/* Slightly larger desc */}
            </CardHeader>
            <CardContent className="pt-6 flex-grow p-6"> {/* Standard padding */}
              {/* Pass only active services and translation function to booking form */}
              <BookingForm services={bookableServices} />
            </CardContent>
          </Card>
        </MotionDiv>
      </MotionDiv>

      <MotionDiv variants={itemVariants}>
        <Separator className="my-20 sm:my-32 bg-gradient-to-r from-transparent via-border/50 to-transparent h-[1px]" /> {/* Faded separator */}
      </MotionDiv>

      {/* Our Work Gallery Section */}
      <MotionDiv variants={itemVariants} className="mb-20 sm:mb-32"> {/* Increased margin */}
        <header className="text-center mb-12 sm:mb-16"> {/* Increased margin */}
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-3 flex items-center justify-center gap-3">
            <Images className="h-8 w-8 text-accent animate-subtle-pulse" /> {/* Added subtle infinite animation */}
            {t('home.our_work')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t('home.our_work_desc')}</p> {/* Relaxed leading */}
        </header>
        {/* Pass images with category */}
        <GalleryGrid images={galleryImages} />
         {/* CTA to view full gallery */}
         <div className="text-center mt-12">
             <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                 <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm hover:shadow-md">
                    <Link href="/cuts">
                        {t('cuts_page.title')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                 </Button>
             </MotionDiv>
         </div>
      </MotionDiv>

      {/* Footer */}
      <MotionDiv variants={itemVariants} className="mt-24 sm:mt-40 pt-10 border-t border-border/30 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} {t('home.title')}. {t('home.footer_rights')}</p>
        <p>{t('home.footer_address')}</p>
      </MotionDiv>
    </MotionDiv>
  );
}
