'use client'

import { RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/client'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { dict, locale } = useI18n()
  const t = dict.states

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <div aria-hidden="true" className="flex gap-1">
        <span className="h-14 w-9 rounded-md bg-destructive" />
        <span className="h-14 w-9 rounded-md bg-destructive/60" />
        <span className="h-14 w-9 rounded-md bg-destructive/25" />
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{t.errorTitle}</h1>
        <p className="leading-relaxed text-pretty text-muted-foreground">{t.errorDescription}</p>
      </div>
      {error.digest && (
        <p className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
          {t.errorCode}: {error.digest}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={reset}>
          <RotateCcw data-icon="inline-start" />
          {dict.common.tryAgain}
        </Button>
        <Link href={`/${locale}`} className={buttonVariants({ variant: 'outline' })}>
          {dict.common.backHome}
        </Link>
      </div>
    </div>
  )
}
