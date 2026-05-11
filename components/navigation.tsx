'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ArrowRight, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactModal } from './contact-modal';
import { useTranslation } from '@/hooks/use-translation';
import { useNavigation } from '@/hooks/use-navigation';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { locale, setLocale, t } = useTranslation();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const { items: navLinks } = useNavigation('header');

  const languages = [
    { code: 'nl', name: 'Nederlands' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative flex justify-between items-center h-16 px-6 rounded-full transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-2xl border border-slate-100' : 'bg-transparent'
          }`}>
          {/* Logo */}
          <Link href="#" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="relative w-10 h-10"
            >
              <Image
                src="/viesa-logo.png"
                alt="VIESA Automations Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </motion.div>
            <span className="text-xl font-display font-bold text-slate-900 tracking-tight">
              VIESA <span className="text-primary">Automations</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-all px-4 py-2 rounded-full hover:bg-slate-50 border border-slate-100/50"
              >
                <Globe size={14} className="opacity-60" />
                <span className="uppercase tracking-widest">{currentLang.code}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-40 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-1.5"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLocale(lang.code);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all ${currentLang.code === lang.code
                          ? 'bg-primary text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                          }`}
                      >
                        <span>{lang.name}</span>
                        {currentLang.code === lang.code && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsContactOpen(true)}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm flex items-center gap-2"
            >
              Contact
              <ArrowRight size={16} />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-900 p-2 glass rounded-full"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-4 p-6 bg-white/95 backdrop-blur-2xl rounded-3xl space-y-4 shadow-2xl border border-slate-100"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  className="block text-lg font-medium text-slate-900 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code);
                      setIsOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${currentLang.code === lang.code
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-slate-50 border-transparent text-slate-500'
                      }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">{lang.code}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsContactOpen(true);
                  setIsOpen(false);
                }}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold flex items-center justify-center gap-2"
              >
                Contact
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </nav>
  );
}
