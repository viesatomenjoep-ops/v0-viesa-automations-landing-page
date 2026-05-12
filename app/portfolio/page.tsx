'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/hooks/use-translation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ChatWidget } from '@/components/chat-widget';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Layout, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactModal } from '@/components/contact-modal';

export default function PortfolioPage() {
  return <PortfolioContent />;
}

export function PortfolioContent() {
  const { t, languageId, isLoading: transLoading } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPortfolio() {
      const { data } = await supabase.from('portfolio_items').select(`
        *,
        translations:portfolio_item_translations(*)
      `).order('sort_order', { ascending: true });
      
      setItems(data || []);
      setIsLoading(false);
    }
    fetchPortfolio();
  }, []);

  if (transLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider mb-8">
              <Sparkles size={16} />
              PORTFOLIO
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight">
              {t('portfolio.header_title', 'Onze Projecten')}
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-10">
              {t('portfolio.header_subtitle', 'Een kijkje in de innovatieve oplossingen die we voor onze klanten hebben gebouwd.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {items.map((item, idx) => {
              const trans = item.translations?.find((tr: any) => tr.language_id === languageId) || item.translations?.[0];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={item.image_url} 
                      alt={trans?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                      <div className="w-full flex justify-between items-center text-white">
                        <span className="font-bold tracking-widest text-xs uppercase">Bekijk Case</span>
                        <ArrowUpRight size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="p-8 md:p-10">
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                      {trans?.title || 'Project'}
                    </h3>
                    <p className="text-slate-500 leading-relaxed mb-6 line-clamp-3">
                      {trans?.description || 'Beschrijving...'}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 text-xs font-bold border border-slate-100 uppercase tracking-widest">
                        Case Study
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-primary rounded-[48px] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                {t('portfolio.cta_title', 'Klaar voor de volgende stap?')}
              </h2>
              <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
                {t('portfolio.cta_subtitle', 'Laten we samen kijken hoe we jouw processen kunnen automatiseren en optimaliseren.')}
              </p>
              <Button 
                onClick={() => setIsContactModalOpen(true)}
                size="lg" 
                className="bg-white text-primary hover:bg-blue-50 font-bold rounded-2xl h-16 px-10 text-lg transition-all"
              >
                <MessageCircle className="mr-2" />
                {t('portfolio.cta_button_text', 'Contact Opnemen')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </main>
  );
}
