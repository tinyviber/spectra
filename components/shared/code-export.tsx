'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { track } from '@/lib/analytics'
import { useI18n } from '@/lib/i18n/client'

export function useCopy() {
  const { dict } = useI18n()
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(value: string, what: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(value)
      toast.success(dict.common.copied, { description: value.length > 40 ? undefined : value })
      track('copy', { what })
      setTimeout(() => setCopied((c) => (c === value ? null : c)), 1500)
    } catch {
      toast.error(dict.common.copyFailed)
    }
  }

  return { copy, copied }
}

export function CodeExport({ formats, name }: { formats: { id: string; label: string; code: string }[]; name: string }) {
  const { dict } = useI18n()
  const { copy, copied } = useCopy()

  return (
    <Tabs defaultValue={formats[0].id} className="gap-0 overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-2 border-b px-2 py-1.5">
        <TabsList variant="line">
          {formats.map((f) => (
            <TabsTrigger key={f.id} value={f.id} className="font-mono text-xs">
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {formats.map((f) => (
        <TabsContent key={f.id} value={f.id} className="relative">
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-3 right-3"
            onClick={() => copy(f.code, `${name}:${f.id}`)}
          >
            {copied === f.code ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
            {dict.common.copy}
          </Button>
          <pre className="max-h-80 overflow-auto p-4 pr-24 font-mono text-xs leading-relaxed text-foreground/90">
            <code>{f.code}</code>
          </pre>
        </TabsContent>
      ))}
    </Tabs>
  )
}
