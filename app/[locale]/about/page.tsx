import { Bug } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolPage } from '@/components/shared/tool-page'
import { buttonVariants } from '@/components/ui/button'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { organizationSchema, webPageSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { routes, siteConfig } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

const chips = ['bg-primary', 'bg-chart-2', 'bg-chart-3', 'bg-highlight']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).about
  return buildMetadata({ locale, route: 'about', title: t.metaTitle, description: t.metaDescription })
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.about

  return (
    <ToolPage
      locale={locale}
      dict={dict}
      path={routes.about.path}
      title={t.title}
      subtitle={t.intro}
      schema={[
        webPageSchema({ locale, name: t.metaTitle, description: t.metaDescription, path: routes.about.path, type: 'AboutPage' }),
        organizationSchema(),
      ]}
    >
      <div className="flex flex-col gap-16">
        <section aria-labelledby="principles" className="flex flex-col gap-6">
          <h2 id="principles" className="text-2xl font-semibold tracking-tight">
            {t.principlesTitle}
          </h2>
          <ul className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
            {t.principles.map((p, i) => (
              <li key={p.title} className="flex flex-col gap-4 bg-card p-6">
                <span aria-hidden="true" className={`h-8 w-5 rounded-sm ${chips[i % chips.length]} ring-1 ring-border`} />
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="leading-relaxed text-pretty text-muted-foreground">{p.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="stack" className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <h2 id="stack" className="text-2xl font-semibold tracking-tight">
            {t.stackTitle}
          </h2>
          <p className="text-lg leading-relaxed text-pretty text-muted-foreground">{t.stack}</p>
        </section>

        <section
          aria-labelledby="contact"
          className="flex flex-col items-start gap-4 rounded-2xl bg-foreground p-8 text-background md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-col gap-2">
            <h2 id="contact" className="text-2xl font-semibold tracking-tight">
              {t.contactTitle}
            </h2>
            <p className="leading-relaxed opacity-75">{t.contact}</p>
          </div>
          <a
            href={`${siteConfig.github}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'secondary', size: 'lg' })}
          >
            <Bug data-icon="inline-start" />
            GitHub
          </a>
        </section>
      </div>
    </ToolPage>
  )
}
