import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = { title: '404', robots: { index: false, follow: true } }

export default function CatchAll() {
  notFound()
}
