'use client';

import { motion } from 'framer-motion';
import { Award, Zap, DollarSign } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useUSPs } from '@/hooks/use-usps';

const iconMap: Record<string, any> = {
  Award,
  Zap,
  DollarSign
};

export function USPSection() {
  const { t } = useTranslation();
  const { usps, isLoading } = useUSPs();

  return (
    <section className="py-24 md:py-40 bg-gradient-to-b from-[#0f172a] to-[#050505] px-4 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Waarom <span className="text-primary text-glow">VIESA Automations</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
            Wij onderscheiden ons door een unieke combinatie van technische expertise, snelheid en integriteit.
          </p>
        </motion.div>

        {/* USP Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {usps.map((usp, index) => {
            const Icon = iconMap[usp.icon_name] || Award;
            return (
              <motion.div
                key={usp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="p-10 glass glass-hover rounded-[40px] group transition-all duration-500 border-white/5"
              >
                {/* Icon */}
                <div className="mb-8 inline-block p-5 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-all duration-500 border border-primary/20">
                  <Icon size={32} className="text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-display font-bold text-white mb-4 tracking-tight group-hover:text-primary transition-colors">
                  {usp.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed font-sans">
                  {usp.description}
                </p>

                {/* Bottom Decor */}
                <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Premium Standard</span>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
