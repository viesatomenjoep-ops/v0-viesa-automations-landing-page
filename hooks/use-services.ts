'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from './use-translation';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  sort_order: number;
  features_title?: string;
  features?: string;
}

export function useServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { languageId, isLoading: isLangLoading } = useTranslation();
  const supabase = createClient();

  useEffect(() => {
    if (languageId) {
      fetchServices(languageId);
    } else if (!isLangLoading) {
      setIsLoading(false);
    }
  }, [languageId, isLangLoading]);

  async function fetchServices(langId: string) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_items')
        .select(`
          id,
          icon_name,
          sort_order,
          translations:service_item_translations (
            title,
            description,
            features_title,
            features
          )
        `)
        .eq('service_item_translations.language_id', langId)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const formattedServices = (data || []).map((item: any) => ({
        id: item.id,
        icon_name: item.icon_name,
        sort_order: item.sort_order,
        title: item.translations[0]?.title || '',
        description: item.translations[0]?.description || '',
        features_title: item.translations[0]?.features_title || '',
        features: item.translations[0]?.features || '',
      }));

      setServices(formattedServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return { services, isLoading };
}
