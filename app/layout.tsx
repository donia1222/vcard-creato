import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import { I18nProvider } from '@/components/I18nProvider'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VCard Creator — Digitale Visitenkarte kostenlos erstellen',
  description: 'Erstelle deine digitale Visitenkarte kostenlos in Sekunden. QR-Code inklusive, keine Registrierung nötig. Teile deine Kontaktdaten sofort als Link oder .vcf-Datei.',
  keywords: ['digitale Visitenkarte', 'vCard erstellen', 'QR Code Visitenkarte', 'tarjeta de visita digital', 'digital business card'],
  openGraph: {
    title: 'VCard Creator — Digitale Visitenkarte kostenlos erstellen',
    description: 'Kostenlose digitale Visitenkarte mit QR-Code. Kein Account nötig.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  return (
    <html lang="de" className={jakarta.variable}>
      <body className="antialiased">
        <I18nProvider>{children}</I18nProvider>
        {adsenseClient && adsenseClient !== 'ca-pub-XXXXXXXXXXXXXXXX' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
