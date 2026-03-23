import type { CardData } from '@/types/card'

interface CardPreviewProps {
  card: Partial<CardData>
  size?: 'sm' | 'md'
  namePlaceholder?: string
  emptyPlaceholder?: string
}

interface DesignProps {
  card: Partial<CardData>
  initials: string
  isSmall: boolean
  namePlaceholder: string
  emptyPlaceholder: string
}

export default function CardPreview({ card, size = 'md', namePlaceholder = 'Your Name', emptyPlaceholder = 'Fill in the form' }: CardPreviewProps) {
  const design = card.design || 'classic'
  const initials = card.name
    ? card.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  const isSmall = size === 'sm'
  const props: DesignProps = { card, initials, isSmall, namePlaceholder, emptyPlaceholder }

  if (design === 'dark') return <DarkCard {...props} />
  if (design === 'ocean') return <OceanCard {...props} />
  if (design === 'rose') return <RoseCard {...props} />
  return <ClassicCard {...props} />
}

// ── Classic ────────────────────────────────────────────────
function ClassicCard({ card, initials, isSmall, namePlaceholder, emptyPlaceholder }: DesignProps) {
  const av = isSmall ? 64 : 80
  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #dfeefb', overflow: 'hidden', width: '100%', boxShadow: '0 4px 20px rgba(15,29,44,0.07)' }}>
      <div style={{ height: 4, background: 'linear-gradient(90deg, #fe6c75, #f06069)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isSmall ? 20 : 28 }}>
        <div style={{ marginBottom: 14 }}>
          {card.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.photo} alt={card.name || ''} style={{ width: av, height: av, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 4px 16px rgba(15,29,44,0.10)' }} />
          ) : (
            <div style={{ width: av, height: av, borderRadius: '50%', background: 'linear-gradient(135deg, #fe6c75, #f06069)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: isSmall ? 22 : 28, boxShadow: '0 4px 16px rgba(254,108,117,0.25)' }}>
              {initials}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <h2 style={{ fontSize: isSmall ? 18 : 22, fontWeight: 800, color: '#0f1d2c', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{card.name || namePlaceholder}</h2>
          {card.title && <p style={{ color: '#fe6c75', fontSize: 13, fontWeight: 600, marginTop: 4 }}>{card.title}</p>}
          {card.company && <p style={{ color: '#6b7d99', fontSize: 13, marginTop: 2 }}>{card.company}</p>}
        </div>
        <div style={{ width: '100%', height: 1, background: '#dfeefb', marginBottom: 18 }} />
        <ContactList card={card} emptyPlaceholder={emptyPlaceholder} iconBg="#fff5f5" textColor="#424e65" />
      </div>
    </div>
  )
}

// ── Dark ───────────────────────────────────────────────────
function DarkCard({ card, initials, isSmall, namePlaceholder, emptyPlaceholder }: DesignProps) {
  const av = isSmall ? 64 : 80
  return (
    <div style={{ background: '#0f1d2c', borderRadius: 20, border: '1.5px solid #1e3048', overflow: 'hidden', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.30)' }}>
      <div style={{ height: 4, background: 'linear-gradient(90deg, #fe6c75, #f06069)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isSmall ? 20 : 28 }}>
        <div style={{ marginBottom: 14 }}>
          {card.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.photo} alt={card.name || ''} style={{ width: av, height: av, borderRadius: '50%', objectFit: 'cover', border: '3px solid #1e3048', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }} />
          ) : (
            <div style={{ width: av, height: av, borderRadius: '50%', background: 'linear-gradient(135deg, #fe6c75, #f06069)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: isSmall ? 22 : 28, boxShadow: '0 4px 20px rgba(254,108,117,0.35)' }}>
              {initials}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <h2 style={{ fontSize: isSmall ? 18 : 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{card.name || namePlaceholder}</h2>
          {card.title && <p style={{ color: '#fe6c75', fontSize: 13, fontWeight: 600, marginTop: 4 }}>{card.title}</p>}
          {card.company && <p style={{ color: '#7a90a8', fontSize: 13, marginTop: 2 }}>{card.company}</p>}
        </div>
        <div style={{ width: '100%', height: 1, background: '#1e3048', marginBottom: 18 }} />
        <ContactList card={card} emptyPlaceholder={emptyPlaceholder} iconBg="#1e3048" textColor="#a8c0d8" />
      </div>
    </div>
  )
}

// ── Ocean ──────────────────────────────────────────────────
function OceanCard({ card, initials, isSmall, namePlaceholder, emptyPlaceholder }: DesignProps) {
  const av = isSmall ? 64 : 80
  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #bae6fd', overflow: 'hidden', width: '100%', boxShadow: '0 8px 32px rgba(14,165,233,0.12)' }}>
      {/* Gradient header */}
      <div style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', padding: isSmall ? '24px 20px 28px' : '28px 28px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: 14 }}>
          {card.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.photo} alt={card.name || ''} style={{ width: av, height: av, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.45)', boxShadow: '0 4px 20px rgba(0,0,0,0.20)' }} />
          ) : (
            <div style={{ width: av, height: av, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.40)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: isSmall ? 22 : 28 }}>
              {initials}
            </div>
          )}
        </div>
        <h2 style={{ fontSize: isSmall ? 18 : 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.2 }}>{card.name || namePlaceholder}</h2>
        {card.title && <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600, marginTop: 4, textAlign: 'center' }}>{card.title}</p>}
        {card.company && <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 2, textAlign: 'center' }}>{card.company}</p>}
      </div>
      {/* White body */}
      <div style={{ padding: isSmall ? '16px 20px' : '20px 28px' }}>
        <ContactList card={card} emptyPlaceholder={emptyPlaceholder} iconBg="#e0f2fe" textColor="#374151" />
      </div>
    </div>
  )
}

// ── Rose ───────────────────────────────────────────────────
function RoseCard({ card, initials, isSmall, namePlaceholder, emptyPlaceholder }: DesignProps) {
  const av = isSmall ? 64 : 80
  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #fce7f3', overflow: 'hidden', width: '100%', boxShadow: '0 8px 32px rgba(244,63,94,0.10)' }}>
      <div style={{ height: 10, background: 'linear-gradient(90deg, #f43f5e, #fb7185, #fda4af)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isSmall ? 20 : 28 }}>
        <div style={{ marginBottom: 14 }}>
          {card.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.photo} alt={card.name || ''} style={{ width: av, height: av, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fce7f3', boxShadow: '0 4px 16px rgba(244,63,94,0.20)' }} />
          ) : (
            <div style={{ width: av, height: av, borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #fb7185)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: isSmall ? 22 : 28, boxShadow: '0 4px 20px rgba(244,63,94,0.30)' }}>
              {initials}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <h2 style={{ fontSize: isSmall ? 18 : 22, fontWeight: 800, color: '#1f1535', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{card.name || namePlaceholder}</h2>
          {card.title && <p style={{ color: '#f43f5e', fontSize: 13, fontWeight: 600, marginTop: 4 }}>{card.title}</p>}
          {card.company && <p style={{ color: '#9d6b8f', fontSize: 13, marginTop: 2 }}>{card.company}</p>}
        </div>
        <div style={{ width: '100%', height: 1, background: '#fce7f3', marginBottom: 18 }} />
        <ContactList card={card} emptyPlaceholder={emptyPlaceholder} iconBg="#fdf2f8" textColor="#4a2040" />
      </div>
    </div>
  )
}

// ── Shared contact list ────────────────────────────────────
function ContactList({ card, emptyPlaceholder, iconBg, textColor }: {
  card: Partial<CardData>
  emptyPlaceholder: string
  iconBg: string
  textColor: string
}) {
  const hasAny = card.email || card.phone || card.website || card.address
  if (!hasAny) return <p style={{ color: '#c8d5e3', fontSize: 12, textAlign: 'center', padding: '4px 0' }}>{emptyPlaceholder}</p>
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {card.email && <CRow icon="✉" text={card.email} iconBg={iconBg} textColor={textColor} />}
      {card.phone && <CRow icon="☎" text={card.phone} iconBg={iconBg} textColor={textColor} />}
      {card.website && <CRow icon="🌐" text={card.website} iconBg={iconBg} textColor={textColor} />}
      {card.address && <CRow icon="📍" text={card.address} iconBg={iconBg} textColor={textColor} />}
    </div>
  )
}

function CRow({ icon, text, iconBg, textColor }: { icon: string; text: string; iconBg: string; textColor: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: textColor }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
        {icon}
      </span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  )
}
