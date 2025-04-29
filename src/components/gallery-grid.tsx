// src/components/gallery-grid.tsx
'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
}

// Variants for staggering animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger effect for children
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

// Define different sizes for grid items
const itemSizes = [
  'col-span-2 row-span-2', // Larger item
  'col-span-1 row-span-1',
  'col-span-1 row-span-2', // Tall item
  'col-span-2 row-span-1', // Wide item
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
];

export const GalleryGrid: FC<GalleryGridProps> = ({ images }) => {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]" // Adjust row height as needed
      variants={containerVariants}
      initial="hidden"
      whileInView="visible" // Animate when the grid comes into view
      viewport={{ once: true, amount: 0.2 }} // Trigger animation once, when 20% is visible
    >
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          className={cn(
            'relative overflow-hidden rounded-lg shadow-lg group',
            itemSizes[index % itemSizes.length] // Cycle through sizes
          )}
          variants={itemVariants}
        >
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-hidden="true"
          />
          {/* Glassmorphism effect container */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] rounded-lg transition duration-300 group-hover:backdrop-blur-[1px] border border-white/10">
             <Image
                src={image.src}
                alt={image.alt}
                fill // Use fill to cover the container
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" // Responsive sizes
                style={{ objectFit: 'cover' }} // Ensure image covers the area
                className="transform transition-transform duration-500 ease-in-out group-hover:scale-105" // Zoom effect on hover
                priority={index < 4} // Prioritize loading first few images
              />
          </div>
          <div className="absolute bottom-0 left-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm font-medium drop-shadow-md">{image.alt}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
