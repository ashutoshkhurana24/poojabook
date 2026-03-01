'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Pooja {
  id: string
  title: string
  slug: string
  description: string
  basePrice: number
  mode: string
  imageUrl?: string | null
  category: { name: string; slug: string }
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function PoojasPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [poojas, setPoojas] = useState<Pooja[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categoryFromUrl = searchParams.get('category') || ''
  const modeFromUrl = searchParams.get('mode') || ''
  const searchFromUrl = searchParams.get('search') || ''

  const [category, setCategory] = useState(categoryFromUrl)
  const [mode, setMode] = useState(modeFromUrl)
  const [search, setSearch] = useState(searchFromUrl)

  const fetchPoojas = useCallback(async (cat: string, mod: string, searchTerm: string) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (cat && cat.trim() !== '') params.set('category', cat.trim())
      if (mod && mod.trim() !== '') params.set('mode', mod.trim())
      if (searchTerm && searchTerm.trim() !== '') params.set('search', searchTerm.trim())
      
      const url = params.toString() ? `/api/poojas?${params.toString()}` : '/api/poojas'
      console.log('Fetching poojas from:', url)
      
      const res = await fetch(url)
      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('API response:', data)
      
      if (res.ok && data.success) {
        const poojasArray = data.data?.poojas || data.poojas || []
        console.log('Poojas array:', poojasArray)
        setPoojas(Array.isArray(poojasArray) ? poojasArray : [])
      } else {
        console.error('API error:', data.error)
        setError(data.error || 'Failed to load poojas')
        setPoojas([])
      }
    } catch (err) {
      console.error('Failed to fetch poojas:', err)
      setError('Failed to load poojas. Please try again.')
      setPoojas([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchPoojas(categoryFromUrl, modeFromUrl, searchFromUrl)
  }, [categoryFromUrl, modeFromUrl, searchFromUrl, fetchPoojas])

  useEffect(() => {
    setCategory(categoryFromUrl)
    setMode(modeFromUrl)
    setSearch(searchFromUrl)
  }, [categoryFromUrl, modeFromUrl, searchFromUrl])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (mode) params.set('mode', mode)
    if (search) params.set('search', search)
    router.push(`/poojas?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/poojas')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div data-tour="filters" className="bg-surface rounded-2xl p-6 sticky top-24">
              <h2 className="font-heading text-xl mb-6">Filters</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search poojas..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none"
                  >
                    <option value="">All Modes</option>
                    <option value="IN_TEMPLE">In Temple</option>
                    <option value="AT_HOME">At Home</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={applyFilters}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                  Apply Filters
                </button>

                {(category || mode || search) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-primary hover:underline text-sm"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Poojas Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-heading text-2xl">
                {categoryFromUrl 
                  ? `${categories.find(c => c.slug === categoryFromUrl)?.name || categoryFromUrl} Poojas`
                  : modeFromUrl 
                    ? `${modeFromUrl.replace('_', ' ')} Poojas`
                    : 'All Poojas'}
              </h1>
              <span className="text-text-secondary">{poojas.length} results</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-surface rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-surface rounded-2xl">
                <p className="text-6xl mb-4">😔</p>
                <p className="text-2xl font-heading">Could not load poojas</p>
                <p className="text-gray-500 mt-2">{error}</p>
                <button 
                  onClick={() => fetchPoojas(categoryFromUrl, modeFromUrl, searchFromUrl)} 
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Try Again
                </button>
              </div>
            ) : poojas.length === 0 ? (
              <div className="text-center py-20 bg-surface rounded-2xl">
                <p className="text-6xl mb-4">🙏</p>
                <p className="text-2xl font-heading">No poojas found</p>
                <p className="text-gray-500 mt-2">Try different filters or search terms</p>
                <button 
                  onClick={clearFilters} 
                  className="mt-4 underline text-orange-600 hover:text-orange-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {poojas.map((pooja) => (
                  <Link
                    key={pooja.id}
                    href={`/poojas/${pooja.slug}`}
                    className="bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group"
                  >
                    <div className="relative h-52 w-full overflow-hidden bg-orange-50">
                      {pooja.imageUrl ? (
                        <img
                          src={pooja.imageUrl}
                          alt={pooja.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                          <span className="text-5xl">🪔</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur-sm text-orange-700 text-xs font-bold px-3 py-1 rounded-full shadow">
                          {pooja.mode === 'IN_TEMPLE' ? '🏛 Temple' : pooja.mode === 'AT_HOME' ? '🏠 At Home' : '💻 Online'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-accent/20 text-accent-dark text-xs rounded-full">
                          {pooja.category?.name}
                        </span>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {pooja.mode.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg mb-2 group-hover:text-primary transition">
                        {pooja.title}
                      </h3>
                      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                        {pooja.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-warning">★</span>
                          <span className="text-sm font-medium">4.8</span>
                          <span className="text-text-secondary text-sm">(124)</span>
                        </div>
                        <div className="text-primary font-semibold">
                          ₹{pooja.basePrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
