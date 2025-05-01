// src/components/gallery-grid.tsx
'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import { cn } from '@/lib/utils';
import { Maximize, X } from 'lucide-react'; // Icon for potential zoom interaction and close
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
      scale: 1.04, // Slightly reduced scale
      zIndex: 10, // Bring hovered item to front
      boxShadow: "0px 15px 30px hsla(var(--background) / 0.3)", // Use background with opacity for shadow
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
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 auto-rows-[180px] sm:auto-rows-[220px]" // Responsive row height, increased gap
      variants={containerVariants}
      initial="hidden"
      whileInView="visible" // Animate when the grid comes into view
      viewport={{ once: true, amount: 0.1 }} // Trigger animation once, when 10% is visible
    >
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          className={cn(
            'relative overflow-hidden rounded-xl shadow-lg group cursor-pointer border border-border/60', // Rounded-xl, added border
            itemSizes[index % itemSizes.length] // Cycle through sizes
          )}
          variants={itemVariants}
          whileHover="hover"
          onClick={() => setSelectedImage(image)} // Open modal on click
        >
          {/* Image with slight inner padding simulated by the wrapper */}
          <div className="absolute inset-0.5 rounded-[11px] overflow-hidden"> {/* Inner div for image clipping */}
             <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" // Adjusted sizes for breakpoints
                style={{ objectFit: 'cover' }}
                className="transform transition-transform duration-500 ease-in-out group-hover:scale-105" // Slightly less zoom
                priority={index < 6} // Prioritize loading more initial images
              />
          </div>
           {/* Overlay Gradient and Text */}
           <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10 flex flex-col justify-end p-4 sm:p-5" // Increased padding
            aria-hidden="true"
           >
                <p className="text-white text-sm sm:text-base font-medium drop-shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    {image.alt}
                </p>
                 {image.category && (
                    <span className="text-xs sm:text-sm text-accent font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {image.category}
                    </span>
                 )}
           </div>
            {/* Zoom icon on hover */}
           <div className="absolute top-3 right-3 z-20 p-1.5 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm border border-white/20"> {/* Adjusted position, added border */}
             <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" /> {/* Slightly larger icon */}
           </div>
        </motion.div>
      ))}
    </motion.div>

     {/* Image Modal */}
      <Dialog.Root open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
       <AnimatePresence>
         {selectedImage && (
           <Dialog.Portal forceMount> {/* Keep portal mounted for exit animation */}
             <Dialog.Overlay asChild>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md" // Increased z-index, blur
                />
             </Dialog.Overlay>
             <Dialog.Content asChild>
                 <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed left-[50%] top-[50%] z-[101] grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border-none bg-transparent p-2 shadow-lg" // Increased z-index, max-width
                  >
                   <Image
                     src={selectedImage.src}
                     alt={selectedImage.alt}
                     width={1000} // Adjust max width as needed
                     height={750} // Adjust max height as needed
                     className="rounded-lg object-contain max-h-[85svh] w-auto mx-auto shadow-2xl" // Added shadow
                   />
                   <p className="text-center text-white/90 mt-4 text-base bg-black/60 px-4 py-1.5 rounded-full inline-block absolute bottom-5 left-1/2 -translate-x-1/2 backdrop-blur-sm">{selectedImage.alt}</p> {/* Enhanced caption */}
                    <Dialog.Close asChild>
                         <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1, transition: {delay: 0.1} }} // Add delay
                            exit={{ opacity: 0, scale: 0.5 }}
                            whileHover={{ scale: 1.15, rotate: 90, backgroundColor: 'hsla(0, 0%, 0%, 0.7)' }} // Increased scale, rotate, darker bg
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-3 top-3 rounded-full p-2 bg-black/50 text-white/80 hover:text-white transition-all z-[102]" // Adjusted position/padding, increased z-index
                            aria-label="Close"
                          >
                            <X className="h-5 w-5" />
                         </motion.button>
                    </Dialog.Close>
                 </motion.div>
             </Dialog.Content>
           </Dialog.Portal>
         )}
       </AnimatePresence>
     </Dialog.Root>
    </>
  );
};
