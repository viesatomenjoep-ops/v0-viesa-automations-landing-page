import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { TrustSection } from '@/components/trust-section';
import dynamic from 'next/dynamic';

const ServicesGrid = dynamic(() => import('@/components/services-grid').then(mod => mod.ServicesGrid));
const ProcessSection = dynamic(() => import('@/components/process-section').then(mod => mod.ProcessSection));
const USPSection = dynamic(() => import('@/components/usp-section').then(mod => mod.USPSection));
const AboutSection = dynamic(() => import('@/components/about-section').then(mod => mod.AboutSection));
const FAQSection = dynamic(() => import('@/components/faq-section').then(mod => mod.FAQSection));
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
