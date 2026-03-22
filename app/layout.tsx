import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VCard Creator — Tarjeta de Visita Digital',
  description: 'Crea tu tarjeta de visita digital gratis. Genera un código QR y comparte tu contacto fácilmente.',
  openGraph: {
    title: 'VCard Creator',
    description: 'Crea tu tarjeta de visita digital en segundos',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
