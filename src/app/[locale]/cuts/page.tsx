// src/app/[locale]/cuts/page.tsx
import { GalleryGrid } from '@/components/gallery-grid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Keep Card imports if needed elsewhere, but not used directly here
import { Separator } from '@/components/ui/separator';
import { getServices, type Service } from '@/lib/services'; // Re-use services for categories maybe
import { getI18n } from '@/locales/server'; // Import server-side i18n
import { setStaticParamsLocale } from 'next-international/server'; // Correct import for setStaticParamsLocale
import { MotionDiv } from '@/components/motion-provider';
import { Images } from 'lucide-react'; // Icon for gallery
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Use Tabs for filtering

// Mock images for the gallery - replace with actual image URLs and link to services/categories
// In a real app, fetch these images, potentially associating them with specific services.
const cutImages = [
  { id: 'g1', src: 'https://picsum.photos/seed/haircut1/400/600', alt: 'Modern Pompadour', category: 'Haircuts' },
  { id: 'g2', src: 'https://picsum.photos/seed/beardtrim2/500/350', alt: 'Sharp Beard Lineup', category: 'Beard Care' },
  { id: 'g3', src: 'https://picsum.photos/seed/fade4/450/550', alt: 'High Skin Fade', category: 'Haircuts' },
  { id: 'g4', src: 'https://picsum.photos/seed/classic5/400/500', alt: 'Classic Side Part', category: 'Haircuts' },
  { id: 'g5', src: 'https://picsum.photos/seed/longhair6/350/550', alt: 'Textured Long Top', category: 'Styling' },
  { id: 'g6', src: 'https://picsum.photos/seed/shave7/600/400', alt: 'Clean Straight Razor Shave', category: 'Shaves' },
  { id: 'g7', src: 'https://picsum.photos/seed/undercut8/420/580', alt: 'Disconnected Undercut', category: 'Haircuts' },
  { id: 'g8', src: 'https://picsum.photos/seed/beardstyle9/550/400', alt: 'Full Beard Shaping', category: 'Beard Care' },
  { id: 'g9', src: 'https://picsum.photos/seed/kidscut10/400/500', alt: 'Cool Kids Cut', category: 'Haircuts' },
   { id: 'g10', src: 'https://picsum.photos/seed/buzzcut11/500/500', alt: 'Sharp Buzz Cut', category: 'Haircuts' },
   { id: 'g11', src: 'https://picsum.photos/seed/mustache12/600/450', alt: 'Styled Mustache', category: 'Beard Care' },
   { id: 'g12', src: 'https://picsum.photos/seed/design13/450/600', alt: 'Hair Design Pattern', category: 'Styling' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Get unique categories from the images
const getUniqueCategories = (images: typeof cutImages) => {
  const categories = new Set(images.map(img => img.category));
  return ['All Cuts', ...Array.from(categories).sort()]; // Add 'All Cuts' option
};

// Mapping for translation keys (adjust if your keys differ)
const categoryTranslationKeys: Record<string, string> = {
    'All Cuts': 'cuts_page.all_cuts',
    'Haircuts': 'cuts_page.haircuts',
    'Beard Care': 'cuts_page.beard_care',
    'Shaves': 'cuts_page.shaves',
    'Styling': 'cuts_page.styling',
    // Add more mappings if needed
};

export default async function CutsPage({ params }: { params: { locale: string } }) {
  setStaticParamsLocale(params.locale);

  const t = await getI18n();
  const categories = getUniqueCategories(cutImages);

  return (
    <MotionDiv
      className="container mx-auto px-4 py-16 sm:py-24" // Increased padding
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <MotionDiv variants={itemVariants} className="text-center mb-16 sm:mb-20"> {/* Increased margin */}
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 flex items-center justify-center gap-3"> {/* Increased margin bottom */}
           <Images className="h-8 w-8 text-accent" /> {t('cuts_page.title')}
        </h1>
        <p className="text-lg text-muted-foreground">{t('cuts_page.subtitle')}</p>
      </MotionDiv>

      <MotionDiv variants={itemVariants}>
        <Tabs defaultValue="All Cuts" className="w-full mb-16"> {/* Increased margin bottom */}
          {/* Enhanced TabsList Styling */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center lg:w-auto mx-auto gap-2 bg-muted/60 p-1.5 h-auto rounded-lg shadow-inner mb-12"> {/* Added padding, rounded-lg, inner shadow, margin bottom */}
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=inactive]:bg-transparent data-[state=inactive]:hover:bg-muted/80 data-[state=inactive]:text-muted-foreground transition-all duration-200 flex-1 lg:flex-none px-4 py-2 text-sm font-medium rounded-md" // Enhanced styling
              >
                 {t(categoryTranslationKeys[category] || category)} {/* Translate category name */}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              {/* Filter images based on the selected category tab */}
              <GalleryGrid images={category === 'All Cuts' ? cutImages : cutImages.filter(img => img.category === category)} />
            </TabsContent>
          ))}
        </Tabs>
      </MotionDiv>

      <MotionDiv variants={itemVariants} className="mt-20 sm:mt-24 pt-10 border-t border-border/30 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} {t('home.title')}. {t('home.footer_rights')}</p>
      </MotionDiv>
    </MotionDiv>
  );
}
