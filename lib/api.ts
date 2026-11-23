// Dónde vive la API PHP (Hostpoint, web.lweb.ch). Lweb, 23/11/2026.
// El navegador le habla directamente para crear, editar y borrar: así el límite de peticiones
// del PHP cuenta por persona. En local se puede apuntar a una copia con NEXT_PUBLIC_PHP_API.
export const PHP_API = process.env.NEXT_PUBLIC_PHP_API || 'https://web.lweb.ch/vcard/api/cards.php'

export const cardApi = (id: string) => `${PHP_API}?id=${encodeURIComponent(id)}`
export const vcfUrl = (id: string) => `${cardApi(id)}&action=vcf`

// Códigos de error del PHP → clave de traducción
export function errorKey(status: number, code?: string): string {
  if (status === 429) return 'form.error.rate'
  switch (code) {
    case 'name_required': return 'form.error.name'
    case 'email_invalid': return 'form.error.email'
    case 'photo_invalid':
    case 'photo_too_big': return 'form.error.photo'
    case 'forbidden': return 'form.error.forbidden'
    default: return 'form.error.generic'
  }
}

// Reduce la foto en el navegador antes de enviarla (máx. 640 px, JPEG): cabe de sobra en el límite del PHP.
export function reducirFoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const max = 640
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k)
      c.height = Math.round(img.height * k)
      const ctx = c.getContext('2d')
      if (!ctx) { URL.revokeObjectURL(url); reject(new Error('canvas')); return }
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('img')) }
    img.src = url
  })
}
