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

function AvatarFallback({ initials, size, color = '#fff' }: { initials: string; size: number; color?: string }) {
  if (initials === '?') {
    const s = size * 0.44
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.70 }}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  }
  return <>{initials}</>
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
  if (design === 'gradient') return <GradientCard {...props} />
  if (design === 'minimal') return <MinimalCard {...props} />
  if (design === 'split') return <SplitCard {...props} />
  if (design === 'glass') return <GlassCard {...props} />
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
              <AvatarFallback initials={initials} size={av} />
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
              <AvatarFallback initials={initials} size={av} />
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
// "Hero fold" — gradient banner, avatar overlapping the fold
function OceanCard({ card, initials, isSmall, namePlaceholder, emptyPlaceholder }: DesignProps) {
  const av = isSmall ? 68 : 88
  const bannerH = isSmall ? 70 : 90
  const halfAv = av / 2
  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #bae6fd', overflow: 'hidden', width: '100%', boxShadow: '0 8px 32px rgba(14,165,233,0.14)', position: 'relative' }}>
      {/* Banner */}
      <div style={{ height: bannerH, background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 60%, #38bdf8 100%)' }} />
      {/* Avatar overlapping fold */}
      <div style={{ position: 'absolute', top: bannerH - halfAv, left: '50%', transform: 'translateX(-50%)' }}>
        {card.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.photo} alt={card.name || ''} style={{ width: av, height: av, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 4px 20px rgba(3,105,161,0.25)' }} />
        ) : (
          <div style={{ width: av, height: av, borderRadius: '50%', background: 'linear-gradient(135deg, #0369a1, #38bdf8)', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: isSmall ? 22 : 28, boxShadow: '0 4px 20px rgba(3,105,161,0.25)' }}>
            <AvatarFallback initials={initials} size={av} />
          </div>
        )}
      </div>
      {/* Content below avatar */}
      <div style={{ paddingTop: halfAv + (isSmall ? 10 : 14), paddingBottom: isSmall ? 18 : 24, paddingLeft: isSmall ? 18 : 24, paddingRight: isSmall ? 18 : 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: isSmall ? 17 : 21, fontWeight: 800, color: '#0c2a40', letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.2, marginBottom: 2 }}>{card.name || namePlaceholder}</h2>
        {card.title && <p style={{ color: '#0ea5e9', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{card.title}</p>}
        {card.company && <p style={{ color: '#64748b', fontSize: 12, marginTop: 2, textAlign: 'center' }}>{card.company}</p>}
        <div style={{ width: '100%', height: 1, background: '#e0f2fe', margin: isSmall ? '12px 0' : '16px 0' }} />
        <ContactList card={card} emptyPlaceholder={emptyPlaceholder} iconBg="#e0f2fe" textColor="#374151" />
      </div>
    </div>
  )
}

// ── Rose ───────────────────────────────────────────────────
// "Ticket" — vertical left accent strip + white right panel
function RoseCard({ card, initials, isSmall, namePlaceholder, emptyPlaceholder }: DesignProps) {
  const av = isSmall ? 56 : 72
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', width: '100%', boxShadow: '0 8px 32px rgba(244,63,94,0.14)', display: 'flex', minHeight: isSmall ? 170 : 210, background: '#fff', border: '1.5px solid #fce7f3' }}>
      {/* Left rose strip */}
      <div style={{ width: isSmall ? 80 : 100, flexShrink: 0, background: 'linear-gradient(180deg, #f43f5e 0%, #fb7185 60%, #fda4af 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 8px', gap: 10 }}>
        {card.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.photo} alt={card.name || ''} style={{ width: av, height: av, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.55)' }} />
        ) : (
          <div style={{ width: av, height: av, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', border: '2px solid rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: isSmall ? 18 : 24 }}>
            <AvatarFallback initials={initials} size={av} />
          </div>
        )}
        {card.company && (
          <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.80)', textAlign: 'center', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', wordBreak: 'break-word' }}>{card.company}</p>
        )}
      </div>
      {/* Right white panel */}
      <div style={{ flex: 1, padding: isSmall ? '16px 14px' : '20px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, minWidth: 0 }}>
        <h2 style={{ fontSize: isSmall ? 14 : 18, fontWeight: 800, color: '#1f1535', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{card.name || namePlaceholder}</h2>
        {card.title && <p style={{ color: '#f43f5e', fontSize: 11, fontWeight: 600 }}>{card.title}</p>}
        <div style={{ width: '100%', height: 1, background: '#fce7f3', margin: '6px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {card.email && <RoseRow icon="✉" text={card.email} />}
          {card.phone && <RoseRow icon="☎" text={card.phone} />}
          {card.website && <RoseRow icon="🌐" text={card.website} />}
          {card.address && <RoseRow icon="📍" text={card.address} />}
          {!card.email && !card.phone && !card.website && !card.address && (
            <p style={{ color: '#fce7f3', fontSize: 11 }}>{emptyPlaceholder}</p>
          )}
        </div>
      </div>
    </div>
  )
}
function RoseRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#4a2040' }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  )
}

// ── Gradient ───────────────────────────────────────────────
function GradientCard({ card, initials, isSmall, namePlaceholder, emptyPlaceholder }: DesignProps) {
  const av = isSmall ? 64 : 80
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', width: '100%', boxShadow: '0 8px 40px rgba(99,50,234,0.25)', background: 'linear-gradient(145deg, #6332ea 0%, #a855f7 55%, #ec4899 100%)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isSmall ? '24px 20px 20px' : '32px 28px 28px' }}>
        <div style={{ marginBottom: 14 }}>
          {card.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.photo} alt={card.name || ''} style={{ width: av, height: av, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }} />
          ) : (
            <div style={{ width: av, height: av, borderRadius: '50%', background: 'rgba(255,255,255,0.20)', border: '2px solid rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: isSmall ? 22 : 28 }}>
              <AvatarFallback initials={initials} size={av} />
            </div>
          )}
        </div>
        <h2 style={{ fontSize: isSmall ? 18 : 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.2, marginBottom: 4 }}>{card.name || namePlaceholder}</h2>
        {card.title && <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{card.title}</p>}
        {card.company && <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, textAlign: 'center', marginTop: 2 }}>{card.company}</p>}
        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.20)', margin: '18px 0' }} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {card.email && <GradPill icon="✉" text={card.email} />}
          {card.phone && <GradPill icon="☎" text={card.phone} />}
          {card.website && <GradPill icon="🌐" text={card.website} />}
          {card.address && <GradPill icon="📍" text={card.address} />}
          {!card.email && !card.phone && !card.website && !card.address && (
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, textAlign: 'center' }}>{emptyPlaceholder}</p>
          )}
        </div>
      </div>
    </div>
  )
}
function GradPill({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 12px', backdropFilter: 'blur(4px)' }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 12, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  )
}

// ── Minimal ────────────────────────────────────────────────
function MinimalCard({ card, initials, isSmall, namePlaceholder, emptyPlaceholder }: DesignProps) {
  const av = isSmall ? 60 : 76
  return (
    <div style={{ background: '#fafafa', borderRadius: 20, border: '1px solid #e8e8e8', overflow: 'hidden', width: '100%', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isSmall ? '24px 20px 20px' : '32px 28px 28px' }}>
        <div style={{ marginBottom: 16 }}>
          {card.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.photo} alt={card.name || ''} style={{ width: av, height: av, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e8e8e8' }} />
          ) : (
            <div style={{ width: av, height: av, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: isSmall ? 20 : 26, letterSpacing: '-0.03em' }}>
              <AvatarFallback initials={initials} size={av} />
            </div>
          )}
        </div>
        <h2 style={{ fontSize: isSmall ? 20 : 26, fontWeight: 800, color: '#111', letterSpacing: '-0.04em', textAlign: 'center', lineHeight: 1.1, marginBottom: 4 }}>{card.name || namePlaceholder}</h2>
        {card.title && <p style={{ color: '#555', fontSize: 13, textAlign: 'center', fontWeight: 500, marginTop: 2 }}>{card.title}</p>}
        {card.company && <p style={{ color: '#999', fontSize: 12, textAlign: 'center', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.company}</p>}
        <div style={{ width: 40, height: 1, background: '#ddd', margin: '18px 0' }} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {card.email && <MinRow icon="✉" text={card.email} />}
          {card.phone && <MinRow icon="☎" text={card.phone} />}
          {card.website && <MinRow icon="🌐" text={card.website} />}
          {card.address && <MinRow icon="📍" text={card.address} />}
          {!card.email && !card.phone && !card.website && !card.address && (
            <p style={{ color: '#ccc', fontSize: 12, textAlign: 'center' }}>{emptyPlaceholder}</p>
          )}
        </div>
      </div>
    </div>
  )
}
function MinRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#333' }}>
      <span style={{ fontSize: 13, flexShrink: 0, width: 20, textAlign: 'center' }}>{icon}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderBottom: '1px solid #eee', flex: 1, paddingBottom: 8 }}>{text}</span>
    </div>
  )
}

