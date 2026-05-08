'use client';

import { motion } from 'framer-motion';
import { Globe, Server, Zap, Smartphone, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const services = [
  {
    icon: Globe,
    title: 'Websites & Platforms',
    description: 'High-performance websites en web applicaties gebouwd met de nieuwste technologie.',
    className: 'md:col-span-2 md:row-span-2',
    image: '/abstract-tech-1.png', // Placeholder for generated images
    color: 'from-primary/20 to-transparent'
  },
  {
    icon: Server,
    title: 'CRM/ERP Systemen',
    description: 'Geïntegreerde bedrijfssystemen die uw workflows automatiseren.',
    className: 'md:col-span-1 md:row-span-1',
    color: 'from-secondary/20 to-transparent'
  },
  {
    icon: Zap,
    title: 'Lead Capture',
    description: 'Geavanceerde systemen om leads automatisch in te vangen.',
    className: 'md:col-span-1 md:row-span-2',
    color: 'from-primary/20 to-transparent'
  },
  {
    icon: Smartphone,
    title: 'Mobiele Apps',
    description: 'Native en cross-platform apps die uw bedrijf naar mobiel brengen.',
    className: 'md:col-span-1 md:row-span-1',
    color: 'from-secondary/20 to-transparent'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export function ServicesGrid() {
  return (
    <section id="services" className="py-24 md:py-40 bg-background px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Onze <span className="text-primary text-glow">Expertise</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
            Wij bouwen de digitale ruggengraat van uw onderneming met moderne technologie en slimme automatisering.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`group relative glass glass-hover rounded-3xl p-8 overflow-hidden flex flex-col justify-between ${service.className}`}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-block p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3 flex items-center gap-2">
                    {service.title}
                    <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1" />
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-[280px]">
                    {service.description}
                  </p>
                </div>

                <div className="relative z-10 mt-auto flex justify-end">
                  <span className="text-xs font-mono text-white/20 group-hover:text-primary/40 transition-colors uppercase tracking-widest">
                    Service 0{index + 1}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
