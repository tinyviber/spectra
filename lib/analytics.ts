'use client'

import { track as vercelTrack } from '@vercel/analytics'

type EventMap = {
  palette_generated: { hex: string; source: 'form' | 'preset' | 'url' }
  palette_extracted: { colors: number; source: 'upload' | 'sample' }
  directory_search: { query: string; results: number }
  directory_visit: { name: string; category: string }
  type_scale_changed: { ratio: number; base: number }
  copy: { what: string }
  locale_switched: { to: string }
  theme_switched: { to: string }
}

export function track<E extends keyof EventMap>(event: E, properties: EventMap[E]) {
  try {
    vercelTrack(event, properties)
  } catch {
    // Analytics must never break the UI.
  }
}
