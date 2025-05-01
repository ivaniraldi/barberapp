// src/app/[locale]/admin/page.tsx
'use client'; // This component interacts with state and API, so it needs to be client-side

import { useState, useEffect, Suspense } from 'react'; // Added Suspense
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminServiceManager } from "@/components/admin/admin-service-manager";
import { AdminAppointmentManager } from "@/components/admin/admin-appointment-manager";
import { Separator } from "@/components/ui/separator";
import { Lock, LogOut, Settings, CalendarDays, Loader2 } from "lucide-react"; // Added Loader2
import { getServices, type Service } from "@/lib/services";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useI18n } from '@/locales/client'; // Use client-side hook
import { MotionDiv } from '@/components/motion-provider'; // Import MotionDiv
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Mock Appointments Data - Use ISO strings for consistency across server/client
// In a real app, fetch this data from your backend/database
const mockAppointments = [
    { id: 'a1', clientName: 'John Doe', clientPhone: '+15551234', clientEmail: 'john@example.com', serviceName: 'Corte de Cabelo Clássico', date: '2024-09-15T10:00:00Z', status: 'Confirmed' }, // Updated name
    { id: 'a2', clientName: 'Jane Smith', clientPhone: '+15555678', clientEmail: 'jane@example.com', serviceName: 'Aparar e Modelar Barba', date: '2024-09-15T11:30:00Z', status: 'Pending' }, // Updated name
    { id: 'a3', clientName: 'Bob Johnson', clientPhone: '+15559012', clientEmail: 'bob@example.com', serviceName: 'Barbear com Toalha Quente', date: '2024-09-16T14:00:00Z', status: 'Completed' }, // Updated name
    { id: 'a4', clientName: 'Carlos Rey', clientPhone: '+346661122', clientEmail: 'carlos@email.es', serviceName: 'Corte Degradê (Skin Fade)', date: '2024-09-17T09:00:00Z', status: 'Confirmed' }, // Updated name
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Enhanced card hover effect for admin panels
const cardHoverEffect = {
  boxShadow: "0px 8px 20px hsla(var(--primary) / 0.08), 0px 4px 8px hsla(var(--primary) / 0.04)", // Softer shadow
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }
};


