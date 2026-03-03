'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface CityOption {
  value: string
  label: string
}

const DEFAULT_CITIES: CityOption[] = [
  { value: 'Mumbai', label: 'Mumbai, Maharashtra' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Bangalore', label: 'Bangalore, Karnataka' },
  { value: 'Varanasi', label: 'Varanasi, UP' },
  { value: 'Chennai', label: 'Chennai, Tamil Nadu' },
]

const FALLBACK_CITY = 'Chennai, Tamil Nadu'

type LocationStatus = 'idle' | 'detecting' | 'success' | 'fallback'

interface LocationSelectorProps {
  onCityChange?: (city: string) => void
}

function persistCity(
  fullLocation: string,
  setSelectedCity: (v: string) => void,
  setCustomCity: (v: string) => void,
  onCityChange?: (v: string) => void
) {
  const existing = DEFAULT_CITIES.find(
    c => fullLocation.toLowerCase().startsWith(c.value.toLowerCase())
  )
  const finalValue = existing ? existing.value : fullLocation
  if (!existing) setCustomCity(fullLocation)
  setSelectedCity(finalValue)
  localStorage.setItem('poojabook_user_city', finalValue)
  onCityChange?.(finalValue)
}

async function detectByIP(
  setSelectedCity: (v: string) => void,
  setCustomCity: (v: string) => void,
  setStatus: (s: LocationStatus) => void,
  onCityChange?: (v: string) => void
) {
  try {
    const res = await axios.get('https://ipapi.co/json/')
    if (res.data?.city) {
      persistCity(`${res.data.city}, ${res.data.region}`, setSelectedCity, setCustomCity, onCityChange)
      setStatus('fallback')
      return
    }
    throw new Error('ipapi failed')
  } catch {
    try {
      const res2 = await axios.get('http://ip-api.com/json/')
      if (res2.data?.city) {
        persistCity(`${res2.data.city}, ${res2.data.regionName}`, setSelectedCity, setCustomCity, onCityChange)
        setStatus('fallback')
        return
      }
    } catch { /* ignore */ }
    // Final silent fallback
    persistCity(FALLBACK_CITY, setSelectedCity, setCustomCity, onCityChange)
    setStatus('fallback')
  }
}

export default function LocationSelector({ onCityChange }: LocationSelectorProps) {
  const [selectedCity, setSelectedCity] = useState('')
  const [customCity, setCustomCity] = useState('')
  const [status, setStatus] = useState<LocationStatus>('idle')

  const detectGPSLocation = () => {
    setStatus('detecting')

    if (!navigator.geolocation) {
      detectByIP(setSelectedCity, setCustomCity, setStatus, onCityChange)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const addr = data.address
          const city =
            addr.city || addr.town || addr.city_district ||
            addr.municipality || addr.suburb || addr.village ||
            addr.district || addr.county
          const state = addr.state || ''

          if (city) {
            const loc = state ? `${city}, ${state}` : city
            persistCity(loc, setSelectedCity, setCustomCity, onCityChange)
            setStatus('success')
          } else {
            await detectByIP(setSelectedCity, setCustomCity, setStatus, onCityChange)
          }
        } catch {
          await detectByIP(setSelectedCity, setCustomCity, setStatus, onCityChange)
        }
      },
      async () => {
        // Denied or unavailable — fall back to IP silently, no error shown
        await detectByIP(setSelectedCity, setCustomCity, setStatus, onCityChange)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  useEffect(() => {
    const saved = localStorage.getItem('poojabook_user_city')
    if (saved) {
      setSelectedCity(saved)
      setStatus('success')
      onCityChange?.(saved)
    } else {
      detectGPSLocation()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for cityDetected event fired elsewhere in the app
  useEffect(() => {
    const handler = (e: Event) => {
      const city = (e as CustomEvent<string>).detail
      if (city) { setSelectedCity(city); setCustomCity(''); setStatus('success') }
    }
    window.addEventListener('cityDetected', handler)
    return () => window.removeEventListener('cityDetected', handler)
  }, [])

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
    setCustomCity('')
    if (value) {
      localStorage.setItem('poojabook_user_city', value)
      onCityChange?.(value)
    }
  }

  const cities = [...DEFAULT_CITIES]
  if (customCity && !cities.find(c => c.value === customCity)) {
    cities.push({ value: customCity, label: customCity })
  }

  const iconContent = () => {
    if (status === 'detecting') {
      return (
        <svg className="animate-spin h-4 w-4 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )
    }
    if (status === 'success') {
      return <span className="text-green-500 text-sm font-bold">✓</span>
    }
    return <span className="text-base">📍</span>
  }

  return (
    <div className="relative w-full h-full">
      <div className="flex items-center h-full gap-2">
        <div className="relative flex-1">
          <select
            name="city"
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full h-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none bg-white text-base"
          >
            <option value="">City</option>
            {cities.map((city) => (
              <option key={city.value} value={city.value}>{city.label}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={detectGPSLocation}
          disabled={status === 'detecting'}
          title={status === 'success' ? 'Location detected' : status === 'detecting' ? 'Detecting...' : 'Detect my location'}
          className="px-3 h-full rounded-xl border border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition flex items-center justify-center bg-white disabled:opacity-60"
        >
          {iconContent()}
        </button>
      </div>
    </div>
  )
}
