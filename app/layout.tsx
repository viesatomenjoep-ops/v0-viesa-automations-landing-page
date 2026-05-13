import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
});

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'VIESA Automations | IT Automation & High-End Digital Solutions',
  description: 'Van high-end websites tot complexe CRM-systemen: wij automatiseren uw groei van A tot Z. VIESA Automations - Your Partner in Digital Automation.',
  generator: 'v0.app',
  keywords: ['IT Automation', 'CRM Systems', 'Web Development', 'Business Optimization', 'VIESA Automations'],
  authors: [{ name: 'VIESA Automations' }],
  metadataBase: new URL('https://viesa-automations.nl'),
  alternates: {
    canonical: '/',
    languages: {
      'nl-NL': '/nl',
      'en-US': '/en',
      'es-ES': '/es',
    },
  },
  openGraph: {
    title: 'VIESA Automations | IT Automation Solutions',
    description: 'Transforming businesses through intelligent automation and high-end digital solutions.',
    url: 'https://viesa-automations.nl',
    siteName: 'VIESA Automations',
    images: [
      {
        url: '/viesa-logo.png',
        width: 1200,
        height: 630,
        alt: 'VIESA Automations Logo',
      },
    ],
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIESA Automations | IT Automation Solutions',
    description: 'Intelligent automation and high-end digital solutions.',
    images: ['/viesa-logo.png'],
  },
  icons: {
    icon: '/viesa-logo.png',
    apple: '/viesa-logo.png',
  },
}

import { TranslationProvider } from '@/hooks/use-translation';
import { Toaster } from '@/components/ui/sonner';
import { JsonLd } from '@/components/json-ld';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${outfit.variable} ${inter.variable} bg-background dark scroll-smooth`}>
      <body className="font-sans antialiased text-foreground selection:bg-primary selection:text-primary-foreground">
        <JsonLd />
        <TranslationProvider>
          {children}
        </TranslationProvider>
        <Toaster position="top-right" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
