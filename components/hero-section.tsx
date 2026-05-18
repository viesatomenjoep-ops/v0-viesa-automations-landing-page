'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';
import { ContactModal } from './contact-modal';
import { useState } from 'react';

import { useTranslation } from '@/hooks/use-translation';

export function HeroSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden bg-white"
    >
      {/* Dynamic Mesh Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-100/50 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />

        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ opacity }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next-Gen Automation
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-bold text-slate-900 leading-[1.1] tracking-tight">
            {t('hero.title', 'Uw Bedrijf op')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-slate-400 to-primary bg-300% animate-gradient">
              {t('hero.title_accent', 'Autopiloot')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 max-w-xl font-sans leading-relaxed">
            {t('hero.subtitle', 'Van high-end platforms tot intelligente CRM-systemen: wij transformeren complexe processen in naadloze digitale ervaringen.')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsContactOpen(true)}
              className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_-5px_rgba(15,83,115,0.5)] transition-all duration-300"
            >
              {t('hero.cta_primary', 'Start Project')}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-slate-50 border border-slate-200 rounded-full font-bold flex items-center justify-center gap-2 text-slate-900 hover:bg-slate-100 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Play size={14} className="text-primary" fill="currentColor" />
              </div>
              {t('hero.cta_secondary', 'Onze Visie')}
            </motion.button>
          </div>
        </motion.div>

        {/* Right Side: Interactive Visual */}
        <motion.div
          style={{ y: y1 }}
          className="relative hidden lg:block"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10 w-full aspect-square glass rounded-[40px] p-2 overflow-hidden border-white/5"
          >
            {/* Inner "App" Mockup */}
            <div className="w-full h-full bg-white rounded-[32px] border border-slate-100 overflow-hidden relative p-8 shadow-inner">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent z-10" />

              {/* Mockup Content */}
              <div className="relative space-y-6 z-20">
                <div className="h-4 w-32 bg-slate-100 rounded-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100" />
                  <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100" />
                </div>
                <div className="h-48 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative shadow-inner flex items-center justify-center">
                  {/* Card Background Mesh */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
                  </div>

                  {/* Animated Logo */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 2, -2, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative z-10 w-24 h-24"
                  >
                    <Image
                      src="/viesa-logo.png"
                      alt="VIESA Logo"
                      fill
                      priority
                      className="object-contain drop-shadow-[0_0_15px_rgba(15,83,115,0.8)]"
                    />
                  </motion.div>

                  {/* Technical Label */}
                  <div className="absolute bottom-4 left-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest"></span>
                  </div>
                </div>
              </div>

              {/* Glowing Cursor Overlay */}
              <motion.div
                animate={{
                  x: [0, 100, 50, 0],
                  y: [0, 50, 150, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary/10 rounded-full blur-[60px] pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Floating Element 1 */}
          <motion.div
            style={{ y: y2 }}
            className="absolute -top-12 -right-12 w-40 h-40 bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-2xl z-20"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-100 rounded-full" />
              <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
        <div className="absolute top-[40%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-50 to-transparent" />
        <div className="absolute top-[60%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-50 to-transparent" />
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </section>
  );
}
