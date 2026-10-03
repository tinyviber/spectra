'use client'

import { track as vercelTrack } from '@vercel/analytics'

// Events carry only actions and outcome counts — never user input
// (typed colors, search queries), per the privacy policy.
type EventMap = {
  palette_generated: { source: 'form' | 'preset' | 'url' }
  palette_extracted: { colors: number; source: 'upload' | 'sample' }
  directory_search: { results: number }
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
