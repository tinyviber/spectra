import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolPage } from '@/components/shared/tool-page'
import { ExtractTool } from '@/components/tools/extract/extract-tool'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { webApplicationSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { routes } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).extract
  return buildMetadata({ locale, route: 'extract', title: t.metaTitle, description: t.metaDescription, kind: 'Upload → Result' })
}

export default async function ExtractPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.extract

  return (
    <ToolPage
      locale={locale}
      dict={dict}
      path={routes.extract.path}
      title={t.title}
      subtitle={t.subtitle}
      template="uploadResult"
      swatch="bg-highlight"
      schema={[webApplicationSchema({ locale, name: t.title, description: t.metaDescription, path: routes.extract.path })]}
    >
      <ExtractTool />
    </ToolPage>
  )
}
