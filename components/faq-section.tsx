'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MessageCircle } from 'lucide-react';
import { ContactModal } from './contact-modal';
import { useTranslation } from '@/hooks/use-translation';
import { useFAQs } from '@/hooks/use-faqs';

export function FAQSection() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { t } = useTranslation();
  const { faqs, isLoading } = useFAQs();

  return (
    <>
      <section id="faq" className="py-24 md:py-40 bg-gradient-to-b from-slate-50 to-white px-4 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight">
              {t('faq.header_title', 'Veelgestelde')} <span className="text-primary">{t('faq.header_title_accent', 'Vragen')}</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 font-sans max-w-2xl mx-auto leading-relaxed">
              {t('faq.header_subtitle', 'Alles wat u moet weten over onze werkwijze en expertise.')}
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px] p-2 border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${index}`}
                  className="border-b border-slate-100 last:border-0 px-8"
                >
                  <AccordionTrigger className="py-8 hover:text-primary transition-all text-left hover:no-underline group">
                    <span className="text-lg md:text-xl font-display font-medium text-slate-900 group-hover:text-primary group-data-[state=open]:text-primary transition-colors">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-8 leading-relaxed font-sans text-base md:text-lg">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Still have questions? */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 p-10 bg-white border border-primary/10 rounded-[40px] text-center relative group overflow-hidden shadow-lg"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                <MessageCircle className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">{t('faq.cta_title', 'Nog vragen?')}</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">{t('faq.cta_subtitle', 'We helpen graag om uw project tot een succes te maken.')}</p>
              <button
                onClick={() => setIsContactOpen(true)}
                className="px-10 py-4 bg-primary text-white rounded-full font-bold hover:shadow-[0_0_30px_-5px_rgba(15,83,115,0.4)] transition-all duration-300"
              >
                {t('faq.cta_button', 'Contacteer ons')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}
