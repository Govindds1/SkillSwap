import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero';
import { BenefitsSection } from '@/components/benefits';
import { TopSkillsSection } from '@/components/top-skills';
import { TestimonialsSection } from '@/components/testimonials';
import { CTASection } from '@/components/cta-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-warm-cream">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <TopSkillsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
