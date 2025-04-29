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
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
}

interface BookingFormProps {
  services: Service[];
}

const bookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." }), // E.164 format-ish
  email: z.string().email({ message: "Invalid email address." }),
  serviceId: z.string({ required_error: "Please select a service." }),
  date: z.date({ required_error: "Please select a date." }),
  time: z.string({ required_error: "Please select a time." }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// Mock available times - replace with dynamic fetching based on date and service duration
const availableTimes = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00"
];

export const BookingForm: FC<BookingFormProps> = ({ services }) => {
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Booking submitted:', data);
    // Here you would typically send the data to your backend API
    // e.g., await fetch('/api/bookings', { method: 'POST', body: JSON.stringify(data) });

    toast({
      title: "Appointment Booked!",
      description: `Thanks, ${data.name}! Your appointment for ${services.find(s => s.id === data.serviceId)?.name} on ${format(data.date, 'PPP')} at ${data.time} is confirmed.`,
      variant: "default", // Use 'default' or 'destructive'
    });
    // Optionally reset the form: reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
       <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center"><User className="mr-2 h-4 w-4" /> Name</Label>
        <Input id="name" {...register('name')} placeholder="Your Full Name" aria-invalid={errors.name ? "true" : "false"} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center"><Phone className="mr-2 h-4 w-4" /> Phone</Label>
            <Input id="phone" type="tel" {...register('phone')} placeholder="+1234567890" aria-invalid={errors.phone ? "true" : "false"} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4" /> Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="your.email@example.com" aria-invalid={errors.email ? "true" : "false"} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
      </div>


      <div className="space-y-2">
        <Label htmlFor="serviceId" className="flex items-center"><Scissors className="mr-2 h-4 w-4" /> Service</Label>
        <Controller
          name="serviceId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="serviceId" aria-invalid={errors.serviceId ? "true" : "false"}>
                <SelectValue placeholder="Select a service" />
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
        {errors.serviceId && <p className="text-sm text-destructive">{errors.serviceId.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center"><CalendarIcon className="mr-2 h-4 w-4" /> Date</Label>
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
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="flex items-center"><Clock className="mr-2 h-4 w-4" /> Time</Label>
           <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="time" aria-invalid={errors.time ? "true" : "false"}>
                  <SelectValue placeholder="Select a time" />
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
          {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
        </div>
      </div>


      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Clock className="mr-2 h-4 w-4 animate-spin" /> Booking...
          </>
        ) : (
          'Book Appointment'
        )}
      </Button>
    </form>
  );
};