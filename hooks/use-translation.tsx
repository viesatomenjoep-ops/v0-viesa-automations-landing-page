'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type Translations = Record<string, string>;

interface TranslationContextType {
  translations: Translations;
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, defaultValue?: string) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [translations, setTranslations] = useState<Translations>({});
  const [locale, setLocale] = useState<string>('nl'); // Default to Dutch
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Load locale from localStorage if available
    const savedLocale = localStorage.getItem('viesa_locale');
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('viesa_locale', locale);
    fetchTranslations();
  }, [locale]);

  async function fetchTranslations() {
    setIsLoading(true);
    try {
      // 1. Fetch the language ID for the current locale
      const { data: lang } = await supabase
        .from('languages')
        .select('id')
        .eq('code', locale)
        .single();
      
      if (!lang) return;

      // 2. Fetch all translations for this language
      // We join with content_keys and sections to get the full key (e.g., 'hero.title')
      const { data, error } = await supabase
        .from('translations')
        .select(`
          value,
          content_key:content_keys (
            key,
            section:sections (
              name
            )
          )
        `)
        .eq('language_id', lang.id);

      if (error) throw error;

      const transMap: Translations = {};
      data?.forEach((item: any) => {
        const sectionName = item.content_key.section.name;
        const keyName = item.content_key.key;
        transMap[`${sectionName}.${keyName}`] = item.value;
      });

      setTranslations(transMap);
    } catch (error: any) {
      console.error('Failed to fetch translations:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const t = (key: string, defaultValue: string = '') => {
    return translations[key] || defaultValue || key;
  };

  return (
    <TranslationContext.Provider value={{ translations, locale, setLocale, t, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
