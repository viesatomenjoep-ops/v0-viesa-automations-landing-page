'use client';

import { Search, Palette, Code, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discovery',
    description: 'We analyseren uw bedrijf, doelgroep en markt om de perfecte oplossing te ontwerpen.',
  },
  {
    number: '02',
    icon: Palette,
    title: 'Design',
    description: 'Slick, modern design dat uw brand weerspiegelt en gebruikers begeistert.',
  },
  {
    number: '03',
    icon: Code,
    title: 'Build',
    description: 'Robuuste, scalable code gebouwd met best practices en de nieuwste tech.',
  },
  {
    number: '04',
    icon: Sparkles,
    title: 'Automate',
    description: 'Integratie en automatisering zodat uw bedrijf soepel draait, 24/7.',
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="py-20 md:py-32 bg-[#0f1419] px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Onze Werkwijze</h2>
          <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
            Van A tot Z, een gestructureerd proces
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector lines (hidden on mobile) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0F5373] via-[#0F5373] to-transparent" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Badge with number */}
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0F5373] text-white rounded-full font-bold text-lg mb-6 relative z-10">
                  {step.number}
                </div>

                {/* Card */}
                <div className="pt-4">
                  <div className="mb-4 inline-block p-3 bg-[#0F5373]/20 rounded-lg">
                    <Icon size={28} className="text-[#0F5373]" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-[#94a3b8] leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
