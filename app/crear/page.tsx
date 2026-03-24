'use client'

import { useState, useRef, useEffect } from 'react'
import CardPreview from '@/components/CardPreview'
import QRDisplay from '@/components/QRDisplay'
import { useI18n, LangSwitcher } from '@/components/I18nProvider'
import type { CardData, CardDesign } from '@/types/card'

interface FormState {
  name: string; company: string; title: string
  phone: string; email: string; website: string
  address: string; photo: string; design: CardDesign
}

const EMPTY: FormState = {
  name: '', company: '', title: '',
  phone: '', email: '', website: '',
  address: '', photo: '', design: 'classic',
}

// Demo Unsplash portraits shown when no photo uploaded
const DEMO_PHOTOS: Record<string, string> = {
  classic:  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format',
  dark:     'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face&auto=format',
  ocean:    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format',
  rose:     'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&auto=format',
  gradient: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format',
  minimal:  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face&auto=format',
  split:    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face&auto=format',
  glass:    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face&auto=format',
}

const DEMO_NAMES: Record<string, { name: string; title: string; company: string }> = {
  classic:  { name: 'Thomas Müller', title: 'Product Manager', company: 'Acme GmbH' },
  dark:     { name: 'Laura Becker',  title: 'UX Designer',     company: 'Studio Berlin' },
  ocean:    { name: 'Jonas Weber',   title: 'Developer',       company: 'Tech AG' },
  rose:     { name: 'Sofia Rossi',   title: 'Marketing Lead',  company: 'Brand Co.' },
  gradient: { name: 'Marc Dupont',   title: 'Creative Dir.',   company: 'Agence Paris' },
  minimal:  { name: 'Nina Schulz',   title: 'Architect',       company: 'Studio M' },
  split:    { name: 'Carlos Ruiz',   title: 'Engineer',        company: 'Green Tech' },
  glass:    { name: 'Emma Laurent',  title: 'Consultant',      company: 'Nexus Group' },
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
  const filtered = entries.filter((e) => e.id !== entry.id)
  localStorage.setItem(LS_KEY, JSON.stringify([entry, ...filtered].slice(0, 50)))
}

