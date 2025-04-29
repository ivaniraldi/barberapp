// src/components/admin/admin-appointment-manager.tsx
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react'; // Import useEffect
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle, XCircle, Clock, User, Phone, Mail, Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceName: string;
  date: Date | string; // Allow string for initial props, parse inside
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

interface AdminAppointmentManagerProps {
  initialAppointments: Appointment[];
}

const statusColors: Record<Appointment['status'], string> = {
    Pending: 'bg-yellow-900/50 border-yellow-700 text-yellow-300', // Dark theme adjustment
    Confirmed: 'bg-green-900/50 border-green-700 text-green-300', // Dark theme adjustment
    Cancelled: 'bg-red-900/50 border-red-700 text-red-300', // Dark theme adjustment
    Completed: 'bg-blue-900/50 border-blue-700 text-blue-300', // Dark theme adjustment
};

// Helper function to safely create a Date object
const safeParseDate = (dateInput: Date | string): Date | null => {
  try {
    const date = new Date(dateInput);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return null; // Invalid date
    }
    return date;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

export const AdminAppointmentManager: FC<AdminAppointmentManagerProps> = ({ initialAppointments }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isClient, setIsClient] = useState(false); // State to track client-side mount
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true); // Set to true after component mounts
  }, []);

  // Sort appointments by date, upcoming first
  // Ensure date comparison works correctly by parsing dates safely
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = safeParseDate(a.date);
    const dateB = safeParseDate(b.date);
    if (!dateA || !dateB) return 0; // Handle invalid dates if necessary
    return dateA.getTime() - dateB.getTime();
   });

   const updateAppointmentStatus = async (appointmentId: string, newStatus: Appointment['status']) => {
       // Simulate API call
       await new Promise(resolve => setTimeout(resolve, 300));

       setAppointments(prevAppointments =>
         prevAppointments.map(app =>
           app.id === appointmentId ? { ...app, status: newStatus } : app
         )
       );

       toast({
         title: "Appointment Status Updated",
         description: `Appointment ID ${appointmentId} set to ${newStatus}.`,
         variant: 'default' // Ensure variant is set for dark theme contrast
       });
     };


  return (
    <div className="space-y-6">
       {/* Add Filtering/Sorting options here later if needed */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Calendar className="inline mr-1 h-4 w-4" />Date & Time</TableHead>
            <TableHead><User className="inline mr-1 h-4 w-4" />Client</TableHead>
            <TableHead><Scissors className="inline mr-1 h-4 w-4" />Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppointments.length === 0 && (
             <TableRow>
               <TableCell colSpan={5} className="text-center text-muted-foreground py-6">No appointments found.</TableCell>
             </TableRow>
           )}
          {sortedAppointments.map((appointment) => {
            const appointmentDate = safeParseDate(appointment.date);
            return (
            <TableRow key={appointment.id} className="hover:bg-muted/50">
              <TableCell>
                 {/* Format date directly. Ensure the Date object is valid. */}
                 {appointmentDate ? (
                    <>
                      <div>{format(appointmentDate, 'PPP')}</div>
                      {/* Only render time formatting on the client */}
                      <div className="text-sm text-muted-foreground h-4"> {/* Added fixed height to prevent layout shift */}
                        {isClient ? format(appointmentDate, 'p') : ''}
                      </div>
                    </>
                 ) : (
                    <div className="text-destructive">Invalid Date</div>
                 )}
              </TableCell>
              <TableCell>
                <div className="font-medium text-primary">{appointment.clientName}</div>
                <div className="text-sm text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1">
                    <a href={`tel:${appointment.clientPhone}`} className="hover:text-accent flex items-center text-xs">
                        <Phone className="mr-1 h-3 w-3"/> {appointment.clientPhone}
                    </a>
                    <a href={`mailto:${appointment.clientEmail}`} className="hover:text-accent flex items-center text-xs">
                        <Mail className="mr-1 h-3 w-3"/> {appointment.clientEmail}
                    </a>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{appointment.serviceName}</TableCell>
              <TableCell>
                {/* Adjusted Badge styling for dark theme */}
                <Badge variant="outline" className={`border ${statusColors[appointment.status]}`}>
                   {appointment.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                   {appointment.status === 'Confirmed' && <CheckCircle className="mr-1 h-3 w-3" />}
                   {appointment.status === 'Cancelled' && <XCircle className="mr-1 h-3 w-3" />}
                   {appointment.status === 'Completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                  {appointment.status}
                </Badge>
              </TableCell>
               <TableCell className="text-right">
                  <Select
                    value={appointment.status}
                    onValueChange={(newStatus: Appointment['status']) => updateAppointmentStatus(appointment.id, newStatus)}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs bg-input/50 border-border/70">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  );
};
