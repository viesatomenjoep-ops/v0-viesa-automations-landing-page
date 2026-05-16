'use client';

import { motion } from 'framer-motion';
import { Search, Palette, Code, Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useProcess } from '@/hooks/use-process';

const iconMap: Record<string, any> = {
  'Discovery': Search,
  'Design': Palette,
  'Build': Code,
  'Automate': Sparkles
};

const colors = [
  'border-cyan-500/30',
  'border-violet-500/30',
  'border-blue-500/30',
  'border-emerald-500/30'
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
  const { t } = useTranslation();
  const { steps, isLoading } = useProcess();

  return (
    <section id="process" className="py-24 md:py-40 bg-slate-50 px-4 relative">
       {/* Background accent */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight">
            {t('process.header_title', 'Onze')} <span className="text-primary">{t('process.header_title_accent', 'Werkwijze')}</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-sans leading-relaxed">
            {t('process.header_subtitle', 'Van concept tot realisatie: een gestroomlijnd proces gericht op snelheid en kwaliteit.')}
          </p>
        </motion.div>

        {/* Steps */}
        {!isLoading && steps.length > 0 && (
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
            // Map icon by title or index fallback
            const Icon = iconMap[step.title] || (index === 0 ? Search : index === 1 ? Palette : index === 2 ? Code : Sparkles);
            const color = colors[index % colors.length];
            
            return (
              <motion.div 
                key={step.id} 
                variants={itemVariants}
                className="relative group"
              >
                {/* Badge with number */}
                <div className="relative flex items-center justify-center w-14 h-14 bg-white border border-slate-200 rounded-full font-display font-bold text-lg mb-8 z-10 group-hover:border-primary/50 transition-all duration-500 shadow-sm">
                  <span className="text-slate-900 group-hover:text-primary transition-colors">
                    0{index + 1}
                  </span>
                  
                  {/* Subtle glow behind number */}
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Card-like content */}
                <div className={`p-8 bg-white rounded-3xl border border-slate-100 border-l-4 ${color} hover:shadow-xl hover:shadow-primary/5 transition-all duration-500`}>
                  <div className="mb-6 inline-block p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-primary/30 transition-colors">
                    <Icon size={28} className="text-primary" />
                  </div>

                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