export default function CrearPage() {
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
  const [formTab, setFormTab] = useState<'data' | 'design'>('data')
  const fileRef = useRef<HTMLInputElement>(null)
  const { tr } = useI18n()

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

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

  const shareUrl = result
    ? result.url + (form.design && form.design !== 'classic' ? `?design=${form.design}` : '')
    : ''

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleNativeShare = async () => {
    if (!result) return
    if (navigator.share) {
      await navigator.share({ url: shareUrl })
    } else {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
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
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <a href="/" className="btn-secondary" style={{ height: 40, fontSize: 14, padding: '0 20px' }}>
              {tr('land.back')}
            </a>
            {history.length > 0 && (
              <button onClick={() => setShowHistory(true)}
                className="btn-secondary"
                style={{ height: 40, fontSize: 14, padding: '0 16px', gap: 6 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {tr('history.btn')}
                <span style={{
                  background: '#fe6c75', color: '#fff',
                  borderRadius: 100, fontSize: 11, fontWeight: 700,
                  padding: '1px 6px', marginLeft: 2,
                }}>
                  {history.length}
                </span>
              </button>
            )}
          </div>
          <a href="/" style={{ fontWeight: 800, fontSize: 20, color: '#0f1d2c', letterSpacing: '-0.02em', textDecoration: 'none' }}>
            VCard <span style={{ color: '#fe6c75' }}>Creator</span>
          </a>
        </div>
      </header>


      {/* ── AD SLOT TOP ── */}
      {process.env.NODE_ENV === 'development' ? (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 24px 0' }}>
          <div style={{
            background: '#f4f7fb', border: '2px dashed #c8d5e3',
            borderRadius: 12, height: 90,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#a8b8cc', fontSize: 12, fontWeight: 600, gap: 8,
          }}>
            📢 Google Ad — 728×90 (solo visible en desarrollo)
          </div>
        </div>
      ) : (process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 24px 0' }}>
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
            data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT || '0000000000'}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ))}

      {/* ── FORM / RESULT ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>

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
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f1d2c', marginBottom: 20, letterSpacing: '-0.01em' }}>
                {tr('form.title')}
              </h2>

              {/* ── TABS ── */}
              <div style={{ display: 'flex', gap: 4, background: '#f4f7fb', borderRadius: 14, padding: 4, marginBottom: 24 }}>
                {(['data', 'design'] as const).map((tab) => (
                  <button key={tab} type="button" onClick={() => setFormTab(tab)}
                    style={{
                      flex: 1, height: 46, borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontWeight: 700, fontSize: 16, fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: formTab === tab ? '#fff' : 'transparent',
                      color: formTab === tab ? '#0f1d2c' : '#6b7d99',
                      boxShadow: formTab === tab ? '0 1px 6px rgba(15,29,44,0.10)' : 'none',
                      transition: 'all 150ms',
                    }}>
                    {tab === 'data' ? (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/></svg>
                        {tr('form.tab.data')}
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
                        {tr('form.tab.design')}
                      </>
                    )}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* ── DATA TAB ── */}
                {formTab === 'data' && (<>
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
                </>)}

                {/* ── DESIGN TAB ── */}
                {formTab === 'design' && (
                  <div>
                    <p style={{ fontSize: 13, color: '#6b7d99', fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {tr('design.choose')}
                    </p>
                    <div className="design-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      {(['classic', 'dark', 'ocean', 'rose', 'gradient', 'minimal', 'split', 'glass'] as const).map((d) => {
                        const selected = (form.design || 'classic') === d
                        return (
                          <button key={d} type="button"
                            onClick={() => setForm((p) => ({ ...p, design: d }))}
                            style={{
                              border: `2px solid ${selected ? '#fe6c75' : '#dfeefb'}`,
                              borderRadius: 16, padding: 10, cursor: 'pointer',
                              background: selected ? '#fff5f5' : '#fff',
                              position: 'relative', transition: 'all 200ms',
                              textAlign: 'left',
                            }}>
                            {selected && (
                              <div style={{
                                position: 'absolute', top: 8, right: 8, zIndex: 1,
                                width: 22, height: 22, borderRadius: '50%',
                                background: '#fe6c75', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 800,
                              }}>✓</div>
                            )}
                            <div style={{ pointerEvents: 'none', marginBottom: 8 }}>
                              <CardPreview
                                card={{
                                  ...DEMO_NAMES[d],
                                  design: d,
                                  photo: DEMO_PHOTOS[d],
                                }}
                                size="sm"
                                namePlaceholder=""
                                emptyPlaceholder=""
                              />
                            </div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: selected ? '#fe6c75' : '#6b7d99', textAlign: 'center', textTransform: 'capitalize' }}>
                              {tr(`design.${d}`)}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                    <button type="button" onClick={() => setFormTab('data')}
                      style={{
                        width: '100%', height: 52, marginTop: 20,
                        background: '#2563eb', border: 'none',
                        borderRadius: 1000, fontWeight: 700, fontSize: 15,
                        color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 4px 20px rgba(37,99,235,0.30)',
                        transition: 'all 200ms',
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                      onMouseOut={(e) => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/></svg>
                      {tr('form.tab.data')}
                    </button>
                  </div>
                )}

                {error && (
                  <div style={{ background: '#fff5f5', border: '1.5px solid #fecdd3', borderRadius: 12, padding: '10px 16px', color: '#e1545d', fontSize: 14, fontWeight: 500 }}>
                    ⚠ {error}
                  </div>
                )}

                {formTab === 'data' && (
                  <button type="submit" disabled={loading} className="btn-primary"
                    style={{ width: '100%', height: 52, fontSize: 16 }}>
                    {loading ? tr('form.submitting') : tr('form.submit')}
                  </button>
                )}
              </form>
            </div>

            {/* ── RIGHT: Live Preview ── */}
            <div style={{ position: 'sticky', top: 80 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7d99', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {tr('preview.label')}
              </p>
              <CardPreview
                card={form}
                namePlaceholder={tr('preview.name')}
                emptyPlaceholder={tr('preview.empty')}
              />
              {form.design && form.design !== 'classic' && (
                <div style={{ marginTop: 8, textAlign: 'center' }}>
                  <span style={{ fontSize: 11, color: '#fe6c75', fontWeight: 700, background: '#fff5f5', border: '1px solid #fecdd3', borderRadius: 100, padding: '3px 10px' }}>
                    🎨 {tr(`design.${form.design}`)}
                  </span>
                </div>
              )}
              <p style={{ fontSize: 12, color: '#a8b8cc', marginTop: 10, textAlign: 'center' }}>
                {tr('preview.hint')}
              </p>
            </div>
          </div>
        ) : (
          /* ── RESULT ── */
          <div style={{ maxWidth: 760, margin: '0 auto' }}>

            {/* Success banner */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              border: '1.5px solid #86efac', borderRadius: 16,
              padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#16a34a', fontSize: 15 }}>{tr('result.success')}</p>
                <p style={{ color: '#4ade80', fontSize: 13 }}>{tr('result.success.sub')}</p>
              </div>
            </div>

            {/* Card + QR side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }} className="result-grid">

              {/* Card preview */}
              <div style={{ background: '#f4f7fb', border: '1.5px solid #dfeefb', borderRadius: 20, padding: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7d99', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {tr('result.card.label')}
                </p>
                <CardPreview card={{ ...result.card, design: form.design }} />
              </div>

              {/* QR section */}
              <div style={{ background: '#f4f7fb', border: '1.5px solid #dfeefb', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7d99', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
                  {tr('result.qr.label')}
                </p>
                <p style={{ fontSize: 12, color: '#a8b8cc', marginBottom: 14, textAlign: 'center', lineHeight: 1.5 }}>
                  {tr('result.qr.desc')}
                </p>
                <div style={{
                  background: '#fff', border: '1.5px solid #dfeefb',
                  borderRadius: 18, padding: 14,
                  boxShadow: '0 4px 20px rgba(15,29,44,0.06)',
                  marginBottom: 4, width: '100%',
                }}>
                  <QRDisplay url={shareUrl} size={180} showDownload filename={result.card.name.replace(/\s+/g, '_')} />
                </div>
                <p style={{ fontSize: 11, color: '#a8b8cc', marginTop: 10, textAlign: 'center' }}>{tr('result.qr.hint')}</p>
              </div>
            </div>

            {/* URL copy box */}
            <div style={{ background: '#f4f7fb', border: '1.5px solid #dfeefb', borderRadius: 16, padding: '14px 18px', marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: '#6b7d99', fontWeight: 600, marginBottom: 8 }}>{tr('result.url.label')}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input readOnly value={shareUrl}
                  style={{ flex: 1, background: '#fff', border: '1.5px solid #dfeefb', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#424e65', fontFamily: 'inherit', minWidth: 0 }} />
                <button onClick={handleCopy}
                  style={{
                    height: 44, padding: '0 18px', borderRadius: 10, border: '1.5px solid #dfeefb',
                    background: copied ? '#fe6c75' : '#fff', color: copied ? '#fff' : '#424e65',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 200ms', fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}>
                  {copied ? tr('result.copied') : tr('result.copy')}
                </button>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer"
                  title={tr('result.open')}
                  style={{
                    height: 44, width: 44, flexShrink: 0, borderRadius: 10, border: '1.5px solid #dfeefb',
                    background: '#fff', color: '#424e65', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', transition: 'all 200ms',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#e8faf2'; e.currentTarget.style.borderColor = '#86efac'; e.currentTarget.style.color = '#16a34a' }}
                  onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#dfeefb'; e.currentTarget.style.color = '#424e65' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </div>

            {/* Action buttons — all same height 52px, uniform style */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* Share */}
              <button onClick={handleNativeShare} style={{
                width: '100%', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 1000,
                fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 200ms', boxShadow: '0 4px 20px rgba(124,58,237,0.25)',
              }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#6d28d9' }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#7c3aed' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                {tr('share.label')}
              </button>

              {/* Download .vcf */}
              <a href={`/api/cards?id=${result.id}&action=vcf`} download className="btn-primary"
                style={{ width: '100%', height: 52, justifyContent: 'center', fontSize: 15, borderRadius: 1000 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {tr('result.download')}
              </a>

              {/* New card */}
              <button onClick={() => { setResult(null); setForm(EMPTY) }} style={{
                width: '100%', height: 48,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#f4f7fb', border: '1.5px solid #dfeefb',
                color: '#6b7d99', borderRadius: 1000,
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 200ms',
              }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#fe6c75'; e.currentTarget.style.color = '#fe6c75' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#dfeefb'; e.currentTarget.style.color = '#6b7d99' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {tr('result.new')}
              </button>
            </div>
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
                {tr('lweb.tagline')}
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
                        <div style={{
                          width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg, #fe6c75, #f06069)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 800, fontSize: 14,
                        }}>
                          {initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 700, fontSize: 14, color: '#0f1d2c' }}>
                            {entry.name}
                          </p>
                          <p style={{ fontSize: 12, color: '#6b7d99', marginTop: 1 }}>
                            {[entry.title, entry.company].filter(Boolean).join(' · ') || date}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button
                            onClick={() => handleCopyHistoryUrl(entry.url, entry.id)}
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
  fontSize: 16,
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
