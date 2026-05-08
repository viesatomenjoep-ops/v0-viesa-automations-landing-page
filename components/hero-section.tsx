'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden bg-background"
    >
      {/* Dynamic Mesh Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/15 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
        
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
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
          
          <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-[1.1] tracking-tight">
            Uw Bedrijf op <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient text-glow">
              Autopiloot
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl font-sans leading-relaxed">
            Van high-end platforms tot intelligente CRM-systemen: wij transformeren complexe processen in naadloze digitale ervaringen.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_-5px_rgba(15,83,115,0.5)] transition-all duration-300"
            >
              Start Project
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 glass glass-hover rounded-full font-bold flex items-center justify-center gap-2 text-white"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Play size={14} fill="white" />
              </div>
              Onze Visie
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
            <div className="w-full h-full bg-[#050505] rounded-[32px] border border-white/10 overflow-hidden relative p-8">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent" />
              
              {/* Mockup Content */}
              <div className="relative space-y-6">
                <div className="h-4 w-32 bg-white/10 rounded-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
                  <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
                </div>
                <div className="h-48 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <div className="text-primary/40 font-mono text-xs tracking-tighter">
                    VISUAL_DATA_STREAM_01
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
                className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary/30 rounded-full blur-[60px] pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Floating Element 1 */}
          <motion.div 
            style={{ y: y2 }}
            className="absolute -top-12 -right-12 w-40 h-40 glass rounded-3xl p-6 flex flex-col justify-between border-white/10 shadow-2xl z-20"
          >
             <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <div className="w-4 h-4 bg-secondary rounded-full animate-pulse" />
             </div>
             <div className="space-y-2">
                <div className="h-2 w-full bg-white/10 rounded-full" />
                <div className="h-2 w-2/3 bg-white/10 rounded-full" />
             </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
         <div className="absolute top-[40%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         <div className="absolute top-[60%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </section>
  );
}
