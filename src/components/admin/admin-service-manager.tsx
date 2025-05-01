// src/components/admin/admin-service-manager.tsx
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription, // Import Description for delete confirmation
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { PlusCircle, Edit, Power, PowerOff, DollarSign, Clock, Tag, Trash2, Euro, PoundSterling, Loader2, AlertTriangle } from 'lucide-react'; // Added more icons
import { useToast } from '@/hooks/use-toast';
import type { Service } from '@/lib/services';
import { getServices as fetchServices, addService as apiAddService, updateService as apiUpdateService, deleteService as apiDeleteService } from '@/lib/services'; // Import API functions
import { useI18n, useCurrentLocale } from '@/locales/client';
import { MotionDiv, MotionButton } from '@/components/motion-provider';
import { AnimatePresence } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';


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

// Helper to format currency based on locale
const formatCurrency = (price: number, locale: string): string => {
    const options: Intl.NumberFormatOptions = { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2 };
    let currencyCode = 'BRL'; // Default to BRL for Portuguese
    if (locale === 'en') currencyCode = 'USD';
    else if (locale === 'es') currencyCode = 'EUR';

    options.currency = currencyCode;

    try {
        return new Intl.NumberFormat(locale, options).format(price);
    } catch (error) {
        console.error("Currency formatting error:", error);
        const symbol = locale === 'pt' ? 'R$' : locale === 'es' ? '€' : '$';
        return `${symbol}${price.toFixed(2)}`;
    }
};

