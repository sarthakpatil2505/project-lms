import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CoursesPreview } from '@/components/landing/CoursesPreview';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-brand-500 selection:text-white">
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CoursesPreview />
      <LandingFooter />
    </main>
  );
}
