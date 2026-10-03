import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Cta } from '@/components/home/cta'
import { Foundation } from '@/components/home/foundation'
import { Hero } from '@/components/home/hero'
import { ToolGrid } from '@/components/home/tool-grid'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return buildMetadata({ locale, route: 'home', title: dict.home.metaTitle, description: dict.meta.description, absoluteTitle: true })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <ToolGrid locale={locale} dict={dict} />
      <Foundation dict={dict} />
      <Cta locale={locale} dict={dict} />
    </>
  )
}
