'use client'

import { useState } from 'react'
import { useI18n, LangSwitcher } from '@/components/I18nProvider'

const CORAL = '#fe6c75'
const DARK  = '#0f1d2c'
const GRAY  = '#6b7d99'
const LIGHT = '#f4f7fb'
const BORDER= '#dfeefb'

export default function LandingPage() {
  const { tr } = useI18n()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqItems = Array.from({ length: 7 }, (_, i) => ({
    q: tr(`land.faq.q${i + 1}`),
    a: tr(`land.faq.a${i + 1}`),
  }))

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--font-jakarta, Plus Jakarta Sans, system-ui, sans-serif)' }}>

      {/* ══ HEADER ══ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        height: 68,
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 22, color: DARK, letterSpacing: '-0.03em', textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/logo-vcard.png" alt="" width={34} height={34} style={{ borderRadius: 9, display: 'block' }} />
            <span>VCard <span style={{ color: CORAL }}>Creator</span></span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="https://lweb.ch" target="_blank" rel="noopener noreferrer" className="hide-sm" style={{ fontSize: 13, fontWeight: 700, color: '#a8b8cc', textDecoration: 'none' }}>
              {tr('header.by')} <span style={{ color: CORAL }}>Lweb</span>
            </a>
            <span className="hide-sm"><LangSwitcher /></span>
            <a href="/crear" className="btn-primary" style={{ height: 44, fontSize: 15, padding: '0 24px' }}>
              {tr('land.header.cta')}
            </a>
          </div>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section style={{ background: 'linear-gradient(160deg, #f4f7fb 0%, #fff 60%)', padding: '72px 24px 60px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} className="hero-grid">

          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff5f5', border: `1.5px solid #fecdd3`,
              color: CORAL, fontSize: 13, fontWeight: 700,
              padding: '6px 16px', borderRadius: 1000, marginBottom: 24,
            }}>
              {tr('land.hero.badge')}
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 800, color: DARK, letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 20 }}>
              {tr('land.hero.title1')}<br />
              <span style={{ color: CORAL }}>{tr('land.hero.title2')}</span><br />
              {tr('land.hero.title3')}
            </h1>

            <p style={{ fontSize: 18, color: GRAY, lineHeight: 1.65, marginBottom: 36, maxWidth: 460 }}>
              {tr('land.hero.subtitle')}
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
              <a href="/crear" className="btn-primary" style={{ fontSize: 16, height: 56, padding: '0 32px' }}>
                {tr('land.hero.cta')}
              </a>
            </div>

            {/* Mini trust: solo lo que es verdad */}
            <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: GRAY, fontWeight: 600 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {tr('land.hero.trust')}
            </p>
          </div>

          {/* Right: Dashboard mockup */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: '#fff', borderRadius: 20,
              border: `1.5px solid ${BORDER}`,
              boxShadow: '0 24px 64px rgba(15,29,44,0.14)',
              overflow: 'hidden',
            }}>
              {/* Browser bar */}
              <div style={{ background: LIGHT, padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fe6c75' }}/>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24' }}/>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4ade80' }}/>
                <div style={{ flex: 1, marginLeft: 12, background: '#fff', borderRadius: 8, padding: '5px 14px', fontSize: 12, color: GRAY, border: `1px solid ${BORDER}` }}>
                vcard-creato.vercel.app
                </div>
              </div>
              {/* Card list */}
              <div style={{ padding: '20px 20px 8px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  {tr('land.mockup.recent')}
                </p>
                {[
                  { name: 'María García', role: 'CEO · Empresa SL', color: '#fff5f5' },
                  { name: 'Carlos Pérez', role: 'Developer · Freelance', color: '#f0fdf4' },
                  { name: 'Anna Müller', role: 'Designer · Studio', color: '#eff6ff' },
                ].map((card, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 12, marginBottom: 8,
                    background: card.color, border: `1px solid ${BORDER}`,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: `linear-gradient(135deg, ${CORAL}, #f06069)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 800, fontSize: 13,
                    }}>
                      {card.name.split(' ').map(w=>w[0]).join('')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: DARK }}>{card.name}</p>
                      <p style={{ fontSize: 11, color: GRAY }}>{card.role}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: CORAL, background: '#fff5f5', border: `1px solid #fecdd3`, borderRadius: 100, padding: '2px 8px' }}>
                        vCard
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, borderTop: `1px solid ${BORDER}`, margin: '8px 0 0' }}>
                {[
                  ['QR', tr('land.mockup.s1')],
                  ['.vcf', tr('land.mockup.s2')],
                  ['CHF 0', tr('land.mockup.s3')],
                ].map(([val, label], i) => (
                  <div key={i} style={{ padding: '14px 0', textAlign: 'center', borderRight: i < 2 ? `1px solid ${BORDER}` : 'none' }}>
                    <p style={{ fontWeight: 800, fontSize: 18, color: i === 0 ? CORAL : DARK }}>{val}</p>
                    <p style={{ fontSize: 11, color: GRAY }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating QR card */}
            <div style={{
              position: 'absolute', top: -22, right: -18,
              background: '#fff', borderRadius: 16,
              border: `1.5px solid ${BORDER}`,
              boxShadow: '0 12px 32px rgba(15,29,44,0.12)',
              padding: '14px 16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <div style={{ width: 60, height: 60, background: DARK, borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 2, padding: 6 }}>
                {Array.from({length:36}).map((_,i) => (
                  <div key={i} style={{ background: [0,1,2,6,7,8,12,13,14,3,9,15,18,19,20,24,25,26,30,31,32,5,11,17,23,29,35,4,22,33].includes(i) ? '#fff' : 'transparent', borderRadius: 1 }} />
                ))}
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, color: GRAY }}>{tr('land.mockup.qr')}</p>
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 100, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: '#16a34a' }}>
                {tr('land.mockup.ready')}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══ 3 STEPS ══ */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: DARK, letterSpacing: '-0.03em', marginBottom: 12 }}>
              {tr('land.steps.title')}
            </h2>
            <p style={{ fontSize: 17, color: GRAY }}>{tr('land.steps.subtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="steps-grid">

            {/* Step 1 */}
            <div style={{ background: LIGHT, borderRadius: 24, border: `1.5px solid ${BORDER}`, overflow: 'hidden' }}>
              <div style={{ background: '#fff', margin: 16, borderRadius: 16, border: `1.5px solid ${BORDER}`, padding: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    ['👤', tr('form.name'), true],
                    ['🏢', tr('form.company'), false],
                    ['📞', tr('form.phone'), false],
                    ['✉️', tr('form.email'), false],
                  ].map(([icon, label, active], i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: LIGHT, borderRadius: 10, padding: '8px 12px',
                      border: active ? `2px solid ${CORAL}` : `1.5px solid ${BORDER}`,
                    }}>
                      <span style={{ fontSize: 13 }}>{icon as string}</span>
                      <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? DARK : GRAY }}>{label as string}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: CORAL, color: '#fff', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: DARK }}>{tr('land.step1.title')}</p>
                </div>
                <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6 }}>{tr('land.step1.desc')}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ background: LIGHT, borderRadius: 24, border: `1.5px solid ${BORDER}`, overflow: 'hidden' }}>
              <div style={{ background: '#fff', margin: 16, borderRadius: 16, border: `1.5px solid ${BORDER}`, padding: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{tr('design.choose')}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { label: tr('design.classic'), bg: '#fff', accent: CORAL, selected: true },
                    { label: tr('design.dark'), bg: '#1a2540', accent: '#60a5fa', selected: false },
                    { label: tr('design.ocean'), bg: '#0ea5e9', accent: '#fff', selected: false },
                    { label: tr('design.rose'), bg: '#ffe4e6', accent: '#e11d48', selected: false },
                  ].map((d, i) => (
                    <div key={i} style={{ borderRadius: 10, border: `2px solid ${d.selected ? CORAL : BORDER}`, padding: 8, background: d.bg, position: 'relative' }}>
                      {d.selected && (
                        <div style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: '50%', background: CORAL, color: '#fff', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                      )}
                      <div style={{ width: '100%', height: 4, borderRadius: 2, background: d.accent, marginBottom: 5 }} />
                      <div style={{ height: 4, width: '60%', borderRadius: 2, background: d.accent, opacity: 0.4, marginBottom: 3 }} />
                      <div style={{ height: 3, width: '40%', borderRadius: 2, background: d.accent, opacity: 0.25 }} />
                      <p style={{ fontSize: 9, fontWeight: 700, color: d.selected ? CORAL : GRAY, marginTop: 5, textAlign: 'center' }}>{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: CORAL, color: '#fff', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: DARK }}>{tr('land.step2.title')}</p>
                </div>
                <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6 }}>{tr('land.step2.desc')}</p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ background: LIGHT, borderRadius: 24, border: `1.5px solid ${BORDER}`, overflow: 'hidden' }}>
              <div style={{ background: '#fff', margin: 16, borderRadius: 16, border: `1.5px solid ${BORDER}`, padding: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ background: LIGHT, borderRadius: 10, padding: '8px 12px', border: `1.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12 }}>🔗</span>
                    <span style={{ fontSize: 11, color: GRAY, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>vcard-creato.vercel.app/card/...</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: CORAL, background: '#fff5f5', border: `1px solid #fecdd3`, borderRadius: 100, padding: '2px 8px', flexShrink: 0 }}>{tr('result.copy')}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: LIGHT, borderRadius: 10, padding: '8px 12px', border: `1.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 16 }}>◼</span>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: DARK }}>QR Code</p>
                        <p style={{ fontSize: 10, color: GRAY }}>PNG · SVG</p>
                      </div>
                    </div>
                    <div style={{ flex: 1, background: '#f0fdf4', borderRadius: 10, padding: '8px 12px', border: '1.5px solid #86efac', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14 }}>👤</span>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>.vcf</p>
                        <p style={{ fontSize: 10, color: '#4ade80' }}>{tr('card.save')}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: '#7c3aed', borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>⬆ {tr('share.label')}</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: CORAL, color: '#fff', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: DARK }}>{tr('land.step3.title')}</p>
                </div>
                <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6 }}>{tr('land.step3.desc')}</p>
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a href="/crear" className="btn-primary" style={{ fontSize: 16, height: 56, padding: '0 40px' }}>
              {tr('land.hero.cta')}
            </a>
          </div>
        </div>
      </section>

      {/* ══ IM ALLTAG: tres fotos (generadas con IA, sin texto en pantalla) ══ */}
      <section style={{ background: LIGHT, borderTop: `1px solid ${BORDER}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: DARK, letterSpacing: '-0.03em', marginBottom: 12 }}>
              {tr('land.use.title')}
            </h2>
            <p style={{ fontSize: 17, color: GRAY, maxWidth: 620, margin: '0 auto' }}>{tr('land.use.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="use-grid">
            {[
              { img: '/fotos/3-tienda.webp', t: 'land.use.1.t', d: 'land.use.1.d' },
              { img: '/fotos/1-mano.webp', t: 'land.use.2.t', d: 'land.use.2.d' },
              { img: '/fotos/4-escritorio.webp', t: 'land.use.3.t', d: 'land.use.3.d' },
            ].map((u) => (
              <figure key={u.img} style={{ margin: 0, background: '#fff', borderRadius: 22, border: `1.5px solid ${BORDER}`, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.img} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }} />
                <figcaption style={{ padding: '18px 20px 22px' }}>
                  <p style={{ fontWeight: 800, fontSize: 17, color: DARK, marginBottom: 6, letterSpacing: '-0.01em' }}>{tr(u.t)}</p>
                  <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{tr(u.d)}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SHOWCASE ══ */}
      <section style={{ background: LIGHT, borderTop: `1px solid ${BORDER}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: DARK, letterSpacing: '-0.03em', marginBottom: 12 }}>
              {tr('land.showcase.title')}
            </h2>
            <p style={{ fontSize: 17, color: GRAY }}>{tr('land.showcase.subtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} className="showcase-grid">
            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { icon: '🔗', t: 'land.sh.url.title', d: 'land.sh.url.desc' },
                { icon: '◼', t: 'land.sh.qr.title', d: 'land.sh.qr.desc' },
                { icon: '👤', t: 'land.sh.vcf.title', d: 'land.sh.vcf.desc' },
                { icon: '🎨', t: 'land.sh.design.title', d: 'land.sh.design.desc' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', border: `1.5px solid ${BORDER}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: DARK, marginBottom: 4 }}>{tr(item.t)}</p>
                    <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6 }}>{tr(item.d)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Phone mockup */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 280 }}>
                <div style={{ background: DARK, borderRadius: 40, padding: '14px 10px', boxShadow: '0 32px 80px rgba(15,29,44,0.25)' }}>
                  <div style={{ background: DARK, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                    <div style={{ width: 80, height: 20, background: '#1a2540', borderRadius: 100 }} />
                  </div>
                  <div style={{ background: '#fff', borderRadius: 28, overflow: 'hidden', minHeight: 480 }}>
                    <div style={{ background: `linear-gradient(135deg, ${CORAL} 0%, #f06069 100%)`, padding: '32px 20px 20px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=144&h=144&fit=crop&crop=face&auto=format"
                        alt="María García"
                        style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.85)', marginBottom: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
                      />
                      <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, marginBottom: 2 }}>María García</p>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>CEO · Empresa Digital SL</p>
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[['📞', '+34 600 000 000'], ['✉️', 'maria@empresa.com'], ['🌐', 'empresa.com'], ['📍', 'Madrid, España']].map(([icon, val], i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 14 }}>{icon}</span>
                          <span style={{ fontSize: 12, color: GRAY }}>{val}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 8, background: CORAL, borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{tr('land.phone.save')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating URL */}
                <div style={{ position: 'absolute', top: 40, right: -50, background: '#fff', borderRadius: 14, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(15,29,44,0.12)', padding: '10px 14px', fontSize: 11 }}>
                  <p style={{ fontWeight: 700, color: DARK, marginBottom: 2 }}>{tr('land.mockup.url')}</p>
                  <p style={{ color: CORAL, fontWeight: 600 }}>vcard-creato.vercel.app/...</p>
                </div>
                {/* Floating QR */}
                <div style={{ position: 'absolute', bottom: 60, left: -44, background: '#fff', borderRadius: 14, border: `1.5px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(15,29,44,0.12)', padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, background: DARK, borderRadius: 8, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>◼</div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: GRAY }}>{tr('land.mockup.qr')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section style={{ background: '#fff', borderTop: `1px solid ${BORDER}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: DARK, letterSpacing: '-0.03em', marginBottom: 12 }}>
              {tr('land.features.title')}
            </h2>
            <p style={{ fontSize: 17, color: GRAY }}>{tr('land.features.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }} className="features-grid">
            {[
              { icon: '🎨', t: 'land.feat1.title', d: 'land.feat1.desc' },
              { icon: '⚡', t: 'land.feat2.title', d: 'land.feat2.desc' },
              { icon: '🔗', t: 'land.feat3.title', d: 'land.feat3.desc' },
              { icon: '📲', t: 'land.feat4.title', d: 'land.feat4.desc' },
            ].map((f, i) => (
              <div key={i} style={{ background: LIGHT, borderRadius: 20, border: `1.5px solid ${BORDER}`, padding: '28px 22px' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff', border: `1.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>
                  {f.icon}
                </div>
                <p style={{ fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 8 }}>{tr(f.t)}</p>
                <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.65 }}>{tr(f.d)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EIN PROJEKT VON LWEB (antes: reseñas inventadas) ══ */}
      <section style={{ background: LIGHT, borderTop: `1px solid ${BORDER}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="social-grid">
          <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 64px rgba(15,29,44,0.12)', position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fotos/2-evento.webp" alt="" loading="lazy" style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff5f5', border: `1.5px solid #fecdd3`, color: CORAL, fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 1000, marginBottom: 20 }}>
              {tr('land.lweb.badge')}
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, color: DARK, letterSpacing: '-0.03em', marginBottom: 14 }}>
              {tr('land.lweb.title')}
            </h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, marginBottom: 26 }}>{tr('land.lweb.text')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {['land.lweb.p1', 'land.lweb.p2', 'land.lweb.p3'].map((k) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 14, border: `1.5px solid ${BORDER}`, padding: '12px 16px' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#e8faf2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{tr(k)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/crear" className="btn-primary" style={{ height: 52, fontSize: 15, padding: '0 26px' }}>{tr('land.hero.cta')}</a>
              <a href="https://lweb.ch" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ height: 52, fontSize: 15, padding: '0 24px' }}>{tr('land.lweb.cta')} ↗</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA BAND ══ */}
      <section style={{ background: `linear-gradient(135deg, ${DARK} 0%, #1a2a40 100%)`, padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 16 }}>
            {tr('land.cta.title1')}<br />
            <span style={{ color: CORAL }}>{tr('land.cta.title2')}</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', marginBottom: 36 }}>
            {tr('land.cta.subtitle')}
          </p>
          <a href="/crear" className="btn-primary" style={{ fontSize: 17, height: 60, padding: '0 44px' }}>
            {tr('land.cta.btn')}
          </a>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section style={{ background: '#fff', borderTop: `1px solid ${BORDER}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: DARK, letterSpacing: '-0.03em', marginBottom: 8 }}>
              {tr('land.faq.title')}
            </h2>
            <p style={{ fontSize: 16, color: GRAY }}>{tr('land.faq.subtitle')}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqItems.map((item, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', gap: 16, textAlign: 'left', fontFamily: 'inherit' }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: DARK }}>{item.q}</span>
                  <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: openFaq === i ? CORAL : LIGHT, border: `1.5px solid ${openFaq === i ? CORAL : BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: openFaq === i ? '#fff' : GRAY, fontSize: 16, fontWeight: 700, transition: 'all 200ms' }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, paddingBottom: 20 }}>{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: DARK, padding: '56px 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }} className="footer-grid">
            <div>
              <p style={{ fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.03em', marginBottom: 12 }}>
                VCard <span style={{ color: CORAL }}>Creator</span>
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280 }}>
                {tr('land.footer.desc')}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 16 }}>
                {tr('footer.made')} <a href="https://lweb.ch" target="_blank" rel="noopener noreferrer" style={{ color: CORAL, fontWeight: 600 }}>Lweb.ch</a> — Schweiz
              </p>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>{tr('land.footer.product')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['land.footer.create', '/crear'], ['land.footer.how', '/crear'], ['land.footer.designs', '/crear']].map(([key, href], i) => (
                  <a key={i} href={href} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
                    onMouseOver={(e) => (e.currentTarget.style.color = CORAL)}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>
                    {tr(key)}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>{tr('land.footer.features')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['land.footer.digital', 'land.footer.qr', 'land.footer.url', 'land.footer.vcf'].map((key, i) => (
                  <span key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{tr(key)}</span>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>{tr('land.footer.legal')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="https://lweb.ch" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Lweb.ch</a>
                <a href="mailto:info@lweb.ch" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>info@lweb.ch</a>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>9475 Sevelen, CH</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              {tr('land.footer.rights')}
            </p>
            <LangSwitcher />
          </div>
        </div>
      </footer>

    </div>
  )
}
