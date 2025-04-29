// src/app/[locale]/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminServiceManager } from "@/components/admin/admin-service-manager";
import { AdminAppointmentManager } from "@/components/admin/admin-appointment-manager";
import { Separator } from "@/components/ui/separator";
import { Lock, LogOut, Settings, CalendarDays } from "lucide-react"; // Added icons
import { getServices } from "@/lib/services";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getI18n } from '@/locales/server'; // Import server-side i18n
import { MotionDiv } from '@/components/motion-provider'; // Import MotionDiv

// Mock Appointments Data - Use ISO strings for consistency across server/client
// In a real app, fetch this data from your backend/database
const mockAppointments = [
    { id: 'a1', clientName: 'John Doe', clientPhone: '+15551234', clientEmail: 'john@example.com', serviceName: 'Classic Haircut', date: '2024-09-15T10:00:00Z', status: 'Confirmed' },
    { id: 'a2', clientName: 'Jane Smith', clientPhone: '+15555678', clientEmail: 'jane@example.com', serviceName: 'Beard Trim & Shape', date: '2024-09-15T11:30:00Z', status: 'Pending' },
    { id: 'a3', clientName: 'Bob Johnson', clientPhone: '+15559012', clientEmail: 'bob@example.com', serviceName: 'Hot Towel Shave', date: '2024-09-16T14:00:00Z', status: 'Completed' },
    { id: 'a4', clientName: 'Carlos Rey', clientPhone: '+346661122', clientEmail: 'carlos@email.es', serviceName: 'Skin Fade Haircut', date: '2024-09-17T09:00:00Z', status: 'Confirmed' },
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
  scale: 1.015, // More subtle scale for admin context
  boxShadow: "0px 8px 20px hsla(var(--primary) / 0.08), 0px 4px 8px hsla(var(--primary) / 0.04)", // Softer shadow
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }
};


export default async function AdminPage() {
  const t = await getI18n(); // Get translation function
  // In a real app, you'd add authentication checks here, possibly using middleware or a HOC
  // For now, we assume access is granted if the user reaches this page (middleware handles basic check).

  const services = getServices(); // Fetch actual services

  return (
    <MotionDiv
      className="container mx-auto px-4 py-8 sm:py-12" // Standard padding
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <MotionDiv variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between mb-10"> {/* Increased margin */}
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-0">{t('admin_page.title')}</h1>
         <div className="flex items-center gap-4">
            <span className="flex items-center text-muted-foreground text-sm font-medium"> {/* Slightly bolder text */}
                <Lock className="mr-2 h-4 w-4 text-green-500 animate-subtle-pulse" /> {/* Subtle infinite animation */}
                {t('admin_page.authenticated')}
            </span>
            {/* Logout Button - Professional Outline Style */}
            <Button
                variant="outline"
                size="sm"
                asChild
                className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive/70 transition-colors duration-200" // Destructive outline style
             >
                <Link href="/"> {/* Link back to homepage (locale handled) */}
                    <LogOut className="mr-2 h-4 w-4"/> {t('nav.logout')}
                </Link>
            </Button>
         </div>
      </MotionDiv>

      <MotionDiv variants={itemVariants}>
        <Separator className="mb-10 border-border/50" /> {/* Increased margin */}
      </MotionDiv>

      <Tabs defaultValue="appointments" className="w-full">
         <MotionDiv variants={itemVariants}>
            {/* Improved TabsList Styling */}
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-8 bg-muted/60 p-1 h-auto sm:h-11 rounded-lg shadow-inner"> {/* Rounded-lg, inner shadow */}
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
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg overflow-hidden rounded-xl"> {/* Rounded-xl */}
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/30 p-5"> {/* Slightly more padding */}
                  <CardTitle className="text-xl font-semibold">{t('admin_page.appointments_title')}</CardTitle> {/* Adjusted size */}
                  <CardDescription className="text-base">{t('admin_page.appointments_desc')}</CardDescription> {/* Adjusted size */}
                </CardHeader>
                <CardContent className="p-5 sm:p-6"> {/* Consistent padding */}
                  {/* Pass initial data and translation function */}
                  <AdminAppointmentManager initialAppointments={mockAppointments} />
                </CardContent>
              </Card>
           </MotionDiv>
        </TabsContent>

        <TabsContent value="services">
           <MotionDiv variants={itemVariants} whileHover={cardHoverEffect}>
               {/* Professional Card Styling */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg overflow-hidden rounded-xl"> {/* Rounded-xl */}
                <CardHeader className="bg-gradient-to-l from-primary/5 to-accent/5 border-b border-border/30 p-5"> {/* Slightly more padding */}
                  <CardTitle className="text-xl font-semibold">{t('admin_page.services_title')}</CardTitle> {/* Adjusted size */}
                  <CardDescription className="text-base">{t('admin_page.services_desc')}</CardDescription> {/* Adjusted size */}
                </CardHeader>
                <CardContent className="p-5 sm:p-6"> {/* Consistent padding */}
                    {/* Pass fetched services and translation function */}
                    <AdminServiceManager initialServices={services} />
                </CardContent>
              </Card>
           </MotionDiv>
        </TabsContent>
      </Tabs>

       {/* Footer */}
       <MotionDiv variants={itemVariants} className="mt-20 pt-10 border-t border-border/30 text-center text-muted-foreground text-sm">
          <p>{t('admin_page.footer_copy', { year: new Date().getFullYear() })}</p>
       </MotionDiv>
    </MotionDiv>
  );
}
