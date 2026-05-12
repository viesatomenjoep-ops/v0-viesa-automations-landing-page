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
            {t('usp.header_title', 'Waarom')} <span className="text-primary text-glow">{t('usp.header_title_accent', 'VIESA Automations?')}</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
            {t('usp.header_subtitle', 'Wij onderscheiden ons door een unieke combinatie van technische expertise, snelheid en integriteit.')}
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
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-primary/20 to-transparent border border-white/10 rounded-3xl p-8 overflow-hidden flex flex-col justify-between transition-all duration-500 shadow-xl"
              >
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 inline-block p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
                    <Icon size={28} className="text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-display font-bold text-white mb-3 tracking-tight">
                    {usp.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed font-sans">
                    {usp.description}
                  </p>
                </div>

                {/* Bottom Decor */}
                <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 group-hover:text-primary/40 transition-colors">USP 0{index + 1}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