// ── Split ──────────────────────────────────────────────────
function SplitCard({ card, initials, isSmall, namePlaceholder, emptyPlaceholder }: DesignProps) {
  const av = isSmall ? 56 : 72
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', width: '100%', boxShadow: '0 8px 32px rgba(5,150,105,0.15)', display: 'flex', minHeight: isSmall ? 160 : 200 }}>
      {/* Left panel */}
      <div style={{ width: isSmall ? 90 : 110, flexShrink: 0, background: 'linear-gradient(180deg, #059669 0%, #10b981 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 10px', gap: 10 }}>
        {card.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.photo} alt={card.name || ''} style={{ width: av, height: av, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)' }} />
        ) : (
          <div style={{ width: av, height: av, borderRadius: '50%', background: 'rgba(255,255,255,0.20)', border: '2px solid rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: isSmall ? 18 : 24 }}>
            {initials}
          </div>
        )}
        {card.company && (
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', wordBreak: 'break-word' }}>{card.company}</p>
        )}
      </div>
      {/* Right panel */}
      <div style={{ flex: 1, background: '#fff', padding: isSmall ? '16px 14px' : '20px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, minWidth: 0 }}>
        <h2 style={{ fontSize: isSmall ? 15 : 18, fontWeight: 800, color: '#0f1d2c', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{card.name || namePlaceholder}</h2>
        {card.title && <p style={{ color: '#059669', fontSize: 12, fontWeight: 600 }}>{card.title}</p>}
        <div style={{ width: '100%', height: 1, background: '#e7f7f2', margin: '6px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {card.email && <SplitRow icon="✉" text={card.email} />}
          {card.phone && <SplitRow icon="☎" text={card.phone} />}
          {card.website && <SplitRow icon="🌐" text={card.website} />}
          {card.address && <SplitRow icon="📍" text={card.address} />}
          {!card.email && !card.phone && !card.website && !card.address && (
            <p style={{ color: '#c8d5e3', fontSize: 11 }}>{emptyPlaceholder}</p>
          )}
        </div>
      </div>
    </div>
  )
}
function SplitRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#424e65' }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  )
}

// ── Glass ──────────────────────────────────────────────────
function GlassCard({ card, initials, isSmall, namePlaceholder, emptyPlaceholder }: DesignProps) {
  const av = isSmall ? 64 : 80
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', width: '100%', boxShadow: '0 20px 60px rgba(15,23,42,0.45)', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c4a6e 100%)', position: 'relative' }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(139,92,246,0.3)', filter: 'blur(30px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(6,182,212,0.25)', filter: 'blur(25px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isSmall ? '24px 20px 20px' : '32px 28px 28px' }}>
        <div style={{ marginBottom: 14 }}>
          {card.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.photo} alt={card.name || ''} style={{ width: av, height: av, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(139,92,246,0.6)', boxShadow: '0 0 20px rgba(139,92,246,0.5)' }} />
          ) : (
            <div style={{ width: av, height: av, borderRadius: '50%', background: 'rgba(139,92,246,0.25)', border: '2px solid rgba(139,92,246,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4b5fd', fontWeight: 800, fontSize: isSmall ? 22 : 28 }}>
              <AvatarFallback initials={initials} size={av} />
            </div>
          )}
        </div>
        <h2 style={{ fontSize: isSmall ? 18 : 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.2, marginBottom: 4 }}>{card.name || namePlaceholder}</h2>
        {card.title && <p style={{ color: '#a78bfa', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{card.title}</p>}
        {card.company && <p style={{ color: 'rgba(241,245,249,0.5)', fontSize: 13, textAlign: 'center', marginTop: 2 }}>{card.company}</p>}
        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.10)', margin: '18px 0' }} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {card.email && <GlassPill icon="✉" text={card.email} />}
          {card.phone && <GlassPill icon="☎" text={card.phone} />}
          {card.website && <GlassPill icon="🌐" text={card.website} />}
          {card.address && <GlassPill icon="📍" text={card.address} />}
          {!card.email && !card.phone && !card.website && !card.address && (
            <p style={{ color: 'rgba(241,245,249,0.3)', fontSize: 12, textAlign: 'center' }}>{emptyPlaceholder}</p>
          )}
        </div>
      </div>
    </div>
  )
}
function GlassPill({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 12px' }}>
      <span style={{ fontSize: 13, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 12, color: 'rgba(241,245,249,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
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
