import { cn } from '@/lib/utils'

export function SwatchChip({
  swatch,
  code,
  label,
  className,
  style,
}: {
  swatch: string
  code: string
  label?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      style={style}
      className={cn('flex flex-col overflow-hidden rounded-xl border bg-card p-1.5 shadow-sm', className)}
    >
      <div className={cn('aspect-[4/3] w-full rounded-lg', swatch)} />
      <div className="flex flex-col px-1.5 pt-2 pb-1">
        <span className="font-mono text-[11px] font-semibold tracking-wide text-foreground">{code}</span>
        {label && <span className="truncate text-[11px] text-muted-foreground">{label}</span>}
      </div>
    </div>
  )
}
