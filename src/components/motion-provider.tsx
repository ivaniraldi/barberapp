// src/components/motion-provider.tsx
'use client';

import { motion, MotionProps } from 'framer-motion';
import React from 'react';

// Wrapper for div
interface MotionDivProps extends React.HTMLAttributes<HTMLDivElement>, MotionProps {
  children: React.ReactNode;
  as?: React.ElementType; // Allow specifying the element type
}

export const MotionDiv = React.forwardRef<HTMLElement, MotionDivProps>(
    ({ children, as = 'div', ...props }, ref) => {
    const Component = motion(as);
    return <Component ref={ref} {...props}>{children}</Component>;
});
MotionDiv.displayName = 'MotionDiv';


// Wrapper for button
interface MotionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, MotionProps {
  children: React.ReactNode;
  asChild?: boolean; // For compatibility with Radix Slot
}

export const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
    ({ children, asChild, ...props }, ref) => {
    // If using asChild, Framer Motion might interfere with Radix Slot.
    // It's generally safer to wrap the component that uses asChild with MotionDiv
    // or apply motion directly if the component accepts motion props.
    // For a standard button, this works:
    if (asChild) {
         console.warn("MotionButton with asChild might have unexpected behavior. Consider wrapping the child Link/Slot with MotionDiv instead.");
         // Attempt to pass motion props through Slot, might not work as expected with all motion features.
         // A simple wrapper approach:
         return <motion.div {...props as any}><button ref={ref} >{children}</button></motion.div>
         // Or pass directly if Slot/Button supports it (less common)
         // return <motion.button ref={ref} {...props}>{children}</motion.button>;

     }
     return <motion.button ref={ref} {...props}>{children}</motion.button>;
});
MotionButton.displayName = 'MotionButton';


// Wrapper for ul (example)
interface MotionUlProps extends React.HTMLAttributes<HTMLUListElement>, MotionProps {
  children: React.ReactNode;
}
export const MotionUl = React.forwardRef<HTMLUListElement, MotionUlProps>(({ children, ...props }, ref) => {
    return <motion.ul ref={ref} {...props}>{children}</motion.ul>;
});
MotionUl.displayName = 'MotionUl';


// Wrapper for li (example)
interface MotionLiProps extends React.HTMLAttributes<HTMLLIElement>, MotionProps {
  children: React.ReactNode;
}
export const MotionLi = React.forwardRef<HTMLLIElement, MotionLiProps>(({ children, ...props }, ref) => {
    return <motion.li ref={ref} {...props}>{children}</motion.li>;
});
MotionLi.displayName = 'MotionLi';


// Global Provider (Optional but good practice if using LayoutGroup or complex shared state)
interface MotionProviderProps {
    children: React.ReactNode;
}

export const MotionProvider: React.FC<MotionProviderProps> = ({ children }) => {
  // You can add LayoutGroup here if needed for shared layout animations
  // import { LayoutGroup } from 'framer-motion';
  // return <LayoutGroup>{children}</LayoutGroup>;
  return <>{children}</>; // Simple fragment provider for now
};
