'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from './use-translation';

export interface NavItem {
  id: string;
  label: string;
  url: string;
  sort_order: number;
}

export function useNavigation(menuType: string) {
  const [items, setItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useTranslation();
  const supabase = createClient();

  useEffect(() => {
    fetchNavigation();
  }, [locale, menuType]);

  async function fetchNavigation() {
    setIsLoading(true);
    try {
      const { data: lang } = await supabase.from('languages').select('id').eq('code', locale).single();
      if (!lang) return;

      const { data } = await supabase
        .from('navigation_items')
        .select(`
          id,
          url,
          sort_order,
          translations:navigation_item_translations (
            label,
            language_id
          )
        `)
        .eq('menu_type', menuType)
        .order('sort_order', { ascending: true });

      const formatted = (data || []).map((item: any) => ({
        id: item.id,
        url: item.url,
        sort_order: item.sort_order,
        label: item.translations.find((t: any) => t.language_id === lang.id)?.label || '',
      }));

      setItems(formatted);
    } catch (error) {
      console.error(`Failed to fetch navigation items for ${menuType}:`, error);
    } finally {
      setIsLoading(false);
    }
  }

  return { items, isLoading };
}
