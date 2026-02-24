import Link from 'next/link'
import { getUpcomingAuspiciousDays, getDayName } from '@/lib/panchang'

export default function AuspiciousDaysSection() {
  const days = getUpcomingAuspiciousDays(8)

  return (
    <section className="py-16 bg-gradient-to-b from-surface to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl mb-2">🗓️ Upcoming Auspicious Days</h2>
          <p className="text-text-secondary">Plan your poojas on the most sacred dates</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {days.map((day) => {
            const date = new Date(day.date + 'T00:00:00')
            const monthDay = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
            const isMajor = day.type === 'major'
            
            return (
              <Link
                key={day.date}
                href={`/calendar?date=${day.date}`}
                className={`flex-shrink-0 w-48 p-4 rounded-2xl border-2 transition hover:shadow-lg ${
                  isMajor 
                    ? 'border-amber-400 bg-amber-50 hover:border-amber-500' 
                    : 'border-orange-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="text-sm text-text-secondary mb-1">
                  {monthDay} • {getDayName(day.date).slice(0, 3)}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {day.tithi} • {day.paksha}
                </div>
                {day.festivals.length > 0 && (
                  <div className={`font-semibold text-sm mb-2 ${isMajor ? 'text-amber-700' : 'text-orange-700'}`}>
                    {day.festivals[0]}
                  </div>
                )}
                <div className="text-xs text-gray-500 mb-2">{day.nakshatra}</div>
                {day.pooja_suggestions.length > 0 && (
                  <div className="text-xs text-primary font-medium">
                    Book {day.pooja_suggestions[0].replace('-', ' ')} →
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-6">
          <Link href="/calendar" className="text-primary hover:underline font-medium">
            View Full Calendar →
          </Link>
        </div>
      </div>
    </section>
  )
}
