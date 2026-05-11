'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from './use-translation';

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  sort_order: number;
}

export function useProcess() {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useTranslation();
  const supabase = createClient();

  useEffect(() => {
    fetchProcess();
  }, [locale]);

  async function fetchProcess() {
    setIsLoading(true);
    try {
      const { data: lang } = await supabase.from('languages').select('id').eq('code', locale).single();
      if (!lang) return;

      const { data } = await supabase
        .from('process_steps')
        .select(`
          id,
          sort_order,
          translations:process_step_translations (
            title,
            description
          )
        `)
        .eq('process_step_translations.language_id', lang.id)
        .order('sort_order', { ascending: true });

      const formatted = (data || []).map((item: any) => ({
        id: item.id,
        sort_order: item.sort_order,
        title: item.translations[0]?.title || '',
        description: item.translations[0]?.description || '',
      }));

      setSteps(formatted);
    } catch (error) {
      console.error('Failed to fetch process steps:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return { steps, isLoading };
}
