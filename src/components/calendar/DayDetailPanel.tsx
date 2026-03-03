'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { RAHU_KAAL, getDayName } from '@/lib/panchang'
import { getNakshatraForDate, getTithiForDate } from '@/lib/calendarData'
import type { PankajItem } from '@/lib/panchang'

interface Props {
  dateStr: string | null
  panchangItem?: PankajItem | null
  onClose: () => void
}

const POOJA_LABELS: Record<string, string> = {
  'ganesh-puja': 'Ganesh Puja',
  'lakshmi-puja': 'Lakshmi Puja',
  'satyanarayan-puja': 'Satyanarayan Puja',
  'navgraha-shanti': 'Navgraha Shanti',
  'rudrabhishek': 'Rudrabhishek',
  'hanuman-chalisa': 'Hanuman Chalisa',
  'durga-puja': 'Durga Puja',
  'vishnu-puja': 'Vishnu Puja',
}

function getApproxSunrise(dateStr: string): string {
  const month = new Date(dateStr + 'T00:00:00').getMonth() + 1
  // Sunrise shifts ~4 min per week across the year; approximate for India
  if (month <= 2 || month === 12) return '6:45 AM'
  if (month <= 4 || month >= 10) return '6:15 AM'
  return '5:50 AM'
}

function getApproxSunset(dateStr: string): string {
  const month = new Date(dateStr + 'T00:00:00').getMonth() + 1
  if (month <= 2 || month === 12) return '6:00 PM'
  if (month <= 4 || month >= 10) return '6:30 PM'
  return '7:00 PM'
}

function NatureChip({ nature }: { nature: string }) {
  const color =
    nature === 'Auspicious' ? 'bg-green-100 text-green-700' :
    nature === 'Soft'       ? 'bg-blue-100 text-blue-700' :
    nature === 'Fixed'      ? 'bg-purple-100 text-purple-700' :
    nature === 'Movable'    ? 'bg-teal-100 text-teal-700' :
    nature === 'Sharp'      ? 'bg-red-100 text-red-700' :
    nature === 'Fierce'     ? 'bg-orange-100 text-orange-700' :
    nature === 'Mixed'      ? 'bg-yellow-100 text-yellow-700' :
    'bg-gray-100 text-gray-700'
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{nature}</span>
  )
}

export default function DayDetailPanel({ dateStr, panchangItem, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const nakshatra = dateStr ? getNakshatraForDate(dateStr, panchangItem?.nakshatra) : null
  const tithi     = dateStr ? getTithiForDate(dateStr, panchangItem?.tithi) : null
  const dayName   = dateStr ? getDayName(dateStr) : null
  const rahuKaal  = dayName ? RAHU_KAAL[dayName] : null
  const sunrise   = dateStr ? getApproxSunrise(dateStr) : null
  const sunset    = dateStr ? getApproxSunset(dateStr) : null

  const dateLabel = dateStr
    ? new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  const suggestedPoojas = panchangItem?.pooja_suggestions?.length
    ? panchangItem.pooja_suggestions
    : nakshatra?.suitable.includes('all auspicious works') ? ['ganesh-puja', 'satyanarayan-puja']
    : nakshatra?.suitable.some(s => s.includes('Vishnu')) ? ['satyanarayan-puja']
    : nakshatra?.suitable.some(s => s.includes('Shiva')) ? ['rudrabhishek']
    : nakshatra?.suitable.some(s => s.includes('Devi') || s.includes('Durga')) ? ['durga-puja']
    : ['ganesh-puja']

  return (
    <AnimatePresence>
      {dateStr && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-orange-100 text-xs font-medium uppercase tracking-wider mb-1">Day Details</p>
                  <h2 className="font-heading text-lg leading-snug">{dateLabel}</h2>
                  {panchangItem?.festivals && panchangItem.festivals.length > 0 && (
                    <p className="text-orange-100 text-sm mt-1">🎉 {panchangItem.festivals.join(' · ')}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition ml-2 flex-shrink-0"
                  aria-label="Close panel"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 p-5 space-y-5">
              {/* Tithi */}
              <section>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">🌙 Tithi</p>
                {tithi ? (
                  <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-purple-800">{tithi.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tithi.auspicious ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {tithi.auspicious ? '✓ Auspicious' : '✗ Inauspicious'}
                      </span>
                    </div>
                    <p className="text-xs text-purple-600">{tithi.paksha} Paksha</p>
                    <p className="text-xs text-gray-500 mt-1">Suitable for: {tithi.suitable.join(', ')}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Not available</p>
                )}
              </section>

              {/* Nakshatra */}
              {nakshatra && (
                <section>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">⭐ Nakshatra</p>
                  <div className="rounded-xl p-3 border" style={{ borderColor: nakshatra.color + '60', backgroundColor: nakshatra.color + '10' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-800">{nakshatra.name}</span>
                      <NatureChip nature={nakshatra.nature} />
                    </div>
                    <p className="text-xs text-gray-500">Deity: {nakshatra.deity}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {nakshatra.suitable.map(s => (
                        <span key={s} className="text-[10px] bg-white/80 border rounded-full px-2 py-0.5 text-gray-600">{s}</span>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Sun & Time */}
              <section>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">🌅 Timings</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
                    <p className="text-xl mb-1">🌅</p>
                    <p className="text-xs text-gray-500">Sunrise</p>
                    <p className="font-semibold text-amber-700">{sunrise}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 border border-orange-100 text-center">
                    <p className="text-xl mb-1">🌇</p>
                    <p className="text-xs text-gray-500">Sunset</p>
                    <p className="font-semibold text-orange-700">{sunset}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 border border-red-100 col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">⚡ Rahu Kaal <span className="text-red-500">(avoid)</span></p>
                        <p className="font-semibold text-red-600">{rahuKaal || '—'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">✅ Abhijit Muhurat</p>
                        <p className="font-semibold text-green-600">12:00 – 12:48 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Panchang extra info */}
              {panchangItem && (
                <section>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">📜 Panchang</p>
                  <div className="bg-gray-50 rounded-xl p-3 border space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="font-medium capitalize">{panchangItem.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Auspicious</span>
                      <span className={`font-medium ${panchangItem.is_auspicious ? 'text-green-600' : 'text-gray-500'}`}>
                        {panchangItem.is_auspicious ? '✓ Yes' : 'Neutral'}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* Suggested Poojas */}
              <section>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">🪔 Suggested Poojas</p>
                <div className="space-y-2">
                  {suggestedPoojas.slice(0, 3).map(slug => (
                    <Link
                      key={slug}
                      href={`/poojas/${slug}?date=${dateStr}`}
                      className="flex items-center justify-between bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl px-4 py-3 transition"
                    >
                      <span className="text-sm font-medium text-orange-800">
                        🪔 {POOJA_LABELS[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* CTA Footer */}
            <div className="p-5 border-t bg-gray-50 flex-shrink-0">
              <Link
                href={`/poojas?date=${dateStr}`}
                className="block w-full py-3 bg-primary text-white text-center rounded-xl font-semibold hover:bg-primary-dark transition"
              >
                View All Poojas for This Date →
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
