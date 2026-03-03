'use client'

import { useMemo } from 'react'
import { REGIONAL_FESTIVALS, type RegionalFestivalEntry } from '@/lib/calendarData'

interface Props {
  activeRegion: string
  onChange: (region: string) => void
  userCity?: string
  currentMonth: number  // 1-12
}

const TABS = [
  { key: 'all',   label: 'All India', icon: '🇮🇳' },
  { key: 'north', label: 'North',     icon: '🏔️' },
  { key: 'south', label: 'South',     icon: '🌴' },
  { key: 'east',  label: 'East',      icon: '🌊' },
  { key: 'west',  label: 'West',      icon: '🏜️' },
]

const REGION_ACCENT: Record<string, string> = {
  north: 'border-red-400 bg-red-50 text-red-700',
  south: 'border-green-500 bg-green-50 text-green-700',
  east:  'border-blue-500 bg-blue-50 text-blue-700',
  west:  'border-yellow-500 bg-yellow-50 text-yellow-700',
}

const REGION_DOT: Record<string, string> = {
  north: 'bg-red-400',
  south: 'bg-green-500',
  east:  'bg-blue-500',
  west:  'bg-yellow-500',
}

export default function RegionalFilter({ activeRegion, onChange, userCity, currentMonth }: Props) {
  // Festivals for the current month across selected regions
  const festivalsThisMonth = useMemo(() => {
    const results: { region: string; festival: RegionalFestivalEntry }[] = []
    const regions = activeRegion === 'all'
      ? Object.keys(REGIONAL_FESTIVALS)
      : [activeRegion]

    for (const region of regions) {
      const data = REGIONAL_FESTIVALS[region]
      if (!data) continue
      for (const f of data.festivals) {
        if (f.month === currentMonth) {
          results.push({ region, festival: f })
        }
      }
    }
    return results
  }, [activeRegion, currentMonth])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          📍 Regional Festivals
          {userCity && (
            <span className="text-xs text-gray-400 font-normal">— detected: {userCity.split(',')[0]}</span>
          )}
        </p>
      </div>

      {/* Region Tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeRegion === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Festivals this month */}
      {festivalsThisMonth.length > 0 ? (
        <div className="space-y-2">
          {festivalsThisMonth.map(({ region, festival }) => (
            <div
              key={`${region}-${festival.name}`}
              className={`flex items-center gap-3 rounded-xl p-2.5 border ${
                REGION_ACCENT[region] || 'border-orange-200 bg-orange-50 text-orange-700'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${REGION_DOT[region] || 'bg-orange-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{festival.name}</p>
                <p className="text-xs opacity-75 truncate">{festival.significance}</p>
              </div>
              <span className="text-lg flex-shrink-0">{REGIONAL_FESTIVALS[region]?.icon}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">
          No regional festivals this month in the selected area.
        </p>
      )}

      {/* Color legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t text-xs text-gray-500">
        {Object.entries(REGIONAL_FESTIVALS).map(([key, data]) => (
          <span key={key} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full inline-block ${REGION_DOT[key]}`} />
            {data.region}
          </span>
        ))}
      </div>
    </div>
  )
}
