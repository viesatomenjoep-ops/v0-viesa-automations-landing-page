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
}

export function useServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useTranslation();
  const supabase = createClient();

  useEffect(() => {
    fetchServices();
  }, [locale]);

  async function fetchServices() {
    setIsLoading(true);
    try {
      const { data: lang } = await supabase
        .from('languages')
        .select('id')
        .eq('code', locale)
        .single();
      
      if (!lang) return;

      const { data, error } = await supabase
        .from('service_items')
        .select(`
          id,
          icon_name,
          sort_order,
          translations:service_item_translations (
            title,
            description
          )
        `)
        .eq('service_item_translations.language_id', lang.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const formattedServices = (data || []).map((item: any) => ({
        id: item.id,
        icon_name: item.icon_name,
        sort_order: item.sort_order,
        title: item.translations[0]?.title || '',
        description: item.translations[0]?.description || '',
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
