'use client'

import { ArrowUpRight, Search, SearchX, Star, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { track } from '@/lib/analytics'
import { format } from '@/lib/i18n/config'
import { useI18n } from '@/lib/i18n/client'
import { categories, pricings, resources, type Category, type Pricing } from '@/lib/resources'
import { cn } from '@/lib/utils'

type Sort = 'featured' | 'name'

const categoryTint: Record<Category, string> = {
  color: 'bg-chart-1',
  typography: 'bg-chart-2',
  icons: 'bg-chart-3',
  illustration: 'bg-chart-4',
  inspiration: 'bg-chart-5',
  tooling: 'bg-foreground',
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex h-8 items-center gap-2 rounded-full border px-3 text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        active ? 'border-foreground bg-foreground text-background' : 'bg-card text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

export function DirectoryTool({
  initialQuery,
  initialCategory,
}: {
  initialQuery: string
  initialCategory: Category | null
}) {
  const { dict, locale } = useI18n()
  const t = dict.directory
  const router = useRouter()
  const pathname = usePathname()

  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState<Category | null>(initialCategory)
  const [pricing, setPricing] = useState<Pricing | null>(null)
  const [sort, setSort] = useState<Sort>('featured')
  const deferredQuery = useDeferredValue(query)

  const results = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    const filtered = resources.filter((r) => {
      if (category && r.category !== category) return false
      if (pricing && r.pricing !== pricing) return false
      if (!q) return true
      const haystack = [r.name, r.description[locale], r.description.en, t.categories[r.category], ...r.tags].join(' ').toLowerCase()
      return haystack.includes(q)
    })
    return filtered.sort((a, b) =>
      sort === 'featured' ? Number(!!b.featured) - Number(!!a.featured) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name),
    )
  }, [deferredQuery, category, pricing, sort, locale, t.categories])

  useEffect(() => {
    const params = new URLSearchParams()
    if (deferredQuery.trim()) params.set('q', deferredQuery.trim())
    if (category) params.set('category', category)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [deferredQuery, category, pathname, router])

  useEffect(() => {
    const q = deferredQuery.trim()
    if (q.length < 2) return
    const id = setTimeout(() => track('directory_search', { query: q, results: results.length }), 800)
    return () => clearTimeout(id)
  }, [deferredQuery, results.length])

  const hasFilters = !!(query || category || pricing)
  const clear = () => {
    setQuery('')
    setCategory(null)
    setPricing(null)
  }

  const sortItems = [
    { value: 'featured', label: t.sortFeatured },
    { value: 'name', label: t.sortName },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-5">
        <div className="relative">
          <label htmlFor="directory-search" className="sr-only">
            {t.searchLabel}
          </label>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="directory-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            autoComplete="off"
            className="h-12 rounded-xl pr-10 pl-10 text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-1/2 right-3 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X aria-hidden="true" className="size-4" />
              <span className="sr-only">{dict.common.reset}</span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label={t.category} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:pb-0">
            <Chip active={!category} onClick={() => setCategory(null)}>
              {t.all}
            </Chip>
            {categories.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>
                <span aria-hidden="true" className={cn('size-2 rounded-full', categoryTint[c])} />
                {t.categories[c]}
              </Chip>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div role="group" aria-label={t.pricing} className="flex gap-1 rounded-full border p-0.5">
              {pricings.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={pricing === p}
                  onClick={() => setPricing(pricing === p ? null : p)}
                  className="h-7 rounded-full px-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-muted aria-pressed:text-foreground"
                >
                  {t.prices[p]}
                </button>
              ))}
            </div>
            <Select items={sortItems} value={sort} onValueChange={(v) => v && setSort(v as Sort)}>
              <SelectTrigger aria-label={t.sort} className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm text-muted-foreground tabular-nums">
          {results.length === 1 ? t.resultsOne : format(t.results, { count: results.length })}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clear}>
            {t.clear}
          </Button>
        )}
      </div>

      {results.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <li key={r.id}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('directory_visit', { name: r.name, category: r.category })}
                className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="relative flex size-10 items-center justify-center rounded-xl border bg-muted font-mono text-sm font-semibold text-foreground"
                  >
                    {r.name.slice(0, 2)}
                    <span className={cn('absolute -right-1 -bottom-1 size-3 rounded-full ring-2 ring-card', categoryTint[r.category])} />
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <h2 className="flex items-center gap-2 font-semibold">
                    {r.name}
                    {r.featured && (
                      <Star aria-label={t.featured} className="size-3.5 fill-primary text-primary" />
                    )}
                  </h2>
                  <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{r.description[locale]}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary">{t.categories[r.category]}</Badge>
                  <Badge variant="outline">{t.prices[r.pricing]}</Badge>
                </div>
                <span className="sr-only">{format(t.visit, { name: r.name })}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<SearchX className="size-8 text-muted-foreground" />}
          title={deferredQuery.trim() ? format(t.emptyTitle, { query: deferredQuery.trim() }) : t.emptyTitleFilters}
          description={t.emptyDescription}
          action={
            <Button variant="outline" onClick={clear}>
              {t.clear}
            </Button>
          }
        />
      )}
    </div>
  )
}
