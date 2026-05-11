'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { usePartners } from '@/hooks/use-partners';

export function TrustSection() {
  const { t } = useTranslation();
  const { partners, isLoading } = usePartners();
  
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground text-xs md:text-sm mb-12 uppercase tracking-[0.3em] font-medium"
        >
          {t('trust.header', 'Partnering with Innovation Leaders')}
        </motion.p>

        <div className="relative">
          {/* Masking gradients */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Marquee Container */}
          <div className="flex overflow-hidden group">
            {partners.length > 0 && (
              <motion.div
                className="flex gap-20 py-4"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {duplicatedPartners.map((partner, index) => (
                  <div
                    key={`${partner.id}-${index}`}
                    className="flex-shrink-0 flex items-center justify-center"
                  >
                    <span className="text-2xl md:text-3xl font-display font-bold text-slate-200 hover:text-primary transition-colors duration-500 cursor-default select-none">
                      {partner.name}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
