import { NextRequest, NextResponse } from 'next/server'
import { cardApi } from '@/lib/api'

// Solo lectura, por compatibilidad con enlaces antiguos (/api/cards?id=…&action=vcf).
// Crear, editar y borrar van directos del navegador a la API PHP (ver lib/api.ts).
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') || ''
  if (!/^[a-f0-9]{12}$/.test(id)) return NextResponse.json({ error: 'id_invalid' }, { status: 400 })
  const vcf = req.nextUrl.searchParams.get('action') === 'vcf'
  try {
    const res = await fetch(cardApi(id) + (vcf ? '&action=vcf' : ''), { cache: 'no-store' })
    if (vcf && res.ok) {
      return new NextResponse(await res.arrayBuffer(), {
        status: 200,
        headers: {
          'Content-Type': 'text/vcard; charset=utf-8',
          'Content-Disposition': res.headers.get('Content-Disposition') || 'attachment; filename="kontakt.vcf"',
        },
      })
    }
    const data = await res.json().catch(() => ({ error: 'server_error' }))
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 502 })
  }
}
