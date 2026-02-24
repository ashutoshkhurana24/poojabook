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
      const bannerDismissed = localStorage.getItem('poojabook_location_banner_dismissed')
      if (!bannerDismissed) {
        setShowBanner(true)
      }
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
            setError('Location detected but couldn\'t find city. Please select manually.')
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
            'Madhya Pradesh': 'MP',
            'Rajasthan': 'Rajasthan',
            'Punjab': 'Punjab',
            'Haryana': 'Haryana',
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
          localStorage.setItem('poojabook_location_banner_dismissed', 'true')
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
          setError('Location access denied. Please select your city.')
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
    localStorage.setItem('poojabook_location_banner_dismissed', 'true')
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
    <>
      {showBanner && (
        <div className="mb-4 bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
          <p className="text-sm text-primary">
            Allow location access for a personalized experience
          </p>
          <div className="flex gap-2 ml-4">
            <button
              onClick={handleAllowBanner}
              className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition"
            >
              Allow
            </button>
            <button
              onClick={handleDismissBanner}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <select
          name="city"
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.value} value={city.value}>
              {city.label}
            </option>
          ))}
        </select>
        
        <button
          type="button"
          onClick={detectLocation}
          disabled={isDetecting}
          title="Detect my location"
          className="px-3 py-3 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition flex items-center justify-center min-w-[50px]"
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

      {selectedCity && !customCity && (
        <button
          type="button"
          onClick={clearLocation}
          className="text-xs text-text-secondary hover:text-primary mt-1 underline"
        >
          Not {cities.find(c => c.value === selectedCity)?.label || selectedCity}? Change
        </button>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </>
  )
}
