'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LocationSelector from '@/components/LocationSelector'
import AuspiciousDaysSection from '@/components/AuspiciousDaysSection'

const tourSteps = [
  { title: 'Welcome!', message: 'Welcome to PoojaBook! Let me guide you through.' },
  { title: 'Categories', message: 'Browse poojas by category like Ganesh, Lakshmi, and more.' },
  { title: 'Featured', message: 'Check out our most popular poojas.' },
  { title: 'Auspicious Days', message: 'Plan your pooja on sacred dates like Mahashivratri.' },
  { title: 'How It Works', message: 'Browse, select, book - it\'s that easy!' },
  { title: 'Partner', message: 'Are you a Pandit or Temple? Join us!' },
]

const featuredPoojas = [
  { title: 'Ganesh Puja', slug: 'ganesh-puja', price: 1100, category: 'Ganesh', mode: 'IN_TEMPLE', icon: '🐘' },
  { title: 'Lakshmi Puja', slug: 'lakshmi-puja', price: 2100, category: 'Lakshmi', mode: 'IN_TEMPLE', icon: '🪷' },
  { title: 'Navgraha Shanti', slug: 'navgraha-shanti', price: 5100, category: 'Navgraha', mode: 'AT_HOME', icon: '🌟' },
  { title: 'Satyanarayan Puja', slug: 'satyanarayan-puja', price: 2500, category: 'Satyanarayan', mode: 'AT_HOME', icon: '🔱' },
  { title: 'Rudrabhishek', slug: 'rudrabhishek', price: 8100, category: 'Rudrabhishek', mode: 'AT_HOME', icon: '🕉️' },
  { title: 'Hanuman Chalisa', slug: 'hanuman-chalisa', price: 510, category: 'Hanuman', mode: 'AT_HOME', icon: '🐒' },
]

const categories = [
  { name: 'Ganesh', slug: 'ganesh', icon: '🐘' },
  { name: 'Lakshmi', slug: 'lakshmi', icon: '🪷' },
  { name: 'Navgraha', slug: 'navgraha', icon: '🌟' },
  { name: 'Satyanarayan', slug: 'satyanarayan', icon: '🔱' },
  { name: 'Rudrabhishek', slug: 'rudrabhishek', icon: '🕉️' },
  { name: 'Vishnu', slug: 'vishnu', icon: '🐚' },
  { name: 'Hanuman', slug: 'hanuman', icon: '🐒' },
  { name: 'Durga', slug: 'durga', icon: '⚔️' },
]

