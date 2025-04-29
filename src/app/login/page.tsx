// src/app/login/page.tsx
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
import { LogIn, Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
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
        title: "Login Successful",
        description: "Redirecting to admin panel...",
        variant: "default",
      });
      // In a real app, set auth state (e.g., context, session, token)
      router.push('/admin'); // Redirect to admin dashboard
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-xl bg-card/80 backdrop-blur-md border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Admin Login</CardTitle>
          <CardDescription className="text-muted-foreground">Access the BarberApp dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center text-foreground">
                <Mail className="mr-2 h-4 w-4 text-accent" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@admin.com"
                {...register('email')}
                aria-invalid={errors.email ? "true" : "false"}
                className="bg-input/50 border-border/70 focus:border-accent focus:ring-accent"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center text-foreground">
                <Lock className="mr-2 h-4 w-4 text-accent" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register('password')}
                aria-invalid={errors.password ? "true" : "false"}
                 className="bg-input/50 border-border/70 focus:border-accent focus:ring-accent"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                   <LogIn className="mr-2 h-4 w-4 animate-spin" /> Logging In...
                </>
              ) : (
                 <>
                   <LogIn className="mr-2 h-4 w-4" /> Login
                 </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
