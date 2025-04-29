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

const cardHoverEffect = {
  scale: 1.02,
  boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
  transition: { duration: 0.3 }
};


export default async function AdminPage() {
  const t = await getI18n(); // Get translation function
  // In a real app, you'd add authentication checks here, possibly using middleware or a HOC
  // For now, we assume access is granted if the user reaches this page (middleware handles basic check).

  const services = getServices(); // Fetch actual services

  return (
    <MotionDiv
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <MotionDiv variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4 sm:mb-0">{t('admin_page.title')}</h1>
         <div className="flex items-center gap-4">
            <span className="flex items-center text-muted-foreground text-sm">
                <Lock className="mr-2 h-4 w-4 text-green-500 animate-subtle-pulse" /> {/* Subtle infinite animation */}
                {t('admin_page.authenticated')}
            </span>
            {/* Add a simple Logout button - in real app, this would trigger auth state change */}
            <Button variant="outline" size="sm" asChild className="border-destructive/50 text-destructive hover:bg-destructive/10">
                <Link href="/"> {/* Link back to homepage (locale handled) */}
                    <LogOut className="mr-2 h-4 w-4"/> {t('nav.logout')}
                </Link>
            </Button>
         </div>
      </MotionDiv>

      <MotionDiv variants={itemVariants}>
        <Separator className="mb-8 border-border/50" />
      </MotionDiv>

      <Tabs defaultValue="appointments" className="w-full">
         <MotionDiv variants={itemVariants}>
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-6 bg-muted/60 p-1 h-auto sm:h-10">
              <TabsTrigger value="appointments" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:hover:bg-muted transition-colors">
                 <CalendarDays className="h-4 w-4"/> {t('admin_page.manage_appointments')}
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:hover:bg-muted transition-colors">
                  <Settings className="h-4 w-4"/> {t('admin_page.manage_services')}
              </TabsTrigger>
            </TabsList>
          </MotionDiv>

        <TabsContent value="appointments">
           <MotionDiv variants={itemVariants} whileHover={cardHoverEffect}>
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle>{t('admin_page.appointments_title')}</CardTitle>
                  <CardDescription>{t('admin_page.appointments_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {/* Pass initial data and translation function */}
                  <AdminAppointmentManager initialAppointments={mockAppointments} />
                </CardContent>
              </Card>
           </MotionDiv>
        </TabsContent>

        <TabsContent value="services">
           <MotionDiv variants={itemVariants} whileHover={cardHoverEffect}>
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-primary/5 to-accent/5">
                  <CardTitle>{t('admin_page.services_title')}</CardTitle>
                  <CardDescription>{t('admin_page.services_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    {/* Pass fetched services and translation function */}
                    <AdminServiceManager initialServices={services} />
                </CardContent>
              </Card>
           </MotionDiv>
        </TabsContent>
      </Tabs>

       <MotionDiv variants={itemVariants} className="mt-16 pt-8 border-t border-border/30 text-center text-muted-foreground text-sm">
          <p>{t('admin_page.footer_copy', { year: new Date().getFullYear() })}</p>
       </MotionDiv>
    </MotionDiv>
  );
}
