'use client'

import { createContext, useContext } from 'react'
import type { Locale } from './config'
import { getDictionary, type Dictionary } from './dictionaries'

type I18nContextValue = { locale: Locale; dict: Dictionary }

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, dict: getDictionary(locale) }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
