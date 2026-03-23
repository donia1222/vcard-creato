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

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#fff', padding: '48px 24px', borderTop: '1px solid #dfeefb' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f1d2c', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 36 }}>
            {tr('how.title')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="how-grid">
            {([
              { num: '1', title: tr('how.step1.title'), desc: tr('how.step1.desc'), icon: '✏️' },
              { num: '2', title: tr('how.step2.title'), desc: tr('how.step2.desc'), icon: '⚡' },
              { num: '3', title: tr('how.step3.title'), desc: tr('how.step3.desc'), icon: '🔗' },
            ] as const).map((step) => (
              <div key={step.num} style={{
                background: '#f4f7fb', borderRadius: 20,
                border: '1.5px solid #dfeefb',
                padding: '24px 20px', textAlign: 'center',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fe6c75, #f06069)',
                  color: '#fff', fontWeight: 800, fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px',
                }}>
                  {step.num}
                </div>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#0f1d2c', marginBottom: 6 }}>{step.title}</p>
                <p style={{ fontSize: 13, color: '#6b7d99', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AD SLOT TOP ── */}
      {process.env.NODE_ENV === 'development' ? (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 8px' }}>
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
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 8px' }}>
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
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f1d2c', marginBottom: 20, letterSpacing: '-0.01em' }}>
                {tr('form.title')}
              </h2>

              {/* ── TABS ── */}
              <div style={{ display: 'flex', gap: 4, background: '#f4f7fb', borderRadius: 14, padding: 4, marginBottom: 24 }}>
                {(['data', 'design'] as const).map((tab) => (
                  <button key={tab} type="button" onClick={() => setFormTab(tab)}
                    style={{
                      flex: 1, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
                      background: formTab === tab ? '#fff' : 'transparent',
                      color: formTab === tab ? '#0f1d2c' : '#6b7d99',
                      boxShadow: formTab === tab ? '0 1px 6px rgba(15,29,44,0.10)' : 'none',
                      transition: 'all 150ms',
                    }}>
                    {tab === 'data' ? `📝 ${tr('form.tab.data')}` : `🎨 ${tr('form.tab.design')}`}
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      {(['classic', 'dark', 'ocean', 'rose'] as const).map((d) => {
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
                                card={{ ...form, design: d }}
                                size="sm"
                                namePlaceholder={form.name || tr('preview.name')}
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
                        width: '100%', height: 44, marginTop: 18,
                        background: '#f4f7fb', border: '1.5px solid #dfeefb',
                        borderRadius: 1000, fontWeight: 700, fontSize: 14,
                        color: '#424e65', cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 200ms',
                      }}>
                      ← {tr('form.tab.data')}
                    </button>
                  </div>
                )}

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
                <CardPreview card={{ ...result.card, design: form.design }} />
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

            {/* ── Share buttons ── */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: '#6b7d99', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                {tr('share.label')}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {/* WhatsApp */}
                <a href={`https://wa.me/?text=${encodeURIComponent(result.url)}`} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    height: 44, padding: '0 18px', borderRadius: 1000,
                    background: '#22c55e', color: '#fff',
                    fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    fontFamily: 'inherit', transition: 'filter 200ms',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(0.9)' }}
                  onMouseOut={(e) => { e.currentTarget.style.filter = 'none' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                {/* Telegram */}
                <a href={`https://t.me/share/url?url=${encodeURIComponent(result.url)}`} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    height: 44, padding: '0 18px', borderRadius: 1000,
                    background: '#229ED9', color: '#fff',
                    fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    fontFamily: 'inherit', transition: 'filter 200ms',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(0.9)' }}
                  onMouseOut={(e) => { e.currentTarget.style.filter = 'none' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  Telegram
                </a>
                {/* Email */}
                <a href={`mailto:?subject=${encodeURIComponent(tr('share.email.subject'))}&body=${encodeURIComponent(result.url)}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    height: 44, padding: '0 18px', borderRadius: 1000,
                    background: '#f4f7fb', border: '1.5px solid #dfeefb',
                    color: '#424e65', fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    fontFamily: 'inherit', transition: 'background 200ms',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#e8f0fb' }}
                  onMouseOut={(e) => { e.currentTarget.style.background = '#f4f7fb' }}>
                  ✉ {tr('share.email')}
                </a>
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {tr('result.open')}
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {tr('result.new')}
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


      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr !important; }
          .result-grid { grid-template-columns: 1fr !important; }
          .how-grid { grid-template-columns: 1fr !important; }
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
