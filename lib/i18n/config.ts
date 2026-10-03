export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const localeLabels: Record<Locale, { native: string; short: string }> = {
  en: { native: 'English', short: 'EN' },
  zh: { native: '简体中文', short: '中' },
}

export const htmlLang: Record<Locale, string> = { en: 'en', zh: 'zh-CN' }
export const ogLocale: Record<Locale, string> = { en: 'en_US', zh: 'zh_CN' }

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

export function format(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`))
}
