function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (production) return `https://${production}`
  const preview = process.env.VERCEL_URL
  if (preview) return `https://${preview}`
  return 'http://localhost:3000'
}

export const siteConfig = {
  name: 'Spectra',
  url: resolveSiteUrl(),
  email: 'hello@spectra.tools',
  twitter: '@spectratools',
  github: 'https://github.com/vercel',
  lastUpdated: '2026-10-01',
} as const

export type RouteKey =
  | 'home'
  | 'palette'
  | 'extract'
  | 'directory'
  | 'typeScale'
  | 'about'
  | 'privacy'
  | 'terms'

export const routes: Record<RouteKey, { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }> = {
  home: { path: '', priority: 1, changeFrequency: 'weekly' },
  palette: { path: '/tools/palette', priority: 0.9, changeFrequency: 'monthly' },
  extract: { path: '/tools/extract', priority: 0.9, changeFrequency: 'monthly' },
  directory: { path: '/directory', priority: 0.8, changeFrequency: 'weekly' },
  typeScale: { path: '/tools/type-scale', priority: 0.9, changeFrequency: 'monthly' },
  about: { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
  privacy: { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  terms: { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
}

export function localePath(locale: string, path: string) {
  return `/${locale}${path}`
}

export function absoluteUrl(path: string) {
  return `${siteConfig.url}${path}`
}
