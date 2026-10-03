import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolPage } from '@/components/shared/tool-page'
import { PaletteTool } from '@/components/tools/palette/palette-tool'
import { normalizeHex } from '@/lib/color'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { webApplicationSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { routes } from '@/lib/site'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ hex?: string; name?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).palette
  return buildMetadata({ locale, route: 'palette', title: t.metaTitle, description: t.metaDescription, kind: 'Input → Result' })
}

export default async function PalettePage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const { hex, name } = await searchParams
  const dict = getDictionary(locale)
  const t = dict.palette
  const initialName = (name ?? 'brand').replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'brand'

  return (
    <ToolPage
      locale={locale}
      dict={dict}
      path={routes.palette.path}
      title={t.title}
      subtitle={t.subtitle}
      template="inputResult"
      swatch="bg-primary"
      schema={[webApplicationSchema({ locale, name: t.title, description: t.metaDescription, path: routes.palette.path })]}
    >
      <PaletteTool initialHex={hex ? normalizeHex(hex) : null} initialName={initialName} />
    </ToolPage>
  )
}
