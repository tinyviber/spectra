'use client'

import './globals.css'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className="bg-background">
      <body className="flex min-h-svh items-center justify-center bg-background p-6 font-sans text-foreground">
        <main className="flex max-w-md flex-col items-center gap-5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Something went sideways · 出了点问题</h1>
          <p className="leading-relaxed text-muted-foreground">
            A critical error stopped the page from loading. 页面因严重错误无法加载。
          </p>
          {error.digest && <code className="rounded bg-muted px-2 py-1 text-xs">{error.digest}</code>}
          <button
            type="button"
            onClick={reset}
            className="h-10 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Try again · 重试
          </button>
        </main>
      </body>
    </html>
  )
}
