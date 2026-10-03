'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useI18n } from '@/lib/i18n/client'
import { routes } from '@/lib/site'
import { tools } from '@/lib/tools'
import { cn } from '@/lib/utils'
import { LocaleSwitcher } from './locale-switcher'
import { ThemeToggle } from './theme-toggle'

export function SiteHeader() {
  const { locale, dict } = useI18n()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    ...tools.map((tool) => ({ href: `/${locale}${tool.path}`, label: dict.nav[tool.key], template: dict.templates[tool.template] })),
    { href: `/${locale}${routes.about.path}`, label: dict.nav.about, template: null },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 md:px-6">
        <Link href={`/${locale}`} className="rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" aria-label={`Spectra — ${dict.nav.home}`}>
          <Logo />
        </Link>

        <nav aria-label={dict.nav.primary} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                    'aria-[current=page]:bg-secondary aria-[current=page]:text-secondary-foreground aria-[current=page]:font-medium',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label={dict.nav.menu} />}>
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader className="border-b">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
                <SheetDescription>{dict.meta.tagline}</SheetDescription>
              </SheetHeader>
              <nav aria-label={dict.nav.primary} className="px-2">
                <ul className="flex flex-col gap-1">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                        className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted aria-[current=page]:bg-secondary"
                      >
                        <span className="text-base font-medium">{link.label}</span>
                        {link.template && <span className="font-mono text-xs text-muted-foreground">{link.template}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
