'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Server, Zap, Smartphone, ArrowUpRight, X, Send, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useServices } from '@/hooks/use-services';

const iconMap: Record<string, any> = {
  Globe,
  Server,
  Zap,
  Smartphone
};

const serviceCardStyles = [
  { className: 'md:col-span-2 md:row-span-2', color: 'from-primary/20 to-transparent' },
  { className: 'md:col-span-1 md:row-span-2', color: 'from-secondary/20 to-transparent' },
  { className: 'md:col-span-1 md:row-span-2', color: 'from-primary/20 to-transparent' },
  { className: 'md:col-span-1 md:row-span-1', color: 'from-secondary/20 to-transparent' },
];

const WebsiteMockup = () => (
  <div className="absolute right-[-5%] bottom-[-10%] w-[70%] h-[75%] bg-white/5 border border-white/10 rounded-t-xl overflow-hidden shadow-2xl rotate-[-5deg] pointer-events-none transition-transform duration-700 group-hover:rotate-[-2deg] group-hover:scale-105 group-hover:bg-white/10 z-0">
    <div className="h-5 bg-white/5 border-b border-white/10 flex items-center px-3 gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
    </div>
    <div className="p-3 space-y-2">
      <div className="h-12 bg-white/5 rounded-md" />
      <div className="flex gap-2">
        <div className="h-16 w-1/3 bg-white/5 rounded-md" />
        <div className="h-16 w-2/3 bg-white/5 rounded-md" />
      </div>
    </div>
  </div>
);

const AppMockup = () => (
  <div className="absolute right-[5%] bottom-[-20%] w-[45%] h-[90%] bg-slate-900 border-[3px] border-slate-700/50 rounded-[28px] overflow-hidden shadow-2xl rotate-[10deg] pointer-events-none transition-transform duration-700 group-hover:rotate-[5deg] group-hover:scale-105 group-hover:border-slate-600/50 z-0">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-3 bg-slate-700/50 rounded-b-lg" />
    <div className="p-3 pt-6 space-y-3">
      <div className="h-10 bg-white/10 rounded-lg" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-12 bg-white/5 rounded-lg" />
        <div className="h-12 bg-white/5 rounded-lg" />
        <div className="h-12 bg-white/5 rounded-lg" />
        <div className="h-12 bg-white/5 rounded-lg" />
      </div>
      <div className="h-16 bg-primary/20 rounded-lg" />
    </div>
  </div>
);

const DashboardMockup = () => (
  <div className="absolute right-[-10%] bottom-[-5%] w-[85%] h-[75%] bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl rotate-[-8deg] flex pointer-events-none transition-transform duration-700 group-hover:rotate-[-4deg] group-hover:scale-105 z-0">
    <div className="w-1/4 h-full bg-white/5 border-r border-white/10 p-2 space-y-2">
      <div className="h-2 w-1/2 bg-white/20 rounded" />
      <div className="h-1.5 w-full bg-white/10 rounded mt-4" />
      <div className="h-1.5 w-full bg-white/10 rounded" />
      <div className="h-1.5 w-4/5 bg-white/10 rounded" />
    </div>
    <div className="w-3/4 p-3 space-y-3">
      <div className="h-3 w-1/3 bg-white/20 rounded" />
      <div className="flex gap-2">
        <div className="h-12 w-1/2 bg-white/5 rounded-md" />
        <div className="h-12 w-1/2 bg-primary/20 rounded-md" />
      </div>
      <div className="h-20 bg-white/5 rounded-md flex items-end p-2 gap-1.5">
        <div className="w-full h-[30%] bg-white/10 rounded-t-sm" />
        <div className="w-full h-[50%] bg-white/10 rounded-t-sm" />
        <div className="w-full h-[80%] bg-primary/40 rounded-t-sm animate-pulse" />
        <div className="w-full h-[60%] bg-white/10 rounded-t-sm" />
      </div>
    </div>
  </div>
);

const AutomationMockup = () => (
  <div className="absolute right-[0%] bottom-[0%] w-[80%] h-[80%] pointer-events-none opacity-30 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-50 z-0">
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0">
      <path d="M 40 160 C 80 160 80 40 120 40" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/50" />
      <path d="M 40 160 C 80 160 120 100 160 100" stroke="currentColor" strokeWidth="2" fill="none" className="text-white/20" />

      <circle cx="40" cy="160" r="8" fill="#0f172a" stroke="currentColor" strokeWidth="2" className="text-white/50" />
      <circle cx="120" cy="40" r="12" fill="#0f172a" stroke="currentColor" strokeWidth="3" className="text-primary" />
      <circle cx="160" cy="100" r="8" fill="#0f172a" stroke="currentColor" strokeWidth="2" className="text-white/50" />
    </svg>
  </div>
);

