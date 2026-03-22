import { NextRequest, NextResponse } from 'next/server'
import redis from '@/lib/redis'
import { generateVCF } from '@/lib/vcf'
import type { CardData } from '@/types/card'

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

    const card: CardData = JSON.parse(data)
    const vcfContent = generateVCF(card)
    const filename = `${card.name.replace(/\s+/g, '_')}_tarjeta.vcf`

    return new NextResponse(vcfContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('[GET /api/card/:id/vcf]', err)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
