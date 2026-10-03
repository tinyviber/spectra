import type { Metadata } from 'next'
import { htmlLang, locales, ogLocale, type Locale } from './i18n/config'
import { routes, siteConfig, type RouteKey } from './site'

type BuildMetadataInput = {
  locale: Locale
  route: RouteKey
  title: string
  description: string
  kind?: string
  absoluteTitle?: boolean
}

export function alternatesFor(path: string) {
  const languages: Record<string, string> = {}
  for (const l of locales) languages[htmlLang[l]] = `/${l}${path}`
  languages['x-default'] = `/en${path}`
  return languages
}

export function ogImageUrl({ title, locale, kind }: { title: string; locale: Locale; kind?: string }) {
  const params = new URLSearchParams({ title, locale })
  if (kind) params.set('kind', kind)
  return `/api/og?${params.toString()}`
}

export function buildMetadata({ locale, route, title, description, kind, absoluteTitle }: BuildMetadataInput): Metadata {
  const path = routes[route].path
  const canonical = `/${locale}${path}`
  const image = ogImageUrl({ title, locale, kind })

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages: alternatesFor(path) },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
