'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  getPanchangData, 
  getPanchangForDate, 
  getFestivalDates, 
  getDayName,
  getRahuKaal,
  formatDateHindi,
  PankajItem 
} from '@/lib/panchang'

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const monthName = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const panchangMap = new Map<string, PankajItem>()
  getPanchangData().forEach(item => {
    panchangMap.set(item.date, item)
  })

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push(dateStr)
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-amber-500'
      case 'ekadashi': return 'bg-purple-500'
      case 'amavasya': return 'bg-gray-600'
      case 'purnima': return 'bg-yellow-500'
      default: return 'bg-orange-400'
    }
  }

  const filteredFestivals = getFestivalDates().filter(item => {
    const itemDate = new Date(item.date + 'T00:00:00')
    const threeMonthsLater = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
    if (itemDate < today || itemDate > threeMonthsLater) return false
    if (filter === 'all') return true
    return item.type === filter
  })

  const selectedPanchang = selectedDate ? panchangMap.get(selectedDate) : null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl mb-2">🗓️ Hindu Calendar</h1>
          <p className="text-text-secondary">Find auspicious dates for your poojas</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeTab === 'calendar' 
                ? 'bg-primary text-white' 
                : 'bg-surface text-text-secondary hover:bg-primary/10'
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeTab === 'list' 
                ? 'bg-primary text-white' 
                : 'bg-surface text-text-secondary hover:bg-primary/10'
            }`}
          >
            List View
          </button>
        </div>

        {activeTab === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                    ←
                  </button>
                  <h2 className="font-heading text-xl">{monthName}</h2>
                  <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                    →
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-text-secondary py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((dateStr, idx) => {
                    if (!dateStr) {
                      return <div key={idx} className="h-16" />
                    }
                    
                    const dayNum = parseInt(dateStr.split('-')[2])
                    const panchang = panchangMap.get(dateStr)
                    const isToday = today.toISOString().split('T')[0] === dateStr
                    const isSelected = selectedDate === dateStr

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`h-16 rounded-lg border text-left p-1 transition relative ${
                          isSelected 
                            ? 'border-primary bg-primary/10' 
                            : isToday 
                              ? 'border-amber-400 bg-amber-50'
                              : 'border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <span className={`text-sm ${isToday ? 'font-bold text-amber-600' : ''}`}>
                          {dayNum}
                        </span>
                        {panchang && (
                          <>
                            <div className="text-[10px] text-gray-500 truncate">{panchang.tithi}</div>
                            {panchang.festivals.length > 0 && (
                              <div className={`w-2 h-2 rounded-full absolute bottom-1 left-1 ${getTypeColor(panchang.type)}`} />
                            )}
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    Major Festival
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    Ekadashi
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-600" />
                    Amavasya
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    Purnima
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Pankaj Widget */}
            <div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <h3 className="font-heading text-lg mb-4">📅 Today&apos;s Pankaj</h3>
                <div className="text-2xl font-bold mb-2">{formatDateHindi(today)}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tithi:</span>
                    <span className="font-medium">{panchangMap.get(today.toISOString().split('T')[0])?.tithi || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paksha:</span>
                    <span className="font-medium">{panchangMap.get(today.toISOString().split('T')[0])?.paksha || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nakshatra:</span>
                    <span className="font-medium">{panchangMap.get(today.toISOString().split('T')[0])?.nakshatra || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rahu Kaal:</span>
                    <span className="font-medium text-red-600">{getRahuKaal()}</span>
                  </div>
                </div>
              </div>

              {selectedPanchang && (
                <div className="bg-surface rounded-2xl p-6 mt-4 border">
                  <h3 className="font-heading text-lg mb-4">
                    {new Date(selectedDate! + 'T00:00:00').toLocaleDateString('en-IN', { 
                      day: 'numeric', month: 'long' 
                    })}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Tithi:</span> {selectedPanchang.tithi} ({selectedPanchang.paksha})</div>
                    <div><span className="text-gray-600">Nakshatra:</span> {selectedPanchang.nakshatra}</div>
                    <div><span className="text-gray-600">Type:</span> {selectedPanchang.type}</div>
                    {selectedPanchang.festivals.length > 0 && (
                      <div>
                        <span className="text-gray-600">Festivals:</span>
                        <div className="font-medium text-amber-700">{selectedPanchang.festivals.join(', ')}</div>
                      </div>
                    )}
                    {selectedPanchang.pooja_suggestions.length > 0 && (
                      <div className="pt-2">
                        {selectedPanchang.pooja_suggestions.map(slug => (
                          <Link 
                            key={slug}
                            href={`/poojas/${slug}`}
                            className="block text-primary hover:underline text-sm"
                          >
                            Book {slug.replace('-', ' ')} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'major', 'ekadashi', 'amavasya', 'purnima'].map(f => (
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

            {/* Festival List */}
            <div className="space-y-3">
              {filteredFestivals.map(item => (
                <div 
                  key={item.date} 
                  className="bg-surface rounded-xl p-4 flex items-center justify-between border"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {new Date(item.date + 'T00:00:00').toLocaleDateString('en-IN', { 
                          weekday: 'short', day: 'numeric', month: 'short' 
                        })}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        item.type === 'major' ? 'bg-amber-100 text-amber-700' :
                        item.type === 'ekadashi' ? 'bg-purple-100 text-purple-700' :
                        item.type === 'amavasya' ? 'bg-gray-100 text-gray-700' :
                        item.type === 'purnima' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="text-lg font-medium mt-1">{item.festivals.join(', ')}</div>
                    <div className="text-sm text-gray-500">{item.tithi} • {item.nakshatra}</div>
                  </div>
                  {item.pooja_suggestions.length > 0 && (
                    <Link
                      href={`/poojas/${item.pooja_suggestions[0]}`}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                    >
                      Book Pooja
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
