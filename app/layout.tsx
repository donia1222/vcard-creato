import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/components/I18nProvider'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const BASE_URL = 'https://vcard.lweb.ch'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'VCard Creator — Tarjeta de Visita Digital con QR Gratis',
    template: '%s | VCard Creator',
  },
  description:
    'Crea tu tarjeta de visita digital gratis en segundos. Genera un código QR y una URL permanente para compartir tus datos de contacto desde el móvil o el ordenador. Sin registro, sin instalación.',
  keywords: [
    // ES — Español
    'tarjeta de visita digital', 'tarjeta de visita con QR', 'crear tarjeta de visita gratis',
    'generador tarjeta de visita digital', 'tarjeta contacto QR code', 'tarjeta visita online',
    'crear vcard online gratis', 'compartir contacto por QR', 'tarjeta digital profesional',
    'vcard generador gratis', 'tarjeta de visita virtual', 'crear tarjeta contacto digital',
    // DE — Deutsch
    'digitale Visitenkarte', 'Visitenkarte mit QR Code erstellen', 'Visitenkarte kostenlos erstellen',
    'digitale Visitenkarte gratis', 'vCard erstellen kostenlos', 'QR Code Visitenkarte erstellen',
    'digitale Visitenkarte ohne Registrierung', 'Visitenkarte online erstellen',
    'Kontaktkarte QR Code', 'digitale Kontaktkarte erstellen',
    // EN — English
    'digital business card', 'free digital business card', 'business card with QR code',
    'create business card online free', 'vcard generator free', 'QR code business card generator',
    'digital contact card', 'share contact via QR code', 'online business card maker',
    'free vcard creator', 'electronic business card', 'virtual business card free',
    // FR — Français
    'carte de visite numérique gratuite', 'carte de visite QR code gratuite',
    'créer carte de visite digitale', 'générateur carte visite numérique',
    'carte de visite en ligne gratuite', 'partager contact QR code',
    'créer vcard gratuit', 'carte de visite virtuelle',
    // IT — Italiano
    'biglietto da visita digitale gratis', 'biglietto visita QR code gratis',
    'creare biglietto da visita digitale', 'generatore biglietto visita digitale',
    'biglietto da visita online gratuito', 'condividere contatto QR code',
    'vcard gratis online', 'biglietto visita virtuale',
  ],
  authors: [{ name: 'Lweb', url: 'https://lweb.ch' }],
  creator: 'Lweb — lweb.ch',
  publisher: 'Lweb',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'VCard Creator — Tarjeta de Visita Digital con QR Gratis',
    description:
      'Crea tu tarjeta de visita digital gratis. QR code incluido, URL permanente, sin registro. Lista para compartir en segundos.',
    url: BASE_URL,
    siteName: 'VCard Creator',
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['de_DE', 'en_US', 'fr_FR', 'it_IT'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VCard Creator — Tarjeta de Visita Digital con QR Gratis',
    description:
      'Crea tu tarjeta de visita digital gratis. QR code incluido, URL permanente, sin registro.',
    creator: '@lweb_ch',
  },
  other: {
    'google-adsense-account': 'ca-pub-7632189809073629',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VCard Creator',
  url: BASE_URL,
  description:
    'Generador gratuito de tarjetas de visita digitales con código QR y URL permanente. Sin registro ni instalación.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  creator: {
    '@type': 'Organization',
    name: 'Lweb',
    url: 'https://lweb.ch',
  },
  featureList: [
    'Generador de código QR',
    'URL permanente',
    'Descarga .vcf',
    'Sin registro',
    'Multiidioma',
  ],
  inLanguage: ['de', 'en', 'es', 'fr', 'it'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  return (
    <html lang="es" className={jakarta.variable}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <I18nProvider>{children}</I18nProvider>
        <Analytics />
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
