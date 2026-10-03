'use client'

import { Link2, Sparkles } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/shared/empty-state'
import { useCopy } from '@/components/shared/code-export'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { track } from '@/lib/analytics'
import { generateScale, normalizeHex } from '@/lib/color'
import { useI18n } from '@/lib/i18n/client'
import { PaletteResult } from './palette-result'

const presets = [
  { name: 'Cobalt', hex: '#2f5bea' },
  { name: 'Jade', hex: '#0f9d76' },
  { name: 'Persimmon', hex: '#e8613c' },
  { name: 'Orchid', hex: '#b04fc4' },
  { name: 'Saffron', hex: '#e6a817' },
  { name: 'Slate', hex: '#4b5868' },
]

export function PaletteTool({ initialHex, initialName }: { initialHex: string | null; initialName: string }) {
  const { dict } = useI18n()
  const t = dict.palette
  const router = useRouter()
  const pathname = usePathname()
  const { copy } = useCopy()

  const [input, setInput] = useState(initialHex ?? '')
  const [name, setName] = useState(initialName)
  const [hex, setHex] = useState<string | null>(initialHex)
  const [error, setError] = useState<string | null>(null)

  const scale = useMemo(() => (hex ? generateScale(hex) : null), [hex])
  const pickerValue = normalizeHex(input) ?? hex ?? '#2f5bea'

  function apply(value: string, source: 'form' | 'preset') {
    const normalized = normalizeHex(value)
    if (!normalized) {
      setError(t.invalid)
      return
    }
    setError(null)
    setInput(normalized)
    setHex(normalized)
    const params = new URLSearchParams({ hex: normalized.slice(1) })
    if (name && name !== 'brand') params.set('name', name)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    track('palette_generated', { hex: normalized, source })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          apply(input, 'form')
        }}
        className="flex flex-col gap-6 rounded-2xl border bg-card p-5 lg:sticky lg:top-24"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="base-hex">{t.inputLabel}</Label>
          <div className="flex gap-2">
            <label className="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-md ring-1 ring-border">
              <span className="sr-only">{t.pickerLabel}</span>
              <span aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: pickerValue }} />
              <input
                type="color"
                value={pickerValue}
                onChange={(e) => {
                  setInput(e.target.value)
                  setError(null)
                }}
                onBlur={(e) => apply(e.target.value, 'form')}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
            <Input
              id="base-hex"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="#2F5BEA"
              spellCheck={false}
              autoComplete="off"
              aria-invalid={error ? true : undefined}
              aria-describedby="base-hex-hint"
              className="font-mono uppercase"
            />
          </div>
          <p id="base-hex-hint" className={error ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}>
            {error ?? t.inputHint}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="scale-name">{t.nameLabel}</Label>
          <Input
            id="scale-name"
            value={name}
            onChange={(e) => setName(e.target.value.replace(/[^a-z0-9-]/gi, '').toLowerCase())}
            placeholder={t.namePlaceholder}
            className="font-mono"
          />
        </div>

        <Button type="submit" size="lg">
          <Sparkles data-icon="inline-start" />
          {t.generate}
        </Button>

        <fieldset className="flex flex-col gap-3">
          <legend className="pb-3 text-sm font-medium">{t.presets}</legend>
          <div className="grid grid-cols-6 gap-2">
            {presets.map((p) => (
              <button
                key={p.hex}
                type="button"
                onClick={() => apply(p.hex, 'preset')}
                aria-label={`${p.name} ${p.hex}`}
                aria-pressed={hex === p.hex}
                className="aspect-square rounded-md ring-1 ring-border transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:ring-2 aria-pressed:ring-foreground"
                style={{ backgroundColor: p.hex }}
              />
            ))}
          </div>
        </fieldset>

        {hex && (
          <Button type="button" variant="outline" onClick={() => copy(window.location.href, 'share-link')}>
            <Link2 data-icon="inline-start" />
            {t.share}
          </Button>
        )}
      </form>

      <div aria-live="polite" className="min-w-0">
        {scale ? (
          <PaletteResult scale={scale} name={name || 'brand'} />
        ) : (
          <EmptyState title={t.emptyTitle} description={t.emptyDescription} className="min-h-96" />
        )}
      </div>
    </div>
  )
}
