import { NextRequest, NextResponse } from 'next/server'

const PHP_API = 'https://web.lweb.ch/vcard/api/cards.php'

export async function POST(req: NextRequest) {
  let text = ''
  try {
    const body = await req.json()

    const res = await fetch(PHP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    text = await res.text()

    // Strip possible BOM or whitespace before JSON
    const clean = text.trim().replace(/^\uFEFF/, '')
    const data = JSON.parse(clean)
    return NextResponse.json(data, { status: res.status })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    // Return the raw PHP response so we can see what went wrong
    return NextResponse.json(
      { error: msg, php_url: PHP_API, raw: text.slice(0, 1000) },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  let text = ''
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

    text = await res.text()
    const clean = text.trim().replace(/^\uFEFF/, '')
    const data = JSON.parse(clean)
    return NextResponse.json(data, { status: res.status })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: msg, php_url: PHP_API, raw: text.slice(0, 1000) },
      { status: 500 }
    )
  }
}
