import { ServiceList } from '@/components/service-list';
import { BookingForm } from '@/components/booking-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Mock data for services - replace with actual data fetching later
const services = [
  { id: '1', name: 'Classic Haircut', description: 'Traditional haircut with scissors and clippers.', duration: 30, price: 25 },
  { id: '2', name: 'Beard Trim', description: 'Shape and trim your beard to perfection.', duration: 15, price: 15 },
  { id: '3', name: 'Hot Towel Shave', description: 'Relaxing hot towel shave with a straight razor.', duration: 45, price: 40 },
  { id: '4', name: 'Hair Wash & Style', description: 'Shampoo, condition, and style.', duration: 20, price: 20 },
];

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-2">BarberApp</h1>
        <p className="text-lg text-muted-foreground">Your neighborhood barbershop for premium grooming services.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Our Services</CardTitle>
              <CardDescription>Choose from our range of expert barbering services.</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceList services={services} />
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Book Your Appointment</CardTitle>
              <CardDescription>Select a service and find a time that works for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingForm services={services} />
            </CardContent>
          </Card>
        </section>
      </div>

      <footer className="mt-16 pt-8 border-t text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BarberApp. All rights reserved.</p>
        <p>123 Barber Street, Cityville</p>
      </footer>
    </main>
  );
}