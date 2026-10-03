import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { routes } from '@/lib/site'

const steps = ['bg-primary/15', 'bg-primary/30', 'bg-primary/50', 'bg-primary/70', 'bg-primary', 'bg-foreground/80']

export function Cta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-col gap-8 overflow-hidden rounded-3xl border bg-card p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">{dict.home.ctaTitle}</h2>
          <p className="leading-relaxed text-muted-foreground">{dict.home.ctaSubtitle}</p>
          <Button size="lg" className="mt-3 w-fit" nativeButton={false} render={<Link href={`/${locale}${routes.palette.path}?hex=2f5bea`} />}>
            {dict.home.primaryCta}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
        <div aria-hidden="true" className="flex h-28 w-full max-w-sm overflow-hidden rounded-xl ring-1 ring-border">
          {steps.map((s) => (
            <span key={s} className={`flex-1 ${s}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
