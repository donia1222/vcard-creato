export type CardDesign = 'classic' | 'dark' | 'ocean' | 'rose' | 'gradient' | 'minimal' | 'split' | 'glass'

export interface CardData {
  id: string
  name: string
  company?: string
  title?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  photo?: string  // base64 data URL
  design?: CardDesign
  createdAt: string
}
