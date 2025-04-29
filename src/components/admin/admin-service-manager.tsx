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
import { PlusCircle, Edit, Power, PowerOff, DollarSign, Clock, Tag, Trash2 } from 'lucide-react'; // Added Trash2, Tag
import { useToast } from '@/hooks/use-toast';
import type { Service } from '@/lib/services';
import { useI18n } from '@/locales/client'; // Import i18n hook
import { MotionDiv, MotionButton } from '@/components/motion-provider'; // Import motion components
import { AnimatePresence } from 'framer-motion'; // For exit animations


interface AdminServiceManagerProps {
  initialServices: Service[];
}

// Define Zod schema using translation keys for messages
const getServiceSchema = (t: ReturnType<typeof useI18n>) => z.object({
  name: z.string().min(3, { message: t('admin_service.name_error') }),
  description: z.string().min(5, { message: t('admin_service.description_error') }),
  duration: z.coerce.number().int().positive({ message: t('admin_service.duration_error') }),
  price: z.coerce.number().positive({ message: t('admin_service.price_error') }),
  category: z.string().min(2, { message: t('admin_service.category_error') }),
  active: z.boolean().default(true),
});

// Infer the type from the Zod schema
type ServiceFormData = z.infer<ReturnType<typeof getServiceSchema>>;