export const AdminServiceManager: FC<AdminServiceManagerProps> = ({ initialServices }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null); // For delete confirmation
  const { toast } = useToast();
  const t = useI18n();
  const currentLocale = useCurrentLocale() as 'en' | 'es' | 'pt';
  const serviceSchema = getServiceSchema(t);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { name: '', description: '', duration: 0, price: 0, category: '', active: true }
  });

  // Fetch services on mount (optional, if initialServices might be stale)
  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      try {
        const freshServices = await fetchServices(); // Use your actual fetch function
        setServices(freshServices);
      } catch (error) {
        toast({ title: t('admin_service.fetch_error_title'), description: t('admin_service.fetch_error_desc'), variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    loadServices();
  }, [t, toast]); // Add dependencies for hooks used inside effect


  const openModalForEdit = (service: Service) => {
    setEditingService(service);
    reset(service);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingService(null);
    reset({ name: '', description: '', duration: 0, price: 0, category: '', active: true });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    reset({ name: '', description: '', duration: 0, price: 0, category: '', active: true }); // Reset form on close
  };

  const handleDeleteConfirmation = (service: Service) => {
      setServiceToDelete(service);
      // AlertDialog trigger will open the confirmation dialog
  };

  const handleDeleteService = async () => {
      if (!serviceToDelete) return;
      setIsLoading(true);
      try {
          await apiDeleteService(serviceToDelete.id); // Call the actual API delete function
          setServices(prev => prev.filter(s => s.id !== serviceToDelete!.id));
          toast({ title: t('admin_service.delete_success_title'), description: t('admin_service.delete_success_desc', { serviceName: serviceToDelete.name }) });
          setServiceToDelete(null); // Close confirmation dialog implicitly via state update
      } catch (error) {
          console.error("Failed to delete service:", error);
          toast({ title: t('admin_service.delete_error_title'), description: t('admin_service.error_generic_desc'), variant: 'destructive' });
      } finally {
          setIsLoading(false);
      }
  };

  const onSubmit = async (data: ServiceFormData) => {
    setIsLoading(true);
    try {
      if (editingService) {
        // Update existing service
        const updatedService = await apiUpdateService(editingService.id, data); // Use API update function
        setServices(services.map(s => s.id === editingService.id ? updatedService : s));
        toast({ title: t('admin_service.update_success_title'), description: t('admin_service.update_success_desc', { serviceName: data.name }) });
      } else {
        // Add new service
        const newService = await apiAddService(data); // Use API add function
        setServices(prev => [newService, ...prev]);
        toast({ title: t('admin_service.add_success_title'), description: t('admin_service.add_success_desc', { serviceName: data.name }) });
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save service:", error);
      toast({ title: editingService ? t('admin_service.update_error_title') : t('admin_service.add_error_title'), description: t('admin_service.error_generic_desc'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleServiceStatus = async (service: Service) => {
    const optimisticStatus = !service.active;
    const originalServices = [...services]; // Store original state for potential rollback

    // Optimistic update UI first
    setServices(services.map(s => s.id === service.id ? { ...s, active: optimisticStatus } : s));

    try {
      // Call API to update status
      await apiUpdateService(service.id, { active: optimisticStatus }); // Assuming updateService can handle partial updates

      // Toast on successful API call
      const statusKey = optimisticStatus ? 'status_active' : 'status_inactive';
      const titleKey = optimisticStatus ? 'toggle_success_title_activated' : 'toggle_success_title_deactivated';
      toast({
        title: t(titleKey as any),
        description: t('admin_service.toggle_success_desc', { serviceName: service.name, status: t(statusKey as any).toLowerCase() }),
      });
    } catch (error) {
      console.error("Failed to toggle service status:", error);
      // Rollback UI on error
      setServices(originalServices);
      toast({ title: t('admin_service.toggle_error_title'), description: t('admin_service.error_generic_desc'), variant: 'destructive' });
    }
  };

    // Animation variants for modal
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 10 }, // Smoother start
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.95, y: 5, transition: { duration: 0.2, ease: "easeIn" } } // Smoother exit
    };

     // Animation variants for table rows
    const tableRowVariants = {
        hidden: { opacity: 0, y: 5 }, // Reduced initial offset
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" } // Faster stagger
        }),
        exit: { opacity: 0, x: -10, transition: { duration: 0.2 } } // Slightly adjusted exit
    };


  return (
    <div className="space-y-6">
      <div className="flex justify-end">
         <Dialog open={isModalOpen} onOpenChange={(isOpen) => { if (!isOpen) closeModal(); setIsModalOpen(isOpen); }}>
           <DialogTrigger asChild>
            <MotionButton
                onClick={openModalForNew}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                whileHover={{ y: -2 }} // Subtle hover lift
                whileTap={{ scale: 0.97 }} // Subtle tap
             >
                <PlusCircle className="mr-2 h-4 w-4" /> {t('admin_service.add_new')}
            </MotionButton>
           </DialogTrigger>
           <AnimatePresence>
            {isModalOpen && (
              <DialogContent
                className="sm:max-w-[525px] bg-card border-border/70"
                onEscapeKeyDown={closeModal}
                onPointerDownOutside={closeModal}
              >
                 <MotionDiv
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col"
                 >
                      <DialogHeader>
                        <DialogTitle className="text-primary">{editingService ? t('admin_service.edit_service') : t('admin_service.add_service')}</DialogTitle>
                        <DialogDescription>
                          {editingService ? t('admin_service.edit_service_desc') : t('admin_service.add_service_desc')}
                        </DialogDescription>
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
                               <Label htmlFor="price" className="text-muted-foreground">{t('admin_service.price', { symbol: currentLocale === 'pt' ? 'R$' : currentLocale === 'es' ? '€' : '$' })}</Label>
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
                               className="bg-accent hover:bg-accent/90 text-accent-foreground min-w-[110px]" // Min width to prevent resizing
                               disabled={isSubmitting || isLoading} // Disable during form submit or API call
                                whileHover={{ y: -2 }} // Subtle hover lift
                                whileTap={{ scale: 0.97 }} // Subtle tap
                             >
                                {isSubmitting || isLoading ? (
                                   <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    editingService ? t('admin_service.save_changes') : t('admin_service.add_service')
                                )}
                             </MotionButton>
                        </DialogFooter>
                      </form>
                 </MotionDiv>
              </DialogContent>
             )}
            </AnimatePresence>
         </Dialog>
      </div>

       {/* Delete Confirmation Dialog */}
       <AlertDialog open={!!serviceToDelete} onOpenChange={(isOpen) => { if (!isOpen) setServiceToDelete(null); }}>
           <AlertDialogContent>
               <AlertDialogHeader>
                   <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="text-destructive h-5 w-5"/> {t('admin_service.delete_confirm_title')}
                   </AlertDialogTitle>
                   <AlertDialogDescription>
                       {t('admin_service.delete_confirm_desc', { serviceName: serviceToDelete?.name || '' })}
                   </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                   <AlertDialogCancel disabled={isLoading}>{t('admin_service.cancel')}</AlertDialogCancel>
                   <AlertDialogAction
                       onClick={handleDeleteService}
                       disabled={isLoading}
                       className="bg-destructive hover:bg-destructive/90 text-destructive-foreground min-w-[90px]"
                   >
                       {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('admin_service.delete_confirm_button')}
                   </AlertDialogAction>
               </AlertDialogFooter>
           </AlertDialogContent>
       </AlertDialog>


      <div className="overflow-x-auto"> {/* Responsive table */}
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin_service.th_name')}</TableHead>
                <TableHead><Tag className="inline mr-1 h-4 w-4" />{t('admin_service.th_category')}</TableHead>
                <TableHead><Clock className="inline mr-1 h-4 w-4" />{t('admin_service.th_duration')}</TableHead>
                <TableHead>
                  {currentLocale === 'pt' && <span className="inline mr-1">R$</span>}
                  {currentLocale === 'es' && <Euro className="inline mr-1 h-4 w-4" />}
                  {currentLocale === 'en' && <DollarSign className="inline mr-1 h-4 w-4" />}
                  {t('admin_service.th_price')}
                </TableHead>
                <TableHead>{t('admin_service.th_status')}</TableHead>
                <TableHead className="text-right">{t('admin_service.th_actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}> {/* Handle row add/remove animations */}
                  {isLoading && services.length === 0 && ( // Show skeleton loader only when loading initial data
                       [...Array(3)].map((_, i) => (
                           <TableRow key={`skel-${i}`}>
                               <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                               <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                               <TableCell><Skeleton className="h-5 w-1/4" /></TableCell>
                               <TableCell><Skeleton className="h-5 w-1/4" /></TableCell>
                               <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                               <TableCell className="text-right space-x-0.5">
                                   <Skeleton className="h-8 w-8 inline-block" />
                                   <Skeleton className="h-8 w-8 inline-block" />
                                   <Skeleton className="h-8 w-8 inline-block" />
                               </TableCell>
                           </TableRow>
                       ))
                   )}
                  {!isLoading && services.length === 0 && (
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
                       <TableCell className="text-muted-foreground">
                         {formatCurrency(service.price, currentLocale)}
                       </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-normal border ${service.active ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-gray-500/10 border-gray-500/50 text-gray-400'}`}> {/* Adjusted inactive color */}
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
                           whileHover={{ scale: 1.1, y: -1 }} whileTap={{ scale: 0.9 }}
                         >
                          {service.active ? <PowerOff className="h-4 w-4 text-red-500" /> : <Power className="h-4 w-4 text-green-500" />}
                        </MotionButton>
                        <MotionButton
                           variant="ghost"
                           size="icon"
                           onClick={() => openModalForEdit(service)}
                           title={t('admin_service.edit_tooltip')}
                           className="hover:bg-muted/50"
                           whileHover={{ scale: 1.1, y: -1 }} whileTap={{ scale: 0.9 }}
                         >
                          <Edit className="h-4 w-4 text-blue-400" />
                        </MotionButton>
                         {/* Use AlertDialogTrigger to open confirmation */}
                         <AlertDialogTrigger asChild>
                             <MotionButton
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteConfirmation(service)} // Set service to delete
                                title={t('admin_service.delete_tooltip')}
                                className="text-destructive hover:bg-destructive/10"
                                whileHover={{ scale: 1.1, y: -1 }} whileTap={{ scale: 0.9 }}
                              >
                               <Trash2 className="h-4 w-4" />
                             </MotionButton>
                         </AlertDialogTrigger>
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
