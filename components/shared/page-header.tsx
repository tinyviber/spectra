import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Crumb = { name: string; href: string }

export function PageHeader({
  crumbs,
  crumbLabel,
  template,
  templateLabel,
  title,
  subtitle,
  swatch = 'bg-primary',
  className,
}: {
  crumbs: Crumb[]
  crumbLabel: string
  template?: string
  templateLabel?: string
  title: string
  subtitle?: string
  swatch?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-5 pt-10 pb-8 md:pt-14', className)}>
      <nav aria-label={crumbLabel}>
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1
            return (
              <li key={crumb.href} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-foreground">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.href} className="transition-colors hover:text-foreground">
                      {crumb.name}
                    </Link>
                    <ChevronRight aria-hidden="true" className="size-3.5" />
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      <div className="flex flex-col gap-3">
        {template && (
          <p className="flex w-fit items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1 font-mono text-xs text-muted-foreground">
            <span aria-hidden="true" className={cn('size-4 rounded-full', swatch)} />
            {templateLabel && <span className="sr-only">{templateLabel}: </span>}
            {template}
          </p>
        )}
        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">{title}</h1>
        {subtitle && <p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  )
}
