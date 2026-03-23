'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { useI18n } from '@/components/I18nProvider'

interface QRDisplayProps {
  url: string
  size?: number
  showDownload?: boolean
  filename?: string
}

export default function QRDisplay({ url, size = 200, showDownload = false, filename = 'qr-vcard' }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { lang } = useI18n()

  useEffect(() => {
    if (!canvasRef.current || !url) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 2,
      color: { dark: '#0f1d2c', light: '#ffffff' },
    })
  }, [url, size])

  const downloadQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const label: Record<string, string> = {
    de: 'QR als Bild speichern',
    en: 'Save QR as image',
    es: 'Guardar QR como imagen',
    fr: 'Enregistrer QR en image',
    it: 'Salva QR come immagine',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <canvas ref={canvasRef} style={{ borderRadius: 12 }} />
      {showDownload && (
        <button
          onClick={downloadQR}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 1000,
            border: '1.5px solid #c8d5e3', background: '#fff',
            color: '#424e65', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 200ms',
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#fe6c75'; e.currentTarget.style.color = '#fe6c75' }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#c8d5e3'; e.currentTarget.style.color = '#424e65' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {label[lang] ?? label.en}
        </button>
      )}
    </div>
  )
}
