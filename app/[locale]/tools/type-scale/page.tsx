import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolPage } from '@/components/shared/tool-page'
import { TypeScaleTool } from '@/components/tools/type-scale/type-scale-tool'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { webApplicationSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { routes } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).typeScale
  return buildMetadata({ locale, route: 'typeScale', title: t.metaTitle, description: t.metaDescription, kind: 'Controls → Visualization' })
}

export default async function TypeScalePage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.typeScale

  return (
    <ToolPage
      locale={locale}
      dict={dict}
      path={routes.typeScale.path}
      title={t.title}
      subtitle={t.subtitle}
      template="controlsVisualization"
      swatch="bg-foreground"
      schema={[webApplicationSchema({ locale, name: t.title, description: t.metaDescription, path: routes.typeScale.path })]}
    >
      <TypeScaleTool />
    </ToolPage>
  )
}
