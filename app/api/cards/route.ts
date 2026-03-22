import { NextRequest, NextResponse } from 'next/server'

const PHP_API = process.env.PHP_API_URL || 'https://web.lweb.ch/vcard/api/cards.php'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await fetch(PHP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    // Leer como texto primero para poder debuggear si no es JSON válido
    const text = await res.text()
    console.log('[proxy POST] status:', res.status, 'body:', text.slice(0, 300))

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: 'PHP response is not JSON', raw: text.slice(0, 500) },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: res.status })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[proxy POST] fetch failed:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const action = req.nextUrl.searchParams.get('action')
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    const url = `${PHP_API}?id=${encodeURIComponent(id)}${action ? `&action=${action}` : ''}`
    const res = await fetch(url, { cache: 'no-store' })

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

    const text = await res.text()
    console.log('[proxy GET] status:', res.status, 'body:', text.slice(0, 300))

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: 'PHP response is not JSON', raw: text.slice(0, 500) },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: res.status })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[proxy GET] fetch failed:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
