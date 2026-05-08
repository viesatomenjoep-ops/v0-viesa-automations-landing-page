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
  title: 'VIESA Automations | IT Automation Solutions',
  description: 'Van high-end websites tot complexe CRM-systemen: wij automatiseren uw groei van A tot Z. VIESA Automations - Your Partner in Digital Automation.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${outfit.variable} ${inter.variable} bg-background dark`}>
      <body className="font-sans antialiased text-foreground selection:bg-primary selection:text-primary-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
