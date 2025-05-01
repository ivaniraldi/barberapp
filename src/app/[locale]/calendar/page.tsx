// src/app/[locale]/calendar/page.tsx
'use client';

import * as React from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { enUS, es, pt } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIconLucide } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n, useCurrentLocale } from '@/locales/client';
import { MotionDiv } from '@/components/motion-provider';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea

// Map locale strings to date-fns locale objects
const dateLocales: { [key: string]: Locale } = {
  en: enUS,
  es: es,
  pt: pt,
};

// Mock appointments for demonstration (replace with real data fetching)
const mockAppointmentsData = [
    { id: 'a1', clientName: 'John Doe', serviceName: 'Classic Haircut', date: '2024-09-15T10:00:00Z', status: 'Confirmed' },
    { id: 'a2', clientName: 'Jane Smith', serviceName: 'Beard Trim & Shape', date: '2024-09-15T11:30:00Z', status: 'Pending' },
    { id: 'a3', clientName: 'Bob Johnson', serviceName: 'Hot Towel Shave', date: '2024-09-16T14:00:00Z', status: 'Completed' },
    { id: 'a4', clientName: 'Carlos Rey', serviceName: 'Skin Fade Haircut', date: '2024-09-20T09:00:00Z', status: 'Confirmed' },
    { id: 'a5', clientName: 'Maria Garcia', serviceName: 'Classic Haircut', date: '2024-09-20T15:00:00Z', status: 'Confirmed' },
    { id: 'a6', clientName: 'Peter Jones', serviceName: 'Beard Trim & Shape', date: '2024-10-05T10:30:00Z', status: 'Pending' },
];

interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  date: Date; // Store dates as Date objects internally
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

const statusColors: Record<Appointment['status'], string> = {
    Pending: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400',
    Confirmed: 'bg-green-500/10 border-green-500/50 text-green-400',
    Cancelled: 'bg-red-500/10 border-red-500/50 text-red-400',
    Completed: 'bg-blue-500/10 border-blue-500/50 text-blue-400',
};


// Parse mock data dates
const parseAppointments = (data: typeof mockAppointmentsData): Appointment[] => {
    return data.map(app => ({
        ...app,
        date: new Date(app.date),
    })).filter(app => !isNaN(app.date.getTime())); // Filter out invalid dates
};


