import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PORTFOLIO_ENABLED } from '@/lib/feature-flags'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://viesa-automations.nl'

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  if (!PORTFOLIO_ENABLED) {
    return staticUrls
  }

  const supabase = await createClient()

  const { data: portfolioItems } = await supabase
    .from('portfolio_items')
    .select('id, updated_at')

  const portfolioUrls = (portfolioItems || []).map((item) => ({
    url: `${baseUrl}/portfolio/${item.id}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticUrls,
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...portfolioUrls,
  ]
}
