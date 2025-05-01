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
  AlertDialogTrigger, // Import trigger for AlertDialog
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { PlusCircle, Edit, Power, PowerOff, DollarSign, Clock, Tag, Trash2, AlertTriangle, Loader2 } from 'lucide-react'; // Removed currency icons, added Loader2
import { useToast } from '@/hooks/use-toast';
import type { Service } from '@/lib/services';
import { getServices as fetchServices, addService as apiAddService, updateService as apiUpdateService, deleteService as apiDeleteService } from '@/lib/services'; // Import API functions
import { useI18n } from '@/locales/client'; // Removed useCurrentLocale as it's not needed here anymore
import { MotionDiv, MotionButton } from '@/components/motion-provider';
import { AnimatePresence } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';
import { formatCurrency } from '@/lib/utils'; // Import centralized currency formatter


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
  const [isLoading, setIsLoading] = useState(false); // Start as false if initialServices are provided
  const [isSubmittingForm, setIsSubmittingForm] = useState(false); // Separate state for form submission
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null); // For delete confirmation
  const { toast } = useToast();
  const t = useI18n();
  const serviceSchema = getServiceSchema(t);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { name: '', description: '', duration: 0, price: 0, category: '', active: true }
  });

  // Sync state with potentially updated initialServices prop (e.g., after parent re-fetches)
  useEffect(() => {
    setServices(initialServices);
    setIsLoading(false); // Assume loading is finished when initialServices are available
  }, [initialServices]);


  const openModalForEdit = (service: Service) => {
    setEditingService(service);
    reset(service); // Populate form with existing service data
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingService(null);
    reset({ name: '', description: '', duration: 0, price: 0, category: '', active: true }); // Reset to default empty values
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    reset({ name: '', description: '', duration: 0, price: 0, category: '', active: true }); // Reset form on close
  };

  const handleDeleteConfirmation = (service: Service) => {
      setServiceToDelete(service);
  };

  const handleDeleteService = async () => {
      if (!serviceToDelete) return;
      setIsLoading(true); // Use general loading state for delete action
      try {
          await apiDeleteService(serviceToDelete.id); // Call the actual API delete function
          setServices(prev => prev.filter(s => s.id !== serviceToDelete!.id));
          toast({ title: t('admin_service.delete_success_title'), description: t('admin_service.delete_success_desc', { serviceName: serviceToDelete.name }) });
          setServiceToDelete(null); // Close confirmation dialog
      } catch (error) {
          console.error("Failed to delete service:", error);
          toast({ title: t('admin_service.delete_error_title'), description: t('admin_service.error_generic_desc'), variant: 'destructive' });
      } finally {
          setIsLoading(false); // Reset loading state
          setServiceToDelete(null); // Ensure dialog is closed even on error
      }
  };

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmittingForm(true); // Use form submission state
    try {
      if (editingService) {
        const updatedService = await apiUpdateService(editingService.id, data);
        setServices(services.map(s => s.id === editingService.id ? updatedService : s));
        toast({ title: t('admin_service.update_success_title'), description: t('admin_service.update_success_desc', { serviceName: data.name }) });
      } else {
        const newService = await apiAddService(data);
        setServices(prev => [newService, ...prev]);
        toast({ title: t('admin_service.add_success_title'), description: t('admin_service.add_success_desc', { serviceName: data.name }) });
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save service:", error);
      toast({ title: editingService ? t('admin_service.update_error_title') : t('admin_service.add_error_title'), description: t('admin_service.error_generic_desc'), variant: 'destructive' });
    } finally {
      setIsSubmittingForm(false); // Reset form submission state
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
    <div className="space-y-8"> {/* Increased spacing */}
      <div className="flex justify-end">
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
           <DialogTrigger asChild>
            <MotionButton
                onClick={openModalForNew}
                variant="accent" // Use accent variant
                whileHover={{ y: -2 }} // Subtle hover lift
                whileTap={{ scale: 0.97 }} // Subtle tap
             >
                <PlusCircle className="mr-2 h-4 w-4" /> {t('admin_service.add_new')}
            </MotionButton>
           </DialogTrigger>
           <AnimatePresence>
            {isModalOpen && (
              <DialogContent
                className="sm:max-w-[550px] bg-card border-border/70" // Slightly wider modal
                onEscapeKeyDown={closeModal}
                // onPointerDownOutside={closeModal} // Allow interaction outside while modal is open if needed, otherwise keep this
              >
                 <MotionDiv
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col" // Ensure flex direction
                 >
                      <DialogHeader className="mb-4"> {/* Added margin bottom */}
                        <DialogTitle className="text-primary text-xl">{editingService ? t('admin_service.edit_service') : t('admin_service.add_service')}</DialogTitle>
                        <DialogDescription>
                          {editingService ? t('admin_service.edit_service_desc') : t('admin_service.add_service_desc')}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2 max-h-[70vh] overflow-y-auto pr-3"> {/* Increased space-y, reduced py */}
                        <div className="space-y-1.5"> {/* Consistent spacing */}
                            <Label htmlFor="name" className="text-muted-foreground">{t('admin_service.service_name')}</Label>
                            <Input id="name" {...register('name')} aria-invalid={errors.name ? "true" : "false"} className="bg-input/50 border-border/70"/>
                            {errors.name && <p className="text-sm text-destructive pt-1">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="category" className="text-muted-foreground">{t('admin_service.category')}</Label>
                            <Input id="category" {...register('category')} aria-invalid={errors.category ? "true" : "false"} placeholder={t('admin_service.category_placeholder')} className="bg-input/50 border-border/70"/>
                            {errors.category && <p className="text-sm text-destructive pt-1">{errors.category.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-muted-foreground">{t('admin_service.description')}</Label>
                            <Textarea id="description" {...register('description')} aria-invalid={errors.description ? "true" : "false"} className="bg-input/50 border-border/70 min-h-[100px]"/> {/* Increased min height */}
                            {errors.description && <p className="text-sm text-destructive pt-1">{errors.description.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-5"> {/* Increased gap */}
                          <div className="space-y-1.5">
                              <Label htmlFor="duration" className="text-muted-foreground">{t('admin_service.duration')}</Label>
                              <Input id="duration" type="number" {...register('duration')} aria-invalid={errors.duration ? "true" : "false"} className="bg-input/50 border-border/70"/>
                              {errors.duration && <p className="text-sm text-destructive pt-1">{errors.duration.message}</p>}
                          </div>
                            <div className="space-y-1.5">
                               <Label htmlFor="price" className="text-muted-foreground">{t('admin_service.price', { symbol: 'R$' })}</Label> {/* Pass R$ directly */}
                              <Input id="price" type="number" step="0.01" {...register('price')} aria-invalid={errors.price ? "true" : "false"} className="bg-input/50 border-border/70"/>
                              {errors.price && <p className="text-sm text-destructive pt-1">{errors.price.message}</p>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 pt-3"> {/* Increased spacing and padding top */}
                            <Controller
                                name="active"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="active"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label={t('admin_service.active_status')}
                                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-muted focus-visible:ring-ring" // Use green for active
                                    />
                                )}
                            />
                            <Label htmlFor="active" className="text-muted-foreground font-normal cursor-pointer">{t('admin_service.active_status')}</Label> {/* Lighter font, cursor pointer */}
                        </div>
                        <DialogFooter className="pt-6"> {/* Increased padding top */}
                            <DialogClose asChild>
                                <Button type="button" variant="outline">{t('admin_service.cancel')}</Button>
                            </DialogClose>
                            <MotionButton
                               type="submit"
                               variant="accent" // Use accent variant
                               className="min-w-[120px]" // Min width to prevent resizing
                               disabled={isSubmittingForm || isLoading} // Disable during form submit or API call
                                whileHover={{ y: -2 }} // Subtle hover lift
                                whileTap={{ scale: 0.97 }} // Subtle tap
                             >
                                {isSubmittingForm ? (
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

       {/* Delete Confirmation Dialog - Single instance controlled by state */}
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


      <div className="overflow-x-auto rounded-lg border border-border/50 shadow-sm"> {/* Add border and shadow */}
          <Table className="min-w-full">
            <TableHeader className="bg-muted/30"> {/* Subtle header background */}
              <TableRow>
                <TableHead className="w-[30%]">{t('admin_service.th_name')}</TableHead> {/* Adjusted width */}
                <TableHead className="w-[15%]"><Tag className="inline mr-1 h-4 w-4" />{t('admin_service.th_category')}</TableHead> {/* Adjusted width */}
                <TableHead className="w-[10%]"><Clock className="inline mr-1 h-4 w-4" />{t('admin_service.th_duration')}</TableHead> {/* Adjusted width */}
                <TableHead className="w-[10%]"> {/* Adjusted width */}
                   <span className="inline mr-1">R$</span> {/* Display R$ directly */}
                   {t('admin_service.th_price')}
                </TableHead>
                <TableHead className="w-[10%]">{t('admin_service.th_status')}</TableHead> {/* Adjusted width */}
                <TableHead className="text-right w-[15%]">{t('admin_service.th_actions')}</TableHead> {/* Adjusted width */}
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
                               <TableCell className="text-right space-x-1"> {/* Adjusted space */}
                                   <Skeleton className="h-8 w-8 inline-block" />
                                   <Skeleton className="h-8 w-8 inline-block" />
                                   <Skeleton className="h-8 w-8 inline-block" />
                               </TableCell>
                           </TableRow>
                       ))
                   )}
                  {!isLoading && services.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-12">{t('admin_service.no_services')}</TableCell> {/* Increased padding */}
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
                         {formatCurrency(service.price)} {/* Use centralized formatter */}
                       </TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${service.active ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-gray-500/10 border-gray-500/50 text-gray-400'}`}> {/* Use medium font weight */}
                            {service.active ? t('admin_service.status_active') : t('admin_service.status_inactive')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-1"> {/* Adjusted space */}
                        <MotionButton
                           variant="ghost"
                           size="icon"
                           onClick={() => toggleServiceStatus(service)}
                           title={service.active ? t('admin_service.deactivate_tooltip') : t('admin_service.activate_tooltip')}
                           className="hover:bg-muted/50 rounded-md" // Added rounded-md
                           whileHover={{ scale: 1.1, y: -1 }} whileTap={{ scale: 0.9 }}
                         >
                          {service.active ? <PowerOff className="h-4 w-4 text-red-500" /> : <Power className="h-4 w-4 text-green-500" />}
                        </MotionButton>
                        <MotionButton
                           variant="ghost"
                           size="icon"
                           onClick={() => openModalForEdit(service)}
                           title={t('admin_service.edit_tooltip')}
                           className="hover:bg-muted/50 rounded-md" // Added rounded-md
                           whileHover={{ scale: 1.1, y: -1 }} whileTap={{ scale: 0.9 }}
                         >
                          <Edit className="h-4 w-4 text-blue-400" />
                        </MotionButton>
                         {/* Wrap Trigger in AlertDialog */}
                         <AlertDialog>
                             <AlertDialogTrigger asChild>
                                 <MotionButton
                                     variant="ghost"
                                     size="icon"
                                     onClick={() => handleDeleteConfirmation(service)} // Still needed to set state
                                     title={t('admin_service.delete_tooltip')}
                                     className="text-destructive hover:bg-destructive/10 rounded-md" // Added rounded-md
                                     whileHover={{ scale: 1.1, y: -1 }} whileTap={{ scale: 0.9 }}
                                   >
                                    <Trash2 className="h-4 w-4" />
                                  </MotionButton>
                              </AlertDialogTrigger>
                              {/* The AlertDialogContent is outside the map, rendered once */}
                         </AlertDialog>
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
