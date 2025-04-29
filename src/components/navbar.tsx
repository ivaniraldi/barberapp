// src/components/navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, Scissors, LogIn } from 'lucide-react'; // Import icons
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  // Add other main navigation links here if needed
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2 text-primary hover:text-accent transition-colors">
          <Scissors className="h-6 w-6 text-accent" />
          <span className="font-bold">BarberApp</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-accent',
                pathname === item.href ? 'text-accent underline underline-offset-4' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
           <Button asChild variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <Link href="/login">
                <LogIn className="mr-2 h-4 w-4"/> Admin Login
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] bg-background">
              <div className="flex flex-col space-y-4 p-4 pt-10">
                 <Link href="/" className="flex items-center space-x-2 text-lg font-bold mb-4 text-primary" onClick={closeMobileMenu}>
                  <Scissors className="h-6 w-6 text-accent" />
                  <span>BarberApp</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-accent',
                      pathname === item.href ? 'text-accent' : 'text-foreground'
                    )}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="border-border/50 my-4" />
                 <Button asChild variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={closeMobileMenu}>
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4"/> Admin Login
                    </Link>
                 </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
