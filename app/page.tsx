import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { TrustSection } from '@/components/trust-section';
import dynamic from 'next/dynamic';

const SectionSkeleton = () => (
  <div className="py-24 md:py-40 px-4 bg-white animate-pulse">
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="h-8 w-48 bg-slate-100 rounded-full mx-auto" />
      <div className="h-4 w-96 bg-slate-100 rounded-full mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-slate-100 rounded-3xl" />
        ))}
      </div>
    </div>
  </div>
);

const ServicesGrid = dynamic(() => import('@/components/services-grid').then(mod => mod.ServicesGrid), { loading: () => <SectionSkeleton /> });
const ProcessSection = dynamic(() => import('@/components/process-section').then(mod => mod.ProcessSection), { loading: () => <SectionSkeleton /> });
const USPSection = dynamic(() => import('@/components/usp-section').then(mod => mod.USPSection), { loading: () => <SectionSkeleton /> });
const AboutSection = dynamic(() => import('@/components/about-section').then(mod => mod.AboutSection), { loading: () => <SectionSkeleton /> });
const FAQSection = dynamic(() => import('@/components/faq-section').then(mod => mod.FAQSection), { loading: () => <SectionSkeleton /> });
const Footer = dynamic(() => import('@/components/footer').then(mod => mod.Footer));

export default function Page() {
  return (
    <main className="min-h-screen bg-viesa-slate overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <TrustSection />
      <ServicesGrid />
      <ProcessSection />
      <USPSection />
      <AboutSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
