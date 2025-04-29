// src/components/admin/admin-appointment-manager.tsx
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { enUS, es, pt } from 'date-fns/locale'; // Import locales
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
import { Calendar, CheckCircle, XCircle, Clock, User, Phone, Mail, Scissors, Loader2 } from 'lucide-react'; // Added Loader2
import { useToast } from '@/hooks/use-toast';
import { useI18n, useCurrentLocale } from '@/locales/client'; // Import i18n hooks
import { MotionDiv } from '@/components/motion-provider'; // Import MotionDiv

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceName: string;
  date: Date | string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

interface AdminAppointmentManagerProps {
  initialAppointments: Appointment[];
}

const statusColors: Record<Appointment['status'], string> = {
    Pending: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400', // Adjusted for better visibility
    Confirmed: 'bg-green-500/10 border-green-500/50 text-green-400',
    Cancelled: 'bg-red-500/10 border-red-500/50 text-red-400',
    Completed: 'bg-blue-500/10 border-blue-500/50 text-blue-400',
};

// Map locale strings to date-fns locale objects
const dateLocales: { [key: string]: Locale } = {
  en: enUS,
  es: es,
  pt: pt,
};

// Helper function to safely create a Date object
const safeParseDate = (dateInput: Date | string): Date | null => {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date encountered:", dateInput); // Warn about invalid dates
      return null;
    }
    return date;
  } catch (error) {
    console.error("Error parsing date:", dateInput, error);
    return null;
  }
};

export const AdminAppointmentManager: FC<AdminAppointmentManagerProps> = ({ initialAppointments }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const t = useI18n(); // Get translation function
  const currentLocale = useCurrentLocale(); // Get current locale for date formatting

  useEffect(() => {
    setIsClient(true); // Component has mounted on the client
  }, []);

  // Sort appointments by date, upcoming first
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = safeParseDate(a.date);
    const dateB = safeParseDate(b.date);
    // Handle cases where one or both dates are invalid
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1; // Put invalid dates at the end
    if (!dateB) return -1;
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
         title: t('admin_appointment.update_success_title'),
         description: t('admin_appointment.update_success_desc', { appointmentId, newStatus: t(`admin_appointment.${newStatus.toLowerCase()}` as any) }),
         variant: 'default'
       });
     };

     // Animation Variants
     const tableRowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({ // Accept index for staggering
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05, // Stagger animation
                duration: 0.3,
                ease: "easeOut"
            }
        }),
        exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
     };


  return (
    <div className="space-y-6">
      <div className="overflow-x-auto"> {/* Make table horizontally scrollable on small screens */}
        <Table className="min-w-full"> {/* Ensure table takes minimum full width */}
          <TableHeader>
            <TableRow>
              <TableHead><Calendar className="inline mr-1 h-4 w-4" />{t('admin_appointment.date_time')}</TableHead>
              <TableHead><User className="inline mr-1 h-4 w-4" />{t('admin_appointment.client')}</TableHead>
              <TableHead><Scissors className="inline mr-1 h-4 w-4" />{t('admin_appointment.service')}</TableHead>
              <TableHead>{t('admin_appointment.status')}</TableHead>
              <TableHead className="text-right">{t('admin_appointment.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAppointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  {t('admin_appointment.no_appointments')}
                </TableCell>
              </TableRow>
            )}
            {sortedAppointments.map((appointment, index) => {
              const appointmentDate = safeParseDate(appointment.date);
              const locale = dateLocales[currentLocale] || enUS; // Fallback to English

              return (
              <MotionDiv
                key={appointment.id}
                as={TableRow} // Render as TableRow
                className="hover:bg-muted/30 transition-colors duration-150"
                variants={tableRowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={index} // Pass index for stagger delay
                layout // Animate layout changes (e.g., sorting)
              >
                <TableCell className="whitespace-nowrap"> {/* Prevent date/time wrapping */}
                  {appointmentDate ? (
                      <>
                        {/* Use locale in format */}
                        <div>{format(appointmentDate, 'PPP', { locale })}</div>
                        {/* Client-side rendering check for time formatting */}
                        <div className="text-sm text-muted-foreground h-4">
                          {isClient ? format(appointmentDate, 'p', { locale }) : <Loader2 className="h-3 w-3 animate-spin"/>} {/* Show loader during hydration */}
                        </div>
                      </>
                  ) : (
                      <div className="text-destructive text-xs italic">{t('admin_appointment.invalid_date')}</div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{appointment.clientName}</div>
                  <div className="text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center gap-x-3 gap-y-1 mt-1">
                      <a href={`tel:${appointment.clientPhone}`} className="hover:text-accent flex items-center transition-colors">
                          <Phone className="mr-1 h-3 w-3"/> {appointment.clientPhone}
                      </a>
                      <a href={`mailto:${appointment.clientEmail}`} className="hover:text-accent flex items-center transition-colors">
                          <Mail className="mr-1 h-3 w-3"/> {appointment.clientEmail}
                      </a>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{appointment.serviceName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`border text-xs font-normal ${statusColors[appointment.status]}`}>
                    {appointment.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                    {appointment.status === 'Confirmed' && <CheckCircle className="mr-1 h-3 w-3" />}
                    {appointment.status === 'Cancelled' && <XCircle className="mr-1 h-3 w-3" />}
                    {appointment.status === 'Completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                    {/* Translate status */}
                    {t(`admin_appointment.${appointment.status.toLowerCase()}` as any)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <Select
                      value={appointment.status}
                      onValueChange={(newStatus: Appointment['status']) => updateAppointmentStatus(appointment.id, newStatus)}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs bg-input/50 border-border/70 focus:ring-accent focus:border-accent">
                        <SelectValue placeholder={t('admin_appointment.change_status')} />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Translate status options */}
                        <SelectItem value="Pending">{t('admin_appointment.pending')}</SelectItem>
                        <SelectItem value="Confirmed">{t('admin_appointment.confirmed')}</SelectItem>
                        <SelectItem value="Completed">{t('admin_appointment.completed')}</SelectItem>
                        <SelectItem value="Cancelled">{t('admin_appointment.cancelled')}</SelectItem>
                      </SelectContent>
                    </Select>
                </TableCell>
              </MotionDiv>
            )})}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