const getMockup = (iconName: string) => {
  switch (iconName) {
    case 'Globe': return <WebsiteMockup />;
    case 'Smartphone': return <AppMockup />;
    case 'Server': return <DashboardMockup />;
    case 'Zap': return <AutomationMockup />;
    default: return null;
  }
};

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
  const { t } = useTranslation();
  const { services, isLoading } = useServices();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    setSelectedService(null);
    setTimeout(() => {
      setShowContactForm(false);
      setIsSubmitted(false);
      setError(null);
    }, 300); // reset after animation
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          closeModal();
        }, 5000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Er is iets misgegaan. Probeer het later opnieuw.');
      }
    } catch (err) {
      setError('Netwerkfout. Controleer uw verbinding.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  return (
    <section id="services" className="py-24 md:py-40 bg-white px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="hidden md:block absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight">
            {t('services.header_title', 'Onze Expertise')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
            {t('services.header_subtitle', 'Wij bouwen de digitale ruggengraat van uw onderneming met moderne technologie en slimme automatisering.')}
          </p>
        </motion.div>

        {/* Bento Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto md:auto-rows-[240px] animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`bg-slate-100 rounded-3xl ${i === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-2'}`}
                style={{ minHeight: '240px' }}
              />
            ))}
          </div>
        ) : services.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto md:auto-rows-[240px]"
          >
            {services.map((service, index) => {
              const Icon = iconMap[service.icon_name] || Globe;
              const style = serviceCardStyles[index % serviceCardStyles.length];

              return (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => setSelectedService(service)}
                  className={`group relative bg-[#0a0f1c] bg-gradient-to-br ${style.color} border border-white/10 rounded-3xl p-8 overflow-hidden flex flex-col justify-between transition-all duration-500 shadow-xl cursor-pointer ${style.className}`}
                >
                  {/* Background Mockup */}
                  {getMockup(service.icon_name)}

                  <div className="relative z-10">
                    <div className="mb-6 inline-block p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/30 transition-colors backdrop-blur-sm">
                      <Icon size={28} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-3 flex items-center gap-2 drop-shadow-md">
                      {service.title}
                      <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1 text-white" />
                    </h3>
                    <p className="text-white/90 leading-relaxed max-w-[85%] relative z-10 drop-shadow-sm font-light">
                      {service.description}
                    </p>
                  </div>


                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-slate-900/60 md:bg-slate-900/40 md:backdrop-blur-md"
            />
            
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>
              
              {/* Left Side: Mockup / Graphic */}
              <div className="md:w-1/2 bg-[#0a0f1c] relative p-8 min-h-[300px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
                {getMockup(selectedService.icon_name)}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent opacity-50 z-10" />
              </div>
              
              {/* Right Side: Content */}
              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {!showContactForm ? (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col h-full"
                    >
                      <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-6 self-start">
                        {(() => {
                          const SelectedIcon = iconMap[selectedService.icon_name] || Globe;
                          return <SelectedIcon size={32} />;
                        })()}
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight">
                        {selectedService.title}
                      </h2>
                      <p className="text-slate-600 text-lg leading-relaxed mb-8">
                        {selectedService.description}
                      </p>
                      
                      <div className="space-y-6 mb-10 flex-grow">
                        {selectedService.features_title && (
                          <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">
                            {selectedService.features_title}
                          </h4>
                        )}
                        {selectedService.features && (
                          <ul className="space-y-4">
                            {selectedService.features.split('\n').filter((f: string) => f.trim() !== '').map((feature: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-3 text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                <span>{feature.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => setShowContactForm(true)}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 mt-auto"
                      >
                        Start uw Project
                        <ArrowUpRight size={20} />
                      </button>
                    </motion.div>
                  ) : isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center py-12"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 mb-2">
                        {t('contact.success_title', 'Aanvraag Ontvangen!')}
                      </h3>
                      <p className="text-slate-500 text-sm md:text-base">
                        {t('contact.success_message', 'We nemen binnen 24 uur contact met u op.')}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleSubmit}
                      className="space-y-4 flex flex-col h-full justify-center"
                    >
                      <button 
                        type="button" 
                        onClick={() => setShowContactForm(false)} 
                        className="text-sm text-slate-500 flex items-center gap-2 mb-2 hover:text-slate-900 transition-colors self-start"
                      >
                        ← Terug naar details
                      </button>

                      <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">Project starten: {selectedService.title}</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Voornaam</label>
                          <input required name="firstName" type="text" placeholder="Voornaam" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Achternaam</label>
                          <input required name="lastName" type="text" placeholder="Achternaam" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900" />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">E-mailadres</label>
                        <input required name="email" type="email" placeholder="E-mailadres" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900" />
                      </div>
                      
                      <input type="hidden" name="projectType" value={selectedService.title} />
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Beschrijving</label>
                        <textarea required name="description" rows={3} placeholder="Vertel ons kort over uw project en doelen..." className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 resize-none"></textarea>
                      </div>
                      
                      {error && <p className="text-red-500 text-xs font-medium ml-1">{error}</p>}
                      
                      <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 mt-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Verstuur Aanvraag
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
