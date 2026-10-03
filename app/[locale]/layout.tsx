import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { JsonLd } from '@/components/seo/json-ld'
import { Toaster } from '@/components/ui/sonner'
import { I18nProvider } from '@/lib/i18n/client'
import { htmlLang, isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { organizationSchema, websiteSchema } from '@/lib/schema'
import { siteConfig } from '@/lib/site'
import '../globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

type LayoutProps = { children: React.ReactNode; params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: dict.home.metaTitle, template: `%s · ${siteConfig.name}` },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    generator: 'v0.app',
    formatDetection: { telephone: false, email: false, address: false },
    robots: siteConfig.indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } }
      : { index: false, follow: false },
    icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }] },
    manifest: '/manifest.webmanifest',
  }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfcfe' },
    { media: '(prefers-color-scheme: dark)', color: '#12141b' },
  ],
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <html lang={htmlLang[locale]} className={`${geist.variable} ${geistMono.variable} bg-background`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider locale={locale}>
            <a
              href="#main"
              className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              {dict.nav.skip}
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter locale={locale} />
            <Toaster position="bottom-center" />
          </I18nProvider>
        </ThemeProvider>
        <JsonLd data={[organizationSchema(), websiteSchema(locale, dict.meta.description)]} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
