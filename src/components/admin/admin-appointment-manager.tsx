'use client';

import type { FC } from 'react';
import { useState } from 'react';
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle, XCircle, Clock, User, Phone, Mail, Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceName: string;
  date: Date;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

interface AdminAppointmentManagerProps {
  initialAppointments: Appointment[];
}

const statusColors: Record<Appointment['status'], string> = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

export const AdminAppointmentManager: FC<AdminAppointmentManagerProps> = ({ initialAppointments }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const { toast } = useToast();

  // Sort appointments by date, upcoming first
  const sortedAppointments = [...appointments].sort((a, b) => a.date.getTime() - b.date.getTime());

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
               <TableCell colSpan={5} className="text-center text-muted-foreground">No appointments found.</TableCell>
             </TableRow>
           )}
          {sortedAppointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <div>{format(appointment.date, 'PPP')}</div>
                <div className="text-sm text-muted-foreground">{format(appointment.date, 'p')}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{appointment.clientName}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <a href={`tel:${appointment.clientPhone}`} className="hover:text-primary flex items-center"><Phone className="mr-1 h-3 w-3"/> {appointment.clientPhone}</a>
                    <a href={`mailto:${appointment.clientEmail}`} className="hover:text-primary flex items-center"><Mail className="mr-1 h-3 w-3"/> {appointment.clientEmail}</a>
                </div>
              </TableCell>
              <TableCell>{appointment.serviceName}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`border-none ${statusColors[appointment.status]}`}>
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
                    <SelectTrigger className="w-[130px] h-8 text-xs">
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};