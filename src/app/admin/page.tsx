import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminServiceManager } from "@/components/admin/admin-service-manager";
import { AdminAppointmentManager } from "@/components/admin/admin-appointment-manager";
import { Separator } from "@/components/ui/separator";
import { Lock, LogOut } from "lucide-react"; // Added LogOut icon
import { getServices } from "@/lib/services"; // Import function to get services
import { Button } from "@/components/ui/button"; // Import Button
import Link from "next/link"; // Import Link


// Mock Appointments Data - Use ISO strings for consistency across server/client
const mockAppointments = [
    { id: 'a1', clientName: 'John Doe', clientPhone: '+15551234', clientEmail: 'john@example.com', serviceName: 'Classic Haircut', date: '2024-07-25T10:00:00Z', status: 'Confirmed' }, // Use ISO 8601 format (UTC)
    { id: 'a2', clientName: 'Jane Smith', clientPhone: '+15555678', clientEmail: 'jane@example.com', serviceName: 'Beard Trim', date: '2024-07-25T11:30:00Z', status: 'Pending' },
    { id: 'a3', clientName: 'Bob Johnson', clientPhone: '+15559012', clientEmail: 'bob@example.com', serviceName: 'Hot Towel Shave', date: '2024-07-26T14:00:00Z', status: 'Completed' },
];


export default function AdminPage() {
  // In a real app, you'd add authentication checks here, possibly using middleware or a HOC
  // For now, we assume access is granted if the user reaches this page.

  const services = getServices(); // Fetch actual services

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
         <div className="flex items-center gap-4">
            <span className="flex items-center text-muted-foreground">
                <Lock className="mr-2 h-5 w-5 text-green-500" /> {/* Indicate auth */}
                Authenticated
            </span>
            {/* Add a simple Logout button - in real app, this would trigger auth state change */}
            <Button variant="outline" size="sm" asChild>
                <Link href="/"> {/* Link back to homepage for now */}
                    <LogOut className="mr-2 h-4 w-4"/> Logout
                </Link>
            </Button>
         </div>
      </header>

      <Separator className="mb-8 border-border/50" />

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
          <TabsTrigger value="appointments">Manage Appointments</TabsTrigger>
          <TabsTrigger value="services">Manage Services</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>View, confirm, or cancel upcoming appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAppointmentManager initialAppointments={mockAppointments} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Add, edit, or activate/deactivate barbering services.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Pass fetched services */}
                <AdminServiceManager initialServices={services} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
       <footer className="mt-16 pt-8 border-t border-border/30 text-center text-muted-foreground">
        <p>BarberApp Admin &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
