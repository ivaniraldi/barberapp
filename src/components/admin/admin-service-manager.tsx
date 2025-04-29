// src/components/admin/admin-service-manager.tsx
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
import { PlusCircle, Edit, Power, PowerOff, DollarSign, Clock, Tag } from 'lucide-react'; // Added Tag icon
import { useToast } from '@/hooks/use-toast';
import type { Service } from '@/lib/services'; // Import the actual Service type

interface AdminServiceManagerProps {
  initialServices: Service[];
}

// Define Zod schema matching the Service type, including category
const serviceSchema = z.object({
  name: z.string().min(3, { message: "Service name must be at least 3 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  duration: z.coerce.number().int().positive({ message: "Duration must be a positive number (minutes)." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(2, { message: "Category name must be at least 2 characters." }),
  active: z.boolean().default(true),
});

// Infer the type from the Zod schema
type ServiceFormData = z.infer<typeof serviceSchema>;

export const AdminServiceManager: FC<AdminServiceManagerProps> = ({ initialServices }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { name: '', description: '', duration: 0, price: 0, category: '', active: true } // Add category default
  });

  const openModalForEdit = (service: Service) => {
    setEditingService(service);
    reset(service); // Pre-fill form with service data, including category
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingService(null);
    reset({ name: '', description: '', duration: 0, price: 0, category: '', active: true }); // Reset form
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    reset({ name: '', description: '', duration: 0, price: 0, category: '', active: true }); // Ensure reset on close
  };

  const onSubmit = async (data: ServiceFormData) => {
     // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingService) {
      // Update existing service
      const updatedService = { ...editingService, ...data };
      setServices(services.map(s => s.id === editingService.id ? updatedService : s));
      toast({ title: "Service Updated", description: `"${data.name}" has been updated.` });
    } else {
      // Add new service
      // In a real app, the ID would come from the backend after saving
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
         <Dialog open={isModalOpen} onOpenChange={(isOpen) => { if (!isOpen) closeModal(); setIsModalOpen(isOpen); }}>
           <DialogTrigger asChild>
            <Button onClick={openModalForNew} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
            </Button>
           </DialogTrigger>
           <DialogContent className="sm:max-w-[525px] bg-card border-border/70">
              <DialogHeader>
                <DialogTitle className="text-primary">{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                 <div className="space-y-1">
                    <Label htmlFor="name" className="text-muted-foreground">Service Name</Label>
                    <Input id="name" {...register('name')} aria-invalid={errors.name ? "true" : "false"} className="bg-input/50 border-border/70"/>
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                 </div>
                  <div className="space-y-1">
                    <Label htmlFor="category" className="text-muted-foreground">Category</Label>
                    <Input id="category" {...register('category')} aria-invalid={errors.category ? "true" : "false"} placeholder="e.g., Haircuts, Beard Care" className="bg-input/50 border-border/70"/>
                    {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="description" className="text-muted-foreground">Description</Label>
                    <Textarea id="description" {...register('description')} aria-invalid={errors.description ? "true" : "false"} className="bg-input/50 border-border/70"/>
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <Label htmlFor="duration" className="text-muted-foreground">Duration (min)</Label>
                      <Input id="duration" type="number" {...register('duration')} aria-invalid={errors.duration ? "true" : "false"} className="bg-input/50 border-border/70"/>
                      {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
                   </div>
                    <div className="space-y-1">
                      <Label htmlFor="price" className="text-muted-foreground">Price ($)</Label>
                      <Input id="price" type="number" step="0.01" {...register('price')} aria-invalid={errors.price ? "true" : "false"} className="bg-input/50 border-border/70"/>
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
                                className="data-[state=checked]:bg-accent"
                            />
                        )}
                    />
                    <Label htmlFor="active" className="text-muted-foreground">Active Status</Label>
                 </div>
                 <DialogFooter>
                     <DialogClose asChild>
                         <Button type="button" variant="outline">Cancel</Button>
                     </DialogClose>
                     <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">{editingService ? 'Save Changes' : 'Add Service'}</Button>
                 </DialogFooter>
              </form>
           </DialogContent>
         </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead><Tag className="inline mr-1 h-4 w-4" />Category</TableHead> {/* Add Category column */}
            <TableHead><Clock className="inline mr-1 h-4 w-4" />Duration</TableHead>
            <TableHead><DollarSign className="inline mr-1 h-4 w-4" />Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 && (
             <TableRow>
               <TableCell colSpan={6} className="text-center text-muted-foreground">No services found.</TableCell>
             </TableRow>
           )}
          {services.map((service) => (
            <TableRow key={service.id} className="hover:bg-muted/50">
              <TableCell className="font-medium text-primary">{service.name}</TableCell>
              <TableCell className="text-muted-foreground">{service.category}</TableCell> {/* Display category */}
              <TableCell className="text-muted-foreground">{service.duration} min</TableCell>
              <TableCell className="text-muted-foreground">${service.price.toFixed(2)}</TableCell>
              <TableCell>
                 <span className={`px-2 py-1 rounded-full text-xs font-medium border ${service.active ? 'bg-green-900/50 border-green-700 text-green-300' : 'bg-red-900/50 border-red-700 text-red-300'}`}>
                    {service.active ? 'Active' : 'Inactive'}
                 </span>
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="icon" onClick={() => toggleServiceStatus(service)} title={service.active ? "Deactivate Service" : "Activate Service"}>
                   {service.active ? <PowerOff className="h-4 w-4 text-red-500" /> : <Power className="h-4 w-4 text-green-500" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openModalForEdit(service)} title="Edit Service">
                  <Edit className="h-4 w-4 text-blue-400" />
                </Button>
                {/* Delete button remains commented out for safety
                 <Button variant="ghost" size="icon" onClick={() => deleteService(service.id)} title="Delete Service" className="text-destructive hover:text-destructive/80">
                   <Trash2 className="h-4 w-4" />
                 </Button>
                */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
