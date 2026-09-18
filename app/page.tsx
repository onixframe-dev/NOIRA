import { Header } from '@/components/Header';
import { SmoothScroll } from '@/components/SmoothScroll';
import { HeroExperience } from '@/components/HeroExperience';
import { StorySection } from '@/components/StorySection';
import { NutritionSection } from '@/components/NutritionSection';
import { ProductGallery } from '@/components/ProductGallery';
import { FormulaFinder } from '@/components/FormulaFinder';
import { QuoteBand } from '@/components/QuoteBand';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <main>
      <SmoothScroll />
      <Header />
      <HeroExperience />
      <StorySection />
      <NutritionSection />
      <ProductGallery />
      <FormulaFinder />
      <QuoteBand />
      <ContactSection />
      <Footer />
    </main>
  );
}
