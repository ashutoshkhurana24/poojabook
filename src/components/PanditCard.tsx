'use client'

import Link from 'next/link'

interface PanditCardProps {
  pandit: {
    id: string
    name: string
    photo?: string | null
    bio?: string | null
    experienceYears: number
    languages: string[]
    specializations: string[]
    city: string
    state: string
    rating: number
    totalReviews: number
    totalPoojasCompleted: number
    isVerified: boolean
    verificationBadge?: string | null
  }
  onSelect?: (panditId: string) => void
  selected?: boolean
}

export default function PanditCard({ pandit, onSelect, selected }: PanditCardProps) {
  const languages = typeof pandit.languages === 'string' 
    ? JSON.parse(pandit.languages) 
    : pandit.languages

  return (
    <div className={`bg-surface rounded-2xl p-6 border-2 transition ${selected ? 'border-primary' : 'border-transparent hover:border-primary/30'}`}>
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            {pandit.photo ? (
              <img
                src={pandit.photo}
                alt={pandit.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl">🧑‍🎓</span>
            )}
          </div>
          {pandit.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              ✓
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading text-lg font-semibold">{pandit.name}</h3>
            {pandit.isVerified && pandit.verificationBadge && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {pandit.verificationBadge}
              </span>
            )}
          </div>
          
          <p className="text-text-secondary text-sm mb-2">
            {pandit.city}, {pandit.state}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
            <span>⭐ {pandit.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{pandit.totalReviews} reviews</span>
            <span>•</span>
            <span>{pandit.experienceYears} years exp.</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {languages.slice(0, 3).map((lang: string, i: number) => (
              <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {lang}
              </span>
            ))}
            {languages.length > 3 && (
              <span className="text-xs text-text-secondary">+{languages.length - 3}</span>
            )}
          </div>

          <div className="text-sm font-medium text-primary">
            {pandit.totalPoojasCompleted} poojas completed
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t">
        <Link
          href={`/pandits/${pandit.id}`}
          className="flex-1 py-2 text-center border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium"
        >
          View Profile
        </Link>
        {onSelect && (
          <button
            onClick={() => onSelect(pandit.id)}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              selected 
                ? 'bg-primary text-white' 
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {selected ? 'Selected' : 'Select'}
          </button>
        )}
      </div>
    </div>
  )
}