export const AdminServiceManager: FC<AdminServiceManagerProps> = ({ initialServices }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();
  const t = useI18n(); // Get translation function
  const serviceSchema = getServiceSchema(t); // Get schema with translated messages

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { name: '', description: '', duration: 0, price: 0, category: '', active: true }
  });

  const openModalForEdit = (service: Service) => {
    setEditingService(service);
    reset(service); // Pre-fill form
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
    // Optionally reset form on close, or rely on openModalForNew/Edit to set defaults
    // reset({ name: '', description: '', duration: 0, price: 0, category: '', active: true });
  };

  const onSubmit = async (data: ServiceFormData) => {
     // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingService) {
      // Update existing service
      const updatedService = { ...editingService, ...data };
      setServices(services.map(s => s.id === editingService.id ? updatedService : s));
      toast({ title: t('admin_service.update_success_title'), description: t('admin_service.update_success_desc', { serviceName: data.name }) });
    } else {
      // Add new service (generate temporary ID)
      const newService: Service = { ...data, id: `service-${Date.now()}` };
      setServices(prev => [newService, ...prev]); // Add to the beginning for visibility
      toast({ title: t('admin_service.add_success_title'), description: t('admin_service.add_success_desc', { serviceName: data.name }) });
    }
    closeModal();
  };

  const toggleServiceStatus = async (service: Service) => {
     // Simulate API call
     await new Promise(resolve => setTimeout(resolve, 300));
     const updatedStatus = !service.active;
     const statusKey = updatedStatus ? 'status_active' : 'status_inactive';
     const titleKey = updatedStatus ? 'toggle_success_title_activated' : 'toggle_success_title_deactivated';

     setServices(services.map(s => s.id === service.id ? { ...s, active: updatedStatus } : s));
     toast({
       title: t(titleKey as any),
       description: t('admin_service.toggle_success_desc', { serviceName: service.name, status: t(statusKey).toLowerCase() }),
     });
   };

    // Animation variants for modal
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.2, ease: "easeIn" } }
    };

     // Animation variants for table rows
    const tableRowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" }
        }),
        exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
    };


  return (
    <div className="space-y-6">
      <div className="flex justify-end">
         <Dialog open={isModalOpen} onOpenChange={(isOpen) => { if (!isOpen) closeModal(); setIsModalOpen(isOpen); }}>
           <DialogTrigger asChild>
            <MotionButton
                onClick={openModalForNew}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
             >
                <PlusCircle className="mr-2 h-4 w-4" /> {t('admin_service.add_new')}
            </MotionButton>
           </DialogTrigger>
           <AnimatePresence>
            {isModalOpen && (
              <DialogContent
                className="sm:max-w-[525px] bg-card border-border/70"
                as={MotionDiv} // Use MotionDiv for DialogContent
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onEscapeKeyDown={closeModal} // Ensure ESC closes
                onPointerDownOutside={closeModal} // Ensure click outside closes
              >
                  <DialogHeader>
                    <DialogTitle className="text-primary">{editingService ? t('admin_service.edit_service') : t('admin_service.add_service')}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-3"> {/* Scrollable form */}
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-muted-foreground">{t('admin_service.service_name')}</Label>
                        <Input id="name" {...register('name')} aria-invalid={errors.name ? "true" : "false"} className="bg-input/50 border-border/70"/>
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="category" className="text-muted-foreground">{t('admin_service.category')}</Label>
                        <Input id="category" {...register('category')} aria-invalid={errors.category ? "true" : "false"} placeholder={t('admin_service.category_placeholder')} className="bg-input/50 border-border/70"/>
                        {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-muted-foreground">{t('admin_service.description')}</Label>
                        <Textarea id="description" {...register('description')} aria-invalid={errors.description ? "true" : "false"} className="bg-input/50 border-border/70"/>
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                          <Label htmlFor="duration" className="text-muted-foreground">{t('admin_service.duration')}</Label>
                          <Input id="duration" type="number" {...register('duration')} aria-invalid={errors.duration ? "true" : "false"} className="bg-input/50 border-border/70"/>
                          {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
                      </div>
                        <div className="space-y-1">
                          <Label htmlFor="price" className="text-muted-foreground">{t('admin_service.price')}</Label>
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
                                    aria-label={t('admin_service.active_status')}
                                    className="data-[state=checked]:bg-accent focus-visible:ring-accent"
                                />
                            )}
                        />
                        <Label htmlFor="active" className="text-muted-foreground">{t('admin_service.active_status')}</Label>
                    </div>
                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">{t('admin_service.cancel')}</Button>
                        </DialogClose>
                        <MotionButton
                           type="submit"
                           className="bg-accent hover:bg-accent/90 text-accent-foreground"
                           disabled={isSubmitting}
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                         >
                            {editingService ? t('admin_service.save_changes') : t('admin_service.add_service')}
                         </MotionButton>
                    </DialogFooter>
                  </form>
              </DialogContent>
             )}
            </AnimatePresence>
         </Dialog>
      </div>

      <div className="overflow-x-auto"> {/* Responsive table */}
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin_service.th_name')}</TableHead>
                <TableHead><Tag className="inline mr-1 h-4 w-4" />{t('admin_service.th_category')}</TableHead>
                <TableHead><Clock className="inline mr-1 h-4 w-4" />{t('admin_service.th_duration')}</TableHead>
                <TableHead><DollarSign className="inline mr-1 h-4 w-4" />{t('admin_service.th_price')}</TableHead>
                <TableHead>{t('admin_service.th_status')}</TableHead>
                <TableHead className="text-right">{t('admin_service.th_actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}> {/* Handle row add/remove animations */}
                  {services.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-10">{t('admin_service.no_services')}</TableCell>
                    </TableRow>
                  )}
                  {services.map((service, index) => (
                    <MotionDiv
                        key={service.id}
                        as={TableRow} // Render as TableRow
                        className="hover:bg-muted/30 transition-colors duration-150"
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        custom={index} // Pass index for stagger
                        layout
                     >
                      <TableCell className="font-medium text-foreground">{service.name}</TableCell>
                      <TableCell className="text-muted-foreground">{service.category}</TableCell>
                      <TableCell className="text-muted-foreground">{service.duration} min</TableCell>
                      <TableCell className="text-muted-foreground">${service.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-normal border ${service.active ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
                            {service.active ? t('admin_service.status_active') : t('admin_service.status_inactive')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-0.5"> {/* Reduced space */}
                        <MotionButton
                           variant="ghost"
                           size="icon"
                           onClick={() => toggleServiceStatus(service)}
                           title={service.active ? t('admin_service.deactivate_tooltip') : t('admin_service.activate_tooltip')}
                           className="hover:bg-muted/50"
                           whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                         >
                          {service.active ? <PowerOff className="h-4 w-4 text-red-500" /> : <Power className="h-4 w-4 text-green-500" />}
                        </MotionButton>
                        <MotionButton
                           variant="ghost"
                           size="icon"
                           onClick={() => openModalForEdit(service)}
                           title={t('admin_service.edit_tooltip')}
                           className="hover:bg-muted/50"
                           whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                         >
                          <Edit className="h-4 w-4 text-blue-400" />
                        </MotionButton>
                        {/* Add Delete button with confirmation later if needed */}
                         {/*
                         <MotionButton
                           variant="ghost"
                           size="icon"
                           // onClick={() => handleDeleteConfirmation(service.id)} // Needs confirmation dialog
                           title="Delete Service"
                           className="text-destructive hover:bg-destructive/10"
                           whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          >
                           <Trash2 className="h-4 w-4" />
                         </MotionButton>
                         */}
                      </TableCell>
                    </MotionDiv>
                  ))}
                </AnimatePresence>
            </TableBody>
          </Table>
        </div>
    </div>
  );
};
