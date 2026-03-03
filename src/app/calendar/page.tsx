'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  getPanchangData,
  getPanchangForDate,
  getFestivalDates,
  getDayName,
  getRahuKaal,
  formatDateHindi,
  RAHU_KAAL,
  type PankajItem,
} from '@/lib/panchang'
import {
  calculateMuhuratScore,
  getNakshatraForDate,
  getTithiForDate,
  getRegionForCity,
  getFestivalRegion,
  REGION_COLORS,
  REGIONAL_FESTIVALS,
} from '@/lib/calendarData'
import MuhuratFinder from '@/components/calendar/MuhuratFinder'
import DayDetailPanel from '@/components/calendar/DayDetailPanel'
import RegionalFilter from '@/components/calendar/RegionalFilter'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCellBorder(panchang: PankajItem | undefined, score: number): string {
  if (!panchang) return 'border-gray-100'
  if (panchang.type === 'amavasya') return 'border-gray-400 bg-gray-50'
  if (score >= 80 || panchang.type === 'major' || panchang.type === 'purnima')
    return 'border-green-400 bg-green-50/40'
  if (score >= 50 || panchang.is_auspicious)
    return 'border-yellow-400 bg-yellow-50/40'
  return 'border-gray-100'
}

function AuspiciousDot({ score, type }: { score: number; type?: string }) {
  if (type === 'amavasya') return <span className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
  if (score >= 80 || type === 'major' || type === 'purnima')
    return <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
  if (score >= 50) return <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
  return null
}

// ─── Today's Summary Banner ───────────────────────────────────────────────────

