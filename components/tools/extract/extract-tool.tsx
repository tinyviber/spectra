'use client'

import { Check, ImageUp, Loader2, RefreshCw, ShieldCheck } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { CodeExport, useCopy } from '@/components/shared/code-export'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { track } from '@/lib/analytics'
import { extractPalette, readableOn } from '@/lib/color'
import { format } from '@/lib/i18n/config'
import { useI18n } from '@/lib/i18n/client'
import { cn } from '@/lib/utils'

const MAX_BYTES = 10 * 1024 * 1024
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const SAMPLE = '/images/sample-palette.png'

type Status = 'idle' | 'loading' | 'ready' | 'error'

function readPixels(src: string): Promise<Uint8ClampedArray> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const size = 160
      const scale = Math.min(1, size / Math.max(img.naturalWidth, img.naturalHeight))
      const w = Math.max(1, Math.round(img.naturalWidth * scale))
      const h = Math.max(1, Math.round(img.naturalHeight * scale))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return reject(new Error('no-canvas'))
      ctx.drawImage(img, 0, 0, w, h)
      resolve(ctx.getImageData(0, 0, w, h).data)
    }
    img.onerror = () => reject(new Error('load'))
    img.src = src
  })
}

export function ExtractTool() {
  const { dict } = useI18n()
  const t = dict.extract
  const { copy, copied } = useCopy()
  const inputRef = useRef<HTMLInputElement>(null)

  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [isSample, setIsSample] = useState(false)
  const [pixels, setPixels] = useState<Uint8ClampedArray | null>(null)
  const [count, setCount] = useState(6)
  const [dragging, setDragging] = useState(false)

  const colors = useMemo(() => (pixels ? extractPalette(pixels, count) : []), [pixels, count])

  async function load(url: string, source: 'upload' | 'sample') {
    setStatus('loading')
    setError(null)
    try {
      const data = await readPixels(url)
      if (src?.startsWith('blob:')) URL.revokeObjectURL(src)
      setSrc(url)
      setIsSample(source === 'sample')
      setPixels(data)
      setStatus('ready')
      track('palette_extracted', { colors: count, source })
    } catch {
      setStatus(src ? 'ready' : 'error')
      setError(t.readError)
    }
  }

  function handleFile(file: File | undefined) {
    if (!file) return
    if (!ACCEPTED.includes(file.type)) return setError(t.invalidType)
    if (file.size > MAX_BYTES) return setError(t.tooLarge)
    load(URL.createObjectURL(file), 'upload')
  }

  const total = colors.reduce((sum, c) => sum + c.share, 0) || 1
  const css = `:root {\n${colors.map((c, i) => `  --extracted-${i + 1}: ${c.hex};`).join('\n')}\n}`
  const json = JSON.stringify(colors.map((c) => ({ hex: c.hex, coverage: Number((c.share * 100).toFixed(1)) })), null, 2)

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      <div className="flex flex-col gap-4">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            handleFile(e.dataTransfer.files[0])
          }}
          className={cn(
            'relative flex min-h-80 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed bg-card p-6 text-center transition-colors',
            dragging && 'border-primary bg-primary/5',
            src && 'border-solid p-0',
          )}
        >
          {src ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- blob URLs can't go through next/image */}
              <img src={src} alt={isSample ? t.sampleAlt : t.imageAlt} className="max-h-[520px] w-full object-cover" />
              {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                  <Loader2 aria-hidden="true" className="size-6 animate-spin text-primary" />
                  <span className="sr-only">{t.analyzing}</span>
                </div>
              )}
            </>
          ) : status === 'loading' ? (
            <div className="flex flex-col items-center gap-3" role="status">
              <Loader2 aria-hidden="true" className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{t.analyzing}</p>
            </div>
          ) : (
            <>
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ImageUp aria-hidden="true" className="size-6" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold">{t.dropTitle}</p>
                <p className="text-sm text-muted-foreground">{t.dropHint}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={() => inputRef.current?.click()}>{t.browse}</Button>
                <Button variant="outline" onClick={() => load(SAMPLE, 'sample')}>
                  {t.useSample}
                </Button>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            className="sr-only"
            tabIndex={-1}
            aria-label={t.browse}
            onChange={(e) => {
              handleFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
            {t.privacy}
          </p>
          {src && (
            <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              <RefreshCw data-icon="inline-start" />
              {t.replace}
            </Button>
          )}
        </div>
      </div>

      <div aria-live="polite" className="flex min-w-0 flex-col gap-8">
        {colors.length ? (
          <>
            <section className="flex flex-col gap-5 rounded-2xl border bg-card p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold tracking-tight">{t.resultTitle}</h2>
                <div className="flex w-44 items-center gap-3">
                  <Label id="color-count" className="shrink-0 text-xs text-muted-foreground">
                    {t.colorCount}
                  </Label>
                  <Slider
                    aria-labelledby="color-count"
                    min={3}
                    max={10}
                    step={1}
                    value={[count]}
                    onValueChange={(v) => setCount(Array.isArray(v) ? v[0] : v)}
                  />
                  <span className="w-5 text-right font-mono text-xs tabular-nums">{count}</span>
                </div>
              </div>

              <div className="flex h-20 overflow-hidden rounded-xl" aria-hidden="true">
                {colors.map((c) => (
                  <span
                    key={c.hex}
                    className="transition-[flex-grow] duration-500"
                    style={{ backgroundColor: c.hex, flexGrow: c.share / total, minWidth: 8 }}
                  />
                ))}
              </div>

              <ul className="grid gap-2 sm:grid-cols-2">
                {colors.map((c, i) => (
                  <li key={c.hex} className="animate-rise" style={{ animationDelay: `${i * 40}ms` }}>
                    <button
                      type="button"
                      onClick={() => copy(c.hex, 'extracted')}
                      className="flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <span
                        className="flex size-11 shrink-0 items-center justify-center rounded-lg ring-1 ring-border"
                        style={{ backgroundColor: c.hex, color: readableOn(c.hex) }}
                      >
                        {copied === c.hex && <Check aria-hidden="true" className="size-4" />}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="font-mono text-sm font-medium uppercase">{c.hex}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(t.coverage, { value: (c.share * 100).toFixed(1) })}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold tracking-tight">{t.exportTitle}</h2>
              <CodeExport
                name="extract"
                formats={[
                  { id: 'css', label: 'CSS', code: css },
                  { id: 'json', label: 'JSON', code: json },
                ]}
              />
            </section>
          </>
        ) : (
          <EmptyState title={t.emptyTitle} description={t.emptyDescription} className="min-h-80" />
        )}
      </div>
    </div>
  )
}
