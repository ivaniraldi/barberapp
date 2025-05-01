// src/app/[locale]/page.tsx
'use client'; // Make this a client component to use hooks

import Link from 'next/link';
import { ServiceList } from '@/components/service-list';
import { BookingForm } from '@/components/booking-form';
import { GalleryGrid } from '@/components/gallery-grid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Images, CalendarCheck, ShoppingCart, Loader2 } from 'lucide-react'; // Added Loader2
import { useI18n } from '@/locales/client'; // Use client-side i18n hook
import { MotionDiv } from '@/components/motion-provider'; // Import MotionDiv
import { useFetchServices } from '@/hooks/use-fetch-services'; // Import the hook from its new location
import { type Service } from '@/lib/services'; // Import service type directly if needed

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

// Hover effect for cards
const cardHoverEffect = {
  boxShadow: "0px 10px 25px hsla(var(--primary) / 0.1), 0px 5px 10px hsla(var(--primary) / 0.05)", // Keep shadow effect
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] } // Custom ease for smooth transition
};

// Mock images for the gallery - replace with actual image URLs from your system
const galleryImages = [
  { id: 'g1', src: 'https://picsum.photos/seed/hair1/400/600', alt: 'Stylish haircut 1', category: 'Haircuts' },
  { id: 'g2', src: 'https://picsum.photos/seed/beard2/500/350', alt: 'Beard trim style 2', category: 'Beard Care' },
  { id: 'g3', src: 'https://picsum.photos/seed/fade3/450/550', alt: 'Clean fade haircut 3', category: 'Haircuts' },
  { id: 'g4', src: 'https://picsum.photos/seed/classic4/400/500', alt: 'Classic men\'s cut 4', category: 'Haircuts' },
  { id: 'g5', src: 'https://picsum.photos/seed/long5/350/550', alt: 'Long hair style 5', category: 'Styling' },
  { id: 'g6', src: 'https://picsum.photos/seed/shave6/600/400', alt: 'Hot towel shave 6', category: 'Shaves' },
];


export default function Home() {
  const t = useI18n(); // Get translation function
  const { services: allServices, isLoading: isLoadingServices, error: servicesError } = useFetchServices();

  // Get popular services (active only) - Calculate after fetching
  const popularServices = allServices.filter(s => s.active).slice(0, 3);

  // Filter all active services for the booking form - Calculate after fetching
  const bookableServices = allServices.filter(service => service.active);

  return (
    <MotionDiv
      className="container mx-auto px-4 py-16 sm:py-24" // Increased padding further
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <MotionDiv variants={itemVariants} className="text-center mb-24 sm:mb-32"> {/* Increased margin */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent mb-4 tracking-tighter drop-shadow-lg"> {/* Tighter tracking, larger size */}
          {t('home.title')}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"> {/* Wider max-width, relaxed leading */}
          {t('home.subtitle')}
        </p>
      </MotionDiv>

      <MotionDiv
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 mb-24 sm:mb-32" // Increased gap and margin
        variants={containerVariants} // Stagger children within this grid too
      >
        {/* Services Section */}
        <MotionDiv variants={itemVariants} whileHover={cardHoverEffect}>
          <Card className="shadow-lg bg-card/90 backdrop-blur-md border-border/50 overflow-hidden h-full flex flex-col rounded-xl"> {/* Explicit rounded-xl */}
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-4 border-b border-border/30"> {/* Subtle header gradient and border */}
              <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2 text-primary"> {/* Responsive title size */}
                <ShoppingCart className="w-7 h-7 text-accent"/> {t('home.popular_services')}
              </CardTitle>
              <CardDescription>{t('home.popular_services_desc')}</CardDescription> {/* Use default description styling */}
            </CardHeader>
            <CardContent className="pt-6 flex-grow flex flex-col justify-between"> {/* Use default CardContent padding */}
               {isLoadingServices && (
                 <div className="flex justify-center items-center h-full py-10">
                   <Loader2 className="h-8 w-8 animate-spin text-accent"/>
                 </div>
               )}
               {servicesError && (
                  <p className="text-destructive text-center py-4">{servicesError}</p>
               )}
               {!isLoadingServices && !servicesError && popularServices.length > 0 ? (
                 <ServiceList services={popularServices} />
               ) : (
                 !isLoadingServices && !servicesError && <p className="text-muted-foreground text-center py-4">{t('services_page.no_services_available')}</p>
               )}
               {/* CTA Button */}
                <MotionDiv whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="mt-6 self-start">
                   <Button asChild variant="link" className="text-accent px-0 group hover:text-accent/80 transition-colors font-semibold">
                    <Link href="/services">
                      {t('home.view_all_services')} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /> {/* Icon animation on hover */}
                    </Link>
                  </Button>
                </MotionDiv>
            </CardContent>
          </Card>
        </MotionDiv>

        {/* Booking Section */}
        <MotionDiv variants={itemVariants}> {/* Removed scaling hover effect */}
          <Card className="shadow-lg bg-card/90 backdrop-blur-md border-border/50 overflow-hidden h-full flex flex-col rounded-xl"> {/* Explicit rounded-xl */}
            <CardHeader className="bg-gradient-to-l from-primary/5 to-accent/5 pb-4 border-b border-border/30"> {/* Subtle header gradient and border */}
              <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2 text-primary"> {/* Responsive title size */}
                 <CalendarCheck className="w-7 h-7 text-accent"/> {t('home.book_appointment')}
              </CardTitle>
              <CardDescription>{t('home.book_appointment_desc')}</CardDescription> {/* Use default description styling */}
            </CardHeader>
            <CardContent className="pt-6 flex-grow"> {/* Use default CardContent padding */}
               {isLoadingServices && (
                 <div className="flex justify-center items-center h-full py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-accent"/>
                 </div>
               )}
               {servicesError && (
                  <p className="text-destructive text-center py-4">Error loading services for booking.</p> // Simplified error message
               )}
              {/* Pass only active services and translation function to booking form */}
              {!isLoadingServices && !servicesError && <BookingForm services={bookableServices} />}
            </CardContent>
          </Card>
        </MotionDiv>
      </MotionDiv>

      <MotionDiv variants={itemVariants}>
        <Separator className="my-24 sm:my-32 bg-gradient-to-r from-transparent via-border/50 to-transparent h-[1px]" /> {/* Faded separator */}
      </MotionDiv>

      {/* Our Work Gallery Section */}
      <MotionDiv variants={itemVariants} className="mb-24 sm:mb-32"> {/* Increased margin */}
        <header className="text-center mb-16 sm:mb-20"> {/* Increased margin */}
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-3 flex items-center justify-center gap-3">
            <Images className="h-8 w-8 text-accent animate-subtle-pulse" /> {/* Added subtle infinite animation */}
            {t('home.our_work')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t('home.our_work_desc')}</p> {/* Relaxed leading */}
        </header>
        {/* Pass images with category */}
        <GalleryGrid images={galleryImages} />
         {/* CTA to view full gallery */}
         <div className="text-center mt-16"> {/* Increased margin */}
             <MotionDiv whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}> {/* Slightly reduced hover scale */}
                 <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors shadow-md hover:shadow-lg">
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
