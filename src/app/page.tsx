import Link from 'next/link';
import { ServiceList } from '@/components/service-list';
import { BookingForm } from '@/components/booking-form';
import { GalleryGrid } from '@/components/gallery-grid'; // Import GalleryGrid
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Images } from 'lucide-react';
import { getServices } from '@/lib/services'; // Import function to get services

export default function Home() {
  const allServices = getServices();
  // Show only the first 3 services as "popular" for the homepage
  const popularServices = allServices.slice(0, 3);
  // Filter services for the booking form (assuming all active services can be booked)
  const bookableServices = allServices.filter(service => service.active);

  // Mock images for the gallery - replace with actual image URLs
  const galleryImages = [
    { id: 'g1', src: 'https://picsum.photos/seed/hair1/400/600', alt: 'Stylish haircut 1' },
    { id: 'g2', src: 'https://picsum.photos/seed/beard2/500/350', alt: 'Beard trim style 2' },
    { id: 'g3', src: 'https://picsum.photos/seed/fade3/450/550', alt: 'Clean fade haircut 3' },
    { id: 'g4', src: 'https://picsum.photos/seed/classic4/400/500', alt: 'Classic men\'s cut 4' },
    { id: 'g5', src: 'https://picsum.photos/seed/long5/350/550', alt: 'Long hair style 5' },
    { id: 'g6', src: 'https://picsum.photos/seed/shave6/600/400', alt: 'Hot towel shave 6' },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold text-primary mb-3 tracking-tight">BarberApp</h1>
        <p className="text-xl text-muted-foreground">Your neighborhood barbershop for premium grooming.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
        {/* Services Section */}
        <section>
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-3xl">Popular Services</CardTitle>
              <CardDescription>Check out some of our client favorites.</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceList services={popularServices} />
              <Button asChild variant="link" className="mt-4 text-accent px-0">
                <Link href="/services">
                  View All Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Booking Section */}
        <section>
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-3xl">Book Your Appointment</CardTitle>
              <CardDescription>Select a service and find a time that suits you.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pass only active services to booking form */}
              <BookingForm services={bookableServices} />
            </CardContent>
          </Card>
        </section>
      </div>

      <Separator className="my-16 bg-border/30" />

      {/* Our Work Gallery Section */}
      <section className="mb-16">
        <header className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-3 flex items-center justify-center gap-3"><Images className="h-8 w-8 text-accent" /> Our Work</h2>
          <p className="text-lg text-muted-foreground">Take a look at some of the styles we create.</p>
        </header>
        <GalleryGrid images={galleryImages} />
      </section>

      <footer className="mt-20 pt-10 border-t border-border/30 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BarberApp. All rights reserved.</p>
        <p>123 Barber Street, Cityville</p>
      </footer>
    </main>
  );
}
