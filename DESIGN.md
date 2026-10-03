# Spectra — Design System

> 一套为色彩与字体工具打造的设计系统。A design system for a suite of color & type tools.
> Concept: **the swatch card** — every screen borrows from printed ink chips, Pantone-style codes and studio proofing sheets.

---

## 1. Principles · 原则

| # | Principle | 中文 | In practice |
|---|-----------|------|-------------|
| 1 | One job, done well | 一事一工具 | Every tool answers one question; controls on the left, result on the right. |
| 2 | Ink, not decoration | 墨色胜于装饰 | Color appears as *content* (swatches, chips) — never as gradients or blobs. |
| 3 | Black & white first | 黑白优先 | Layouts must read perfectly in grayscale; primary blue is a signal, not wallpaper. |
| 4 | Accessible defaults | 默认无障碍 | WCAG AA contrast, visible focus rings, keyboard paths, `prefers-reduced-motion`. |
| 5 | Bilingual parity | 中英对等 | Every string ships in `en` and `zh`; layouts tolerate 30% length variance. |

---

## 2. Color · 色彩

Five roles, all in **OKLCH** (`app/globals.css`). Never use raw Tailwind colors (`bg-white`, `text-black`) — use tokens.

| Role | Token | Light | Dark | Use |
|------|-------|-------|------|-----|
| **Primary** — Spectra Blue (SP 262 C) | `--primary` | `oklch(0.52 0.215 262)` | `oklch(0.68 0.17 260)` | CTAs, links, focus ring, active state |
| **Ink** (black) | `--foreground` | `oklch(0.18 0.02 265)` | `oklch(0.96 0.005 260)` | Text, inverted panels |
| **Paper** (white) | `--background` / `--card` | `oklch(0.99 0.003 260)` / `#fff` | `oklch(0.155 0.012 265)` | Surfaces |
| **Graphite** (gray) | `--muted`, `--muted-foreground`, `--border` | — | — | Secondary text, dividers, wells |
| **Highlight** — Proof Yellow (SP 102 C) | `--highlight` | `oklch(0.92 0.17 102)` | `oklch(0.9 0.16 102)` | Sparingly: one marker per view (badges, "new", selection) |

Supporting: `--destructive` (errors only), `--chart-1…5` (blue ramp + yellow + ink, for data viz).

**Rules**
- Primary appears on ≤ 10% of any screen.
- Highlight is *always* paired with `--highlight-foreground` (never white text).
- Any overridden background must override its text color too.
- Dark mode is a first-class theme (`.dark` class via `next-themes`), not an inversion — primary is lifted in lightness to keep 4.5:1 on dark paper.

---

## 3. Typography · 字体

| Family | Token | Use |
|--------|-------|-----|
| **Geist** | `font-sans` | Headings & body. Chinese falls back to PingFang SC / Noto Sans SC / Microsoft YaHei. |
| **Geist Mono** | `font-mono` | Color codes, values, swatch labels, `tabular-nums` data. |

| Style | Class | Notes |
|-------|-------|-------|
| Display | `text-5xl md:text-7xl font-semibold tracking-tight text-balance` | Home hero only |
| H1 | `text-3xl md:text-5xl font-semibold tracking-tight` | Page headers |
| H2 | `text-2xl font-semibold tracking-tight` | Sections |
| Body | `text-base leading-relaxed text-pretty` | Line-height 1.6 |
| Small | `text-sm text-muted-foreground` | Never below 14px for prose |
| Code label | `font-mono text-xs uppercase tracking-wider` | Swatch codes like `SP 262 C` |

---

## 4. Space, radius, elevation · 间距与圆角

- 4px base grid; use Tailwind scale only (`gap-4`, `p-6`). No arbitrary values. No `space-*`; use `gap-*`.
- Container: `max-w-6xl px-4 md:px-6`.
- Radius: `--radius: 0.75rem` → buttons `rounded-lg`, cards `rounded-2xl`, swatches `rounded-md`.
- Elevation is *borders*, not shadows. Shadows only on floating layers (popover, sheet, toast).

---

## 5. Signature element · 标志性元素

**The swatch chip** (`components/brand/swatch-chip.tsx`): a tall rectangle with a mono code label in the bottom-left corner. It is the logo, the loading indicator, the empty-state illustration, the 404 digits and the tool identifier. Each tool owns one chip color:

| Tool | Template | Chip |
|------|----------|------|
| Palette | Input → Result | `bg-primary` |
| Extract | Upload → Result | `bg-highlight` |
| Directory | Search → Directory | `bg-chart-3` |
| Type scale | Controls → Visualization | `bg-foreground` |

---

## 6. Page templates · 页面模板

All tool pages share `components/shared/tool-page.tsx`: breadcrumb → page header (chip + template tag + title + subtitle) → body → JSON-LD.

1. **Input → Result** — single input + quick presets on top; generated output below with export.
2. **Upload → Result** — dropzone (drag, click, paste, sample) → preview + extracted output side by side.
3. **Search → Directory** — sticky search + filter chips + sort; responsive card grid; URL-synced query.
4. **Controls → Visualization** — sticky control panel (`lg:grid-cols-[320px_1fr]`) + live canvas with tabs.

### States · 状态
| State | Component | Pattern |
|-------|-----------|---------|
| Loading | `app/[locale]/loading.tsx`, `Skeleton` | Pulsing chip row + skeleton blocks, `aria-busy` |
| Empty | `components/shared/empty-state.tsx` | Dashed chip outline + title + action, `role="status"` |
| Error | `app/[locale]/error.tsx`, `app/global-error.tsx` | Destructive chip ramp + digest + retry |
| 404 | `app/[locale]/not-found.tsx` | "4 0 4" chips with dashed middle + tool suggestions |

---

## 7. Motion · 动效

- One entrance per page: staggered `animate-rise` on hero elements (60–80ms steps).
- Hover: color & 2px translate only. Duration 150–200ms, `ease-out`.
- All motion disabled under `prefers-reduced-motion: reduce`.

---

## 8. Platform conventions · 平台规范

| Concern | Location |
|---------|----------|
| i18n routing (`/en`, `/zh`) + locale detection | `proxy.ts`, `lib/i18n/*` |
| SEO metadata, canonical, hreflang | `lib/seo.ts` → `buildMetadata()` |
| Open Graph images | `app/api/og/route.tsx` (dynamic, per page & locale) |
| Structured data (Schema.org) | `lib/schema.ts`, `components/seo/json-ld.tsx` |
| Sitemap / robots / manifest | `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` |
| Analytics (typed events, cookie-free) | `lib/analytics.ts`, Vercel Analytics + Speed Insights |
| Security headers | `next.config.mjs` |

### Adding a page
1. Add a `RouteKey` in `lib/site.ts` (gets sitemap + canonical automatically).
2. Add strings to **both** `en.ts` and `zh.ts` (TypeScript enforces parity).
3. Use `buildMetadata()` in `generateMetadata` and wrap content in `ToolPage`.
