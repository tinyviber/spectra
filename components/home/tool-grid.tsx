import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { tools } from '@/lib/tools'
import { cn } from '@/lib/utils'

export function ToolGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="tools-heading" className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-col gap-3 pb-10">
        <h2 id="tools-heading" className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          {dict.home.templatesTitle}
        </h2>
        <p className="max-w-xl leading-relaxed text-pretty text-muted-foreground">{dict.home.templatesSubtitle}</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => {
          const copy = dict.home.tools[tool.key]
          return (
            <li key={tool.key}>
              <Link
                href={`/${locale}${tool.path}`}
                className="group flex h-full flex-col gap-6 rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className={cn('size-10 rounded-lg ring-1 ring-border', tool.swatch)} />
                    <span className="font-mono text-xs text-muted-foreground">{dict.templates[tool.template]}</span>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold tracking-tight">{copy.title}</h3>
                  <p className="leading-relaxed text-pretty text-muted-foreground">{copy.description}</p>
                </div>
                <span className="mt-auto font-mono text-[11px] tracking-wider text-muted-foreground/80">{tool.code}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
