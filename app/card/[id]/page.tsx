import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import type { CardData, CardDesign } from '@/types/card'
import CardPageClient from '@/components/CardPageClient'
import { cardApi } from '@/lib/api'

export const dynamic = 'force-dynamic'

const DESIGNS = ['classic', 'dark', 'ocean', 'rose', 'gradient', 'minimal', 'split', 'glass']

async function getCard(id: string): Promise<CardData | null> {
  if (!/^[a-f0-9]{12}$/.test(id)) return null
  try {
    const res = await fetch(cardApi(id), { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// La dirección pública sale de la propia petición: así el QR siempre apunta a donde se abrió la página
// (vcard-creato.vercel.app, o la de pruebas), sin depender de una variable en Vercel.
function baseUrl(): string {
  const h = headers()
  const host = h.get('x-forwarded-host') || h.get('host') || 'vcard-creato.vercel.app'
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https')
  return `${proto}://${host}`
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const card = await getCard(params.id)
  if (!card) return { title: 'VCard Creator' }
  return {
    title: `${card.name} · Digitale Visitenkarte`,
    description: [card.title, card.company].filter(Boolean).join(' · ') || 'Digitale Visitenkarte – erstellt mit VCard Creator von Lweb',
    robots: { index: false, follow: false },
  }
}

export default async function CardPage({ params, searchParams }: { params: { id: string }; searchParams: { design?: string } }) {
  const card = await getCard(params.id)
  if (!card) notFound()
  const design = (DESIGNS.includes(card.design ?? '') ? card.design : null)
    ?? (DESIGNS.includes(searchParams.design ?? '') ? searchParams.design : 'classic')
  return <CardPageClient card={{ ...card, design: design as CardDesign }} cardUrl={`${baseUrl()}/card/${card.id}`} />
}
