import { NextRequest, NextResponse } from 'next/server'
import redis from '@/lib/redis'

export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await redis.get(`card:${params.id}`)
    if (!data) {
      return NextResponse.json({ error: 'Tarjeta no encontrada' }, { status: 404 })
    }
    return NextResponse.json(JSON.parse(data))
  } catch (err) {
    console.error('[GET /api/card/:id]', err)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