export default function HomePage() {
  const [showBanner, setShowBanner] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [tourStep, setTourStep] = useState(-1)

  useEffect(() => {
    const savedCity = localStorage.getItem('poojabook_user_city')
    if (!savedCity) {
      setShowBanner(true)
    }
    // Auto show tour
    setTimeout(() => setTourStep(0), 1500)
  }, [])

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setShowBanner(false)
      return
    }

    setIsDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&email=support@poojabook.com`,
            { headers: { 'User-Agent': 'PoojaBook/1.0' } }
          )
          const data = await response.json()
          const address = data.address
          const city = address.city || address.town || address.village || address.district
          if (city) {
            localStorage.setItem('poojabook_user_city', city)
            const event = new CustomEvent('cityDetected', { detail: city })
            window.dispatchEvent(event)
          }
        } catch (e) {
          console.error(e)
        }
        setShowBanner(false)
        setIsDetecting(false)
      },
      () => {
        setShowBanner(false)
        setIsDetecting(false)
      },
      { timeout: 10000 }
    )
  }

  return (
    <div>
      {/* TOUR POPUP - Always visible for testing */}
      {tourStep >= 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setTourStep(-1)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <button onClick={() => setTourStep(-1)} className="absolute top-3 right-4 text-2xl text-gray-400">×</button>
            <div className="text-4xl mb-4 text-center">🎯</div>
            <h3 className="text-xl font-bold text-center mb-2">{tourSteps[tourStep]?.title}</h3>
            <p className="text-gray-600 text-center mb-6">{tourSteps[tourStep]?.message}</p>
            <div className="flex justify-center gap-3">
              {tourStep > 0 && (
                <button onClick={() => setTourStep(tourStep - 1)} className="px-4 py-2 text-gray-600">← Back</button>
              )}
              <button 
                onClick={() => tourStep < tourSteps.length - 1 ? setTourStep(tourStep + 1) : setTourStep(-1)}
                className="px-6 py-2 bg-orange-600 text-white rounded-full font-medium"
              >
                {tourStep < tourSteps.length - 1 ? 'Next →' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero-section" className="relative bg-gradient-to-b from-secondary/90 to-secondary py-24">
        <div className="absolute inset-0 bg-[url('https://thumbs.dreamstime.com/b/vibrant-diwali-puja-thali-brimming-traditional-offerings-shimmering-diyas-fragrant-flowers-sweet-delicacies-symbolic-324123032.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Book Divine Poojas<br />Across India
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Connect with experienced pandits, book temple services, or arrange at-home poojas with just a few clicks.
            </p>

            {/* Search Box */}
            <div className="bg-surface rounded-2xl p-4 shadow-xl">
              {showBanner && (
                <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    <span>📍</span>
                    <span>Enable location for personalized experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={detectLocation}
                      disabled={isDetecting}
                      className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50"
                    >
                      {isDetecting ? 'Detecting...' : 'Enable'}
                    </button>
                    <button
                      onClick={() => setShowBanner(false)}
                      className="px-2 py-1 text-gray-500 hover:text-gray-700 text-lg leading-none"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <form action="/poojas" className="flex flex-col md:flex-row gap-3">
                <div className="flex-[2]">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search poojas, temples..."
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="flex-[1] min-w-[200px]">
                  <div className="h-12">
                    <LocationSelector />
                  </div>
                </div>
                <button
                  type="submit"
                  className="h-12 px-8 bg-primary text-white rounded-xl hover:bg-primary-dark transition font-semibold whitespace-nowrap"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories-section" className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/poojas?category=${cat.slug}`}
                className="group bg-background rounded-2xl p-6 text-center hover:shadow-lg transition border"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Poojas */}
      <section id="featured-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-heading text-3xl">Featured Poojas</h2>
            <Link href="/poojas" className="text-primary hover:underline font-medium">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPoojas.map((pooja) => (
              <Link
                key={pooja.slug}
                href={`/poojas/${pooja.slug}`}
                className="bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group"
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-6xl">{pooja.icon}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-accent/20 text-accent-dark text-xs rounded-full">
                      {pooja.category}
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {pooja.mode.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl mb-2 group-hover:text-primary transition">
                    {pooja.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-warning">★</span>
                      <span className="text-sm font-medium">4.8</span>
                      <span className="text-text-secondary text-sm">(124)</span>
                    </div>
                    <div className="text-primary font-semibold">
                      ₹{pooja.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AuspiciousDaysSection id="auspicious-section" />

      {/* How It Works */}
      <section id="how-it-works-section" className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="font-heading text-xl mb-2">Browse & Select</h3>
              <p className="text-text-secondary">Explore poojas by category, location, or mode.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="font-heading text-xl mb-2">Book Your Slot</h3>
              <p className="text-text-secondary">Choose date, time, and complete booking.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-heading text-xl mb-2">Divine Experience</h3>
              <p className="text-text-secondary">Enjoy authentic pooja experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="partner-section" className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl mb-4">Are You a Pandit or Temple?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join PoojaBook to reach thousands of devotees seeking your divine services.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-accent text-secondary font-semibold rounded-full hover:bg-accent/90 transition"
          >
            Partner With Us
          </Link>
        </div>
      </section>
    </div>
  )
}
