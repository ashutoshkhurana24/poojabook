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

interface LocationSelectorProps {
  onCityChange?: (city: string) => void
}

function saveAndSetCity(
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
  onCityChange?: (v: string) => void
) {
  try {
    // Primary: ipapi.co
    const res = await axios.get('https://ipapi.co/json/')
    if (res.data?.city) {
      saveAndSetCity(`${res.data.city}, ${res.data.region}`, setSelectedCity, setCustomCity, onCityChange)
      return
    }
    throw new Error('ipapi failed')
  } catch {
    try {
      // Backup: ip-api.com
      const res2 = await axios.get('http://ip-api.com/json/')
      if (res2.data?.city) {
        saveAndSetCity(`${res2.data.city}, ${res2.data.regionName}`, setSelectedCity, setCustomCity, onCityChange)
        return
      }
    } catch {
      // Silent fallback — never show an error
    }
    // Final fallback
    saveAndSetCity(FALLBACK_CITY, setSelectedCity, setCustomCity, onCityChange)
  }
}

export default function LocationSelector({ onCityChange }: LocationSelectorProps) {
  const [selectedCity, setSelectedCity] = useState('')
  const [customCity, setCustomCity] = useState('')

  useEffect(() => {
    const savedCity = localStorage.getItem('poojabook_user_city')
    if (savedCity) {
      setSelectedCity(savedCity)
      onCityChange?.(savedCity)
    } else {
      detectByIP(setSelectedCity, setCustomCity, onCityChange)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for cityDetected event (fired elsewhere in the app)
  useEffect(() => {
    const handler = (e: Event) => {
      const city = (e as CustomEvent<string>).detail
      if (city) {
        setSelectedCity(city)
        setCustomCity('')
      }
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

  return (
    <div className="relative w-full h-full">
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
      {selectedCity && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-green-500 text-sm">✓</span>
        </div>
      )}
    </div>
  )
}
