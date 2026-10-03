import { PageHeader } from '@/components/shared/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { breadcrumbSchema } from '@/lib/schema'

export function ToolPage({
  locale,
  dict,
  path,
  title,
  subtitle,
  template,
  swatch,
  schema = [],
  children,
}: {
  locale: Locale
  dict: Dictionary
  path: string
  title: string
  subtitle?: string
  template?: keyof Dictionary['templates']
  swatch?: string
  schema?: Record<string, unknown>[]
  children: React.ReactNode
}) {
  const crumbs = [
    { name: dict.nav.home, href: `/${locale}` },
    { name: title, href: `/${locale}${path}` },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
      <PageHeader
        crumbs={crumbs}
        crumbLabel={dict.common.breadcrumb}
        template={template ? dict.templates[template] : undefined}
        templateLabel={dict.common.template}
        title={title}
        subtitle={subtitle}
        swatch={swatch}
      />
      {children}
      <JsonLd data={[breadcrumbSchema(crumbs.map((c) => ({ name: c.name, path: c.href }))), ...schema]} />
    </div>
  )
}
