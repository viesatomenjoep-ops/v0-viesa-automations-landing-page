'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section 
      className="py-24 md:py-32 bg-slate-50 px-4 relative overflow-hidden group"
      onMouseMove={handleMouseMove}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          opacity: 0.15 
        }} 
      />

      {/* Interactive Cursor Glow */}
      <motion.div
        className="absolute pointer-events-none z-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(15,83,115,0.12) 0%, rgba(15,83,115,0) 60%)',
          width: '800px',
          height: '800px',
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left: Sticky Header Area */}
          <div className="lg:w-5/12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="sticky top-32"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono tracking-widest uppercase mb-6">
                Onze Aanpak
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                {t('usp.header_title', 'Waarom')} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-slate-400">
                  {t('usp.header_title_accent', 'VIESA Automations?')}
                </span>
              </h2>
              <p className="text-lg text-slate-600 font-sans leading-relaxed">
                {t('usp.header_subtitle', 'Wij onderscheiden ons door een unieke combinatie van technische expertise, snelheid en integriteit.')}
              </p>
            </motion.div>
          </div>

          {/* Right: Vertical Features List */}
          <div className="lg:w-7/12 flex flex-col">
            <div className="border-t border-slate-200">
              {usps.map((usp, index) => {
                const Icon = iconMap[usp.icon_name] || Award;
                return (
                  <motion.div
                    key={usp.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="group border-b border-slate-200 py-10 md:py-16 flex flex-col sm:flex-row gap-6 md:gap-10 items-start hover:bg-white transition-colors px-4 sm:px-8 -mx-4 sm:-mx-8 rounded-3xl"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Icon size={32} strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-mono text-primary/60 font-bold tracking-widest mb-3">
                        0{index + 1}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                        {usp.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {usp.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
