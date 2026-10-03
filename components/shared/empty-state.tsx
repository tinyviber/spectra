import { cn } from '@/lib/utils'

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-card/50 px-6 py-16 text-center',
        className,
      )}
    >
      <div aria-hidden="true" className="flex items-center gap-1">
        {icon ?? (
          <>
            <span className="h-10 w-6 rounded-md border bg-checker" />
            <span className="h-10 w-6 rounded-md border bg-checker" />
            <span className="h-10 w-6 rounded-md border-2 border-dashed border-primary/50" />
          </>
        )}
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h2 className="text-base font-semibold text-balance">{title}</h2>
        {description && <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}
