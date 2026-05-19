'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
          setIsSubmitted(false);
          onClose();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <div 
            className="fixed inset-0 z-[110] overflow-y-auto"
            onClick={onClose}
          >
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-2xl rounded-3xl md:rounded-[48px] shadow-2xl overflow-hidden relative border border-slate-100 my-auto"
              >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-slate-50 rounded-full transition-colors z-20 text-slate-400 hover:text-slate-900"
              >
                <X size={24} />
              </button>
 
              <div className="flex flex-col md:flex-row h-full">
                {/* Left Side: Info */}
                <div className="md:w-1/3 bg-slate-900 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
 
                  <div className="relative z-10">
                    <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 tracking-tight">{t('contact.title', 'Laten we bouwen.')}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {t('contact.subtitle', 'Deel uw visie en wij transformeren het in een digitale realiteit.')}
                    </p>
                  </div>
 
                  <div className="mt-8 md:mt-20 relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <CheckCircle2 size={14} className="text-primary" />
                        <span>{t('contact.feature_1', 'Snelle opvolging binnen 24u')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <CheckCircle2 size={14} className="text-primary" />
                        <span>{t('contact.feature_2', 'Gratis consultgesprek')}</span>
                      </div>
                    </div>
                  </div>
                </div>
 
                {/* Right Side: Form */}
                <div className="md:w-2/3 p-8 md:p-10 relative">
                  <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-4 md:space-y-5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                              {t('contact.label_first_name', 'Voornaam')}
                            </label>
                            <input
                              required
                              name="firstName"
                              type="text"
                              placeholder={t('contact.label_first_name', 'Voornaam')}
                              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                              {t('contact.label_last_name', 'Achternaam')}
                            </label>
                            <input
                              required
                              name="lastName"
                              type="text"
                              placeholder={t('contact.label_last_name', 'Achternaam')}
                              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
                            />
                          </div>
                        </div>
 
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            {t('contact.label_email', 'E-mailadres')}
                          </label>
                          <input
                            required
                            name="email"
                            type="email"
                            placeholder={t('contact.label_email', 'email')}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
                          />
                        </div>
 
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            {t('contact.label_project_type', 'Project Type')}
                          </label>
                          <select 
                            name="projectType"
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 appearance-none"
                          >
                            <option>Website / Platform</option>
                            <option>CRM / ERP Systeem</option>
                            <option>AI Chatbot / Automatisering</option>
                            <option>Mobiele Applicatie</option>
                            <option>Anders</option>
                          </select>
                        </div>
 
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            {t('contact.label_description', 'Beschrijving')}
                          </label>
                          <textarea
                            required
                            name="description"
                            rows={3}
                            placeholder={t('contact.label_description', 'Vertel ons kort over uw project en doelen...')}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 resize-none"
                          ></textarea>
                        </div>
 
                        {error && (
                          <p className="text-red-500 text-xs font-medium ml-1">{error}</p>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 mt-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              {t('contact.button_submit', 'Verstuur Aanvraag')}
                              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center py-12 md:py-20"
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
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    )}
    </AnimatePresence>
  );
}
