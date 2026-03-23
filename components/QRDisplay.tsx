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
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '10px 20px', borderRadius: 1000,
            border: '1.5px solid #bfdbfe', background: '#eef4ff',
            color: '#3b82f6', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 200ms', width: '100%', justifyContent: 'center',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#dbeafe' }}
          onMouseOut={(e) => { e.currentTarget.style.background = '#eef4ff' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {label[lang] ?? label.en}
        </button>
      )}
    </div>
  )
}
