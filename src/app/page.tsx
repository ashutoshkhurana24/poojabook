'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LocationSelector from '@/components/LocationSelector'
import AuspiciousDaysSection from '@/components/AuspiciousDaysSection'
import WebsiteTour from '@/components/WebsiteTour'
import PanditMatchmaker from '@/components/PanditMatchmaker'

interface Pooja {
  id: string
  title: string
  slug: string
  basePrice: number
  category: { name: string }
  mode: string
  imageUrl?: string | null
}

interface Category {
  name: string
  slug: string
  icon: string
  imageUrl?: string | null
}

const CATEGORY_CONFIG: Record<string, { url: string; objectPosition: string }> = {
  'durga':        { url: 'https://servdharm.com/cdn/shop/articles/durga-puja-celebrations-story_900x.jpg?v=1657454594', objectPosition: '50% 0%' },
  'ganesh':       { url: 'https://www.bhaktiphotos.com/wp-content/uploads/2018/04/Download-SRI-GANESH-Free-PNG-Transparent-Image.jpg', objectPosition: '50% 0%' },
  'hanuman':      { url: 'https://i0.wp.com/yourspositively.com/wp-content/uploads/2020/07/Use-this-featured-Hanuman-1.jpg?fit=640%2C426&ssl=1', objectPosition: '50% 0%' },
  'lakshmi':      { url: 'https://i.etsystatic.com/21961301/r/il/0738f0/2800145575/il_fullxfull.2800145575_l1yw.jpg', objectPosition: '50% 0%' },
  'navgraha':     { url: 'https://artfactory.in/product_pictures/Navgraha%20Yantra-CP11008.jpg', objectPosition: '50% center' },
  'rudrabhishek': { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfr8wpAx5QPx2huLZWP_FX3s_p1gRsA5PqFw&s', objectPosition: '50% center' },
  'satyanarayan': { url: 'https://pujabooking.com/wp-content/uploads/2017/11/Shri-Satya-Narayan-Katha.jpg', objectPosition: '50% 0%' },
  'vishnu':       { url: 'https://nepalyogahome.com/wp-content/uploads/2021/07/Lord-Vishnu.jpg', objectPosition: '50% 0%' },
}

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    avatar: 'PS',
    rating: 5,
    pooja: 'Griha Pravesh Puja',
    review: 'The pandit was incredibly knowledgeable and performed the ceremony with such devotion. Our new home truly feels blessed. The entire booking process was seamless — from selecting the date to the pandit arriving on time.',
    date: 'February 2026',
    verified: true,
  },
  {
    id: 2,
    name: 'Rajesh Iyer',
    location: 'Chennai, Tamil Nadu',
    avatar: 'RI',
    rating: 5,
    pooja: 'Satyanarayan Puja',
    review: "Being away from home in Chennai, I was worried about finding a trusted pandit. PoojaBook made it incredibly easy. The pandit spoke Tamil fluently and the puja was performed exactly as we do it back home in Kerala.",
    date: 'January 2026',
    verified: true,
  },
  {
    id: 3,
    name: 'Anita Gupta',
    location: 'Delhi',
    avatar: 'AG',
    rating: 5,
    pooja: 'Lakshmi Puja',
    review: 'We booked the Lakshmi Puja for Diwali and it was a divine experience. The pandit brought all the samagri, explained every step to our children, and made the entire family feel connected to our traditions.',
    date: 'November 2025',
    verified: true,
  },
  {
    id: 4,
    name: 'Vikram Mehta',
    location: 'Bangalore, Karnataka',
    avatar: 'VM',
    rating: 5,
    pooja: 'Rudrabhishek',
    review: 'I have attended many Rudrabhishek ceremonies but this one was exceptional. The pandit from PoojaBook was deeply learned in Vedic traditions. Highly recommend to anyone seeking authentic spiritual experiences.',
    date: 'December 2025',
    verified: true,
  },
  {
    id: 5,
    name: 'Sunita Reddy',
    location: 'Hyderabad, Telangana',
    avatar: 'SR',
    rating: 5,
    pooja: 'Navgraha Shanti',
    review: 'My father was going through a very difficult phase and we decided to perform Navgraha Shanti. The transformation after the puja has been remarkable. The pandit was punctual, professional and spiritually uplifting.',
    date: 'January 2026',
    verified: true,
  },
  {
    id: 6,
    name: 'Deepak Joshi',
    location: 'Varanasi, UP',
    avatar: 'DJ',
    rating: 5,
    pooja: 'Ganga Aarti',
    review: 'Even though I live in Varanasi, I used PoojaBook to book a private Ganga Aarti for my family visiting from the US. It was the most memorable experience of their trip. Everything was perfectly organized.',
    date: 'February 2026',
    verified: true,
  },
]

