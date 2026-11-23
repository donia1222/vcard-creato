import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/components/I18nProvider'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

// Dirección pública (Vercel). Lweb, 23/11/2026: vcard.lweb.ch ya no existe.
const BASE_URL = 'https://vcard-creato.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'VCard Creator – Digitale Visitenkarte mit QR-Code, kostenlos',
    template: '%s | VCard Creator',
  },
  description:
    'Erstelle deine digitale Visitenkarte kostenlos in Sekunden: QR-Code, permanente URL und .vcf-Kontakt für iPhone und Android. Ohne Registrierung, ohne Werbung, Daten in der Schweiz. Ein Projekt von Lweb.',
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
    title: 'VCard Creator – Digitale Visitenkarte mit QR-Code',
    description:
      'Kostenlose digitale Visitenkarte mit QR-Code und permanenter URL. Ohne Registrierung, ohne Werbung. Ein Projekt von Lweb.',
    url: BASE_URL,
    siteName: 'VCard Creator',
    type: 'website',
    locale: 'de_CH',
    alternateLocale: ['en_US', 'es_ES', 'fr_CH', 'it_CH'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VCard Creator – Digitale Visitenkarte mit QR-Code',
    description:
      'Kostenlose digitale Visitenkarte mit QR-Code und permanenter URL. Ein Projekt von Lweb.',
    creator: '@lweb_ch',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VCard Creator',
  url: BASE_URL,
  description:
    'Kostenloser Generator für digitale Visitenkarten mit QR-Code und permanenter URL. Ohne Registrierung, ohne Werbung.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CHF',
  },
  creator: {
    '@type': 'Organization',
    name: 'Lweb',
    url: 'https://lweb.ch',
  },
  featureList: [
    'QR-Code',
    'Permanente URL',
    '.vcf-Download',
    'Bearbeiten und löschen',
    'Fünf Sprachen',
  ],
  inLanguage: ['de', 'en', 'es', 'fr', 'it'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={jakarta.variable}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <I18nProvider>{children}</I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
