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
  const [showBanner, setShowBanner] = useState(false)
  const [customCity, setCustomCity] = useState('')

  useEffect(() => {
    const savedCity = localStorage.getItem('poojabook_user_city')
    if (savedCity) {
      setSelectedCity(savedCity)
      onCityChange?.(savedCity)
    } else {
      setShowBanner(true)
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
            {
              headers: {
                'User-Agent': 'PoojaBook/1.0',
              },
            }
          )
          
          if (!response.ok) {
            throw new Error('Reverse geocoding failed')
          }

          const data = await response.json()
          
          const address = data.address
          let city = address.city || address.town || address.village || address.district || address.county
          let state = address.state

          if (!city || !state) {
            setError('Couldn\'t find city. Please select manually.')
            setIsDetecting(false)
            return
          }

          if (state === 'NCT' || state === 'Delhi') {
            state = 'Delhi'
          }
          
          const stateMap: Record<string, string> = {
            'Maharashtra': 'Maharashtra',
            'Karnataka': 'Karnataka',
            'Tamil Nādu': 'Tamil Nadu',
            'Tamil Nadu': 'Tamil Nadu',
            'Uttar Pradesh': 'UP',
            'West Bengal': 'West Bengal',
            'Gujarat': 'Gujarat',
            'Telangana': 'Telangana',
            'Kerala': 'Kerala',
          }

          const normalizedState = stateMap[state] || state
          const fullLocation = `${city}, ${normalizedState}`
          const cityValue = city

          const existingCity = DEFAULT_CITIES.find(
            c => c.value.toLowerCase() === cityValue.toLowerCase() || c.label.toLowerCase().includes(cityValue.toLowerCase())
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

          setShowBanner(false)
        } catch (err) {
          console.error('Geocoding error:', err)
          setError('Couldn\'t fetch location. Please select manually.')
        } finally {
          setIsDetecting(false)
        }
      },
      (err) => {
        setIsDetecting(false)
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location denied. Please select your city.')
        } else {
          setError('Couldn\'t detect location. Please select manually.')
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  const handleAllowBanner = () => {
    setShowBanner(false)
    detectLocation()
  }

  const handleDismissBanner = () => {
    setShowBanner(false)
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
    setShowBanner(true)
    localStorage.removeItem('poojabook_user_city')
    localStorage.removeItem('poojabook_location_banner_dismissed')
    onCityChange?.('')
  }

  const cities = [...DEFAULT_CITIES]
  if (customCity && !cities.find(c => c.value === customCity)) {
    cities.push({ value: customCity, label: customCity })
  }

  const selectedLabel = cities.find(c => c.value === selectedCity)?.label || selectedCity

  return (
    <div className="w-full">
      {showBanner && (
        <div className="mb-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <span className="text-sm text-gray-700">Enable location for personalized experience</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAllowBanner}
              className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition font-medium"
            >
              Enable
            </button>
            <button
              onClick={handleDismissBanner}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            name="city"
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none bg-white"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
          {selectedCity && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-green-500">✓</span>
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={detectLocation}
          disabled={isDetecting}
          title="Detect my location"
          className="px-4 py-3 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-orange-50 transition flex items-center justify-center min-w-[50px] bg-white"
        >
          {isDetecting ? (
            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <span className="text-lg">📍</span>
          )}
        </button>
      </div>

      {selectedCity && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-green-600 font-medium">✓ {selectedLabel}</span>
          <button
            type="button"
            onClick={clearLocation}
            className="text-xs text-gray-500 hover:text-primary underline"
          >
            Change
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}
