'use client'

import { useState, useRef, useEffect } from 'react'
import CardPreview from '@/components/CardPreview'
import QRDisplay from '@/components/QRDisplay'
import { useI18n, LangSwitcher } from '@/components/I18nProvider'
import type { CardData } from '@/types/card'

interface FormState {
  name: string; company: string; title: string
  phone: string; email: string; website: string
  address: string; photo: string
}

const EMPTY: FormState = {
  name: '', company: '', title: '',
  phone: '', email: '', website: '',
  address: '', photo: '',
}

interface Result { id: string; url: string; card: CardData }

interface HistoryEntry {
  id: string
  url: string
  name: string
  company?: string
  title?: string
  createdAt: string
}

const LS_KEY = 'vcard_history'

function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  } catch { return [] }
}

function saveToHistory(result: Result) {
  const entries = loadHistory()
  const entry: HistoryEntry = {
    id: result.id,
    url: result.url,
    name: result.card.name,
    company: result.card.company,
    title: result.card.title,
    createdAt: new Date().toISOString(),
  }
  // Evitar duplicados
  const filtered = entries.filter((e) => e.id !== entry.id)
  localStorage.setItem(LS_KEY, JSON.stringify([entry, ...filtered].slice(0, 50)))
}

export default function HomePage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showImpressum, setShowImpressum] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showCookies, setShowCookies] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { tr } = useI18n()

  useEffect(() => {
    setHistory(loadHistory())
    if (!localStorage.getItem('cookie_consent')) setShowCookies(true)
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', '1')
    setShowCookies(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((p) => ({ ...p, photo: reader.result as string }))
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError(tr('form.error.name')); return }
    setLoading(true)
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear la tarjeta')
      setResult(data)
      saveToHistory(data)
      setHistory(loadHistory())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleCopyHistoryUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDeleteHistory = (id: string) => {
    const updated = loadHistory().filter((e) => e.id !== id)
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
    setHistory(updated)
  }

  const handleClearHistory = () => {
    localStorage.removeItem(LS_KEY)
    setHistory([])
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #dfeefb',
        height: 64,
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#0f1d2c', letterSpacing: '-0.02em' }}>
            VCard <span style={{ color: '#fe6c75' }}>Creator</span>
          </span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {history.length > 0 && (
              <button onClick={() => setShowHistory(true)}
                className="btn-secondary"
                style={{ height: 40, fontSize: 14, padding: '0 16px', gap: 6 }}>
                🕐 {tr('history.btn')}
                <span style={{
                  background: '#fe6c75', color: '#fff',
                  borderRadius: 100, fontSize: 11, fontWeight: 700,
                  padding: '1px 6px', marginLeft: 2,
                }}>
                  {history.length}
                </span>
              </button>
            )}
            <a href="#crear" className="btn-primary" style={{ height: 40, fontSize: 14, padding: '0 20px' }}>
              {tr('header.create')}
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(180deg, #f4f7fb 0%, #fff 100%)', padding: '64px 24px 56px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff5f5', border: '1.5px solid #fecdd3',
            color: '#fe6c75', fontSize: 13, fontWeight: 600,
            padding: '6px 16px', borderRadius: 1000, marginBottom: 24,
          }}>
            ✦ {tr('hero.badge')}
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 800, color: '#0f1d2c', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
            {tr('hero.title')}<br />
            <span style={{ color: '#fe6c75' }}>{tr('hero.title.accent')}</span>
          </h1>
          <p style={{ fontSize: 18, color: '#6b7d99', lineHeight: 1.6, marginBottom: 32 }}>
            {tr('hero.subtitle')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <a href="#crear" className="btn-primary">{tr('hero.cta')}</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7d99', fontSize: 14 }}>
              <span style={{ color: '#fe6c75' }}>✓</span> {tr('hero.feat1')}
              <span style={{ color: '#c8d5e3', margin: '0 4px' }}>·</span>
              <span style={{ color: '#fe6c75' }}>✓</span> {tr('hero.feat2')}
              <span style={{ color: '#c8d5e3', margin: '0 4px' }}>·</span>
              <span style={{ color: '#fe6c75' }}>✓</span> {tr('hero.feat3')}
            </div>
          </div>

          {/* Hero video */}
          <div style={{
            borderRadius: 24, overflow: 'hidden',
            border: '1.5px solid #dfeefb',
            boxShadow: '0 12px 48px rgba(15,29,44,0.10)',
          }}>
            <video
              src="/sora-video-1774223926866.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', display: 'block', maxHeight: 380, objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ── FORM / RESULT ── */}
      <section id="crear" style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>

        {!result ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,420px)', gap: 32, alignItems: 'start' }}
            className="form-grid">
            {/* ── LEFT: Form ── */}
            <div style={{
              background: '#fff',
              border: '1.5px solid #dfeefb',
              borderRadius: 24,
              padding: 32,
              boxShadow: '0 4px 24px rgba(15,29,44,0.06)',
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f1d2c', marginBottom: 24, letterSpacing: '-0.01em' }}>
                {tr('form.title')}
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Photo */}
                <div>
                  <label style={labelStyle}>{tr('form.photo')}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                    {form.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.photo} alt="preview"
                        style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fe6c75' }} />
                    ) : (
                      <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: '#f4f7fb', border: '2px dashed #c8d5e3',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, color: '#a8b8cc',
                      }}>
                        👤
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="btn-secondary" style={{ height: 36, fontSize: 13, padding: '0 16px' }}>
                        {tr('form.photo.upload')}
                      </button>
                      {form.photo && (
                        <button type="button" onClick={() => setForm((p) => ({ ...p, photo: '' }))}
                          style={{ height: 36, fontSize: 13, padding: '0 14px', borderRadius: 1000, border: '1.5px solid #fecdd3', background: '#fff5f5', color: '#fe6c75', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          {tr('form.photo.remove')}
                        </button>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  </div>
                </div>

                <Field label={tr('form.name')} name="name" value={form.name} onChange={handleChange} placeholder={tr('form.name.ph')} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label={tr('form.company')} name="company" value={form.company} onChange={handleChange} placeholder={tr('form.company.ph')} />
                  <Field label={tr('form.title_f')} name="title" value={form.title} onChange={handleChange} placeholder={tr('form.title_f.ph')} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label={tr('form.phone')} name="phone" value={form.phone} onChange={handleChange} placeholder={tr('form.phone.ph')} type="tel" />
                  <Field label={tr('form.email')} name="email" value={form.email} onChange={handleChange} placeholder={tr('form.email.ph')} type="email" />
                </div>

                <Field label={tr('form.website')} name="website" value={form.website} onChange={handleChange} placeholder={tr('form.website.ph')} type="url" />
                <Field label={tr('form.address')} name="address" value={form.address} onChange={handleChange} placeholder={tr('form.address.ph')} />

                {error && (
                  <div style={{ background: '#fff5f5', border: '1.5px solid #fecdd3', borderRadius: 12, padding: '10px 16px', color: '#e1545d', fontSize: 14, fontWeight: 500 }}>
                    ⚠ {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary"
                  style={{ width: '100%', height: 52, fontSize: 16 }}>
                  {loading ? tr('form.submitting') : tr('form.submit')}
                </button>
              </form>
            </div>

            {/* ── RIGHT: Live Preview ── */}
            <div style={{ position: 'sticky', top: 80 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7d99', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {tr('preview.label')}
              </p>
              <CardPreview card={form} namePlaceholder={tr('preview.name')} emptyPlaceholder={tr('preview.empty')} />
              <p style={{ fontSize: 12, color: '#a8b8cc', marginTop: 10, textAlign: 'center' }}>
                {tr('preview.hint')}
              </p>
            </div>
          </div>
        ) : (
          /* ── RESULT ── */
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Success banner */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              border: '1.5px solid #86efac',
              borderRadius: 16, padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 32,
            }}>
              <span style={{ fontSize: 20 }}>✓</span>
              <div>
                <p style={{ fontWeight: 700, color: '#16a34a', fontSize: 15 }}>{tr('result.success')}</p>
                <p style={{ color: '#4ade80', fontSize: 13 }}>{tr('result.success.sub')}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start', marginBottom: 32 }}
              className="result-grid">
              {/* Card preview */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7d99', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tr('result.card.label')}</p>
                <CardPreview card={result.card} />
              </div>

              {/* QR */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7d99', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {tr('result.qr.label')}
                </p>
                <div style={{
                  background: '#fff', border: '1.5px solid #dfeefb',
                  borderRadius: 20, padding: 16,
                  boxShadow: '0 4px 20px rgba(15,29,44,0.06)',
                  display: 'inline-block',
                }}>
                  <QRDisplay url={result.url} size={180} showDownload filename={result.card.name.replace(/\s+/g, '_')} />
                </div>
                <p style={{ fontSize: 12, color: '#a8b8cc', marginTop: 8 }}>{tr('result.qr.hint')}</p>
              </div>
            </div>

            {/* URL box */}
            <div style={{
              background: '#f4f7fb', border: '1.5px solid #dfeefb',
              borderRadius: 16, padding: '16px 20px', marginBottom: 20,
            }}>
              <p style={{ fontSize: 13, color: '#6b7d99', fontWeight: 600, marginBottom: 10 }}>{tr('result.url.label')}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input readOnly value={result.url}
                  style={{ flex: 1, background: '#fff', border: '1.5px solid #dfeefb', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#424e65', fontFamily: 'inherit', minWidth: 0 }} />
                <button onClick={handleCopy}
                  style={{
                    height: 44, padding: '0 18px', borderRadius: 10, border: '1.5px solid #dfeefb',
                    background: copied ? '#fe6c75' : '#fff', color: copied ? '#fff' : '#424e65',
                    fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 200ms', fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}>
                  {copied ? tr('result.copied') : tr('result.copy')}
                </button>
              </div>
            </div>

            {/* Actions — row 1 */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              <a href={`/api/cards?id=${result.id}&action=vcf`} download className="btn-primary" style={{ flex: 1, minWidth: 180, justifyContent: 'center' }}>
                {tr('result.download')}
              </a>
              <a href={result.url} target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, minWidth: 140, height: 52,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  background: '#e8faf2', border: '1.5px solid #86efac',
                  color: '#16a34a', borderRadius: 1000,
                  fontWeight: 700, fontSize: 15, textDecoration: 'none',
                  fontFamily: 'inherit', transition: 'all 200ms',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#d1fae5' }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#e8faf2' }}>
                🔗 {tr('result.open')}
              </a>
            </div>

            {/* Actions — row 2: nueva tarjeta */}
            <button onClick={() => { setResult(null); setForm(EMPTY) }}
              style={{
                width: '100%', height: 46,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                background: '#eef4ff', border: '1.5px solid #bfdbfe',
                color: '#3b82f6', borderRadius: 1000,
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 200ms',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#dbeafe' }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#eef4ff' }}>
              + {tr('result.new')}
            </button>
          </div>
        )}
      </section>

      {/* ── LWEB PROMO BANNER ── */}
      <div style={{ background: '#f4f7fb', borderTop: '1px solid #dfeefb', padding: '20px 24px' }}>
        <a href="https://lweb.ch" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            maxWidth: 680, margin: '0 auto',
            background: '#fff', borderRadius: 16,
            border: '1.5px solid #dfeefb', padding: '16px 22px',
            textDecoration: 'none', gap: 16,
            boxShadow: '0 4px 16px rgba(15,29,44,0.06)',
            transition: 'box-shadow 200ms, border-color 200ms',
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#fe6c75'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(254,108,117,0.15)' }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#dfeefb'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,29,44,0.06)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logolweb.png" alt="Lweb" style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 800, fontSize: 14, color: '#0f1d2c', letterSpacing: '-0.01em', marginBottom: 1 }}>
                Lweb.ch — App & Web Entwicklung
              </p>
              <p style={{ fontSize: 12, color: '#6b7d99', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Native iOS & Android Apps · Moderne Websites · KI-Lösungen · Buchs SG
              </p>
            </div>
          </div>
          <span style={{
            flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#fe6c75',
            background: '#fff5f5', border: '1.5px solid #fecdd3',
            borderRadius: 1000, padding: '5px 13px', whiteSpace: 'nowrap',
          }}>
            lweb.ch →
          </span>
        </a>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #dfeefb', background: '#f4f7fb', padding: '20px 24px 24px', textAlign: 'center' }}>
        <div style={{ marginBottom: 14 }}>
          <LangSwitcher />
        </div>
        <p style={{ fontSize: 13, color: '#6b7d99', marginBottom: 10 }}>
          {tr('footer.made')}{' '}
          <a href="https://lweb.ch" target="_blank" rel="noopener noreferrer" style={{ color: '#fe6c75', fontWeight: 600 }}>Lweb.ch</a>
          {' '}— App & Web Entwicklung
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={() => setShowImpressum(true)}
            style={{ background: 'none', border: 'none', color: '#a8b8cc', fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#fe6c75')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#a8b8cc')}>
            {tr('footer.impressum')}
          </button>
          <span style={{ color: '#dfeefb' }}>·</span>
          <button onClick={() => setShowPrivacy(true)}
            style={{ background: 'none', border: 'none', color: '#a8b8cc', fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#fe6c75')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#a8b8cc')}>
            {tr('footer.privacy')}
          </button>
        </div>
      </footer>

      {/* ── HISTORY MODAL ── */}
      {showHistory && (
        <div
          onClick={() => setShowHistory(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(15,29,44,0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 24,
              width: '100%', maxWidth: 560,
              maxHeight: '80vh', display: 'flex', flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(15,29,44,0.2)',
              border: '1.5px solid #dfeefb',
              overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid #dfeefb',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f1d2c', letterSpacing: '-0.01em' }}>
                  🕐 {tr('history.title')}
                </h2>
                <p style={{ fontSize: 13, color: '#6b7d99', marginTop: 2 }}>
                  {history.length} {history.length === 1 ? tr('history.card') : tr('history.cards')} {tr('history.saved')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {history.length > 0 && (
                  <button onClick={handleClearHistory}
                    style={{ fontSize: 12, color: '#a8b8cc', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px' }}>
                    {tr('history.clearAll')}
                  </button>
                )}
                <button onClick={() => setShowHistory(false)}
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: '#f4f7fb', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, color: '#6b7d99',
                  }}>
                  ✕
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '12px 16px' }}>
              {history.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#a8b8cc', padding: '40px 0', fontSize: 14 }}>
                  {tr('history.empty')}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {history.map((entry) => {
                    const initials = entry.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
                    const date = new Date(entry.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                    return (
                      <div key={entry.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 14,
                        border: '1.5px solid #dfeefb', background: '#f4f7fb',
                      }}>
                        {/* Avatar */}
                        <div style={{
                          width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg, #fe6c75, #f06069)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 800, fontSize: 14,
                        }}>
                          {initials}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 700, fontSize: 14, color: '#0f1d2c', truncate: true } as React.CSSProperties}>
                            {entry.name}
                          </p>
                          <p style={{ fontSize: 12, color: '#6b7d99', marginTop: 1 }}>
                            {[entry.title, entry.company].filter(Boolean).join(' · ') || date}
                          </p>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button
                            onClick={() => handleCopyHistoryUrl(entry.url, entry.id)}
                            title="Copiar enlace"
                            style={{
                              height: 32, padding: '0 10px', borderRadius: 8,
                              border: '1.5px solid #dfeefb',
                              background: copiedId === entry.id ? '#fe6c75' : '#fff',
                              color: copiedId === entry.id ? '#fff' : '#424e65',
                              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                              transition: 'all 200ms',
                            }}>
                            {copiedId === entry.id ? '✓' : '🔗'}
                          </button>
                          <a href={entry.url} target="_blank" rel="noopener noreferrer"
                            title="Abrir tarjeta"
                            style={{
                              height: 32, padding: '0 10px', borderRadius: 8,
                              border: '1.5px solid #dfeefb', background: '#fff',
                              color: '#424e65', fontSize: 12, fontWeight: 600,
                              display: 'flex', alignItems: 'center', textDecoration: 'none',
                            }}>
                            ↗
                          </a>
                          <button
                            onClick={() => handleDeleteHistory(entry.id)}
                            title="Eliminar"
                            style={{
                              height: 32, width: 32, borderRadius: 8,
                              border: '1.5px solid #fecdd3', background: '#fff5f5',
                              color: '#fe6c75', fontSize: 13, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                            ✕
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── IMPRESSUM MODAL ── */}
      {showImpressum && (
        <div onClick={() => setShowImpressum(false)} style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(15,29,44,0.5)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 24, width: '100%', maxWidth: 480,
            boxShadow: '0 20px 60px rgba(15,29,44,0.2)', border: '1.5px solid #dfeefb',
            overflow: 'hidden',
          }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg, #fe6c75, #f06069)' }} />
            <div style={{ padding: '24px 28px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f1d2c', letterSpacing: '-0.01em' }}>
                  {tr('impressum.title')}
                </h2>
                <button onClick={() => setShowImpressum(false)} style={{
                  width: 34, height: 34, borderRadius: '50%', background: '#f4f7fb',
                  border: 'none', cursor: 'pointer', fontSize: 16, color: '#6b7d99', flexShrink: 0,
                }}>✕</button>
              </div>
              <p style={{ fontWeight: 800, fontSize: 16, color: '#0f1d2c', marginBottom: 2 }}>Lweb</p>
              <p style={{ fontSize: 14, color: '#fe6c75', fontWeight: 600, marginBottom: 12 }}>{tr('impressum.role')}</p>
              <p style={{ fontSize: 14, color: '#6b7d99', lineHeight: 1.6, marginBottom: 20 }}>{tr('impressum.desc')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#424e65' }}>
                <span>✉ <a href="mailto:info@lweb.ch" style={{ color: '#fe6c75', fontWeight: 600 }}>info@lweb.ch</a></span>
                <span>☎ <a href="tel:+41765608645" style={{ color: '#424e65' }}>+41 76 560 86 45</a></span>
                <span>📍 9475 Sevelen, Schweiz</span>
                <span>🌐 <a href="https://lweb.ch" target="_blank" rel="noopener noreferrer" style={{ color: '#fe6c75', fontWeight: 600 }}>lweb.ch</a></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PRIVACY MODAL ── */}
      {showPrivacy && (
        <div onClick={() => setShowPrivacy(false)} style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(15,29,44,0.5)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 24, width: '100%', maxWidth: 480,
            boxShadow: '0 20px 60px rgba(15,29,44,0.2)', border: '1.5px solid #dfeefb',
            overflow: 'hidden',
          }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg, #fe6c75, #f06069)' }} />
            <div style={{ padding: '24px 28px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f1d2c', letterSpacing: '-0.01em' }}>
                  {tr('privacy.title')}
                </h2>
                <button onClick={() => setShowPrivacy(false)} style={{
                  width: 34, height: 34, borderRadius: '50%', background: '#f4f7fb',
                  border: 'none', cursor: 'pointer', fontSize: 16, color: '#6b7d99', flexShrink: 0,
                }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14, color: '#6b7d99', lineHeight: 1.7 }}>
                <p>{tr('privacy.p1')}</p>
                <p>{tr('privacy.p2')}</p>
                <p>{tr('privacy.p3')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── COOKIE BANNER ── */}
      {showCookies && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 300, width: 'calc(100% - 40px)', maxWidth: 540,
          background: '#0f1d2c', borderRadius: 16,
          padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 8px 32px rgba(15,29,44,0.25)',
        }}>
          <p style={{ flex: 1, fontSize: 13, color: '#c8d5e3', lineHeight: 1.5, margin: 0 }}>
            We use cookies to store your preferences and card history locally.{' '}
            <button onClick={() => setShowPrivacy(true)}
              style={{ background: 'none', border: 'none', color: '#fe6c75', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontWeight: 600 }}>
              Learn more
            </button>
          </p>
          <button onClick={acceptCookies} style={{
            flexShrink: 0, background: '#fe6c75', color: '#fff',
            border: 'none', borderRadius: 1000, padding: '8px 18px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Got it
          </button>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr !important; }
          .result-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: '#6b7d99',
  display: 'block', marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#f4f7fb',
  border: '1.5px solid #dfeefb',
  borderRadius: 12,
  padding: '10px 14px',
  fontSize: 15,
  color: '#0f1d2c',
  fontFamily: 'inherit',
  transition: 'border-color 200ms, box-shadow 200ms',
  outline: 'none',
}

function Field({
  label, name, value, onChange, placeholder, type = 'text',
}: {
  label: string; name: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string; type?: string
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
        className="lweb-input"
      />
    </div>
  )
}
