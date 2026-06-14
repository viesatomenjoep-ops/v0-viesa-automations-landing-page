'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type Translations = Record<string, string>;

interface TranslationContextType {
  translations: Translations;
  locale: string;
  languageId: string | null;
  setLocale: (locale: string) => void;
  t: (key: string, defaultValue?: string) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [translations, setTranslations] = useState<Translations>({});
  const [locale, setLocale] = useState<string>('nl'); // Default to Dutch
  const [languageId, setLanguageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const savedLocale = localStorage.getItem('viesa_locale');
    if (savedLocale) {
      setLocale(savedLocale);
    } else {
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      // Default to browser language; fetchTranslations will fall back to 'nl' if not found
      setLocale(browserLang || 'nl');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('viesa_locale', locale);
    fetchTranslations(locale);
  }, [locale]);

  async function fetchTranslations(targetLocale: string) {
    setIsLoading(true);
    try {
      // Single query: get language ID + all its translations in one round trip
      const { data: langData, error: langError } = await supabase
        .from('languages')
        .select(`
          id,
          translations (
            value,
            content_key:content_keys (
              key,
              section:sections (
                name
              )
            )
          )
        `)
        .eq('code', targetLocale)
        .limit(1)
        .single();

      // If locale not found, retry with 'nl' fallback
      if (langError || !langData) {
        if (targetLocale !== 'nl') {
          await fetchTranslations('nl');
          return;
        }
        console.warn(`Language not found for locale: ${targetLocale}`);
        setIsLoading(false);
        return;
      }

      setLanguageId(langData.id);

      const transMap: Translations = {};
      langData.translations?.forEach((item: any) => {
        const sectionName = item.content_key?.section?.name;
        const keyName = item.content_key?.key;
        if (!sectionName || !keyName) return;

        const fullKey = keyName.startsWith(`${sectionName}.`)
          ? keyName
          : `${sectionName}.${keyName}`;

        transMap[fullKey] = item.value;
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
    <TranslationContext.Provider value={{ translations, locale, languageId, setLocale, t, isLoading }}>
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
