// src/components/gallery-grid.tsx
'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Maximize } from 'lucide-react'; // Icon for potential zoom interaction
import * as Dialog from '@radix-ui/react-dialog'; // For potential modal view
import { useState } from 'react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category?: string; // Optional category property
}

interface GalleryGridProps {
  images: GalleryImage[];
}

// Variants for staggering animations (can be reused or customized)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Slightly faster stagger
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring', // Spring animation for a bouncier feel
      stiffness: 90,
      damping: 12,
    },
  },
   hover: {
      scale: 1.05,
      zIndex: 10, // Bring hovered item to front
      boxShadow: "0px 15px 25px rgba(0,0,0,0.25)",
      transition: { duration: 0.3 }
   }
};

// Define different sizes for grid items - more variety
const itemSizes = [
  'col-span-2 row-span-2', // Larger item
  'col-span-1 row-span-1',
  'col-span-1 row-span-2', // Tall item
  'col-span-1 row-span-1',
  'col-span-2 row-span-1', // Wide item
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2', // Another tall
  'col-span-2 row-span-2', // Another large
  'col-span-1 row-span-1',
];

export const GalleryGrid: FC<GalleryGridProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[150px] sm:auto-rows-[200px]" // Responsive row height
      variants={containerVariants}
      initial="hidden"
      whileInView="visible" // Animate when the grid comes into view
      viewport={{ once: true, amount: 0.15 }} // Trigger animation once, when 15% is visible
    >
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          className={cn(
            'relative overflow-hidden rounded-xl shadow-lg group cursor-pointer border border-white/10', // Rounded-xl for softer look
            itemSizes[index % itemSizes.length] // Cycle through sizes
          )}
          variants={itemVariants}
          whileHover="hover"
          onClick={() => setSelectedImage(image)} // Open modal on click
        >
          {/* Glassmorphism effect container */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[3px] rounded-xl transition duration-300 group-hover:backdrop-blur-[1px]">
             <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" // Adjusted sizes for breakpoints
                style={{ objectFit: 'cover' }}
                className="transform transition-transform duration-500 ease-in-out group-hover:scale-110" // Slightly more zoom
                priority={index < 6} // Prioritize loading more initial images
              />
          </div>
           {/* Overlay Gradient and Text */}
           <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10 flex flex-col justify-end p-3 sm:p-4"
            aria-hidden="true"
           >
                <p className="text-white text-xs sm:text-sm font-medium drop-shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    {image.alt}
                </p>
                 {image.category && (
                    <span className="text-[10px] sm:text-xs text-accent font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {image.category}
                    </span>
                 )}
           </div>
            {/* Zoom icon on hover */}
           <div className="absolute top-2 right-2 z-20 p-1.5 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
             <Maximize className="w-3 h-3 sm:w-4 sm:h-4 text-white/80" />
           </div>
        </motion.div>
      ))}
    </motion.div>

     {/* Image Modal */}
     <Dialog.Root open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
       <Dialog.Portal>
         <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
         <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border-none bg-transparent p-0 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
           {selectedImage && (
             <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
               <Image
                 src={selectedImage.src}
                 alt={selectedImage.alt}
                 width={800} // Adjust max width as needed
                 height={600} // Adjust max height as needed
                 className="rounded-lg object-contain max-h-[80svh] w-auto mx-auto"
               />
               <p className="text-center text-white/90 mt-3 text-sm bg-black/50 px-3 py-1 rounded-full inline-block absolute bottom-4 left-1/2 -translate-x-1/2">{selectedImage.alt}</p>
                <Dialog.Close className="absolute right-2 top-2 rounded-full p-1.5 bg-black/50 text-white/80 hover:bg-black/70 transition-colors">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </Dialog.Close>
             </motion.div>
           )}
         </Dialog.Content>
       </Dialog.Portal>
     </Dialog.Root>
    </>
  );
};

// Re-export X icon if not already done
import { X } from 'lucide-react';
