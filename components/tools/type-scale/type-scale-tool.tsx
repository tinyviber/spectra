'use client'

import { RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CodeExport } from '@/components/shared/code-export'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { track } from '@/lib/analytics'
import { useI18n } from '@/lib/i18n/client'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { cn } from '@/lib/utils'

const ratios: { key: keyof Dictionary['typeScale']['ratios']; value: number }[] = [
  { key: 'minorSecond', value: 1.067 },
  { key: 'majorSecond', value: 1.125 },
  { key: 'minorThird', value: 1.2 },
  { key: 'majorThird', value: 1.25 },
  { key: 'perfectFourth', value: 1.333 },
  { key: 'augmentedFourth', value: 1.414 },
  { key: 'perfectFifth', value: 1.5 },
  { key: 'goldenRatio', value: 1.618 },
]

const defaults = { base: 16, ratio: 1.25, up: 6, down: 2, lineHeight: 1.5, unit: 'rem' as 'rem' | 'px' }
const stepName = (i: number) => (i === 0 ? 'base' : i > 0 ? `${i}` : `-${Math.abs(i)}`)

function Control({ id, label, value, children }: { id: string; label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label id={id}>{label}</Label>
        <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs tabular-nums">{value}</span>
      </div>
      {children}
    </div>
  )
}

