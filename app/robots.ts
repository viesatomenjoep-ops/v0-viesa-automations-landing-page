import { MetadataRoute } from 'next'
import { PORTFOLIO_ENABLED } from '@/lib/feature-flags'

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin/']
  if (!PORTFOLIO_ENABLED) {
    disallow.push('/portfolio')
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow,
    },
    sitemap: 'https://viesa-automations.nl/sitemap.xml',
  }
}
