'use client'

import { Languages } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { track } from '@/lib/analytics'
import { useI18n } from '@/lib/i18n/client'
import { LOCALE_COOKIE, localeLabels, locales, type Locale } from '@/lib/i18n/config'

export function swapLocale(pathname: string, next: Locale) {
  const segments = pathname.split('/')
  segments[1] = next
  return segments.join('/') || `/${next}`
}

export function LocaleSwitcher() {
  const { locale, dict } = useI18n()
  const pathname = usePathname()
  const router = useRouter()

  function change(next: Locale) {
    if (next === locale) return
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
    track('locale_switched', { to: next })
    router.push(`${swapLocale(pathname, next)}${window.location.search}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="sm" aria-label={dict.nav.language} className="gap-1.5 px-2" />}
      >
        <Languages />
        <span className="font-mono text-xs">{localeLabels[locale].short}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{dict.nav.language}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={locale} onValueChange={(value) => change(value as Locale)}>
            {locales.map((l) => (
              <DropdownMenuRadioItem key={l} value={l} lang={l === 'zh' ? 'zh-CN' : 'en'}>
                {localeLabels[l].native}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
