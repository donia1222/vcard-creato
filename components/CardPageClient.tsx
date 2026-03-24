'use client'

import { useState, useEffect } from 'react'
import { useI18n, LangSwitcher } from '@/components/I18nProvider'
import QRDisplay from '@/components/QRDisplay'
import type { CardData } from '@/types/card'

export default function CardPageClient({ card, cardUrl }: { card: CardData; cardUrl: string }) {
  const { tr } = useI18n()
  const [showModal, setShowModal] = useState(false)

  const initials = card.name
    .split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  useEffect(() => {
    const t = setTimeout(() => setShowModal(true), 3500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #dfeefb', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <a href="/" style={{ fontWeight: 800, fontSize: 18, color: '#0f1d2c', letterSpacing: '-0.02em' }}>
          VCard <span style={{ color: '#fe6c75' }}>Creator</span>
        </a>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Card */}
          <div style={{
            background: '#fff', borderRadius: 24, overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(15,29,44,0.10)', border: '1.5px solid #dfeefb',
          }}>
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

              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f1d2c', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 4 }}>
                {card.name}
              </h1>
              {card.title && <p style={{ color: '#fe6c75', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{card.title}</p>}
              {card.company && <p style={{ color: '#6b7d99', fontSize: 14 }}>{card.company}</p>}

              <div style={{ width: '100%', height: 1, background: '#dfeefb', margin: '24px 0' }} />

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {card.email && <ContactLink href={`mailto:${card.email}`} icon="✉" text={card.email} />}
                {card.phone && <ContactLink href={`tel:${card.phone}`} icon="☎" text={card.phone} />}
                {card.website && <ContactLink href={card.website} icon="🌐" text={card.website} external />}
                {card.address && <ContactRow icon="📍" text={card.address} />}
              </div>

              <a href={`/api/cards?id=${card.id}&action=vcf`} download
                style={{
                  marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', height: 52, background: '#fe6c75', color: '#fff',
                  borderRadius: 1000, fontWeight: 700, fontSize: 15, textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(254,108,117,0.30)',
                }}>
                ⬇ {tr('card.save')}
              </a>
            </div>
          </div>

          {/* QR */}
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <p style={{ fontSize: 12, color: '#a8b8cc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              {tr('card.qr.label')}
            </p>
            <div style={{
              display: 'inline-block', background: '#fff', borderRadius: 16, padding: 14,
              border: '1.5px solid #dfeefb', boxShadow: '0 4px 16px rgba(15,29,44,0.06)',
            }}>
              <QRDisplay url={cardUrl} size={148} />
            </div>
          </div>

          {/* Trigger modal button */}
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', marginTop: 20, height: 48,
              background: '#fff5f5', border: '1.5px solid #fecdd3',
              borderRadius: 1000, color: '#fe6c75', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 200ms',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#fee2e2' }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#fff5f5' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {tr('card.create')} VCard Creator
          </button>
        </div>
      </main>

      {/* ── MODAL: Create own card ── */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(15,29,44,0.55)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            padding: '0 0 0 0',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '28px 28px 0 0',
              width: '100%', maxWidth: 480,
              boxShadow: '0 -20px 60px rgba(15,29,44,0.20)',
              border: '1.5px solid #dfeefb',
              overflow: 'hidden',
            }}
          >
            {/* Top accent */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #fe6c75, #f06069)' }} />

            <div style={{ padding: '28px 28px 32px' }}>
              {/* Drag handle */}
              <div style={{ width: 40, height: 4, background: '#dfeefb', borderRadius: 100, margin: '0 auto 24px' }} />

              {/* Logo */}
              <p style={{ fontWeight: 800, fontSize: 20, color: '#0f1d2c', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 8 }}>
                VCard <span style={{ color: '#fe6c75' }}>Creator</span>
              </p>

              {/* Title */}
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f1d2c', textAlign: 'center', marginBottom: 6, lineHeight: 1.3 }}>
                {tr('card.modal.title')}
              </h2>
              <p style={{ fontSize: 14, color: '#6b7d99', textAlign: 'center', marginBottom: 28 }}>
                {tr('card.modal.sub')}
              </p>

              {/* Features */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
                {['🔗 URL permanente', '◼ QR incluido', '👤 .vcf contacto'].map((f, i) => (
                  <span key={i} style={{ fontSize: 13, color: '#424e65', fontWeight: 600 }}>{f}</span>
                ))}
              </div>

              {/* CTA */}
              <a href="/" className="btn-primary" style={{ width: '100%', height: 56, fontSize: 16, justifyContent: 'center', borderRadius: 1000, marginBottom: 16 }}>
                {tr('card.modal.cta')}
              </a>

              {/* Lang switcher + close */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <LangSwitcher />
                <button
                  onClick={() => setShowModal(false)}
                  style={{ fontSize: 13, color: '#a8b8cc', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {tr('card.modal.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ContactLink({ href, icon, text, external }: { href: string; icon: string; text: string; external?: boolean }) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#424e65', textDecoration: 'none', padding: '8px 12px', borderRadius: 12 }}
      onMouseOver={(e) => (e.currentTarget.style.background = '#f4f7fb')}
      onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}>
      <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
        {icon}
      </span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    </a>
  )
}

function ContactRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#424e65', padding: '8px 12px' }}>
      <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
        {icon}
      </span>
      <span>{text}</span>
    </div>
  )
}