function TodayBanner({
  todayStr,
  panchangMap,
  onOpenDetail,
}: {
  todayStr: string
  panchangMap: Map<string, PankajItem>
  onOpenDetail: () => void
}) {
  const panchang   = panchangMap.get(todayStr)
  const nakshatra  = getNakshatraForDate(todayStr, panchang?.nakshatra)
  const tithi      = getTithiForDate(todayStr, panchang?.tithi)
  const rahuKaal   = getRahuKaal()
  const score      = calculateMuhuratScore(todayStr, 'pooja', panchang?.nakshatra, panchang?.tithi, panchang?.is_auspicious)
  const stars      = score >= 90 ? 5 : score >= 75 ? 4 : score >= 55 ? 3 : score >= 35 ? 2 : 1
  const today      = new Date()
  const dateLabel  = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-orange-100 text-xs font-medium uppercase tracking-wider mb-1">🌟 Today</p>
          <p className="font-heading text-xl">{dateLabel}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
            {tithi && (
              <span>🌙 Tithi: <strong>{tithi.name}</strong> ({tithi.paksha} Paksha)</span>
            )}
            <span>⭐ Nakshatra: <strong>{nakshatra.name}</strong></span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={s <= stars ? 'text-yellow-300' : 'text-orange-300/50'}>★</span>
              ))}
            </div>
            <span className="text-orange-100 text-sm">Auspiciousness: <strong>{score}/100</strong></span>
          </div>
          {panchang?.pooja_suggestions?.length ? (
            <p className="text-orange-100 text-xs mt-1">
              Best for: {panchang.pooja_suggestions.map(s => s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')}
            </p>
          ) : nakshatra?.suitable?.length ? (
            <p className="text-orange-100 text-xs mt-1">
              Best for: {nakshatra.suitable.slice(0, 3).join(', ')}
            </p>
          ) : null}
          <p className="text-orange-100 text-xs mt-1">⚡ Rahu Kaal: {rahuKaal}</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={onOpenDetail}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition"
          >
            View Details
          </button>
          <Link
            href={`/poojas?date=${todayStr}`}
            className="px-4 py-2 bg-white text-orange-600 hover:bg-orange-50 rounded-xl text-sm font-semibold transition"
          >
            Book Today&apos;s Pooja
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const [activeTab, setActiveTab]       = useState<'calendar' | 'list' | 'muhurat'>('calendar')
  const [currentDate, setCurrentDate]   = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [filter, setFilter]             = useState<string>('all')
  const [activeRegion, setActiveRegion] = useState('all')
  const [userCity, setUserCity]         = useState<string | undefined>()

  const today    = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const year     = currentDate.getFullYear()
  const month    = currentDate.getMonth()

  const monthName = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  // Load user city from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('poojabook_user_city')
    if (saved) {
      setUserCity(saved)
      setActiveRegion(getRegionForCity(saved))
    }
  }, [])

  // Build panchang lookup map
  const panchangMap = useMemo(() => {
    const map = new Map<string, PankajItem>()
    getPanchangData().forEach(item => map.set(item.date, item))
    return map
  }, [])

  // Calendar grid days
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days: (string | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) {
    const m = String(month + 1).padStart(2, '0')
    const d = String(i).padStart(2, '0')
    days.push(`${year}-${m}-${d}`)
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  // Festival list filters
  const filteredFestivals = useMemo(() => {
    const threeMonths = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
    return getFestivalDates().filter(item => {
      const d = new Date(item.date + 'T00:00:00')
      if (d < today || d > threeMonths) return false
      return filter === 'all' || item.type === filter
    })
  }, [filter])

  const selectedPanchang = selectedDate ? panchangMap.get(selectedDate) : null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Page Title */}
        <div className="text-center mb-6">
          <h1 className="font-heading text-3xl mb-1">🗓️ Hindu Panchang Calendar</h1>
          <p className="text-text-secondary text-sm">Find auspicious dates, muhurats, and regional festivals</p>
        </div>

        {/* Today's Summary Banner */}
        <div className="mb-6">
          <TodayBanner
            todayStr={todayStr}
            panchangMap={panchangMap}
            onOpenDetail={() => setSelectedDate(todayStr)}
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {([
            { key: 'calendar', label: '📅 Calendar' },
            { key: 'list',     label: '📋 Festival List' },
            { key: 'muhurat',  label: '🔍 Muhurat Finder' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-text-secondary hover:bg-primary/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Calendar View ─────────────────────────────────────────────────── */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            {/* Regional Filter */}
            <RegionalFilter
              activeRegion={activeRegion}
              onChange={setActiveRegion}
              userCity={userCity}
              currentMonth={month + 1}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Calendar Grid */}
              <div className="xl:col-span-2 bg-surface rounded-2xl p-4 sm:p-6">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-5">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg text-lg transition"
                  >
                    ←
                  </button>
                  <h2 className="font-heading text-xl">{monthName}</h2>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg text-lg transition"
                  >
                    →
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-text-secondary py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((dateStr, idx) => {
                    if (!dateStr) return <div key={idx} className="h-16 sm:h-20" />

                    const dayNum    = parseInt(dateStr.split('-')[2])
                    const panchang  = panchangMap.get(dateStr)
                    const isToday   = todayStr === dateStr
                    const isSelected = selectedDate === dateStr

                    const nakshatra = getNakshatraForDate(dateStr, panchang?.nakshatra)
                    const score     = calculateMuhuratScore(
                      dateStr, 'pooja',
                      panchang?.nakshatra, panchang?.tithi, panchang?.is_auspicious,
                    )

                    // Regional dots
                    const festivalRegions: string[] = []
                    if (panchang?.festivals) {
                      for (const f of panchang.festivals) {
                        const r = getFestivalRegion(f)
                        if (r && !festivalRegions.includes(r)) festivalRegions.push(r)
                      }
                    }

                    const cellBorder = isSelected
                      ? 'border-primary bg-primary/10'
                      : isToday
                        ? 'border-amber-400 bg-amber-50'
                        : getCellBorder(panchang, score)

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        title={panchang ? `${panchang.tithi} · ${panchang.nakshatra}${panchang.festivals.length ? ' · ' + panchang.festivals.join(', ') : ''}` : dateStr}
                        className={`h-16 sm:h-20 rounded-lg border-2 text-left p-1 transition relative overflow-hidden flex flex-col ${cellBorder}`}
                      >
                        <span className={`text-xs sm:text-sm font-semibold leading-none ${isToday ? 'text-amber-700' : ''}`}>
                          {dayNum}
                        </span>
                        {panchang && (
                          <>
                            <div className="text-[9px] sm:text-[10px] text-gray-500 truncate leading-tight mt-0.5 hidden sm:block">
                              {panchang.tithi}
                            </div>
                            <div className="text-[9px] text-gray-400 truncate leading-tight hidden sm:block">
                              {nakshatra.name}
                            </div>
                          </>
                        )}
                        {/* Dots row */}
                        <div className="flex gap-0.5 mt-auto">
                          {panchang && score > 0 && (
                            <AuspiciousDot score={score} type={panchang.type} />
                          )}
                          {festivalRegions.map(r => (
                            <span
                              key={r}
                              className={`w-1.5 h-1.5 rounded-full inline-block ${REGION_COLORS[r] || 'bg-orange-400'}`}
                            />
                          ))}
                          {panchang?.festivals && panchang.festivals.length > 0 && festivalRegions.length === 0 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t text-xs text-gray-600">
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Highly auspicious</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> Auspicious</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-500 inline-block" /> Amavasya</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> N. India</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> S. India</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> E. India</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> W. India</div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Today's Panchang */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
                  <h3 className="font-heading text-lg mb-1 flex items-center gap-2">
                    📅 Today&apos;s Panchang
                  </h3>
                  <div className="text-base font-bold mb-3 text-amber-800">{formatDateHindi(today)}</div>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Tithi',     value: panchangMap.get(todayStr)?.tithi || getTithiForDate(todayStr)?.name || '—' },
                      { label: 'Paksha',    value: panchangMap.get(todayStr)?.paksha || getTithiForDate(todayStr)?.paksha || '—' },
                      { label: 'Nakshatra', value: panchangMap.get(todayStr)?.nakshatra || getNakshatraForDate(todayStr).name },
                      { label: 'Rahu Kaal', value: getRahuKaal(), red: true },
                      { label: 'Abhijit',   value: '12:00 – 12:48 PM', green: true },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between gap-2">
                        <span className="text-gray-500 flex-shrink-0">{row.label}:</span>
                        <span className={`font-medium text-right ${row.red ? 'text-red-600' : row.green ? 'text-green-600' : ''}`}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedDate(todayStr)}
                    className="mt-4 w-full py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition"
                  >
                    Full Details →
                  </button>
                </div>

                {/* Selected date card */}
                {selectedDate && selectedDate !== todayStr && (
                  <div className="bg-surface rounded-2xl p-5 border">
                    <h3 className="font-heading text-base mb-3">
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
                        weekday: 'short', day: 'numeric', month: 'long',
                      })}
                    </h3>
                    {selectedPanchang ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Tithi:</span><span className="font-medium">{selectedPanchang.tithi} ({selectedPanchang.paksha})</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Nakshatra:</span><span className="font-medium">{selectedPanchang.nakshatra}</span></div>
                        {selectedPanchang.festivals.length > 0 && (
                          <div><span className="text-gray-500">Festivals:</span><span className="ml-2 font-medium text-amber-700">{selectedPanchang.festivals.join(', ')}</span></div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Nakshatra:</span>
                          <span className="font-medium">{getNakshatraForDate(selectedDate).name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tithi:</span>
                          <span className="font-medium">{getTithiForDate(selectedDate)?.name || '—'}</span>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => {}}  // DayDetailPanel handles this via selectedDate prop
                      className="mt-3 w-full py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition"
                    >
                      Full Details →
                    </button>
                    {selectedPanchang?.pooja_suggestions?.length ? (
                      <div className="mt-3 space-y-1">
                        {selectedPanchang.pooja_suggestions.slice(0, 2).map(slug => (
                          <Link
                            key={slug}
                            href={`/poojas/${slug}?date=${selectedDate}`}
                            className="block text-primary hover:underline text-sm"
                          >
                            🪔 Book {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} →
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Festival List ──────────────────────────────────────────────────── */}
        {activeTab === 'list' && (
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              {['all','major','ekadashi','amavasya','purnima'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'bg-surface text-text-secondary hover:bg-gray-100'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredFestivals.map(item => {
                const regionalRegion = item.festivals
                  .map(f => getFestivalRegion(f))
                  .find(Boolean)

                return (
                  <div
                    key={item.date}
                    className="bg-surface rounded-xl p-4 flex items-center justify-between border gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-sm">
                          {new Date(item.date + 'T00:00:00').toLocaleDateString('en-IN', {
                            weekday: 'short', day: 'numeric', month: 'short',
                          })}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          item.type === 'major'    ? 'bg-amber-100 text-amber-700' :
                          item.type === 'ekadashi' ? 'bg-purple-100 text-purple-700' :
                          item.type === 'amavasya' ? 'bg-gray-100 text-gray-700' :
                          item.type === 'purnima'  ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {item.type}
                        </span>
                        {regionalRegion && (
                          <span className={`px-2 py-0.5 rounded-full text-xs text-white ${REGION_COLORS[regionalRegion] || 'bg-orange-400'}`}>
                            {REGIONAL_FESTIVALS[regionalRegion]?.icon} {REGIONAL_FESTIVALS[regionalRegion]?.region}
                          </span>
                        )}
                      </div>
                      <p className="text-base font-semibold mt-1 truncate">{item.festivals.join(', ')}</p>
                      <p className="text-xs text-gray-500">{item.tithi} • {item.nakshatra}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setSelectedDate(item.date); setActiveTab('calendar') }}
                        className="text-xs text-primary hover:underline"
                      >
                        View on calendar
                      </button>
                      {item.pooja_suggestions.length > 0 && (
                        <Link
                          href={`/poojas/${item.pooja_suggestions[0]}?date=${item.date}`}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition"
                        >
                          Book Pooja
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Muhurat Finder ─────────────────────────────────────────────────── */}
        {activeTab === 'muhurat' && <MuhuratFinder />}
      </div>

      {/* Day Detail Slide Panel */}
      <DayDetailPanel
        dateStr={selectedDate}
        panchangItem={selectedPanchang}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  )
}
