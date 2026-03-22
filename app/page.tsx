'use client'

import { useState, useRef } from 'react'
import CardPreview from '@/components/CardPreview'
import QRDisplay from '@/components/QRDisplay'
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

export default function HomePage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

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
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return }
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/cards'
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear la tarjeta')
      setResult(data)
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
          <a href="#crear" className="btn-primary" style={{ height: 40, fontSize: 14, padding: '0 20px' }}>
            Crear tarjeta
          </a>
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
            ✦ Totalmente gratis · Sin registro
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 800, color: '#0f1d2c', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
            Tu tarjeta de visita<br />
            <span style={{ color: '#fe6c75' }}>digital en segundos</span>
          </h1>
          <p style={{ fontSize: 18, color: '#6b7d99', lineHeight: 1.6, marginBottom: 32 }}>
            Rellena el formulario, obtén tu URL permanente y un código QR listo para compartir o imprimir.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#crear" className="btn-primary">Crear mi tarjeta →</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7d99', fontSize: 14 }}>
              <span style={{ color: '#fe6c75' }}>✓</span> Sin instalación
              <span style={{ color: '#c8d5e3', margin: '0 4px' }}>·</span>
              <span style={{ color: '#fe6c75' }}>✓</span> Contacto .vcf
              <span style={{ color: '#c8d5e3', margin: '0 4px' }}>·</span>
              <span style={{ color: '#fe6c75' }}>✓</span> QR incluido
            </div>
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
                Tus datos de contacto
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Photo */}
                <div>
                  <label style={labelStyle}>Foto de perfil (opcional)</label>
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
                        Subir foto
                      </button>
                      {form.photo && (
                        <button type="button" onClick={() => setForm((p) => ({ ...p, photo: '' }))}
                          style={{ height: 36, fontSize: 13, padding: '0 14px', borderRadius: 1000, border: '1.5px solid #fecdd3', background: '#fff5f5', color: '#fe6c75', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          Quitar
                        </button>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  </div>
                </div>

                <Field label="Nombre completo *" name="name" value={form.name} onChange={handleChange} placeholder="Ej: María García" />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Empresa" name="company" value={form.company} onChange={handleChange} placeholder="Ej: Lweb" />
                  <Field label="Cargo / Puesto" name="title" value={form.title} onChange={handleChange} placeholder="Ej: Desarrollador" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Teléfono" name="phone" value={form.phone} onChange={handleChange} placeholder="+41 76 000 00 00" type="tel" />
                  <Field label="Email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" type="email" />
                </div>

                <Field label="Sitio web" name="website" value={form.website} onChange={handleChange} placeholder="https://tuwebsite.com" type="url" />
                <Field label="Dirección" name="address" value={form.address} onChange={handleChange} placeholder="Ciudad, País" />

                {error && (
                  <div style={{ background: '#fff5f5', border: '1.5px solid #fecdd3', borderRadius: 12, padding: '10px 16px', color: '#e1545d', fontSize: 14, fontWeight: 500 }}>
                    ⚠ {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary"
                  style={{ width: '100%', height: 52, fontSize: 16 }}>
                  {loading ? 'Generando...' : '✦ Generar Tarjeta Digital'}
                </button>
              </form>
            </div>

            {/* ── RIGHT: Live Preview ── */}
            <div style={{ position: 'sticky', top: 80 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7d99', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Vista previa en vivo
              </p>
              <CardPreview card={form} />
              <p style={{ fontSize: 12, color: '#a8b8cc', marginTop: 10, textAlign: 'center' }}>
                Se actualiza mientras escribes
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
                <p style={{ fontWeight: 700, color: '#16a34a', fontSize: 15 }}>¡Tarjeta creada con éxito!</p>
                <p style={{ color: '#4ade80', fontSize: 13 }}>Tu tarjeta está online y lista para compartir</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start', marginBottom: 32 }}
              className="result-grid">
              {/* Card preview */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7d99', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tu tarjeta</p>
                <CardPreview card={result.card} />
              </div>

              {/* QR */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7d99', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Código QR
                </p>
                <div style={{
                  background: '#fff', border: '1.5px solid #dfeefb',
                  borderRadius: 20, padding: 16,
                  boxShadow: '0 4px 20px rgba(15,29,44,0.06)',
                  display: 'inline-block',
                }}>
                  <QRDisplay url={result.url} size={180} />
                </div>
                <p style={{ fontSize: 12, color: '#a8b8cc', marginTop: 8 }}>Escanea para abrir</p>
              </div>
            </div>

            {/* URL box */}
            <div style={{
              background: '#f4f7fb', border: '1.5px solid #dfeefb',
              borderRadius: 16, padding: '16px 20px', marginBottom: 20,
            }}>
              <p style={{ fontSize: 13, color: '#6b7d99', fontWeight: 600, marginBottom: 10 }}>Enlace de tu tarjeta</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input readOnly value={result.url}
                  style={{ flex: 1, background: '#fff', border: '1.5px solid #dfeefb', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#424e65', fontFamily: 'inherit', minWidth: 0 }} />
                <button onClick={handleCopy}
                  style={{
                    height: 44, padding: '0 18px', borderRadius: 10, border: '1.5px solid #dfeefb',
                    background: copied ? '#fe6c75' : '#fff', color: copied ? '#fff' : '#424e65',
                    fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 200ms', fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}>
                  {copied ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href={`${process.env.NEXT_PUBLIC_API_URL || '/api/cards'}?id=${result.id}&action=vcf`} download className="btn-primary" style={{ flex: 1, minWidth: 180, justifyContent: 'center' }}>
                ⬇ Descargar Contacto (.vcf)
              </a>
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ flex: 1, minWidth: 140, justifyContent: 'center' }}>
                🔗 Ver Tarjeta
              </a>
              <button onClick={() => { setResult(null); setForm(EMPTY) }} className="btn-secondary"
                style={{ flex: 1, minWidth: 140 }}>
                + Nueva Tarjeta
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #dfeefb', background: '#f4f7fb', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#6b7d99' }}>
          Hecho con ♥ por{' '}
          <a href="https://lweb.ch" style={{ color: '#fe6c75', fontWeight: 600 }}>Lweb.ch</a>
          {' '}— App & Web Entwicklung
        </p>
      </footer>

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
