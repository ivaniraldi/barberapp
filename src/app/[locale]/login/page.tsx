// src/app/[locale]/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react'; // Added Loader2 for loading state
import { useI18n } from '@/locales/client'; // Import client-side i18n hook
import { MotionDiv, MotionButton } from '@/components/motion-provider'; // Import MotionDiv and MotionButton

const loginSchema = z.object({
  email: z.string().email({ message: "login_page.email_error" }), // Use translation keys
  password: z.string().min(6, { message: "login_page.password_error" }), // Use translation keys
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useI18n(); // Get translation function
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Hardcoded credentials check (replace with real authentication)
    if (data.email === 'admin@admin.com' && data.password === '123123') {
      toast({
        title: t('login_page.login_success_title'),
        description: t('login_page.login_success_description'),
        variant: "default",
      });
      // In a real app, set auth state (e.g., context, session, token)
      router.push('/admin'); // Redirect to admin dashboard (locale prefix handled by middleware)
    } else {
      toast({
        title: t('login_page.login_fail_title'),
        description: t('login_page.login_fail_description'),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

   // Animation variants
  const cardVariants = {
      hidden: { opacity: 0, y: 50, scale: 0.9 },
      visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }, // Example ease
      },
  };

   const inputVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
   };

   const buttonVariants = {
       hover: { scale: 1.05, boxShadow: "0px 5px 15px hsla(var(--accent)/0.25)" },
       tap: { scale: 0.98 }
   }


  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background/90 to-secondary/20 p-4 overflow-hidden">
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="w-full max-w-md shadow-xl bg-card/80 backdrop-blur-lg border-border/60 overflow-hidden">
          <CardHeader className="text-center border-b border-border/30 pb-6 bg-gradient-to-b from-muted/30 to-transparent">
            <MotionDiv initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <CardTitle className="text-3xl font-bold text-primary">{t('login_page.title')}</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">{t('login_page.description')}</CardDescription>
            </MotionDiv>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               <MotionDiv variants={inputVariants} custom={0} initial="hidden" animate="visible" transition={{delay: 0.3}}>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center text-foreground font-medium">
                      <Mail className="mr-2 h-4 w-4 text-accent" /> {t('login_page.email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('login_page.email_placeholder')}
                      {...register('email')}
                      aria-invalid={errors.email ? "true" : "false"}
                      className="bg-input/50 border-border/70 focus:border-accent focus:ring-accent transition-colors duration-200"
                    />
                    {errors.email && <p className="text-sm text-destructive pt-1">{t(errors.email.message as any)}</p>}
                  </div>
               </MotionDiv>
               <MotionDiv variants={inputVariants} custom={1} initial="hidden" animate="visible" transition={{delay: 0.4}}>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center text-foreground font-medium">
                      <Lock className="mr-2 h-4 w-4 text-accent" /> {t('login_page.password')}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('login_page.password_placeholder')}
                      {...register('password')}
                      aria-invalid={errors.password ? "true" : "false"}
                      className="bg-input/50 border-border/70 focus:border-accent focus:ring-accent transition-colors duration-200"
                    />
                    {errors.password && <p className="text-sm text-destructive pt-1">{t(errors.password.message as any)}</p>}
                  </div>
               </MotionDiv>
              <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                  <MotionButton
                     type="submit"
                     className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold transition-all duration-300 transform shadow-md hover:shadow-lg"
                     disabled={isLoading}
                     variants={buttonVariants}
                     whileHover="hover"
                     whileTap="tap"
                  >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('login_page.logging_in_button')}
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" /> {t('login_page.login_button')}
                    </>
                  )}
                  </MotionButton>
              </MotionDiv>
            </form>
          </CardContent>
        </Card>
      </MotionDiv>
    </main>
  );
}
