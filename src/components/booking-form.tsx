// src/components/booking-form.tsx
'use client';

import type { FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { enUS, es, pt } from 'date-fns/locale'; // Import locales for date-fns
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, Scissors, Loader2 } from 'lucide-react'; // Added Loader2
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useI18n, useCurrentLocale } from '@/locales/client'; // Import i18n hooks
import { MotionDiv, MotionButton } from '@/components/motion-provider'; // Import motion components

interface Service {
  id: string;
  name: string;
  // Add other necessary properties if needed, e.g., duration for time slot logic
}

interface BookingFormProps {
  services: Service[];
}

// Map locale strings to date-fns locale objects
const dateLocales: { [key: string]: Locale } = {
  en: enUS,
  es: es,
  pt: pt,
};

// Define Zod schema with translation keys for messages
const getBookingSchema = (t: ReturnType<typeof useI18n>) => z.object({
  name: z.string().min(2, { message: t('booking_form.name_error') }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: t('booking_form.phone_error') }),
  email: z.string().email({ message: t('booking_form.email_error') }),
  serviceId: z.string({ required_error: t('booking_form.service_error') }),
  date: z.date({ required_error: t('booking_form.date_error') }),
  time: z.string({ required_error: t('booking_form.time_error') }),
});


// Mock available times - replace with dynamic fetching based on date and service duration
const availableTimes = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00"
];

export const BookingForm: FC<BookingFormProps> = ({ services }) => {
  const { toast } = useToast();
  const t = useI18n(); // Get translation function
  const currentLocale = useCurrentLocale();
  const bookingSchema = getBookingSchema(t); // Get schema with translated messages

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
     defaultValues: {
      name: '',
      phone: '',
      email: '',
      serviceId: undefined,
      date: undefined,
      time: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Booking submitted:', data);
    // Here you would typically send the data to your backend API
    // e.g., await fetch('/api/bookings', { method: 'POST', body: JSON.stringify(data) });

    const selectedService = services.find(s => s.id === data.serviceId);
    const formattedDate = format(data.date, "PPP", { locale: dateLocales[currentLocale] || enUS });

    toast({
      title: t('booking_form.success_title'),
      description: t('booking_form.success_description', {
        name: data.name,
        serviceName: selectedService?.name || 'Selected Service',
        date: formattedDate,
        time: data.time
      }),
      variant: "default",
    });
     reset(); // Reset form fields after successful submission
  };

   // Animation variants
   const formItemVariants = {
       hidden: { opacity: 0, y: 15 },
       visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
   };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
       <MotionDiv variants={formItemVariants}>
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center text-sm font-medium text-muted-foreground">
              <User className="mr-2 h-4 w-4 text-accent" /> {t('booking_form.name')}
            </Label>
            <Input id="name" {...register('name')} placeholder={t('booking_form.name_placeholder')} aria-invalid={errors.name ? "true" : "false"} />
            {errors.name && <p className="text-sm text-destructive pt-1">{errors.name.message}</p>}
          </div>
        </MotionDiv>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <MotionDiv variants={formItemVariants}>
             <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center text-sm font-medium text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4 text-accent" /> {t('booking_form.phone')}
                </Label>
                <Input id="phone" type="tel" {...register('phone')} placeholder={t('booking_form.phone_placeholder')} aria-invalid={errors.phone ? "true" : "false"} />
                {errors.phone && <p className="text-sm text-destructive pt-1">{errors.phone.message}</p>}
              </div>
          </MotionDiv>
          <MotionDiv variants={formItemVariants}>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center text-sm font-medium text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4 text-accent" /> {t('booking_form.email')}
                </Label>
                <Input id="email" type="email" {...register('email')} placeholder={t('booking_form.email_placeholder')} aria-invalid={errors.email ? "true" : "false"} />
                {errors.email && <p className="text-sm text-destructive pt-1">{errors.email.message}</p>}
              </div>
           </MotionDiv>
      </div>

      <MotionDiv variants={formItemVariants}>
          <div className="space-y-2">
            <Label htmlFor="serviceId" className="flex items-center text-sm font-medium text-muted-foreground">
              <Scissors className="mr-2 h-4 w-4 text-accent" /> {t('booking_form.service')}
            </Label>
            <Controller
              name="serviceId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="serviceId" aria-invalid={errors.serviceId ? "true" : "false"}>
                    <SelectValue placeholder={t('booking_form.select_service')} />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.serviceId && <p className="text-sm text-destructive pt-1">{errors.serviceId.message}</p>}
          </div>
       </MotionDiv>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <MotionDiv variants={formItemVariants}>
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center text-sm font-medium text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4 text-accent" /> {t('booking_form.date')}
              </Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        aria-invalid={errors.date ? "true" : "false"}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP", { locale: dateLocales[currentLocale] || enUS }) : <span>{t('booking_form.pick_a_date')}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                        locale={dateLocales[currentLocale] || enUS} // Pass locale to Calendar
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && <p className="text-sm text-destructive pt-1">{errors.date.message}</p>}
            </div>
          </MotionDiv>

          <MotionDiv variants={formItemVariants}>
             <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center text-sm font-medium text-muted-foreground">
                <Clock className="mr-2 h-4 w-4 text-accent" /> {t('booking_form.time')}
              </Label>
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="time" aria-invalid={errors.time ? "true" : "false"}>
                      <SelectValue placeholder={t('booking_form.select_a_time')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.time && <p className="text-sm text-destructive pt-1">{errors.time.message}</p>}
            </div>
          </MotionDiv>
      </div>

        <MotionButton
           type="submit"
           className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
           disabled={isSubmitting}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.98 }}
         >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('booking_form.booking_button')}
            </>
          ) : (
            t('booking_form.book_button')
          )}
        </MotionButton>
    </form>
  );
};
