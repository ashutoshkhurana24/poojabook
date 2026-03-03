'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  MUHURATS,
  findBestDates,
  getNakshatraForDate,
  getTithiForDate,
  type ScoredDate,
} from '@/lib/calendarData'
import { getPanchangData } from '@/lib/panchang'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function StarRating({ score }: { score: number }) {
  const stars = score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : score >= 40 ? 2 : 1
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= stars ? 'text-yellow-400' : 'text-gray-300'}>★</span>
      ))}
    </div>
  )
}

export default function MuhuratFinder() {
  const today = new Date()
  const [selectedEvent, setSelectedEvent] = useState('pooja')
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())

  // Build panchang lookup once
  const panchangMap = useMemo(() => {
    const map = new Map<string, { nakshatra?: string; tithi?: string; is_auspicious?: boolean }>()
    getPanchangData().forEach(item => map.set(item.date, item))
    return map
  }, [])

  const bestDates: ScoredDate[] = useMemo(
    () => findBestDates(selectedMonth, selectedYear, selectedEvent, panchangMap),
    [selectedEvent, selectedMonth, selectedYear, panchangMap],
  )

  const muhurat = MUHURATS[selectedEvent]

  return (
    <div className="space-y-6">
      {/* Selector Row */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
        <h2 className="font-heading text-xl mb-4 flex items-center gap-2">
          🔍 Find Best Muhurat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Event type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Event Type</label>
            <select
              value={selectedEvent}
              onChange={e => setSelectedEvent(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {Object.entries(MUHURATS).map(([key, m]) => (
                <option key={key} value={key}>{m.icon} {m.name}</option>
              ))}
            </select>
          </div>
          {/* Month */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>
          {/* Year */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {[2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Muhurat description */}
        <div className="mt-4 flex items-center gap-3 text-sm text-orange-700 bg-orange-100 rounded-xl p-3">
          <span className="text-2xl">{muhurat.icon}</span>
          <div>
            <p className="font-semibold">{muhurat.name}</p>
            <p className="text-orange-600">{muhurat.description}</p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="text-amber-500">📅</span>
          Top {bestDates.length} Auspicious Dates in {MONTHS[selectedMonth]} {selectedYear}
        </h3>

        {bestDates.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🙏</p>
            <p>No highly auspicious dates found. Try a different month.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bestDates.map((item, idx) => {
              const date   = new Date(item.date + 'T00:00:00')
              const isWeekend = [0, 6].includes(date.getDay())
              const dayName   = date.toLocaleDateString('en-IN', { weekday: 'long' })
              const dateLabel = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
              const poojaType = selectedEvent === 'pooja' ? 'ganesh-puja' : selectedEvent === 'marriage' ? 'satyanarayan-puja' : 'ganesh-puja'

              return (
                <div
                  key={item.date}
                  className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    idx === 0 ? 'border-amber-400 bg-amber-50 shadow-sm' : 'border-gray-200 bg-white hover:border-orange-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Rank badge */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      idx === 0 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800">{dateLabel}</p>
                        {isWeekend && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Weekend ✓</span>
                        )}
                        {idx === 0 && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Best Pick</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{dayName}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.nakshatra.color }} />
                          <span className="font-medium">Nakshatra:</span> {item.nakshatra.name}
                          <span className="text-gray-400">({item.nakshatra.nature})</span>
                        </span>
                        {item.tithi && (
                          <span className="flex items-center gap-1">
                            <span>🌙</span>
                            <span className="font-medium">Tithi:</span> {item.tithi.name}
                            {item.tithi.auspicious && <span className="text-green-500">✓</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <div className="text-center">
                      <StarRating score={item.score} />
                      <p className="text-xs text-gray-500 mt-0.5">Score: <strong>{item.score}</strong>/100</p>
                    </div>
                    <Link
                      href={`/poojas?date=${item.date}&type=${poojaType}`}
                      className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition whitespace-nowrap"
                    >
                      Book Pooja →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Best nakshatras info */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Best Nakshatras for {muhurat.name}
        </p>
        <div className="flex flex-wrap gap-2">
          {muhurat.bestNakshatras.map(name => {
            const n = getNakshatraForDate('2026-01-01', name)
            return (
              <span
                key={name}
                className="text-xs px-2 py-1 rounded-full text-white font-medium"
                style={{ backgroundColor: n?.color || '#888' }}
              >
                {name}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
