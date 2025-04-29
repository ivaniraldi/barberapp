import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminServiceManager } from "@/components/admin/admin-service-manager";
import { AdminAppointmentManager } from "@/components/admin/admin-appointment-manager";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react"; // Example icon

// Mock Data - Replace with actual data fetching for admin
const mockServices = [
  { id: '1', name: 'Classic Haircut', description: 'Traditional haircut.', duration: 30, price: 25, active: true },
  { id: '2', name: 'Beard Trim', description: 'Shape and trim beard.', duration: 15, price: 15, active: true },
  { id: '3', name: 'Hot Towel Shave', description: 'Relaxing shave.', duration: 45, price: 40, active: false },
];

const mockAppointments = [
    { id: 'a1', clientName: 'John Doe', clientPhone: '+15551234', clientEmail: 'john@example.com', serviceName: 'Classic Haircut', date: new Date(2024, 6, 25, 10, 0), status: 'Confirmed' },
    { id: 'a2', clientName: 'Jane Smith', clientPhone: '+15555678', clientEmail: 'jane@example.com', serviceName: 'Beard Trim', date: new Date(2024, 6, 25, 11, 30), status: 'Pending' },
    { id: 'a3', clientName: 'Bob Johnson', clientPhone: '+15559012', clientEmail: 'bob@example.com', serviceName: 'Hot Towel Shave', date: new Date(2024, 6, 26, 14, 0), status: 'Completed' },
];


export default function AdminPage() {
  // In a real app, you'd add authentication checks here
  // const isAuthenticated = checkAuth(); // Placeholder for auth check
  // if (!isAuthenticated) { redirect('/login'); }

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
         {/* Add authentication status or logout button here */}
         <div className="flex items-center text-muted-foreground">
            <Lock className="mr-2 h-5 w-5" />
            <span>Authenticated Access</span>
         </div>
      </header>

      <Separator className="mb-8" />

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="appointments">Manage Appointments</TabsTrigger>
          <TabsTrigger value="services">Manage Services</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <Card>
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
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Add, edit, or deactivate barbering services.</CardDescription>
            </CardHeader>
            <CardContent>
                <AdminServiceManager initialServices={mockServices} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
       <footer className="mt-16 pt-8 border-t text-center text-muted-foreground">
        <p>BarberApp Admin &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}