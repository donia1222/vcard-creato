import type { CardData } from '@/types/card'

export function generateVCF(card: CardData): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.name}`,
  ]

  if (card.company) lines.push(`ORG:${card.company}`)
  if (card.title) lines.push(`TITLE:${card.title}`)
  if (card.phone) lines.push(`TEL:${card.phone}`)
  if (card.email) lines.push(`EMAIL:${card.email}`)
  if (card.website) lines.push(`URL:${card.website}`)
  if (card.address) lines.push(`ADR:;;${card.address};;;;`)

  // Embed photo as base64 in the VCF (works in iOS/Android Contacts)
  if (card.photo) {
    const match = card.photo.match(/^data:image\/(jpeg|png|webp|gif);base64,(.+)/)
    if (match) {
      const type = match[1].toUpperCase() === 'JPEG' ? 'JPEG' : 'PNG'
      lines.push(`PHOTO;ENCODING=b;TYPE=${type}:${match[2]}`)
    }
  }

  lines.push(`NOTE:Tarjeta generada en ${process.env.NEXT_PUBLIC_BASE_URL || 'vcard-creator'}`)
  lines.push('END:VCARD')

  return lines.join('\r\n')
}
