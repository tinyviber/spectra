'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/client'
import { tools } from '@/lib/tools'
import { cn } from '@/lib/utils'

export default function NotFound() {
  const { dict, locale } = useI18n()
  const t = dict.states

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-12 px-4 py-20 text-center md:py-28">
      <div className="flex flex-col items-center gap-6">
        <div aria-hidden="true" className="flex items-end gap-2 font-mono">
          {['4', '0', '4'].map((d, i) => (
            <span
              key={i}
              className={cn(
                'flex h-28 w-20 items-end justify-start rounded-lg p-2 text-4xl font-semibold md:h-36 md:w-24',
                i === 1 ? 'border-2 border-dashed border-primary text-primary' : 'bg-primary text-primary-foreground',
              )}
            >
              {d}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">{t.notFoundTitle}</h1>
          <p className="leading-relaxed text-pretty text-muted-foreground">{t.notFoundDescription}</p>
        </div>
        <Link href={`/${locale}`} className={buttonVariants({ size: 'lg' })}>
          {dict.common.backHome}
        </Link>
      </div>

      <nav aria-labelledby="suggestions" className="flex w-full flex-col gap-4">
        <h2 id="suggestions" className="text-sm text-muted-foreground">
          {t.notFoundSuggestions}
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {tools.map((tool) => (
            <li key={tool.key}>
              <Link
                href={`/${locale}${tool.path}`}
                className="group flex items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted"
              >
                <span aria-hidden="true" className={cn('h-8 w-5 rounded-sm ring-1 ring-border', tool.swatch)} />
                <span className="flex-1 font-medium">{dict.nav[tool.key]}</span>
                <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
