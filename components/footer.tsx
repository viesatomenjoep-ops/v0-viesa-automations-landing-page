'use client';

import { Mail, Phone, MapPin, Github, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useNavigation } from '@/hooks/use-navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { items: serviceLinks } = useNavigation('footer_services');
  const { items: companyLinks } = useNavigation('footer_company');

  return (
    <footer className="bg-[#050505] border-t border-white/5 text-white pt-24 pb-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="#" className="flex items-center gap-3">
              <span className="text-2xl font-display font-bold tracking-tight">
                VIESA <span className="text-primary">Automations</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs font-sans">
              Transforming businesses through intelligent automation and high-end digital solutions. Your partner in the next era of tech.
            </p>
            <div className="flex gap-4">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -3, color: 'var(--primary)' }}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-xl glass border-white/5 text-muted-foreground transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-lg mb-8 tracking-tight">Diensten</h4>
            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} className="text-muted-foreground hover:text-primary transition-colors flex items-center group gap-2 font-sans">
                    {link.label}
                    {link.url.startsWith('http') && <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-lg mb-8 tracking-tight">Bedrijf</h4>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} className="text-muted-foreground hover:text-primary transition-colors font-sans">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-8 tracking-tight">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Mail size={18} className="text-primary" />
                </div>
                <a href="mailto:contact@viesa-automations.nl" className="text-muted-foreground group-hover:text-white transition-colors font-sans">
                  contact@viesa-automations.nl
                </a>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Phone size={18} className="text-primary" />
                </div>
                <a href="tel:+31612345678" className="text-muted-foreground group-hover:text-white transition-colors font-sans">
                  +31 6 12 34 56 78
                </a>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center mt-1">
                  <MapPin size={18} className="text-primary" />
                </div>
                <span className="text-muted-foreground font-sans pt-2">
                  Breda, Netherlands
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-12" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-xs font-mono tracking-widest uppercase">
            &copy; {currentYear} VIESA Automations. Crafted with Excellence.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
