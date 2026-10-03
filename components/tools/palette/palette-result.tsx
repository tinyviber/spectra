'use client'

import { Check } from 'lucide-react'
import { CodeExport, useCopy } from '@/components/shared/code-export'
import { Badge } from '@/components/ui/badge'
import { contrastRatio, formatOklch, readableOn, wcagLevel, type Swatch } from '@/lib/color'
import { useI18n } from '@/lib/i18n/client'
import { cn } from '@/lib/utils'

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

export function PaletteResult({ scale, name }: { scale: Swatch[]; name: string }) {
  const { dict } = useI18n()
  const t = dict.palette
  const { copy, copied } = useCopy()
  const at = (step: number) => scale.find((s) => s.step === step)!.hex

  const pairs = [
    { fg: at(950), bg: at(50) },
    { fg: at(800), bg: at(100) },
    { fg: '#ffffff', bg: at(600) },
    { fg: at(50), bg: at(900) },
    { fg: at(700), bg: '#ffffff' },
    { fg: at(300), bg: at(950) },
  ]

  const css = `:root {\n${scale.map((s) => `  --${name}-${s.step}: ${s.hex};`).join('\n')}\n}`
  const tailwind = `@theme {\n${scale.map((s) => `  --color-${name}-${s.step}: ${formatOklch(s.oklch)};`).join('\n')}\n}`
  const json = JSON.stringify({ [name]: Object.fromEntries(scale.map((s) => [s.step, s.hex])) }, null, 2)

  return (
    <div className="flex flex-col gap-12">
      <Section title={t.resultTitle} subtitle={t.resultSubtitle}>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-11">
          {scale.map((s, i) => (
            <li key={s.step} className="animate-rise" style={{ animationDelay: `${i * 30}ms` }}>
              <button
                type="button"
                onClick={() => copy(s.hex, 'swatch')}
                className="group flex w-full flex-col overflow-hidden rounded-xl border bg-card p-1 text-left transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span
                  className="relative flex aspect-square w-full items-start justify-end rounded-lg p-1.5 xl:aspect-[3/4]"
                  style={{ backgroundColor: s.hex, color: readableOn(s.hex) }}
                >
                  {s.isBase && <span className="size-1.5 rounded-full bg-current" aria-label="base" />}
                  {copied === s.hex && <Check aria-hidden="true" className="absolute inset-0 m-auto size-4" />}
                </span>
                <span className="flex flex-col px-1 pt-1.5 pb-0.5">
                  <span className="text-xs font-semibold">{s.step}</span>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase">{s.hex}</span>
                </span>
                <span className="sr-only">
                  {t.vsWhite} {s.onWhite.toFixed(2)}, {t.vsBlack} {s.onBlack.toFixed(2)}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
          {scale.map((s) => (
            <span key={s.step} className="flex-1" style={{ backgroundColor: s.hex }} />
          ))}
        </div>
      </Section>

      <Section title={t.contrastTitle} subtitle={t.contrastSubtitle}>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pairs.map((p) => {
            const ratio = contrastRatio(p.fg, p.bg)
            const level = wcagLevel(ratio)
            return (
              <li key={`${p.fg}-${p.bg}`} className="flex items-center gap-4 rounded-xl border bg-card p-3">
                <span
                  className="flex size-14 shrink-0 items-center justify-center rounded-lg text-xl font-semibold ring-1 ring-border"
                  style={{ backgroundColor: p.bg, color: p.fg }}
                  aria-hidden="true"
                >
                  Aa
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1 text-xs">
                  <span className="font-mono text-muted-foreground uppercase">
                    <span className="sr-only">{t.pairText} </span>
                    {p.fg} / <span className="sr-only">{t.pairBackground} </span>
                    {p.bg}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-base font-semibold tabular-nums">{ratio.toFixed(2)}:1</span>
                    <Badge
                      variant={level === 'Fail' ? 'destructive' : level === 'AA Large' ? 'outline' : 'secondary'}
                      className="font-mono"
                    >
                      {level}
                    </Badge>
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section title={t.previewTitle}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-2xl p-6" style={{ backgroundColor: at(50), color: at(950) }}>
            <span
              className="w-fit rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: at(100), color: at(800) }}
            >
              {t.previewBadge}
            </span>
            <h3 className="text-2xl font-semibold tracking-tight text-balance">{t.previewHeading}</h3>
            <p className="text-sm leading-relaxed" style={{ color: at(800) }}>
              {t.previewBody}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-lg px-4 py-2 text-sm font-medium" style={{ backgroundColor: at(600), color: readableOn(at(600)) }}>
                {t.previewPrimary}
              </span>
              <span className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: at(300), color: at(700) }}>
                {t.previewSecondary}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl p-6" style={{ backgroundColor: at(950), color: at(50) }}>
            <span
              className="w-fit rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: at(800), color: at(100) }}
            >
              {t.previewBadge}
            </span>
            <h3 className="text-2xl font-semibold tracking-tight text-balance">{t.previewHeading}</h3>
            <p className="text-sm leading-relaxed" style={{ color: at(200) }}>
              {t.previewBody}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-lg px-4 py-2 text-sm font-medium" style={{ backgroundColor: at(400), color: readableOn(at(400)) }}>
                {t.previewPrimary}
              </span>
              <span className={cn('rounded-lg border px-4 py-2 text-sm font-medium')} style={{ borderColor: at(700), color: at(200) }}>
                {t.previewSecondary}
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Section title={t.exportTitle}>
        <CodeExport
          name="palette"
          formats={[
            { id: 'css', label: 'CSS', code: css },
            { id: 'tailwind', label: 'Tailwind v4', code: tailwind },
            { id: 'json', label: 'JSON', code: json },
          ]}
        />
      </Section>
    </div>
  )
}
