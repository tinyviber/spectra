import type { MetadataRoute } from 'next'
import { htmlLang, locales } from '@/lib/i18n/config'
import { absoluteUrl, routes, siteConfig } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(siteConfig.lastUpdated)

  return Object.values(routes).flatMap((route) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${route.path}`),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [htmlLang[l], absoluteUrl(`/${l}${route.path}`)])),
      },
    })),
  )
}
