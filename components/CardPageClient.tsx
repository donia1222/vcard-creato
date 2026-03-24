'use client'

import { useState, useEffect } from 'react'
import { useI18n, LangSwitcher } from '@/components/I18nProvider'
import QRDisplay from '@/components/QRDisplay'
import CardPreview from '@/components/CardPreview'
import type { CardData } from '@/types/card'

export default function CardPageClient({ card, cardUrl }: { card: CardData; cardUrl: string }) {
  const { tr } = useI18n()
  const [showModal, setShowModal] = useState(false)

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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        <a href="/" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 14, fontWeight: 600, color: '#6b7d99', textDecoration: 'none',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {tr('land.back')}
        </a>
        <a href="/" style={{ fontWeight: 800, fontSize: 18, color: '#0f1d2c', letterSpacing: '-0.02em' }}>
          VCard <span style={{ color: '#fe6c75' }}>Creator</span>
        </a>
        <div style={{ width: 80 }} />
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Card — rendered with the chosen design */}
          <CardPreview card={card} size="md" />

          {/* Download VCF */}
          <a href={`/api/cards?id=${card.id}&action=vcf`} download
            style={{
              marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', height: 52, background: '#fe6c75', color: '#fff',
              borderRadius: 1000, fontWeight: 700, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(254,108,117,0.30)',
            }}>
            ⬇ {tr('card.save')}
          </a>

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

