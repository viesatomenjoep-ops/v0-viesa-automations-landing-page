'use client';

import { Award, Zap, DollarSign } from 'lucide-react';

const usps = [
  {
    icon: Award,
    title: 'Hoogste Kwaliteit',
    description: 'Onze expertise en toewijding zorgen voor solutions die niet alleen werken, maar uitblinken.',
  },
  {
    icon: Zap,
    title: 'Korte Doorlooptijd',
    description: 'Snelle iteraties en agile methodologie brengen uw project snel naar markt.',
  },
  {
    icon: DollarSign,
    title: 'Eerlijke Tarieven',
    description: 'Transparante prijzen zonder verborgen kosten. U betaalt alleen voor wat u gebruikt.',
  },
];

export function USPSection() {
  return (
    <section className="py-20 md:py-32 bg-viesa-slate px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Waarom VIESA?</h2>
          <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
            We onderscheiden ons door excellence, snelheid en integriteit
          </p>
        </div>

        {/* USP Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {usps.map((usp, index) => {
            const Icon = usp.icon;
            return (
              <div
                key={index}
                className="p-8 bg-[#0f1419] border border-[#2d3e52] rounded-xl hover:border-[#00d9ff] transition-all duration-300 group"
              >
                {/* Icon */}
                <div className="mb-6 inline-block p-4 bg-[#00d9ff]/10 rounded-lg group-hover:bg-[#00d9ff]/20 transition-colors">
                  <Icon size={32} className="text-[#00d9ff]" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4">{usp.title}</h3>

                {/* Description */}
                <p className="text-[#94a3b8] leading-relaxed">{usp.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
