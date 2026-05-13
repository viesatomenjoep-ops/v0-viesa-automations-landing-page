import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = 'https://viesa-automations.nl'

  // Fetch all portfolio items for dynamic routes
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
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...portfolioUrls,
  ]
}
