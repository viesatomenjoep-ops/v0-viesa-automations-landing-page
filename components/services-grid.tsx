'use client';

import { Globe, Server, Zap, Smartphone } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Websites & Platforms',
    description: 'High-performance websites en web applicaties gebouwd met de nieuwste technologie.',
  },
  {
    icon: Server,
    title: 'CRM/ERP Systemen',
    description: 'Geïntegreerde bedrijfssystemen die uw workflows automatiseren en efficiëntie verhogen.',
  },
  {
    icon: Zap,
    title: 'Lead Capture Oplossingen',
    description: 'Geavanceerde systemen om leads automatisch in te vangen en te kwalificeren.',
  },
  {
    icon: Smartphone,
    title: 'Mobiele Applicaties',
    description: 'Native en cross-platform apps die uw bedrijf naar mobiel brengen.',
  },
];

export function ServicesGrid() {
  return (
    <section id="services" className="py-20 md:py-32 bg-viesa-slate px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Onze Diensten</h2>
          <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
            Alles wat u nodig heeft voor digitale transformatie
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group p-8 bg-[#0f1419] border border-[#2d3e52] rounded-xl hover:border-[#00d9ff] transition-all duration-300 hover:shadow-lg hover:shadow-[#00d9ff]/20 hover:scale-105"
              >
                {/* Icon */}
                <div className="mb-6 inline-block p-3 bg-[#00d9ff]/10 rounded-lg group-hover:bg-[#00d9ff]/20 transition-colors">
                  <Icon size={32} className="text-[#00d9ff]" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>

                {/* Description */}
                <p className="text-[#94a3b8] leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
