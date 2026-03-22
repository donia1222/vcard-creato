import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { CardData } from '@/types/card'
import QRDisplay from '@/components/QRDisplay'

export const dynamic = 'force-dynamic'

// Server component → llama al proxy interno (mismo dominio, sin CORS)
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
  if (!card) return { title: 'Tarjeta no encontrada' }
  return {
    title: `${card.name} — Tarjeta Digital`,
    description: [card.title, card.company, card.email].filter(Boolean).join(' · '),
  }
}

export default async function CardPage({ params }: { params: { id: string } }) {
  const card = await getCard(params.id)
  if (!card) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const cardUrl = `${baseUrl}/card/${card.id}`

  const initials = card.name
    .split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #dfeefb',
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <a href="/" style={{ fontWeight: 800, fontSize: 18, color: '#0f1d2c', letterSpacing: '-0.02em' }}>
          VCard <span style={{ color: '#fe6c75' }}>Creator</span>
        </a>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Card */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(15,29,44,0.10)',
            border: '1.5px solid #dfeefb',
          }}>
            {/* Top accent stripe */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #fe6c75, #f06069)' }} />

            <div style={{ padding: '36px 32px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Avatar / Photo */}
              <div style={{ marginBottom: 20 }}>
                {card.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.photo} alt={card.name}
                    style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 4px 16px rgba(15,29,44,0.12)' }} />
                ) : (
                  <div style={{
                    width: 88, height: 88, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fe6c75, #f06069)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 32, fontWeight: 800,
                    boxShadow: '0 4px 16px rgba(254,108,117,0.30)',
                  }}>
                    {initials}
                  </div>
                )}
              </div>

              {/* Name */}
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f1d2c', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 4 }}>
                {card.name}
              </h1>
              {card.title && (
                <p style={{ color: '#fe6c75', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{card.title}</p>
              )}
              {card.company && (
                <p style={{ color: '#6b7d99', fontSize: 14 }}>{card.company}</p>
              )}

              {/* Divider */}
              <div style={{ width: '100%', height: 1, background: '#dfeefb', margin: '24px 0' }} />

              {/* Contact info */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {card.email && (
                  <ContactLink href={`mailto:${card.email}`} icon="✉" text={card.email} />
                )}
                {card.phone && (
                  <ContactLink href={`tel:${card.phone}`} icon="☎" text={card.phone} />
                )}
                {card.website && (
                  <ContactLink href={card.website} icon="🌐" text={card.website} external />
                )}
                {card.address && (
                  <ContactRow icon="📍" text={card.address} />
                )}
              </div>

              {/* Save contact button */}
              <a
                href={`/api/cards?id=${card.id}&action=vcf`}
                download
                style={{
                  marginTop: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', height: 52,
                  background: '#fe6c75', color: '#fff',
                  borderRadius: 1000, fontWeight: 700, fontSize: 15,
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(254,108,117,0.30)',
                  transition: 'all 200ms',
                }}
              >
                ⬇ Guardar Contacto
              </a>
            </div>
          </div>

          {/* QR */}
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <p style={{ fontSize: 12, color: '#a8b8cc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Compartir con QR
            </p>
            <div style={{
              display: 'inline-block',
              background: '#fff', borderRadius: 16,
              padding: 14,
              border: '1.5px solid #dfeefb',
              boxShadow: '0 4px 16px rgba(15,29,44,0.06)',
            }}>
              <QRDisplay url={cardUrl} size={148} />
            </div>
          </div>

          {/* Create own */}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#a8b8cc' }}>
            Crea la tuya en{' '}
            <a href="/" style={{ color: '#fe6c75', fontWeight: 600 }}>VCard Creator</a>
          </p>
        </div>
      </main>
    </div>
  )
}

function ContactLink({
  href, icon, text, external,
}: {
  href: string; icon: string; text: string; external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 14, color: '#424e65', textDecoration: 'none',
        padding: '8px 12px', borderRadius: 12,
        transition: 'background 150ms',
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = '#f4f7fb')}
      onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{
        flexShrink: 0, width: 36, height: 36, borderRadius: 10,
        background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
      }}>
        {icon}
      </span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    </a>
  )
}

function ContactRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#424e65', padding: '8px 12px' }}>
      <span style={{
        flexShrink: 0, width: 36, height: 36, borderRadius: 10,
        background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
      }}>
        {icon}
      </span>
      <span>{text}</span>
    </div>
  )
}
