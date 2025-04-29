// src/components/navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'; // Added SheetHeader, SheetTitle
import { cn } from '@/lib/utils';
import { Menu, Scissors, LogIn, Home, Briefcase, GalleryVertical, Globe, CalendarDays } from 'lucide-react'; // Added CalendarDays
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
  const currentLocale = useCurrentLocale() as 'en' | 'es' | 'pt'; // Ensure type safety
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', labelKey: 'nav.home', icon: Home },
    { href: '/services', labelKey: 'nav.services', icon: Briefcase },
    { href: '/cuts', labelKey: 'nav.cuts', icon: GalleryVertical },
    { href: '/calendar', labelKey: 'nav.calendar', icon: CalendarDays }, // Added Calendar
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
    hover: { scale: 1.05, boxShadow: "0px 4px 10px hsla(var(--accent)/0.2)" }, // Adjusted shadow for general buttons
    tap: { scale: 0.98 }
  }

  const accentButtonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 5px 15px hsla(var(--accent)/0.3)" }, // Slightly stronger shadow for accent
    tap: { scale: 0.98 }
  }


  return (
    <MotionDiv
      tag="nav" // Ensure MotionDiv renders as nav semantically
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm" // Professional sticky nav style
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
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2"> {/* Reduced spacing */}
           {navItems.map((item, index) => {
               // Determine if the link is active, handling the root path '/' correctly
               const baseHref = `/${currentLocale}${item.href === '/' ? '' : item.href}`;
               const isActive = pathname === baseHref || (item.href === '/' && pathname === `/${currentLocale}`);

               return (
                 // Wrap Link with MotionDiv instead of using MotionButton asChild
                 <MotionDiv
                   key={item.href}
                   initial="hidden"
                   animate="visible"
                   variants={navItemVariants}
                   transition={{ delay: 0.1 + index * 0.1 }} // Stagger animation
                   whileHover={{ y: -1 }} // Subtle lift effect on hover
                   whileTap={{ scale: 0.97 }}
                 >
                   <Button
                     asChild // Button still needs asChild to render Link correctly
                     variant="ghost"
                     className={cn(
                       'transition-colors text-sm font-medium relative group px-3 py-2 rounded-md',
                       isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                     )}
                   >
                     <Link href={item.href}>
                       <item.icon className="mr-1.5 h-4 w-4 inline-block shrink-0" />
                       <span>{t(item.labelKey as any)}</span>
                       <span className={cn(
                         "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-accent w-0 group-hover:w-[80%] transition-all duration-300",
                         isActive ? 'w-[80%]' : 'w-0'
                       )}></span>
                     </Link>
                   </Button>
                 </MotionDiv>
               );
            })}

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MotionButton
                variant="outline" // Use outline style for secondary actions
                size="sm"
                className="border-border/70 hover:bg-muted/70 text-muted-foreground hover:text-foreground" // Adjusted style
                variants={buttonVariants} whileHover="hover" whileTap="tap"
              >
                <Globe className="mr-1.5 h-4 w-4" /> {currentLocale.toUpperCase()}
              </MotionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLocale('en')} disabled={currentLocale === 'en'}>English (EN)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('es')} disabled={currentLocale === 'es'}>Español (ES)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('pt')} disabled={currentLocale === 'pt'}>Português (PT)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin Login CTA Button */}
           <MotionDiv
             variants={accentButtonVariants}
             whileHover="hover"
             whileTap="tap"
             className="ml-2" // Apply margin to the wrapper div
           >
            <Button
               asChild
               variant="accent" // Use the accent variant for primary CTA
               size="sm"
             >
              <Link href="/login">
                  <LogIn className="mr-1.5 h-4 w-4"/> {t('nav.admin_login')}
              </Link>
            </Button>
           </MotionDiv>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <MotionButton variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Globe className="h-5 w-5" />
              </MotionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLocale('en')} disabled={currentLocale === 'en'}>EN</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('es')} disabled={currentLocale === 'es'}>ES</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('pt')} disabled={currentLocale === 'pt'}>PT</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Mobile Menu Sheet */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <MotionButton variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('nav.toggle_menu')}</span>
              </MotionButton>
            </SheetTrigger>
             <SheetContent side="right" className="w-[280px] bg-background p-0 flex flex-col border-l border-border/50"> {/* Added border */}
               <SheetHeader className="p-6 border-b border-border/50">
                   <SheetTitle> {/* Keep title for accessibility, can be visually hidden if needed */}
                       <Link href="/" className="flex items-center space-x-2 text-lg font-bold text-primary" onClick={closeMobileMenu}>
                        <Scissors className="h-6 w-6 text-accent" />
                        <span>BarberApp</span>
                       </Link>
                   </SheetTitle>
               </SheetHeader>
              <div className="flex-grow flex flex-col space-y-1.5 p-4 overflow-y-auto"> {/* Make menu scrollable */}
                 {navItems.map((item, index) => {
                     const baseHref = `/${currentLocale}${item.href === '/' ? '' : item.href}`;
                     const isActive = pathname === baseHref || (item.href === '/' && pathname === `/${currentLocale}`);

                     return (
                       <MotionDiv
                         key={item.href}
                         variants={mobileNavItemVariants}
                         initial="hidden"
                         animate="visible"
                         transition={{ delay: index * 0.08 }} // Faster stagger for mobile
                       >
                         <SheetClose asChild>
                           <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 text-base font-medium rounded-md px-3 py-2.5 transition-colors', // Slightly larger tap target
                               isActive
                                ? 'bg-accent/10 text-accent' // Use accent color for active
                                : 'text-foreground hover:bg-muted/70' // Subtle hover
                            )}
                            onClick={closeMobileMenu}
                           >
                             <item.icon className="h-5 w-5" />
                             {t(item.labelKey as any)}
                           </Link>
                         </SheetClose>
                        </MotionDiv>
                     );
                   })}

              </div>
               {/* Mobile Admin Login CTA */}
               <div className="mt-auto p-4 border-t border-border/50">
                 {/* Wrap Link with MotionDiv instead of using MotionButton asChild */}
                 <MotionDiv
                     variants={accentButtonVariants}
                     whileHover="hover"
                     whileTap="tap"
                 >
                    <SheetClose asChild>
                       <Button
                         asChild
                         variant="accent" // Use accent variant for consistency
                         className="w-full"
                         onClick={closeMobileMenu}
                        >
                          <Link href="/login">
                              <LogIn className="mr-2 h-4 w-4"/> {t('nav.admin_login')}
                          </Link>
                       </Button>
                    </SheetClose>
                  </MotionDiv>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </MotionDiv>
  );
}