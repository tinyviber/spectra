import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolPage } from '@/components/shared/tool-page'
import { DirectoryTool } from '@/components/tools/directory/directory-tool'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { categories, resources, type Category } from '@/lib/resources'
import { itemListSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { routes } from '@/lib/site'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; category?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).directory
  return buildMetadata({ locale, route: 'directory', title: t.metaTitle, description: t.metaDescription, kind: 'Search → Directory' })
}

export default async function DirectoryPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const { q, category } = await searchParams
  const dict = getDictionary(locale)
  const t = dict.directory
  const initialCategory = categories.includes(category as Category) ? (category as Category) : null

  return (
    <ToolPage
      locale={locale}
      dict={dict}
      path={routes.directory.path}
      title={t.title}
      subtitle={t.subtitle}
      template="searchDirectory"
      swatch="bg-chart-3"
      schema={[itemListSchema(resources.map((r) => ({ name: r.name, url: r.url, description: r.description[locale] })))]}
    >
      <DirectoryTool initialQuery={(q ?? '').slice(0, 100)} initialCategory={initialCategory} />
    </ToolPage>
  )
}
