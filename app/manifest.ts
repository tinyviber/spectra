import type { MetadataRoute } from 'next'
import en from '@/lib/i18n/dictionaries/en'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Spectra',
    short_name: 'Spectra',
    description: en.meta.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfcfe',
    theme_color: '#2f5bea',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
