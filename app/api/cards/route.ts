import { NextRequest, NextResponse } from 'next/server'
import redis from '@/lib/redis'
import type { CardData } from '@/types/card'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
    }

    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 12)

    const card: CardData = {
      id,
      name: body.name.trim(),
      company: body.company?.trim() || undefined,
      title: body.title?.trim() || undefined,
      phone: body.phone?.trim() || undefined,
      email: body.email?.trim() || undefined,
      website: body.website?.trim() || undefined,
      address: body.address?.trim() || undefined,
      photo: body.photo || undefined, // base64 data URL from client
      createdAt: new Date().toISOString(),
    }

    // Store in Redis — no expiry (permanent card)
    await redis.set(`card:${id}`, JSON.stringify(card))

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`

    const cardUrl = `${baseUrl}/card/${id}`

    // Also store url alongside card for easy retrieval
    await redis.set(`card:${id}:url`, cardUrl)

    return NextResponse.json({ id, url: cardUrl, card })
  } catch (err) {
    console.error('[POST /api/cards]', err)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
