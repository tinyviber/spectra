import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SwatchChip } from '@/components/brand/swatch-chip'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { routes } from '@/lib/site'

const fan = [
  { swatch: 'bg-primary', code: 'SP 262 C', label: 'Cobalt', rotate: -14, x: -150, y: 26 },
  { swatch: 'bg-chart-2', code: 'SP 255 C', label: 'Periwinkle', rotate: -6, x: -75, y: 6 },
  { swatch: 'bg-highlight', code: 'SP 102 C', label: 'Lemon', rotate: 2, x: 0, y: 0 },
  { swatch: 'bg-chart-3', code: 'SP 262 T', label: 'Mist', rotate: 9, x: 75, y: 8 },
  { swatch: 'bg-foreground', code: 'SP INK', label: 'Ink', rotate: 16, x: 150, y: 30 },
]

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden border-b">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pt-16 pb-20 md:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-24 lg:pb-28">
        <div className="flex flex-col gap-6">
          <p className="animate-rise flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
            {dict.home.eyebrow}
          </p>
          <h1 className="animate-rise text-5xl font-semibold tracking-tighter text-balance [animation-delay:60ms] md:text-6xl lg:text-7xl">
            {dict.home.title}
          </h1>
          <p className="animate-rise max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground [animation-delay:120ms]">
            {dict.home.subtitle}
          </p>
          <div className="animate-rise flex flex-wrap gap-3 [animation-delay:180ms]">
            <Button size="lg" nativeButton={false} render={<Link href={`/${locale}${routes.palette.path}`} />}>
              {dict.home.primaryCta}
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href={`/${locale}${routes.directory.path}`} />}>
              {dict.home.secondaryCta}
            </Button>
          </div>
        </div>

        <div aria-hidden="true" className="relative mx-auto h-72 w-full max-w-md md:h-80">
          {fan.map((chip, i) => (
            <div
              key={chip.code}
              className="animate-fan absolute top-1/2 left-1/2 w-36 md:w-40"
              style={
                {
                  '--fan-x': `${chip.x}px`,
                  '--fan-y': `${chip.y}px`,
                  '--fan-r': `${chip.rotate}deg`,
                  animationDelay: `${200 + i * 70}ms`,
                  zIndex: i === 2 ? 10 : 5 - Math.abs(2 - i),
                } as React.CSSProperties
              }
            >
              <SwatchChip swatch={chip.swatch} code={chip.code} label={chip.label} className="shadow-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
