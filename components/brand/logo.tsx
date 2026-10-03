import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('relative inline-flex size-6 shrink-0', className)}>
      <span className="absolute inset-0 rounded-md bg-primary" />
      <span className="absolute right-0 bottom-0 size-1/2 rounded-tl-md rounded-br-md bg-highlight" />
    </span>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-semibold tracking-tight', className)}>
      <LogoMark />
      <span>Spectra</span>
    </span>
  )
}
