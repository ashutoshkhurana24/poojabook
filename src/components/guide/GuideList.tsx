'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { POOJA_GUIDES, GUIDE_CATEGORIES, DIFFICULTY_COLORS } from '@/lib/poojaGuides'

export default function GuideList() {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return POOJA_GUIDES.filter(g => {
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.deity.toLowerCase().includes(q) ||
        g.shortDesc.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
      const matchCat = category === 'All' || g.category === category
      return matchSearch && matchCat
    })
  }, [search, category])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div className="bg-gradient-to-b from-secondary to-secondary/90 py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://thumbs.dreamstime.com/b/vibrant-diwali-puja-thali-brimming-traditional-offerings-shimmering-diyas-fragrant-flowers-sweet-delicacies-symbolic-324123032.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-3">
            📖 Pooja Guide & Wiki
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Everything you need to know about Hindu poojas — samagri, process, mantras, and benefits.
          </p>
          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search poojas, deities, categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-12 px-5 rounded-full border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {GUIDE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-text-secondary hover:bg-primary/10 border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-text-secondary text-sm mb-6 text-center">
          Showing <strong>{filtered.length}</strong> of {POOJA_GUIDES.length} guides
        </p>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">🙏</p>
            <p className="text-gray-500">No guides found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(guide => (
              <Link
                key={guide.id}
                href={`/guide/${guide.slug}`}
                className="group bg-surface rounded-2xl border hover:border-primary hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Card top */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 flex items-center gap-4">
                  <span className="text-5xl">{guide.icon}</span>
                  <div>
                    <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide mb-0.5">
                      {guide.category}
                    </p>
                    <h2 className="font-heading text-xl group-hover:text-primary transition">
                      {guide.name}
                    </h2>
                    <p className="text-sm text-text-secondary mt-0.5">{guide.deity}</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-sm text-text-secondary mb-4 flex-1">{guide.shortDesc}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                      ⏱ {guide.duration}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${DIFFICULTY_COLORS[guide.difficulty]}`}>
                      {guide.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                      📍 {guide.region}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="flex-1 text-center py-2 bg-primary text-white rounded-xl text-sm font-semibold group-hover:bg-primary-dark transition">
                      Read Guide →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 text-center border border-orange-200">
          <h2 className="font-heading text-2xl mb-2">Ready to Perform a Pooja?</h2>
          <p className="text-text-secondary mb-5">
            Book an experienced pandit to guide you through an authentic ceremony.
          </p>
          <Link
            href="/poojas"
            className="inline-block px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition"
          >
            Browse All Poojas →
          </Link>
        </div>
      </div>
    </div>
  )
}
