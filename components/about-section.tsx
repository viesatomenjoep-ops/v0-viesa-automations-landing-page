'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export function AboutSection() {
  const { scrollY } = useScroll();

  return (
    <section id="over-ons" className="py-24 md:py-40 bg-white px-4 relative overflow-hidden">
      {/* Subtle decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-8 tracking-tight">
              Over <span className="text-primary">ons</span>
            </h2>

            <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-sans">
              <p>
                Viesa Automations ontwikkelt innovatieve automatiseringsoplossingen en digitale platformen voor bedrijven die sneller, slimmer en efficiënter willen werken. Sinds 2013 bouwt Viesa aan schaalbare software, procesoptimalisatie en slimme technologie voor uiteenlopende sectoren.
              </p>
              <p>
                Met jarenlange ervaring in programmeren en softwareontwikkeling beschikt het team over diepgaande technische expertise. Daarnaast heeft Viesa een eigen AI-model ontwikkeld, gebaseerd op praktijkervaring en geoptimaliseerde workflows. Hierdoor kan het team razendsnel ontwikkelen, processen automatiseren en hoogwaardige oplossingen realiseren tegen aanzienlijk lagere ontwikkelkosten.
              </p>
              <p>
                Viesa is actief binnen sectoren zoals retail & media, automotive, vastgoed, transport & logistiek, de equine sector en muziek & entertainment. Van slimme automatiseringen tot specialistische apps en digitale platformen: innovatie, snelheid en schaalbaarheid staan altijd centraal.
              </p>
            </div>
          </motion.div>

          {/* Visual Right - Abstract Mockups */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[600px] flex items-center justify-center"
          >
            {/* Website Mockup - Bottom Left */}
            <motion.div
              style={{ y: useTransform(scrollY, [1000, 2000], [0, -50]) }}
              className="absolute -bottom-10 -left-10 w-[300px] h-[220px] z-10 hidden md:block"
            >
              <div className="w-full h-full bg-white rounded-2xl border border-slate-100 overflow-hidden relative shadow-2xl">
                <div className="h-6 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                </div>
                <div className="p-4 space-y-4">
                  <div className="h-3 w-1/3 bg-primary/20 rounded-full" />
                  <div className="h-24 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-slate-50 rounded-lg border border-slate-100" />
                    <div className="h-12 bg-slate-50 rounded-lg border border-slate-100" />
                    <div className="h-12 bg-slate-50 rounded-lg border border-slate-100" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-4 text-[8px] font-mono text-slate-300 uppercase tracking-widest"></div>
              </div>
            </motion.div>

            {/* Portal/Dashboard Mockup - Center/Top */}
            <motion.div
              style={{ y: useTransform(scrollY, [1000, 2000], [0, 50]) }}
              className="relative w-full max-w-[450px] aspect-[4/3] z-20"
            >
              <div className="w-full h-full glass rounded-[40px] p-2 border-white/10 shadow-2xl">
                <div className="w-full h-full bg-[#0a0f1d] rounded-[32px] border border-white/5 overflow-hidden relative flex">
                  <div className="w-16 border-r border-white/5 p-4 space-y-6 hidden sm:block">
                    <div className="w-full aspect-square bg-primary/20 rounded-xl flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-4">
                      <div className="w-full h-1.5 bg-white/10 rounded-full" />
                      <div className="w-full h-1.5 bg-white/10 rounded-full" />
                      <div className="w-full h-1.5 bg-white/10 rounded-full" />
                      <div className="w-1/2 h-1.5 bg-white/10 rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 p-8 space-y-8">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-32 bg-white/10 rounded-full" />
                      <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                        <div className="w-4 h-4 bg-primary rounded-sm" />
                      </div>
                    </div>
                    <div className="h-32 bg-primary/5 rounded-2xl border border-primary/10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                      <div className="absolute bottom-4 left-6 h-2 w-24 bg-primary/40 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-white/5 rounded-2xl border border-white/5" />
                      <div className="h-20 bg-white/5 rounded-2xl border border-white/5" />
                    </div>
                    <div className="absolute bottom-4 right-8 text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* App Mockup - Bottom Right */}
            <motion.div
              style={{ y: useTransform(scrollY, [1000, 2000], [0, -80]) }}
              className="absolute -bottom-16 -right-8 w-[200px] h-[400px] z-30 hidden sm:block"
            >
              <div className="w-full h-full bg-white rounded-[45px] border-[6px] border-slate-900 overflow-hidden relative p-6 shadow-2xl">
                <div className="w-24 h-6 bg-slate-900 rounded-b-2xl absolute top-0 left-1/2 -translate-x-1/2 z-10" />
                <div className="mt-8 space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <div className="w-6 h-6 bg-white/20 rounded-full animate-ping" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-900 rounded-full" />
                    <div className="h-3 w-2/3 bg-slate-900 rounded-full" />
                  </div>
                  <div className="h-2 w-1/2 bg-slate-400 rounded-full" />
                  <div className="pt-6 grid grid-cols-1 gap-3">
                    <div className="h-14 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm" />
                    <div className="h-14 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm" />
                    <div className="h-14 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center font-bold text-xs tracking-widest">
                      CONTINUE
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-200 rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
