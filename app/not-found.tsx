'use client'

import { useI18n } from '@/components/I18nProvider'

// Tarjeta borrada o enlace mal copiado (Lweb, 23/11/2026)
export default function NotFound() {
  const { tr } = useI18n()
  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px', background: '#fff', border: '1.5px solid #dfeefb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🪪</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f1d2c', letterSpacing: '-0.02em', marginBottom: 10 }}>{tr('history.gone')}</h1>
        <p style={{ fontSize: 15, color: '#6b7d99', lineHeight: 1.6, marginBottom: 28 }}>{tr('notfound.text')}</p>
        <a href="/crear" className="btn-primary" style={{ height: 52, fontSize: 15, padding: '0 28px' }}>✦ {tr('card.own')}</a>
        <p style={{ fontSize: 12, color: '#a8b8cc', marginTop: 18 }}>
          VCard Creator · {tr('header.by')} <a href="https://lweb.ch" target="_blank" rel="noopener noreferrer" style={{ color: '#fe6c75', fontWeight: 600, textDecoration: 'none' }}>Lweb</a>
        </p>
      </div>
    </div>
  )
}
