import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { TrustSection } from '@/components/trust-section';
import { ServicesGrid } from '@/components/services-grid';
import { ProcessSection } from '@/components/process-section';
import { USPSection } from '@/components/usp-section';
import { FAQSection } from '@/components/faq-section';
import { Footer } from '@/components/footer';
import { ChatWidget } from '@/components/chat-widget';

export default function Page() {
  return (
    <main className="min-h-screen bg-viesa-slate">
      <Navigation />
      <HeroSection />
      <TrustSection />
      <ServicesGrid />
      <ProcessSection />
      <USPSection />
      <FAQSection />
      <Footer />
      <ChatWidget />
    </main>
  );
}
