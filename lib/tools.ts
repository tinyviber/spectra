import type { Dictionary } from './i18n/dictionaries'
import { routes } from './site'

export type ToolKey = 'palette' | 'extract' | 'directory' | 'typeScale'

export const tools: {
  key: ToolKey
  path: string
  template: keyof Dictionary['templates']
  swatch: string
  code: string
}[] = [
  { key: 'palette', path: routes.palette.path, template: 'inputResult', swatch: 'bg-primary', code: 'SP 262 C' },
  { key: 'extract', path: routes.extract.path, template: 'uploadResult', swatch: 'bg-highlight', code: 'SP 102 C' },
  { key: 'directory', path: routes.directory.path, template: 'searchDirectory', swatch: 'bg-chart-3', code: 'SP 262 T' },
  { key: 'typeScale', path: routes.typeScale.path, template: 'controlsVisualization', swatch: 'bg-foreground', code: 'SP INK' },
]
