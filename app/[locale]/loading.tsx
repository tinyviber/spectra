import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div role="status" aria-busy="true" className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-10 pb-24 md:px-6 md:pt-16">
      <span className="sr-only">Loading…</span>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full max-w-xl" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </div>
      <div className="flex gap-2" aria-hidden="true">
        {['bg-primary', 'bg-chart-2', 'bg-chart-3', 'bg-highlight', 'bg-foreground'].map((c, i) => (
          <span key={c} className={`h-14 w-9 animate-pulse rounded-md ${c}`} style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  )
}
