'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  ServicesEditor,
  FAQEditor,
  TextSectionEditor,
  ProcessEditor,
  USPEditor,
  ContactEditor,
  TrustEditor,
  NavigationEditor,
  PortfolioEditor
} from '@/components/admin/list-editors';
import { HeroEditor } from '@/components/admin/hero-editor';
import { AboutEditor } from '@/components/admin/about-editor';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  LayoutDashboard,
  Sparkles,
  HelpCircle,
  Settings,
  Zap,
  Users,
  ShieldCheck,
  Menu as MenuIcon,
  Layout,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminEditorPage() {
  const [languages, setLanguages] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('languages').select('*').order('code', { ascending: true })
      .then(({ data }) => setLanguages(data || []));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight mb-2">Website Editor</h1>
        <p className="text-slate-500">Beheer alle content van je landingspagina vanaf één plek.</p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {/* Navigation Section */}
        <AccordionItem value="navigation" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <MenuIcon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Header Navigatie</h3>
                <p className="text-sm text-slate-400 font-normal">Beheer de menu items in de bovenbalk</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <NavigationEditor languages={languages} menuType="header" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hero" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Hero Sectie</h3>
                <p className="text-sm text-slate-400 font-normal">De eerste indruk van je website</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <HeroEditor languages={languages} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="services" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100/50 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Diensten</h3>
                <p className="text-sm text-slate-400 font-normal">Wat je aanbiedt aan je klanten</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <ServicesEditor languages={languages} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="process" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100/50 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Ons Proces</h3>
                <p className="text-sm text-slate-400 font-normal">De stappen die we samen doorlopen</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <ProcessEditor languages={languages} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="usps" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Waarom Viesa</h3>
                <p className="text-sm text-slate-400 font-normal">Onze unieke verkooppunten (USP's)</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <USPEditor languages={languages} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="about" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Over Ons</h3>
                <p className="text-sm text-slate-400 font-normal">Onze missie, visie en bedrijfsverhaal</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <AboutEditor languages={languages} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <HelpCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">FAQ</h3>
                <p className="text-sm text-slate-400 font-normal">Veelgestelde vragen en antwoorden</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <FAQEditor languages={languages} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100/50 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                <HelpCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Contact Modal</h3>
                <p className="text-sm text-slate-400 font-normal">Teksten voor het contactformulier</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <ContactEditor languages={languages} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="portfolio" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100/50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <ImageIcon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Portfolio</h3>
                <p className="text-sm text-slate-400 font-normal">Showcase je projecten en cases</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <PortfolioEditor languages={languages} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="partners" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100/50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Partners & Vertrouwen</h3>
                <p className="text-sm text-slate-400 font-normal">Bedrijven waar we mee samenwerken</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <TrustEditor />
          </AccordionContent>
        </AccordionItem>

        {/* Footer Sections */}
        <AccordionItem value="footer_services" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                <Layout size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Footer Diensten</h3>
                <p className="text-sm text-slate-400 font-normal">Beheer de diensten-links in de footer</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <NavigationEditor languages={languages} menuType="footer_services" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="footer_company" className="border-none bg-white rounded-[32px] px-8 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <AccordionTrigger className="hover:no-underline py-6 group">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                <Layout size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Footer Bedrijf</h3>
                <p className="text-sm text-slate-400 font-normal">Beheer de bedrijfs-links in de footer</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-10 pt-4">
            <NavigationEditor languages={languages} menuType="footer_company" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
