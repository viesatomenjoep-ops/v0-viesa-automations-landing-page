'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Hoe lang duurt een typisch project?',
    answer:
      'Dit hangt af van de complexiteit en scope. Websites duren meestal 4-8 weken, terwijl complexe CRM-systemen 3-6 maanden kunnen duren. We geven altijd realistische timelines in de discovery fase.',
  },
  {
    question: 'Wat zijn de kosten voor een project?',
    answer:
      'Prijzen variëren afhankelijk van requirements. We werken meestal met fixed quotes of time-and-materials. Eerst hebben we altijd een gratis consultation om scope en budget te bespreken.',
  },
  {
    question: 'Ondersteun jullie integraties met externe systemen?',
    answer:
      'Ja, we hebben ervaring met integraties met alle populaire platforms: Salesforce, HubSpot, QuickBooks, Stripe, en meer. We bouwen custom API\'s als nodig.',
  },
  {
    question: 'Bieden jullie ondersteuning na lancering?',
    answer:
      'Absoluut. We bieden maintenance, bug fixes, en support packages. Na lancering helpen we met monitoring en optimisatie zodat alles soepel blijft lopen.',
  },
  {
    question: 'Kunnen jullie SEO voor onze website optimaliseren?',
    answer:
      'Ja, SEO is ingebakken in al onze website-projecten. We implementeren on-page SEO, technical SEO, en volgen best practices voor performance en indexability.',
  },
  {
    question: 'Hoe gaat het met veiligheid en data privacy?',
    answer:
      'Veiligheid is topprioriteit. We implementeren SSL/HTTPS, data encryption, secure authentication, en volgen GDPR-richtlijnen. Regelmatige security audits zijn standaard.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-40 bg-background px-4 relative overflow-hidden">
       {/* Background accent */}
       <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Veelgestelde <span className="text-primary text-glow">Vragen</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Alles wat u moet weten over onze werkwijze en expertise.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[40px] p-2 border-white/5 overflow-hidden"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-white/5 last:border-0 px-8"
              >
                <AccordionTrigger className="py-8 hover:text-primary transition-all text-left hover:no-underline group">
                  <span className="text-lg md:text-xl font-display font-medium text-white group-hover:text-primary group-data-[state=open]:text-primary transition-colors">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-8 leading-relaxed font-sans text-base md:text-lg">
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
          className="mt-16 p-10 glass rounded-[40px] text-center border-primary/20 relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <MessageCircle className="text-primary" size={32} />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">Nog vragen?</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">We helpen graag om uw project tot een succes te maken.</p>
            <button className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:shadow-[0_0_30px_-5px_rgba(15,83,115,0.5)] transition-all duration-300">
              Contacteer ons
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