export function TypeScaleTool() {
  const { dict } = useI18n()
  const t = dict.typeScale
  const [base, setBase] = useState(defaults.base)
  const [ratio, setRatio] = useState(defaults.ratio)
  const [up, setUp] = useState(defaults.up)
  const [down, setDown] = useState(defaults.down)
  const [lineHeight, setLineHeight] = useState(defaults.lineHeight)
  const [unit, setUnit] = useState(defaults.unit)
  const [sample, setSample] = useState(t.sampleDefault)

  const steps = useMemo(() => {
    const list: { i: number; px: number }[] = []
    for (let i = up; i >= -down; i--) list.push({ i, px: base * Math.pow(ratio, i) })
    return list
  }, [base, ratio, up, down])

  useEffect(() => {
    const id = setTimeout(() => track('type_scale_changed', { ratio, base }), 1000)
    return () => clearTimeout(id)
  }, [ratio, base])

  const maxPx = steps[0]?.px ?? base
  const fmt = (px: number) => (unit === 'rem' ? `${+(px / 16).toFixed(3)}rem` : `${+px.toFixed(2)}px`)
  const lhFor = (px: number) => Math.max(1.05, +(lineHeight - (px - base) / (maxPx - base || 1) * (lineHeight - 1.1)).toFixed(2))

  const css = `:root {\n  --leading-body: ${lineHeight};\n${steps.map((s) => `  --text-${stepName(s.i)}: ${fmt(s.px)};`).join('\n')}\n}`
  const tailwind = `@theme {\n${steps.map((s) => `  --text-${s.i === 0 ? 'base' : s.i > 0 ? `step-${s.i}` : `step-n${Math.abs(s.i)}`}: ${fmt(s.px)};`).join('\n')}\n}`
  const json = JSON.stringify(Object.fromEntries(steps.map((s) => [stepName(s.i), fmt(s.px)])), null, 2)

  const ratioItems = ratios.map((r) => ({ value: String(r.value), label: `${t.ratios[r.key]} · ${r.value}` }))

  function reset() {
    setBase(defaults.base)
    setRatio(defaults.ratio)
    setUp(defaults.up)
    setDown(defaults.down)
    setLineHeight(defaults.lineHeight)
    setUnit(defaults.unit)
    setSample(t.sampleDefault)
  }

  const single = (v: number | readonly number[]) => (Array.isArray(v) ? v[0] : (v as number))

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
      <section aria-labelledby="controls-title" className="flex flex-col gap-6 rounded-2xl border bg-card p-5 lg:sticky lg:top-24">
        <div className="flex items-center justify-between">
          <h2 id="controls-title" className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {t.controls}
          </h2>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw data-icon="inline-start" />
            {dict.common.reset}
          </Button>
        </div>

        <Control id="ctl-base" label={t.base} value={`${base}px`}>
          <Slider aria-labelledby="ctl-base" min={12} max={24} step={1} value={[base]} onValueChange={(v) => setBase(single(v))} />
        </Control>

        <div className="flex flex-col gap-3">
          <Label id="ctl-ratio">{t.ratio}</Label>
          <Select items={ratioItems} value={String(ratio)} onValueChange={(v) => v && setRatio(Number(v))}>
            <SelectTrigger aria-labelledby="ctl-ratio" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ratioItems.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Control id="ctl-up" label={t.stepsUp} value={String(up)}>
          <Slider aria-labelledby="ctl-up" min={2} max={8} step={1} value={[up]} onValueChange={(v) => setUp(single(v))} />
        </Control>
        <Control id="ctl-down" label={t.stepsDown} value={String(down)}>
          <Slider aria-labelledby="ctl-down" min={0} max={3} step={1} value={[down]} onValueChange={(v) => setDown(single(v))} />
        </Control>
        <Control id="ctl-lh" label={t.lineHeight} value={lineHeight.toFixed(2)}>
          <Slider
            aria-labelledby="ctl-lh"
            min={1.2}
            max={1.8}
            step={0.05}
            value={[lineHeight]}
            onValueChange={(v) => setLineHeight(single(v))}
          />
        </Control>

        <div className="flex flex-col gap-3">
          <span id="ctl-unit" className="text-sm font-medium">
            {t.unit}
          </span>
          <div role="radiogroup" aria-labelledby="ctl-unit" className="grid grid-cols-2 gap-1 rounded-lg border p-0.5">
            {(['rem', 'px'] as const).map((u) => (
              <button
                key={u}
                type="button"
                role="radio"
                aria-checked={unit === u}
                onClick={() => setUnit(u)}
                className="h-7 rounded-md font-mono text-xs text-muted-foreground transition-colors aria-checked:bg-foreground aria-checked:text-background"
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ctl-sample">{t.sample}</Label>
          <Input id="ctl-sample" value={sample} onChange={(e) => setSample(e.target.value)} placeholder={t.samplePlaceholder} maxLength={60} />
        </div>
      </section>

      <div className="flex min-w-0 flex-col gap-10">
        <section aria-labelledby="viz-title" className="flex flex-col gap-4">
          <h2 id="viz-title" className="text-lg font-semibold tracking-tight">
            {t.visualization}
          </h2>
          <figure className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
            <div className="flex h-56 items-end gap-2" role="img" aria-label={`${t.chartLabel}: ${steps.map((s) => `${stepName(s.i)} ${fmt(s.px)}`).join(', ')}`}>
              {[...steps].reverse().map((s) => (
                <div key={s.i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{Math.round(s.px)}</span>
                  <div
                    className={cn('w-full rounded-t-md transition-[height] duration-300', s.i === 0 ? 'bg-primary' : 'bg-primary/25')}
                    style={{ height: `${(s.px / maxPx) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t pt-2" aria-hidden="true">
              {[...steps].reverse().map((s) => (
                <span key={s.i} className="flex-1 text-center font-mono text-[10px] text-muted-foreground">
                  {stepName(s.i)}
                </span>
              ))}
            </div>
            <figcaption className="sr-only">{t.chartLabel}</figcaption>
          </figure>
        </section>

        <section aria-labelledby="specimen-title" className="flex flex-col gap-4">
          <h2 id="specimen-title" className="text-lg font-semibold tracking-tight">
            {t.specimen}
          </h2>
          <ol className="flex flex-col divide-y overflow-hidden rounded-2xl border bg-card">
            {steps.map((s) => (
              <li key={s.i} className={cn('grid grid-cols-[72px_minmax(0,1fr)] items-baseline gap-4 px-5 py-4', s.i === 0 && 'bg-primary/5')}>
                <div className="flex flex-col font-mono text-xs text-muted-foreground">
                  <span className={cn(s.i === 0 && 'font-semibold text-primary')}>{stepName(s.i)}</span>
                  <span className="tabular-nums">{fmt(s.px)}</span>
                </div>
                <p
                  className="truncate font-semibold tracking-tight"
                  style={{ fontSize: `${s.px}px`, lineHeight: lhFor(s.px), fontWeight: s.i < 0 ? 400 : s.i === 0 ? 450 : 600 }}
                >
                  {sample || t.samplePlaceholder}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="output-title" className="flex flex-col gap-4">
          <h2 id="output-title" className="text-lg font-semibold tracking-tight">
            {t.output}
          </h2>
          <CodeExport
            name="type-scale"
            formats={[
              { id: 'css', label: 'CSS', code: css },
              { id: 'tailwind', label: 'Tailwind v4', code: tailwind },
              { id: 'json', label: 'JSON', code: json },
            ]}
          />
        </section>
      </div>
    </div>
  )
}