export default function CalendarPage() {
  const t = useI18n();
  const currentLocale = useCurrentLocale() as keyof typeof dateLocales; // Ensure type safety
  const locale = dateLocales[currentLocale] || pt; // Default to Portuguese locale
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [isClient, setIsClient] = React.useState(false); // State to track client-side mount

  React.useEffect(() => {
      setIsClient(true); // Set to true when component mounts on the client
      // Fetch and parse appointments on mount (simulate API call)
      const parsedApps = parseAppointments(mockAppointmentsData);
      setAppointments(parsedApps);
  }, []);


  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const firstDayOfGrid = startOfWeek(firstDayOfMonth, { locale });
  const lastDayOfGrid = endOfWeek(lastDayOfMonth, { locale });
  const daysInMonth = eachDayOfInterval({ start: firstDayOfGrid, end: lastDayOfGrid });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const getAppointmentsForDay = (day: Date): Appointment[] => {
      return appointments
          .filter(app => isSameDay(app.date, day))
          .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by time
  };

  const selectedDayAppointments = selectedDate ? getAppointmentsForDay(selectedDate) : [];

  // Animation variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
  const calendarDayVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
      hover: { scale: 1.08, zIndex: 1, backgroundColor: "hsla(var(--accent)/0.15)"}, // Slightly more scale, accent bg
      tap: { scale: 0.95 }
  };

  if (!isClient) {
       return ( // Basic loading state
         <div className="container mx-auto px-4 py-16 sm:py-24 text-center"> {/* Consistent padding */}
           <p className="text-muted-foreground">{t('calendar_page.loading')}</p> {/* Added loading translation */}
         </div>
       );
  }

  return (
    <MotionDiv
      className="container mx-auto px-4 py-16 sm:py-24" // Consistent padding
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <MotionDiv variants={itemVariants} className="mb-16 text-center"> {/* Increased margin */}
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 flex items-center justify-center gap-3"> {/* Increased margin */}
           <CalendarIconLucide className="h-8 w-8 text-accent" /> {t('calendar_page.title')}
        </h1>
        <p className="text-lg text-muted-foreground">{t('calendar_page.subtitle')}</p>
      </MotionDiv>

      <MotionDiv variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16"> {/* Increased gap */}
        {/* Calendar View */}
        <MotionDiv variants={itemVariants} className="lg:col-span-2">
            <Card className="shadow-xl bg-card/90 backdrop-blur-sm border-border/50 overflow-hidden rounded-xl"> {/* Enhanced shadow, rounded */}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-4 px-6 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/40"> {/* Adjusted border */}
                    <Button variant="outline" size="icon" onClick={handlePrevMonth} className="h-9 w-9"> {/* Slightly larger button */}
                        <ChevronLeft className="h-5 w-5" />
                        <span className="sr-only">{t('calendar_page.previous_month')}</span>
                    </Button>
                    <h3 className="text-xl font-semibold text-primary capitalize">{format(currentMonth, 'MMMM yyyy', { locale })}</h3> {/* Larger font */}
                    <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-9 w-9"> {/* Slightly larger button */}
                        <ChevronRight className="h-5 w-5" />
                        <span className="sr-only">{t('calendar_page.next_month')}</span>
                    </Button>
                </CardHeader>
                <CardContent className="p-4 sm:p-6"> {/* Consistent padding */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-3"> {/* Increased margin bottom */}
                        {/* Render weekday headers based on locale */}
                        {eachDayOfInterval({ start: startOfWeek(new Date(), { locale }), end: endOfWeek(new Date(), { locale }) }).map((day, i) => (
                            <div key={i} className="capitalize py-1.5">{format(day, 'eee', { locale })}</div> // Increased padding
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1.5"> {/* Slightly increased gap */}
                        {daysInMonth.map((day, index) => {
                            const dayAppointments = getAppointmentsForDay(day);
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isSel = selectedDate ? isSameDay(day, selectedDate) : false;
                            const isTod = isToday(day);

                            return (
                                <MotionDiv
                                    key={day.toString()}
                                    variants={calendarDayVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                    transition={{ delay: index * 0.01 }} // Subtle stagger
                                    onClick={() => handleDateClick(day)}
                                    className={cn(
                                        "relative flex items-center justify-center h-12 sm:h-16 rounded-lg cursor-pointer border border-transparent transition-all duration-150 ease-out aspect-square", // Aspect square, rounded-lg
                                        !isCurrentMonth && "text-muted-foreground/30 hover:bg-muted/30", // Dimmed and subtle hover for outside days
                                        isCurrentMonth && "hover:bg-muted/50",
                                        isTod && !isSel && "bg-secondary text-secondary-foreground font-semibold ring-1 ring-secondary", // Today styling (if not selected)
                                        isSel && "bg-accent text-accent-foreground border-accent ring-2 ring-accent ring-offset-2 ring-offset-background shadow-md", // Selected styling
                                        dayAppointments.length > 0 && "after:content-[''] after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:h-1.5 after:w-1.5 after:rounded-full after:bg-primary" // Indicator dot slightly higher
                                    )}
                                >
                                    <span className="text-sm">{format(day, 'd')}</span>
                                </MotionDiv>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </MotionDiv>

        {/* Selected Day's Appointments */}
        <MotionDiv variants={itemVariants}>
            <Card className="shadow-lg bg-card/90 backdrop-blur-sm border-border/50 overflow-hidden rounded-xl sticky top-24"> {/* Sticky sidebar, adjusted top */}
                <CardHeader className="pb-4 bg-gradient-to-l from-primary/5 to-accent/5 border-b border-border/40"> {/* Adjusted border */}
                    <CardTitle className="text-xl font-semibold"> {/* Adjusted size */}
                        {selectedDate ? format(selectedDate, 'PPP', { locale }) : t('calendar_page.select_date')}
                    </CardTitle>
                     <CardDescription>{t('calendar_page.appointments_for_day')}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4"> {/* Use default CardContent padding */}
                    <ScrollArea className="h-[55vh] pr-3"> {/* Wrap content in ScrollArea, adjust height */}
                        <div className="space-y-4"> {/* Add space between appointments */}
                            {selectedDate && selectedDayAppointments.length === 0 && (
                                <p className="text-muted-foreground text-sm py-6 text-center">{t('calendar_page.no_appointments_today')}</p>
                            )}
                            {selectedDate && selectedDayAppointments.map((app, index) => (
                                <MotionDiv
                                    key={app.id}
                                    variants={itemVariants} // Reuse item variant for list items
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 rounded-lg bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors" // Enhanced item styling
                                >
                                    <div className="flex justify-between items-start mb-1.5">
                                        <span className="text-sm font-medium text-primary">{format(app.date, 'p', { locale })} - {app.serviceName}</span>
                                        <Badge variant="outline" className={`text-xs font-normal ml-2 ${statusColors[app.status]}`}>
                                            {t(`admin_appointment.${app.status.toLowerCase()}` as any)}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{app.clientName}</p>
                                </MotionDiv>
                            ))}
                            {!selectedDate && (
                                <p className="text-muted-foreground text-sm py-6 text-center">{t('calendar_page.click_date_prompt')}</p>
                            )}
                        </div>
                     </ScrollArea>
                </CardContent>
            </Card>
        </MotionDiv>
      </MotionDiv>
    </MotionDiv>
  );
}

// Add translations for the calendar page
/*
// en.ts
calendar_page: {
    loading: 'Loading Calendar...', // Added loading text
    title: 'Appointment Calendar',
    subtitle: 'View scheduled appointments by date.',
    previous_month: 'Previous Month',
    next_month: 'Next Month',
    select_date: 'Select a Date',
    appointments_for_day: 'Appointments for this day',
    no_appointments_today: 'No appointments scheduled for this day.',
    click_date_prompt: 'Click on a date in the calendar to see appointments.',
},

// es.ts
calendar_page: {
    loading: 'Cargando Calendario...', // Added loading text
    title: 'Calendario de Citas',
    subtitle: 'Ver citas programadas por fecha.',
    previous_month: 'Mes Anterior',
    next_month: 'Mes Siguiente',
    select_date: 'Selecciona una Fecha',
    appointments_for_day: 'Citas para este día',
    no_appointments_today: 'No hay citas programadas para este día.',
    click_date_prompt: 'Haz clic en una fecha del calendario para ver las citas.',
},

// pt.ts
calendar_page: {
    loading: 'Carregando Calendário...', // Added loading text
    title: 'Calendário de Agendamentos',
    subtitle: 'Veja os agendamentos programados por data.',
    previous_month: 'Mês Anterior',
    next_month: 'Próximo Mês',
    select_date: 'Selecione uma Data',
    appointments_for_day: 'Agendamentos para este dia',
    no_appointments_today: 'Nenhum agendamento programado para este dia.',
    click_date_prompt: 'Clique em uma data no calendário para ver os agendamentos.',
},
*/
