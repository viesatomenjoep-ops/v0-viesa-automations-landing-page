'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
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
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto relative border border-slate-100"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors z-20 text-slate-400 hover:text-slate-900"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Left Side: Info */}
                <div className="md:w-1/3 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />

                  <div className="relative z-10">
                    <h2 className="text-3xl font-display font-bold mb-4 tracking-tight">{t('contact.title', 'Laten we bouwen.')}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {t('contact.subtitle', 'Deel uw visie en wij transformeren het in een digitale realiteit.')}
                    </p>
                  </div>

                  <div className="mt-20 relative z-10">
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
                <div className="md:w-2/3 p-10 relative">
                  <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                              {t('contact.label_first_name', 'Voornaam')}
                            </label>
                            <input
                              required
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
                            type="email"
                            placeholder={t('contact.label_email', 'email')}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            {t('contact.label_project_type', 'Project Type')}
                          </label>
                          <select className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 appearance-none">
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
                            rows={4}
                            placeholder={t('contact.label_description', 'Vertel ons kort over uw project en doelen...')}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 resize-none"
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 mt-4 group"
                        >
                          {t('contact.button_submit', 'Verstuur Aanvraag')}
                          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center py-20"
                      >
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
                          {t('contact.success_title', 'Aanvraag Ontvangen!')}
                        </h3>
                        <p className="text-slate-500">
                          {t('contact.success_message', 'We nemen binnen 24 uur contact met u op.')}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
