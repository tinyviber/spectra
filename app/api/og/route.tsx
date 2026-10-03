import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

const SIZE = { width: 1200, height: 630 }
const COLORS = { paper: '#fbfcfe', ink: '#1b1e2b', cobalt: '#2f5bea', lemon: '#e8e45a', mist: '#c9d3f5', muted: '#6b7088' }

async function loadFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)
  if (!match) throw new Error('font not found')
  const res = await fetch(match[1])
  if (!res.ok) throw new Error('font fetch failed')
  return res.arrayBuffer()
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const localeParam = searchParams.get('locale')
  const locale = isLocale(localeParam) ? localeParam : 'en'
  const dict = getDictionary(locale)
  const title = (searchParams.get('title') ?? dict.home.metaTitle).slice(0, 90)
  const kind = searchParams.get('kind')?.slice(0, 40) ?? dict.meta.tagline

  const text = `${title}${kind}Spectraspectra.tools`
  const family = locale === 'zh' ? 'Noto+Sans+SC' : 'Inter'
  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }[] = []
  try {
    const [regular, bold] = await Promise.all([loadFont(family, 400, text), loadFont(family, 700, text)])
    fonts.push({ name: 'OG', data: regular, weight: 400, style: 'normal' }, { name: 'OG', data: bold, weight: 700, style: 'normal' })
  } catch {
    // Fall back to the built-in font if Google Fonts is unreachable.
  }

  const swatches = [COLORS.cobalt, '#5b7ff0', COLORS.mist, COLORS.lemon, COLORS.ink]

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: COLORS.paper, fontFamily: 'OG' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 44, height: 44, borderRadius: 10, background: COLORS.cobalt, display: 'flex' }}>
              <div style={{ position: 'absolute', right: 0, bottom: 0, width: 22, height: 22, background: COLORS.lemon, borderTopLeftRadius: 10, borderBottomRightRadius: 10 }} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.ink }}>Spectra</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 26, color: COLORS.cobalt, fontWeight: 700 }}>{kind}</div>
            <div style={{ fontSize: title.length > 40 ? 60 : 72, lineHeight: 1.1, fontWeight: 700, color: COLORS.ink, letterSpacing: -1.5 }}>{title}</div>
          </div>
          <div style={{ fontSize: 22, color: COLORS.muted }}>spectra.tools</div>
        </div>
        <div style={{ width: 260, display: 'flex', flexDirection: 'column' }}>
          {swatches.map((c) => (
            <div key={c} style={{ flex: 1, background: c }} />
          ))}
        </div>
      </div>
    ),
    { ...SIZE, fonts: fonts.length ? fonts : undefined, headers: { 'Cache-Control': 'public, max-age=86400, immutable' } },
  )
}
