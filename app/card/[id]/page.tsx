import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { CardData } from '@/types/card'
import CardPageClient from '@/components/CardPageClient'

export const dynamic = 'force-dynamic'

const INTERNAL_API = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/cards`
  : 'http://localhost:3000/api/cards'

async function getCard(id: string): Promise<CardData | null> {
  try {
    const res = await fetch(`${INTERNAL_API}?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const card = await getCard(params.id)
  if (!card) return { title: 'Card not found' }
  return {
    title: `${card.name} — Digital Business Card`,
    description: [card.title, card.company, card.email].filter(Boolean).join(' · '),
  }
}

export default async function CardPage({ params }: { params: { id: string } }) {
  const card = await getCard(params.id)
  if (!card) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const cardUrl = `${baseUrl}/card/${card.id}`

  return <CardPageClient card={card} cardUrl={cardUrl} />
}

