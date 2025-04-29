// src/components/navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, Scissors, LogIn, Home, Briefcase, GalleryVertical, Globe } from 'lucide-react'; // Added icons
import { useState } from 'react';
import { useI18n, useChangeLocale, useCurrentLocale } from '@/locales/client'; // Import i18n hooks
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MotionDiv, MotionButton } from '@/components/motion-provider'; // Import motion components


export function Navbar() {
  const pathname = usePathname();
  const t = useI18n(); // Translation hook
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', labelKey: 'nav.home', icon: Home },
    { href: '/services', labelKey: 'nav.services', icon: Briefcase },
    { href: '/cuts', labelKey: 'nav.cuts', icon: GalleryVertical }, // Added Cuts page
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Animation for Nav Items
  const navItemVariants = {
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0 },
  };

  const mobileNavItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
 };

  const logoVariants = {
    hover: { scale: 1.1, rotate: -5, color: "hsl(var(--accent))" },
    tap: { scale: 0.95 }
  }

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 4px 10px hsla(var(--accent)/0.3)" },
    tap: { scale: 0.98 }
  }


  return (
    <MotionDiv
      tag="nav"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70 shadow-sm"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo/Brand */}
         <MotionDiv whileHover="hover" whileTap="tap" variants={logoVariants}>
             <Link href="/" className="flex items-center space-x-2 text-primary transition-colors duration-300">
              <Scissors className="h-7 w-7 text-accent" />
              <span className="font-bold text-lg tracking-tight">BarberApp</span>
             </Link>
         </MotionDiv>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
           {navItems.map((item, index) => (
            <MotionButton
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                'transition-colors text-sm font-medium relative group px-3 py-2', // Adjusted padding
                pathname === `/${currentLocale}${item.href}` || (item.href === '/' && pathname === `/${currentLocale}`)
                ? 'text-accent'
                : 'text-muted-foreground hover:text-accent'
              )}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
              transition={{ delay: 0.1 + index * 0.1 }} // Stagger animation
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
                <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4 inline-block lg:hidden" /> {/* Show icon on smaller screens */}
                <span className="hidden lg:inline-block">{t(item.labelKey as any)}</span> {/* Show text on larger screens */}
                 <span className={cn(
                    "absolute bottom-0 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-all duration-300",
                     pathname === `/${currentLocale}${item.href}` || (item.href === '/' && pathname === `/${currentLocale}`) ? 'w-full' : 'w-0'
                 )}></span>
                </Link>
            </MotionButton>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MotionButton
                variant="outline"
                size="sm"
                className="border-border/70 hover:bg-muted"
                variants={buttonVariants} whileHover="hover" whileTap="tap"
              >
                <Globe className="mr-2 h-4 w-4" /> {currentLocale.toUpperCase()}
              </MotionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLocale('en')}>English (EN)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('es')}>Español (ES)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('pt')}>Português (PT)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <MotionButton
             asChild
             variant="outline"
             size="sm"
             className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
             variants={buttonVariants} whileHover="hover" whileTap="tap"
           >
            <Link href="/login">
                <LogIn className="mr-2 h-4 w-4"/> {t('nav.admin_login')}
            </Link>
          </MotionButton>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <MotionButton variant="ghost" size="icon" variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Globe className="h-5 w-5" />
              </MotionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLocale('en')}>EN</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('es')}>ES</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('pt')}>PT</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <MotionButton variant="ghost" size="icon" variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('nav.toggle_menu')}</span>
              </MotionButton>
            </SheetTrigger>
             <SheetContent side="right" className="w-[280px] bg-background p-0 flex flex-col">
              <div className="p-6 border-b border-border/50">
                 <Link href="/" className="flex items-center space-x-2 text-lg font-bold text-primary" onClick={closeMobileMenu}>
                  <Scissors className="h-6 w-6 text-accent" />
                  <span>BarberApp</span>
                </Link>
              </div>
              <div className="flex-grow flex flex-col space-y-2 p-4">
                 {navItems.map((item, index) => (
                   <MotionDiv
                     key={item.href}
                     variants={mobileNavItemVariants}
                     initial="hidden"
                     animate="visible"
                     transition={{ delay: index * 0.1 }}
                   >
                     <SheetClose asChild>
                       <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 text-base font-medium rounded-md px-3 py-2.5 transition-colors',
                           pathname === `/${currentLocale}${item.href}` || (item.href === '/' && pathname === `/${currentLocale}`)
                            ? 'bg-accent/10 text-accent'
                            : 'text-foreground hover:bg-muted'
                        )}
                        onClick={closeMobileMenu}
                       >
                         <item.icon className="h-5 w-5" />
                         {t(item.labelKey as any)}
                       </Link>
                     </SheetClose>
                    </MotionDiv>
                 ))}

              </div>
               <div className="mt-auto p-4 border-t border-border/50">
                <SheetClose asChild>
                   <MotionButton
                     asChild
                     variant="outline"
                     className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                     onClick={closeMobileMenu}
                     variants={buttonVariants} whileHover="hover" whileTap="tap"
                    >
                      <Link href="/login">
                          <LogIn className="mr-2 h-4 w-4"/> {t('nav.admin_login')}
                      </Link>
                   </MotionButton>
                  </SheetClose>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </MotionDiv>
  );
}
