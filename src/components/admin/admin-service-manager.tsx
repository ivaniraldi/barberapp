'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, Power, PowerOff, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
}

interface AdminServiceManagerProps {
  initialServices: Service[];
}

const serviceSchema = z.object({
  name: z.string().min(3, { message: "Service name must be at least 3 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  duration: z.coerce.number().int().positive({ message: "Duration must be a positive number." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  active: z.boolean().default(true),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export const AdminServiceManager: FC<AdminServiceManagerProps> = ({ initialServices }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { active: true }
  });

  const openModalForEdit = (service: Service) => {
    setEditingService(service);
    reset(service); // Pre-fill form with service data
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingService(null);
    reset({ name: '', description: '', duration: 0, price: 0, active: true }); // Reset form for new entry
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    reset({ name: '', description: '', duration: 0, price: 0, active: true }); // Ensure reset on close
  };

  const onSubmit = async (data: ServiceFormData) => {
     // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingService) {
      // Update existing service
      setServices(services.map(s => s.id === editingService.id ? { ...editingService, ...data } : s));
      toast({ title: "Service Updated", description: `"${data.name}" has been updated.` });
    } else {
      // Add new service
      const newService: Service = { ...data, id: `service-${Date.now()}` }; // Generate temporary ID
      setServices([...services, newService]);
      toast({ title: "Service Added", description: `"${data.name}" has been added.` });
    }
    closeModal();
  };

    const toggleServiceStatus = async (service: Service) => {
     // Simulate API call
     await new Promise(resolve => setTimeout(resolve, 300));
     const updatedStatus = !service.active;
     setServices(services.map(s => s.id === service.id ? { ...s, active: updatedStatus } : s));
     toast({
       title: `Service ${updatedStatus ? 'Activated' : 'Deactivated'}`,
       description: `"${service.name}" is now ${updatedStatus ? 'active' : 'inactive'}.`,
     });
    };

    // Deletion is commented out as it might be destructive. Implement with caution.
    /*
    const deleteService = async (serviceId: string) => {
        // Add confirmation dialog here
        if (!confirm("Are you sure you want to delete this service? This cannot be undone.")) {
            return;
        }
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setServices(services.filter(s => s.id !== serviceId));
        toast({ title: "Service Deleted", variant: 'destructive' });
    };
    */

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
           <DialogTrigger asChild>
            <Button onClick={openModalForNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
            </Button>
           </DialogTrigger>
           <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                 <div className="space-y-1">
                    <Label htmlFor="name">Service Name</Label>
                    <Input id="name" {...register('name')} aria-invalid={errors.name ? "true" : "false"} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register('description')} aria-invalid={errors.description ? "true" : "false"} />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input id="duration" type="number" {...register('duration')} aria-invalid={errors.duration ? "true" : "false"} />
                      {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
                   </div>
                    <div className="space-y-1">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input id="price" type="number" step="0.01" {...register('price')} aria-invalid={errors.price ? "true" : "false"} />
                      {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                   </div>
                 </div>
                 <div className="flex items-center space-x-2 pt-2">
                    <Controller
                        name="active"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                id="active"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label="Service Status"
                            />
                        )}
                    />
                    <Label htmlFor="active">Active Status</Label>
                 </div>
                 <DialogFooter>
                     <DialogClose asChild>
                         <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                     </DialogClose>
                     <Button type="submit">{editingService ? 'Save Changes' : 'Add Service'}</Button>
                 </DialogFooter>
              </form>
           </DialogContent>
         </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 && (
             <TableRow>
               <TableCell colSpan={5} className="text-center text-muted-foreground">No services found.</TableCell>
             </TableRow>
           )}
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell className="flex items-center"><Clock className="mr-1 h-4 w-4 text-muted-foreground" /> {service.duration} min</TableCell>
              <TableCell className="flex items-center"><DollarSign className="mr-1 h-4 w-4 text-muted-foreground" /> {service.price.toFixed(2)}</TableCell>
              <TableCell>
                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                    {service.active ? 'Active' : 'Inactive'}
                 </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => toggleServiceStatus(service)} title={service.active ? "Deactivate Service" : "Activate Service"}>
                   {service.active ? <PowerOff className="h-4 w-4 text-red-500" /> : <Power className="h-4 w-4 text-green-500" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openModalForEdit(service)} title="Edit Service">
                  <Edit className="h-4 w-4" />
                </Button>
                {/* <Button variant="ghost" size="icon" onClick={() => deleteService(service.id)} title="Delete Service" className="text-destructive hover:text-destructive/80">
                  <Trash2 className="h-4 w-4" />
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};