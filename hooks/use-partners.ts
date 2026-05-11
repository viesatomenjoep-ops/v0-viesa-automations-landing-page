'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Partner {
  id: string;
  name: string;
  logo_url?: string;
}

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('partners')
        .select('*')
        .order('sort_order', { ascending: true });
      
      setPartners(data || []);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return { partners, isLoading };
}