// Custom hook to fetch services client-side
function useFetchServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const t = useI18n();

    useEffect(() => {
        const loadServices = async () => {
            try {
                setIsLoading(true);
                const fetchedServices = await getServices(); // Call the API function
                setServices(fetchedServices);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch services:", err);
                setError(t('admin_service.fetch_error_desc'));
            } finally {
                setIsLoading(false);
            }
        };

        loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Dependencies are intentionally empty to run once on mount

    return { services, isLoading, error };
}

// Component content extracted for Suspense
function AdminPageContent() {
  const t = useI18n(); // Get translation function (client-side)
  const { services: initialServices, isLoading: isLoadingServices, error: servicesError } = useFetchServices();

  return (
      <MotionDiv
        className="container mx-auto px-4 py-12 sm:py-16" // Consistent padding
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <MotionDiv variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between mb-12"> {/* Increased margin */}
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-0">{t('admin_page.title')}</h1>
           <div className="flex items-center gap-4">
              <span className="flex items-center text-muted-foreground text-sm font-medium"> {/* Subtle text */}
                  <Lock className="mr-2 h-4 w-4 text-green-500 animate-subtle-pulse" /> {/* Subtle infinite animation */}
                  {t('admin_page.authenticated')}
              </span>
              {/* Logout Button - Wrap Link in MotionDiv */}
               <MotionDiv
                  variants={itemVariants} // Apply animation variants if needed
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
               >
                 <Button
                    variant="outline"
                    size="sm"
                    asChild // Button renders the Link
                    className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/70 transition-colors duration-200" // Destructive outline style
                 >
                    <Link href="/"> {/* Link back to homepage (locale handled by middleware) */}
                        <LogOut className="mr-2 h-4 w-4"/> {t('nav.logout')}
                    </Link>
                 </Button>
               </MotionDiv>
           </div>
        </MotionDiv>

        <MotionDiv variants={itemVariants}>
          <Separator className="mb-12 border-border/50" /> {/* Increased margin */}
        </MotionDiv>

        <Tabs defaultValue="appointments" className="w-full">
           <MotionDiv variants={itemVariants}>
              {/* Improved TabsList Styling */}
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-10 bg-muted/60 p-1 h-auto sm:h-11 rounded-lg shadow-inner"> {/* Rounded-lg, inner shadow */}
                <TabsTrigger
                  value="appointments"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=inactive]:hover:bg-muted/80 transition-all duration-200 text-sm font-medium py-2 rounded-md" // Enhanced active/inactive states
                 >
                   <CalendarDays className="h-4 w-4"/> {t('admin_page.manage_appointments')}
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=inactive]:hover:bg-muted/80 transition-all duration-200 text-sm font-medium py-2 rounded-md" // Enhanced active/inactive states
                 >
                    <Settings className="h-4 w-4"/> {t('admin_page.manage_services')}
                </TabsTrigger>
              </TabsList>
            </MotionDiv>

          <TabsContent value="appointments">
             <MotionDiv variants={itemVariants} whileHover={cardHoverEffect}>
                {/* Professional Card Styling */}
                <Card className="bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg overflow-hidden rounded-xl"> {/* Rounded-xl */}
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/30"> {/* Use default padding */}
                    <CardTitle className="text-xl font-semibold">{t('admin_page.appointments_title')}</CardTitle> {/* Adjusted size */}
                    <CardDescription>{t('admin_page.appointments_desc')}</CardDescription> {/* Use CardDescription component */}
                  </CardHeader>
                  <CardContent className="p-5 sm:p-6"> {/* Consistent padding */}
                    {/* Pass initial data */}
                    <AdminAppointmentManager initialAppointments={mockAppointments} />
                  </CardContent>
                </Card>
             </MotionDiv>
          </TabsContent>

          <TabsContent value="services">
             <MotionDiv variants={itemVariants} whileHover={cardHoverEffect}>
                 {/* Professional Card Styling */}
                <Card className="bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg overflow-hidden rounded-xl"> {/* Rounded-xl */}
                  <CardHeader className="bg-gradient-to-l from-primary/5 to-accent/5 border-b border-border/30"> {/* Use default padding */}
                    <CardTitle className="text-xl font-semibold">{t('admin_page.services_title')}</CardTitle> {/* Adjusted size */}
                    <CardDescription>{t('admin_page.services_desc')}</CardDescription> {/* Use CardDescription component */}
                  </CardHeader>
                  <CardContent className="p-5 sm:p-6"> {/* Consistent padding */}
                      {/* Show loading state or error for services */}
                      {isLoadingServices && (
                          <div className="space-y-4">
                             <Skeleton className="h-10 w-1/3" />
                             <Skeleton className="h-8 w-full" />
                             <Skeleton className="h-8 w-full" />
                             <Skeleton className="h-8 w-full" />
                           </div>
                       )}
                       {servicesError && (
                           <p className="text-destructive text-center py-4">{servicesError}</p>
                       )}
                      {/* Pass fetched services only when loaded and no error */}
                      {!isLoadingServices && !servicesError && (
                         <AdminServiceManager initialServices={initialServices} />
                      )}
                  </CardContent>
                </Card>
             </MotionDiv>
          </TabsContent>
        </Tabs>

         {/* Footer */}
         <MotionDiv variants={itemVariants} className="mt-24 pt-12 border-t border-border/30 text-center text-muted-foreground text-sm">
            <p>{t('admin_page.footer_copy', { year: new Date().getFullYear() })}</p>
         </MotionDiv>
      </MotionDiv>
  );
}

export default function AdminPage() {
  // Wrap the main content with Suspense
  return (
    <Suspense fallback={<AdminPageFallback />}>
      <AdminPageContent />
    </Suspense>
  );
}

// Fallback component for Suspense
function AdminPageFallback() {
    return (
        <div className="container mx-auto px-4 py-12 sm:py-16 space-y-12">
            <div className="flex flex-col sm:flex-row items-center justify-between">
                <Skeleton className="h-10 w-48 mb-4 sm:mb-0" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 mb-10 h-11 gap-1">
                <Skeleton className="h-full w-full rounded-md" />
                <Skeleton className="h-full w-full rounded-md" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" /> {/* Placeholder for tab content */}
             <div className="mt-24 pt-12 border-t border-border/30 text-center">
                 <Skeleton className="h-4 w-1/3 mx-auto" />
             </div>
        </div>
    );
}

    