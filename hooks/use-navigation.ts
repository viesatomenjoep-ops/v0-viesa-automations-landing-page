'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isPortfolioUrl, PORTFOLIO_ENABLED } from '@/lib/feature-flags';
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
  const { languageId, isLoading: isLangLoading } = useTranslation();
  const supabase = createClient();

  useEffect(() => {
    if (languageId) {
      fetchNavigation(languageId);
    } else if (!isLangLoading) {
      setIsLoading(false);
    }
  }, [languageId, menuType, isLangLoading]);

  async function fetchNavigation(langId: string) {
    setIsLoading(true);
    try {
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
        label: item.translations.find((t: any) => t.language_id === langId)?.label || '',
      }));

      const visibleItems = PORTFOLIO_ENABLED
        ? formatted
        : formatted.filter((item) => !isPortfolioUrl(item.url));

      setItems(visibleItems);
    } catch (error) {
      console.error(`Failed to fetch navigation items for ${menuType}:`, error);
    } finally {
      setIsLoading(false);
    }
  }

  return { items, isLoading };
}
