'use client'

import { useState, useEffect } from 'react'

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

interface LocationSelectorProps {
  onCityChange?: (city: string) => void
}

export default function LocationSelector({ onCityChange }: LocationSelectorProps) {
  const [selectedCity, setSelectedCity] = useState('')
  const [isDetecting, setIsDetecting] = useState(false)
  const [error, setError] = useState('')
  const [customCity, setCustomCity] = useState('')

  useEffect(() => {
    const savedCity = localStorage.getItem('poojabook_user_city')
    if (savedCity) {
      setSelectedCity(savedCity)
      onCityChange?.(savedCity)
    }
  }, [onCityChange])

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setError('Location not supported')
      return
    }

    setIsDetecting(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&email=support@poojabook.com`,
            { headers: { 'User-Agent': 'PoojaBook/1.0' } }
          )
          
          if (!response.ok) throw new Error('Reverse geocoding failed')

          const data = await response.json()
          const address = data.address
          let city = address.city || address.town || address.village || address.district || address.county
          let state = address.state

          if (!city || !state) {
            setError('Couldn\'t find city')
            setIsDetecting(false)
            return
          }

          if (state === 'NCT' || state === 'Delhi') state = 'Delhi'
          
          const stateMap: Record<string, string> = {
            'Maharashtra': 'Maharashtra', 'Karnataka': 'Karnataka',
            'Tamil Nādu': 'Tamil Nadu', 'Tamil Nadu': 'Tamil Nadu',
            'Uttar Pradesh': 'UP', 'West Bengal': 'West Bengal',
            'Gujarat': 'Gujarat', 'Telangana': 'Telangana', 'Kerala': 'Kerala',
          }

          const normalizedState = stateMap[state] || state
          const fullLocation = `${city}, ${normalizedState}`

          const existingCity = DEFAULT_CITIES.find(
            c => c.value.toLowerCase() === city.toLowerCase() || c.label.toLowerCase().includes(city.toLowerCase())
          )

          if (existingCity) {
            setSelectedCity(existingCity.value)
            localStorage.setItem('poojabook_user_city', existingCity.value)
            onCityChange?.(existingCity.value)
          } else {
            setCustomCity(fullLocation)
            setSelectedCity(fullLocation)
            localStorage.setItem('poojabook_user_city', fullLocation)
            onCityChange?.(fullLocation)
          }
        } catch (err) {
          setError('Couldn\'t fetch location')
        } finally {
          setIsDetecting(false)
        }
      },
      (err) => {
        setIsDetecting(false)
        setError(err.code === err.PERMISSION_DENIED ? 'Location denied' : 'Couldn\'t detect location')
      },
      { timeout: 10000 }
    )
  }

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
    setCustomCity('')
    setError('')
    if (value) {
      localStorage.setItem('poojabook_user_city', value)
      onCityChange?.(value)
    }
  }

  const clearLocation = () => {
    setSelectedCity('')
    setCustomCity('')
    localStorage.removeItem('poojabook_user_city')
    onCityChange?.('')
  }

  const cities = [...DEFAULT_CITIES]
  if (customCity && !cities.find(c => c.value === customCity)) {
    cities.push({ value: customCity, label: customCity })
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
          {selectedCity && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-green-500 text-sm">✓</span>
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={detectLocation}
          disabled={isDetecting}
          title="Detect my location"
          className="px-3 h-full rounded-xl border border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition flex items-center justify-center bg-white"
        >
          {isDetecting ? (
            <svg className="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          ) : (
            <span className="text-lg" title="Detect my location">📍</span>
          )}
        </button>
      </div>

      {error && (
        <p className="absolute top-full left-0 text-xs text-red-500 mt-1 whitespace-nowrap">{error}</p>
      )}
    </div>
  )
}
