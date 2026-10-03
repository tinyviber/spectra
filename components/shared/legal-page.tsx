import { ToolPage } from '@/components/shared/tool-page'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { webPageSchema } from '@/lib/schema'
import { siteConfig } from '@/lib/site'

const slug = (s: string, i: number) => `section-${i + 1}`

export function LegalPage({
  locale,
  dict,
  path,
  content,
}: {
  locale: Locale
  dict: Dictionary
  path: string
  content: Dictionary['privacy'] | Dictionary['terms']
}) {
  const date = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', { dateStyle: 'long' }).format(
    new Date(siteConfig.lastUpdated),
  )

  return (
    <ToolPage
      locale={locale}
      dict={dict}
      path={path}
      title={content.title}
      subtitle={content.intro}
      schema={[webPageSchema({ locale, name: content.title, description: content.metaDescription, path })]}
    >
      <div className="grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label={content.title} className="hidden lg:block">
          <ol className="sticky top-24 flex flex-col gap-2 border-l text-sm">
            {content.sections.map((s, i) => (
              <li key={s.heading}>
                <a href={`#${slug(s.heading, i)}`} className="-ml-px block border-l border-transparent pl-4 text-muted-foreground hover:border-foreground hover:text-foreground">
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="flex max-w-2xl flex-col gap-10">
          <p className="text-sm text-muted-foreground">
            {dict.common.lastUpdated}: <time dateTime={siteConfig.lastUpdated}>{date}</time>
          </p>
          {content.sections.map((s, i) => (
            <section key={s.heading} id={slug(s.heading, i)} className="flex scroll-mt-24 flex-col gap-3">
              <h2 className="flex items-baseline gap-3 text-xl font-semibold tracking-tight">
                <span className="font-mono text-xs text-primary tabular-nums">§{i + 1}</span>
                {s.heading}
              </h2>
              <p className="leading-relaxed text-pretty text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </article>
      </div>
    </ToolPage>
  )
}
