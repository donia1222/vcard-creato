import type { CardData } from '@/types/card'

interface CardPreviewProps {
  card: Partial<CardData>
  size?: 'sm' | 'md'
}

export default function CardPreview({ card, size = 'md' }: CardPreviewProps) {
  const initials = card.name
    ? card.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const isSmall = size === 'sm'

  return (
    <div
      className="bg-white rounded-xl2 shadow-card border border-gun-100 overflow-hidden w-full max-w-sm mx-auto"
      style={{ borderRadius: '20px' }}
    >
      {/* Top stripe */}
      <div
        className="h-2 w-full"
        style={{ background: 'linear-gradient(90deg, #fe6c75, #f06069)' }}
      />

      <div className={`flex flex-col items-center ${isSmall ? 'p-5' : 'p-7'}`}>
        {/* Avatar / Photo */}
        <div className="mb-4">
          {card.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.photo}
              alt={card.name || 'foto'}
              className="rounded-full object-cover border-4 border-white shadow-card"
              style={{ width: isSmall ? 64 : 80, height: isSmall ? 64 : 80 }}
            />
          ) : (
            <div
              className="rounded-full flex items-center justify-center text-white font-extrabold shadow-card"
              style={{
                width: isSmall ? 64 : 80,
                height: isSmall ? 64 : 80,
                fontSize: isSmall ? 22 : 28,
                background: 'linear-gradient(135deg, #fe6c75, #f06069)',
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Name & Role */}
        <div className="text-center mb-5">
          <h2
            className="font-extrabold text-gun-900 tracking-tight leading-tight truncate"
            style={{ fontSize: isSmall ? 18 : 22, letterSpacing: '-0.02em' }}
          >
            {card.name || 'Tu Nombre'}
          </h2>
          {card.title && (
            <p className="text-begonia-400 text-sm font-semibold mt-0.5 truncate">
              {card.title}
            </p>
          )}
          {card.company && (
            <p className="text-gun-400 text-sm mt-0.5 truncate">{card.company}</p>
          )}
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gun-100 mb-5" />

        {/* Contact info */}
        <div className="w-full space-y-3">
          {card.email && (
            <ContactRow icon="✉" text={card.email} />
          )}
          {card.phone && (
            <ContactRow icon="☎" text={card.phone} />
          )}
          {card.website && (
            <ContactRow icon="🌐" text={card.website} />
          )}
          {card.address && (
            <ContactRow icon="📍" text={card.address} />
          )}
          {!card.email && !card.phone && !card.website && !card.address && (
            <p className="text-gun-200 text-sm text-center">
              Rellena el formulario para ver los datos
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ContactRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gun-700">
      <span
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base"
        style={{ background: '#fff5f5', color: '#fe6c75' }}
      >
        {icon}
      </span>
      <span className="truncate">{text}</span>
    </div>
  )
}
