'use client';

import { motion } from 'framer-motion';
import { Search, Palette, Code, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discovery',
    description: 'We analyseren uw bedrijf, doelgroep en markt om de perfecte oplossing te ontwerpen.',
    color: 'border-cyan-500/30'
  },
  {
    number: '02',
    icon: Palette,
    title: 'Design',
    description: 'Slick, modern design dat uw brand weerspiegelt en gebruikers begeistert.',
    color: 'border-violet-500/30'
  },
  {
    number: '03',
    icon: Code,
    title: 'Build',
    description: 'Robuuste, scalable code gebouwd met best practices en de nieuwste tech.',
    color: 'border-blue-500/30'
  },
  {
    number: '04',
    icon: Sparkles,
    title: 'Automate',
    description: 'Integratie en automatisering zodat uw bedrijf soepel draait, 24/7.',
    color: 'border-emerald-500/30'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function ProcessSection() {
  return (
    <section id="process" className="py-24 md:py-40 bg-background px-4 relative">
       {/* Background accent */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Onze <span className="text-secondary text-glow">Werkwijze</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
            Van concept tot realisatie: een gestroomlijnd proces gericht op snelheid en kwaliteit.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
        >
          {/* Connector lines (hidden on mobile) */}
          <div className="hidden lg:block absolute top-[28px] left-[60px] right-[60px] h-[1px] bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 opacity-50" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="relative group"
              >
                {/* Badge with number */}
                <div className="relative flex items-center justify-center w-14 h-14 glass rounded-full font-display font-bold text-lg mb-8 z-10 group-hover:border-primary/50 transition-all duration-500 shadow-[0_0_20px_rgba(0,242,255,0.1)]">
                  <span className="text-white group-hover:text-primary transition-colors">
                    {step.number}
                  </span>
                  
                  {/* Subtle glow behind number */}
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Card-like content */}
                <div className={`p-8 glass rounded-3xl border-l-2 ${step.color} hover:bg-white/[0.03] transition-colors duration-500`}>
                  <div className="mb-6 inline-block p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-secondary/30 transition-colors">
                    <Icon size={28} className="text-secondary" />
                  </div>

                  <h3 className="text-2xl font-display font-bold text-white mb-4 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
