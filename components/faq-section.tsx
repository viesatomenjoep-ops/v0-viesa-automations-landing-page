'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Hoe lang duurt een typisch project?',
    answer:
      'Dit hangt af van de complexiteit en scope. Websites duurt meestal 4-8 weken, terwijl complexe CRM-systemen 3-6 maanden kunnen duren. We geven altijd realistische timelines in de discovery fase.',
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
  {
    question: 'Kunnen jullie bestaande systemen refactoren?',
    answer:
      'Zeker. Als uw huidige systeem verouderd of inefficiënt is, kunnen we het refactoren naar moderne, schaalbare architectuur zonder downtime.',
  },
  {
    question: 'Werken jullie met remote teams?',
    answer:
      'Ja, we werken met distributed teams en zijn ervaren in remote collaboration. We communiceren via Slack, Zoom, en GitHub voor naadloze samenwerking.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-[#0f1419] px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Veelgestelde Vragen</h2>
          <p className="text-lg text-[#94a3b8]">Antwoorden op veel gestelde vragen</p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-[#2d3e52] last:border-0"
            >
              <AccordionTrigger className="py-6 hover:text-[#00d9ff] transition-colors text-left text-white">
                <span className="text-lg font-semibold">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-[#94a3b8] pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions? */}
        <div className="mt-12 p-8 bg-[#00d9ff]/5 border border-[#00d9ff]/20 rounded-xl text-center">
          <p className="text-[#94a3b8] mb-4">Nog vragen? We helpen graag!</p>
          <button className="px-8 py-3 bg-[#00d9ff] text-[#0f1419] rounded-lg hover:bg-[#00c4e6] transition-colors font-semibold">
            Contacteer ons
          </button>
        </div>
      </div>
    </section>
  );
}
