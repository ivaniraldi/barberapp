import { ServiceList } from '@/components/service-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getServices } from '@/lib/services'; // Import function to get services

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string; // Added category
  active: boolean;
}

// Helper function to group services by category
const groupServicesByCategory = (services: Service[]) => {
  return services.reduce((acc, service) => {
    const category = service.category || 'Other'; // Default category if none provided
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
};


export default function ServicesPage() {
  const allServices = getServices();
  const activeServices = allServices.filter(service => service.active); // Only show active services
  const categorizedServices = groupServicesByCategory(activeServices);
  const categories = Object.keys(categorizedServices).sort(); // Sort categories alphabetically

  return (
    <main className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-2">Our Services</h1>
        <p className="text-lg text-muted-foreground">Find the perfect grooming service for you.</p>
      </header>

      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="text-3xl font-semibold text-primary mb-6 pb-2 border-b border-accent">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categorizedServices[category].map(service => (
                <Card key={service.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur-sm border-border/50">
                   {/* Removed CardHeader and CardDescription as details are in ServiceList */}
                  <CardContent className="pt-6"> {/* Add padding-top back */}
                    <ServiceList services={[service]} /> {/* Pass single service as an array */}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {categories.length === 0 && (
          <p className="text-center text-muted-foreground text-lg">No services currently available. Please check back later.</p>
        )}
      </div>

      <footer className="mt-20 pt-10 border-t border-border/30 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BarberApp. All rights reserved.</p>
      </footer>
    </main>
  );
}
