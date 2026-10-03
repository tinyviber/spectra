import { Accessibility, BarChart3, Globe2, LayoutTemplate, Search, SunMoon } from 'lucide-react'
import type { Dictionary } from '@/lib/i18n/dictionaries'

const icons = [Globe2, SunMoon, Search, LayoutTemplate, BarChart3, Accessibility]

export function Foundation({ dict }: { dict: Dictionary }) {
  return (
    <section aria-labelledby="foundation-heading" className="border-y bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
        <div className="flex flex-col gap-3 pb-10">
          <h2 id="foundation-heading" className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {dict.home.builtTitle}
          </h2>
          <p className="max-w-xl leading-relaxed text-pretty text-muted-foreground">{dict.home.builtSubtitle}</p>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {dict.home.built.map((item, i) => {
            const Icon = icons[i]
            return (
              <li key={item.title} className="flex flex-col gap-3 bg-card p-6">
                <Icon aria-hidden="true" className="size-5 text-primary" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{item.description}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
