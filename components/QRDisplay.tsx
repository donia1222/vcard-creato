'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRDisplayProps {
  url: string
  size?: number
}

export default function QRDisplay({ url, size = 200 }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !url) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 2,
      color: {
        dark: '#0f1d2c',
        light: '#ffffff',
      },
    })
  }, [url, size])

  return <canvas ref={canvasRef} style={{ borderRadius: 12 }} />
}
