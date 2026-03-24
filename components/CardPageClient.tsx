'use client'

import { useI18n } from '@/components/I18nProvider'
import QRDisplay from '@/components/QRDisplay'
import CardPreview from '@/components/CardPreview'
import type { CardData } from '@/types/card'

export default function CardPageClient({ card, cardUrl }: { card: CardData; cardUrl: string }) {
  const { tr } = useI18n()

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
              <QRDisplay url={cardUrl} size={148} showDownload filename={card.name.replace(/\s+/g, '_')} />
            </div>
          </div>

        </div>
      </main>

    </div>
  )
}

