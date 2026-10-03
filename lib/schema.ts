import { htmlLang, type Locale } from './i18n/config'
import { absoluteUrl, siteConfig } from './site'

type Thing = Record<string, unknown>

export function organizationSchema(): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl('/icon.svg'),
    sameAs: [siteConfig.github],
  }
}

export function websiteSchema(locale: Locale, description: string): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl(`/${locale}#website`),
    name: siteConfig.name,
    url: absoluteUrl(`/${locale}`),
    description,
    inLanguage: htmlLang[locale],
    publisher: { '@id': absoluteUrl('/#organization') },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: absoluteUrl(`/${locale}/directory?q={search_term_string}`) },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function webApplicationSchema({
  locale,
  name,
  description,
  path,
}: {
  locale: Locale
  name: string
  description: string
  path: string
}): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: absoluteUrl(`/${locale}${path}`),
    inLanguage: htmlLang[locale],
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function itemListSchema(items: { name: string; url: string; description: string }[]): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: { '@type': 'WebSite', name: item.name, url: item.url, description: item.description },
    })),
  }
}

export function webPageSchema({ locale, name, description, path, type = 'WebPage' }: {
  locale: Locale
  name: string
  description: string
  path: string
  type?: 'WebPage' | 'AboutPage'
}): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url: absoluteUrl(`/${locale}${path}`),
    inLanguage: htmlLang[locale],
    isPartOf: { '@id': absoluteUrl(`/${locale}#website`) },
    dateModified: siteConfig.lastUpdated,
  }
}
