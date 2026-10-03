import Link from 'next/link'
import { Logo } from '@/components/brand/logo'
import type { Locale } from '@/lib/i18n/config'
import { localeLabels, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { routes, siteConfig } from '@/lib/site'
import { tools } from '@/lib/tools'

const STRIP = ['bg-primary', 'bg-chart-2', 'bg-chart-3', 'bg-highlight', 'bg-foreground']

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const year = new Date(siteConfig.lastUpdated).getFullYear()

  const columns = [
    {
      title: dict.footer.tools,
      links: tools.map((tool) => ({ href: `/${locale}${tool.path}`, label: dict.home.tools[tool.key].title })),
    },
    {
      title: dict.footer.resources,
      links: [
        { href: `/${locale}${routes.directory.path}`, label: dict.nav.directory },
        { href: `/${locale}${routes.about.path}`, label: dict.nav.about },
        { href: '/sitemap.xml', label: dict.footer.sitemap },
      ],
    },
    {
      title: dict.footer.legal,
      links: [
        { href: `/${locale}${routes.privacy.path}`, label: dict.privacy.title },
        { href: `/${locale}${routes.terms.path}`, label: dict.terms.title },
      ],
    },
  ]

  return (
    <footer className="mt-24 border-t bg-muted/40">
      <div aria-hidden="true" className="flex h-1.5">
        {STRIP.map((c) => (
          <span key={c} className={`flex-1 ${c}`} />
        ))}
      </div>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-6">
        <div className="flex flex-col gap-4">
          <Logo className="text-lg" />
          <p className="max-w-xs text-sm leading-relaxed text-pretty text-muted-foreground">{dict.footer.tagline}</p>
          <a href={`mailto:${siteConfig.email}`} className="w-fit font-mono text-sm text-foreground underline-offset-4 hover:underline">
            {siteConfig.email}
          </a>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
            <h2 className="font-mono text-xs tracking-wider text-muted-foreground uppercase">{col.title}</h2>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-foreground/80 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            © {year} {siteConfig.name}. {dict.footer.rights} {dict.footer.local}
          </p>
          <ul className="flex items-center gap-3" aria-label={dict.nav.language}>
            {locales.map((l) => (
              <li key={l}>
                <Link
                  href={`/${l}`}
                  hrefLang={l === 'zh' ? 'zh-CN' : 'en'}
                  aria-current={l === locale ? 'true' : undefined}
                  className="hover:text-foreground aria-[current=true]:font-medium aria-[current=true]:text-foreground"
                >
                  {localeLabels[l].native}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
