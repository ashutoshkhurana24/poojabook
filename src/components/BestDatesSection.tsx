'use client'

import Link from 'next/link'
import { getPoojaSuggestionDates } from '@/lib/panchang'

interface BestDatesProps {
  poojaSlug: string
}

export default function BestDatesSection({ poojaSlug }: BestDatesProps) {
  const dates = getPoojaSuggestionDates(poojaSlug)

  if (dates.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
      <h3 className="font-heading text-lg mb-4">🗓️ Best Dates to Book This Pooja</h3>
      <div className="flex flex-wrap gap-3">
        {dates.map(date => (
          <Link
            key={date.date}
            href={`/calendar?date=${date.date}`}
            className="px-4 py-2 bg-white rounded-lg border border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition flex items-center gap-2"
          >
            <span className="font-medium">
              {new Date(date.date + 'T00:00:00').toLocaleDateString('en-IN', { 
                day: 'numeric', month: 'short' 
              })}
            </span>
            {date.festivals.length > 0 && (
              <span className="text-xs text-amber-700">({date.festivals[0]})</span>
            )}
          </Link>
        ))}
      </div>
      <Link href="/calendar" className="text-sm text-primary hover:underline mt-3 inline-block">
        View Full Calendar →
      </Link>
    </div>
  )
}
