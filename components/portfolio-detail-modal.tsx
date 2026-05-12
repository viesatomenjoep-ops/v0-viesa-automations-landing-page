'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ArrowRight, Calendar, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

interface PortfolioDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  languageId: string | null;
  onContactClick: () => void;
}

export function PortfolioDetailModal({ isOpen, onClose, item, languageId, onContactClick }: PortfolioDetailModalProps) {
  const { t } = useTranslation();
  if (!item) return null;

  const trans = item.translations?.find((tr: any) => tr.language_id === languageId) || item.translations?.[0];

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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 md:p-8 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white w-full max-w-5xl rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden pointer-events-auto relative border border-slate-100 my-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md hover:bg-slate-50 rounded-full transition-all z-20 text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col">
                {/* Visual Side */}
                <div className="w-full aspect-[16/10] md:aspect-[21/9] relative bg-slate-100 overflow-hidden group">
                  <img
                    src={item.image_url}
                    alt={trans?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                  
                  {/* Floating Tags over image */}
                  <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex flex-wrap gap-2">
                    <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest">
                      Case Study
                    </div>
                    <div className="px-4 py-2 rounded-full bg-primary/80 backdrop-blur-md border border-primary/30 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest">
                      Success Story
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full p-8 md:p-16 bg-white relative">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs md:text-sm mb-6 uppercase tracking-widest">
                      <Tag size={16} />
                      <span>{t('portfolio.case_study', 'Project Details')}</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-10 tracking-tight leading-tight">
                      {trans?.title || 'Project'}
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-8">
                        <div className="text-slate-600 text-lg md:text-xl leading-relaxed">
                          {trans?.description}
                        </div>
                      </div>

                      <div className="space-y-10">
                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 gap-8 py-8 border-y border-slate-50">
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Platform</div>
                            <div className="text-slate-900 font-bold text-lg">VIESA Automations</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</div>
                            <div className="text-slate-900 font-bold text-lg">Digital Solutions</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Button 
                            onClick={onContactClick}
                            size="lg" 
                            className="w-full bg-primary text-white hover:bg-primary/90 font-bold rounded-2xl h-14 text-sm md:text-base shadow-xl shadow-primary/20 transition-all group"
                          >
                            <MessageCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                            <span className="hidden sm:inline">{t('portfolio.start_similar', 'Start een vergelijkbaar project')}</span>
                            <span className="sm:hidden">{t('portfolio.contact_short', 'Contact')}</span>
                            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform h-4 w-4 md:h-5 md:w-5" />
                          </Button>
                          <p className="text-center text-[10px] md:text-xs text-slate-400 font-medium">
                            {t('portfolio.consultation_free', 'Vrijblijvend kennismakingsgesprek binnen 24u')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
