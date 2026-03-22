import { NextRequest, NextResponse } from 'next/server'

// Server-side proxy → el browser llama a Vercel, Vercel llama al PHP
// Así el browser nunca hace cross-origin y no hay CORS

const PHP_API = process.env.PHP_API_URL || 'https://web.lweb.ch/vcar/api/cards.php'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(PHP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    console.error('[proxy POST /api/cards]', err)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const action = req.nextUrl.searchParams.get('action')
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    const url = `${PHP_API}?id=${encodeURIComponent(id)}${action ? `&action=${action}` : ''}`
    const res = await fetch(url, { cache: 'no-store' })

    // VCF download — reenviar el stream binario
    if (action === 'vcf') {
      const blob = await res.blob()
      return new NextResponse(blob, {
        status: res.status,
        headers: {
          'Content-Type': 'text/vcard; charset=utf-8',
          'Content-Disposition': res.headers.get('Content-Disposition') || 'attachment; filename="tarjeta.vcf"',
        },
      })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    console.error('[proxy GET /api/cards]', err)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