export default function HomePage() {
  const [showBanner, setShowBanner] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('poojabook_user_city')
    }
    return false
  })
  const [isDetecting, setIsDetecting] = useState(false)
  const [featuredPoojas, setFeaturedPoojas] = useState<Pooja[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [matchmakerOpen, setMatchmakerOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [visibleTestimonials, setVisibleTestimonials] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) setVisibleTestimonials(1)
        else if (window.innerWidth < 1024) setVisibleTestimonials(2)
        else setVisibleTestimonials(3)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => 
        prev >= TESTIMONIALS.length - visibleTestimonials ? 0 : prev + 1
      )
    }, 4000)
    return () => clearInterval(timer)
  }, [activeTestimonial, visibleTestimonials])

  useEffect(() => {
    Promise.all([
      fetch('/api/poojas?limit=6', { next: { revalidate: 60 } }).then(res => res.json()),
      fetch('/api/categories', { next: { revalidate: 60 } }).then(res => res.json()).catch(() => ({ success: true, data: [] }))
    ]).then(([poojasRes, categoriesRes]) => {
      if (poojasRes.success) {
        setFeaturedPoojas(poojasRes.data.poojas || [])
      }
      if (categoriesRes.success) {
        setCategories(categoriesRes.data || [])
      }
    }).catch(console.error)
    .finally(() => setLoading(false))
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
      <WebsiteTour />

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
            <div data-tour="search" className="bg-surface rounded-2xl p-4 shadow-xl">
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
              
              <button 
                onClick={() => setMatchmakerOpen(true)}
                className="mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                🪔 Find My Perfect Pooja
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories-section" data-tour="categories" className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl text-center mb-12">Browse by Category</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-background rounded-2xl p-6 animate-pulse">
                  <div className="text-4xl mb-3">🪔</div>
                  <div className="h-5 bg-gray-200 rounded mx-auto w-20"></div>
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/poojas?category=${cat.slug}`}
                  className="group bg-background rounded-2xl overflow-hidden text-center hover:shadow-lg transition border"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-orange-50">
                    {(CATEGORY_CONFIG[cat.slug]?.url || cat.imageUrl) ? (
                      <img
                        src={CATEGORY_CONFIG[cat.slug]?.url || cat.imageUrl || ''}
                        alt={cat.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ 
                          objectPosition: cat.slug === 'ganesh' || cat.slug === 'hanuman' ? '50% 0%' : (CATEGORY_CONFIG[cat.slug]?.objectPosition || 'center')
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <span className="text-4xl">{cat.icon}</span>
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-text-primary group-hover:text-primary transition py-3">
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Link href="/poojas?category=ganesh" className="group bg-background rounded-2xl p-6 text-center hover:shadow-lg transition border">
                <div className="text-4xl mb-3">🐘</div>
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition">Ganesh</h3>
              </Link>
              <Link href="/poojas?category=lakshmi" className="group bg-background rounded-2xl p-6 text-center hover:shadow-lg transition border">
                <div className="text-4xl mb-3">🪷</div>
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition">Lakshmi</h3>
              </Link>
              <Link href="/poojas?category=navgraha" className="group bg-background rounded-2xl p-6 text-center hover:shadow-lg transition border">
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition">Navgraha</h3>
              </Link>
              <Link href="/poojas?category=satyanarayan" className="group bg-background rounded-2xl p-6 text-center hover:shadow-lg transition border">
                <div className="text-4xl mb-3">🔱</div>
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition">Satyanarayan</h3>
              </Link>
              <Link href="/poojas?category=rudrabhishek" className="group bg-background rounded-2xl p-6 text-center hover:shadow-lg transition border">
                <div className="text-4xl mb-3">🕉️</div>
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition">Rudrabhishek</h3>
              </Link>
              <Link href="/poojas?category=vishnu" className="group bg-background rounded-2xl p-6 text-center hover:shadow-lg transition border">
                <div className="text-4xl mb-3">🐚</div>
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition">Vishnu</h3>
              </Link>
              <Link href="/poojas?category=hanuman" className="group bg-background rounded-2xl p-6 text-center hover:shadow-lg transition border">
                <div className="text-4xl mb-3">🐒</div>
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition">Hanuman</h3>
              </Link>
              <Link href="/poojas?category=durga" className="group bg-background rounded-2xl p-6 text-center hover:shadow-lg transition border">
                <div className="text-4xl mb-3">⚔️</div>
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition">Durga</h3>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Poojas */}
      <section id="featured-section" data-tour="featured" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-heading text-3xl">Featured Poojas</h2>
            <Link href="/poojas" className="text-primary hover:underline font-medium">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-surface rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredPoojas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPoojas.map((pooja) => (
                <Link
                  key={pooja.id}
                  href={`/poojas/${pooja.slug}`}
                  className="bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-orange-50">
                    {pooja.imageUrl ? (
                      <img
                        src={pooja.imageUrl}
                        alt={pooja.title}
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <span className="text-6xl">🪔</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-accent/20 text-accent-dark text-xs rounded-full">
                        {pooja.category?.name}
                      </span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {pooja.mode?.replace('_', ' ')}
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
                        ₹{pooja.basePrice?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['ganesh-puja', 'lakshmi-puja', 'navgraha-shanti', 'satyanarayan-puja', 'rudrabhishek', 'hanuman-chalisa'].map((slug) => (
                <Link
                  key={slug}
                  href={`/poojas/${slug}`}
                  className="bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-6xl">🪔</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-accent/20 text-accent-dark text-xs rounded-full">
                        General
                      </span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        Available
                      </span>
                    </div>
                    <h3 className="font-heading text-xl mb-2 group-hover:text-primary transition">
                      {slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-warning">★</span>
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-text-secondary text-sm">(124)</span>
                      </div>
                      <div className="text-primary font-semibold">
                        From ₹1,100
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-medium uppercase tracking-wider text-sm mb-2">
              What Devotees Say
            </p>
            <h2 className="text-4xl font-serif text-gray-800 mb-3">
              Blessed Experiences
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Join thousands of families who have experienced divine ceremonies through PoojaBook
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                  <span key={star} className="text-yellow-400 text-2xl">★</span>
                ))}
              </div>
              <span className="text-3xl font-bold text-gray-800">4.9</span>
              <span className="text-gray-400">/ 5 · Based on 2,400+ bookings</span>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeTestimonial * (100 / visibleTestimonials)}%)` }}
            >
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.id}
                  className="min-w-[calc(33.333%-16px)] md:min-w-[calc(50%-12px)] min-w-[calc(100%-0px)] bg-white rounded-2xl p-6 shadow-md border border-orange-100 flex-shrink-0"
                >
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-5 text-sm">
                    "{t.review}"
                  </p>
                  <div className="mb-4">
                    <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">
                      🪔 {t.pooja}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold text-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                          {t.verified && (
                            <span className="text-green-500 text-xs">✓</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs">{t.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-xs">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTestimonial(Math.max(0, activeTestimonial - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-orange-500 hover:bg-orange-50 transition disabled:opacity-30"
              disabled={activeTestimonial === 0}
            >
              ←
            </button>
            <button
              onClick={() => setActiveTestimonial(Math.min(TESTIMONIALS.length - visibleTestimonials, activeTestimonial + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-orange-500 hover:bg-orange-50 transition disabled:opacity-30"
              disabled={activeTestimonial === TESTIMONIALS.length - visibleTestimonials}
            >
              →
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: TESTIMONIALS.length - visibleTestimonials + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeTestimonial === i ? 'bg-orange-500 w-6' : 'bg-orange-200'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-orange-100">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-2xl">🙏</span>
              <div>
                <p className="font-bold text-gray-800">10,000+</p>
                <p className="text-xs">Poojas Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-bold text-gray-800">4.9/5</p>
                <p className="text-xs">Average Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-2xl">🏛</span>
              <div>
                <p className="font-bold text-gray-800">500+</p>
                <p className="text-xs">Verified Pandits</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-bold text-gray-800">50+ Cities</p>
                <p className="text-xs">Across India</p>
              </div>
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

      <PanditMatchmaker open={matchmakerOpen} onClose={() => setMatchmakerOpen(false)} />
    </div>
  )
}
