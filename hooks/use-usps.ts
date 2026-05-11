'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from './use-translation';

export interface USPItem {
  id: string;
  title: string;
  description: string;
  icon_name: string;
}

export function useUSPs() {
  const [usps, setUsps] = useState<USPItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useTranslation();
  const supabase = createClient();

  useEffect(() => {
    fetchUSPs();
  }, [locale]);

  async function fetchUSPs() {
    setIsLoading(true);
    try {
      const { data: lang } = await supabase.from('languages').select('id').eq('code', locale).single();
      if (!lang) return;

      const { data } = await supabase
        .from('usp_items')
        .select(`
          id,
          icon_name,
          translations:usp_item_translations (
            title,
            description
          )
        `)
        .eq('usp_item_translations.language_id', lang.id)
        .order('sort_order', { ascending: true });

      const formatted = (data || []).map((item: any) => ({
        id: item.id,
        icon_name: item.icon_name,
        title: item.translations[0]?.title || '',
        description: item.translations[0]?.description || '',
      }));

      setUsps(formatted);
    } catch (error) {
      console.error('Failed to fetch USPs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return { usps, isLoading };
}
