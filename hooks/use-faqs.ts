'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from './use-translation';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { languageId, isLoading: isLangLoading } = useTranslation();
  const supabase = createClient();

  useEffect(() => {
    if (languageId) {
      fetchFAQs(languageId);
    } else if (!isLangLoading) {
      setIsLoading(false);
    }
  }, [languageId, isLangLoading]);

  async function fetchFAQs(langId: string) {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('faq_items')
        .select(`
          id,
          translations:faq_item_translations (
            question,
            answer
          )
        `)
        .eq('faq_item_translations.language_id', langId)
        .order('sort_order', { ascending: true });

      const formatted = (data || []).map((item: any) => ({
        id: item.id,
        question: item.translations[0]?.question || '',
        answer: item.translations[0]?.answer || '',
      }));

      setFaqs(formatted);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return { faqs, isLoading };
}
