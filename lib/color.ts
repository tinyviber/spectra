export type RGB = { r: number; g: number; b: number }
export type OKLCH = { l: number; c: number; h: number }

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

export function normalizeHex(input: string): string | null {
  const match = input.trim().match(HEX_RE)
  if (!match) return null
  let hex = match[1].toLowerCase()
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
  return `#${hex}`
}

export function hexToRgb(hex: string): RGB {
  const n = Number.parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export function rgbToHex({ r, g, b }: RGB): string {
  const to = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

const toLinear = (c: number) => {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const fromLinear = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055) * 255

export function rgbToOklab({ r, g, b }: RGB) {
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  }
}

function oklabToLinear(L: number, a: number, b: number) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  }
}

export function hexToOklch(hex: string): OKLCH {
  const { L, a, b } = rgbToOklab(hexToRgb(hex))
  const c = Math.sqrt(a * a + b * b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return { l: L, c, h }
}

const inGamut = ({ r, g, b }: RGB) => [r, g, b].every((v) => v >= -0.0001 && v <= 1.0001)

export function oklchToHex({ l, c, h }: OKLCH): string {
  const rad = (h * Math.PI) / 180
  let chroma = c
  let lin = oklabToLinear(l, chroma * Math.cos(rad), chroma * Math.sin(rad))
  while (!inGamut(lin) && chroma > 0) {
    chroma = Math.max(0, chroma - 0.002)
    lin = oklabToLinear(l, chroma * Math.cos(rad), chroma * Math.sin(rad))
  }
  return rgbToHex({ r: fromLinear(lin.r), g: fromLinear(lin.g), b: fromLinear(lin.b) })
}

export function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

export function contrastRatio(a: string, b: string) {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

export type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail'
export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA Large'
  return 'Fail'
}

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
const TARGET_L = [0.975, 0.94, 0.885, 0.81, 0.72, 0.63, 0.545, 0.465, 0.39, 0.32, 0.25]
const CHROMA_FACTOR = [0.12, 0.26, 0.48, 0.72, 0.92, 1, 1, 0.94, 0.84, 0.72, 0.58]

export type Swatch = { step: number; hex: string; oklch: OKLCH; isBase: boolean; onWhite: number; onBlack: number }

export function generateScale(baseHex: string): Swatch[] {
  const base = hexToOklch(baseHex)
  let closest = 0
  TARGET_L.forEach((l, i) => {
    if (Math.abs(l - base.l) < Math.abs(TARGET_L[closest] - base.l)) closest = i
  })

  return SCALE_STEPS.map((step, i) => {
    const isBase = i === closest
    const hex = isBase ? baseHex : oklchToHex({ l: TARGET_L[i], c: base.c * CHROMA_FACTOR[i], h: base.h })
    return {
      step,
      hex,
      oklch: hexToOklch(hex),
      isBase,
      onWhite: contrastRatio(hex, '#ffffff'),
      onBlack: contrastRatio(hex, '#000000'),
    }
  })
}

export function readableOn(hex: string) {
  return contrastRatio(hex, '#ffffff') >= contrastRatio(hex, '#0b0d14') ? '#ffffff' : '#0b0d14'
}

export function formatOklch({ l, c, h }: OKLCH) {
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`
}

export type ExtractedColor = { hex: string; share: number }

export function extractPalette(data: Uint8ClampedArray, count: number): ExtractedColor[] {
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>()
  let total = 0
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 125) continue
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3)
    const bucket = buckets.get(key)
    if (bucket) {
      bucket.r += r
      bucket.g += g
      bucket.b += b
      bucket.n++
    } else buckets.set(key, { r, g, b, n: 1 })
    total++
  }
  if (!total) return []

  const candidates = [...buckets.values()]
    .map((bk) => {
      const rgb = { r: bk.r / bk.n, g: bk.g / bk.n, b: bk.b / bk.n }
      return { rgb, lab: rgbToOklab(rgb), n: bk.n }
    })
    .sort((a, b) => b.n - a.n)

  const clusters: { lab: { L: number; a: number; b: number }; r: number; g: number; b: number; n: number }[] = []
  const threshold = 0.07
  for (const cand of candidates) {
    const near = clusters.find((cl) => {
      const dL = cl.lab.L - cand.lab.L
      const da = cl.lab.a - cand.lab.a
      const db = cl.lab.b - cand.lab.b
      return Math.sqrt(dL * dL + da * da + db * db) < threshold
    })
    if (near) {
      near.r += cand.rgb.r * cand.n
      near.g += cand.rgb.g * cand.n
      near.b += cand.rgb.b * cand.n
      near.n += cand.n
    } else {
      clusters.push({ lab: cand.lab, r: cand.rgb.r * cand.n, g: cand.rgb.g * cand.n, b: cand.rgb.b * cand.n, n: cand.n })
    }
  }

  return clusters
    .sort((a, b) => b.n - a.n)
    .slice(0, count)
    .map((cl) => ({ hex: rgbToHex({ r: cl.r / cl.n, g: cl.g / cl.n, b: cl.b / cl.n }), share: cl.n / total }))
}
