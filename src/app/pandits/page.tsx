import { prisma } from '@/lib/prisma'
import PanditCard from '@/components/PanditCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PanditsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; language?: string; specialization?: string; rating?: string }>
}) {
  const params = await searchParams
  const { city, language, specialization, rating } = params

  const where: any = {}

  if (city) where.city = city
  if (rating) where.rating = { gte: parseFloat(rating) }
  if (specialization) {
    where.specializations = { contains: specialization }
  }

  const pandits = await prisma.pandit.findMany({
    where,
    orderBy: { rating: 'desc' },
  })

  const categories = await prisma.poojaCategory.findMany()

  const cities = await prisma.pandit.findMany({
    select: { city: true },
    distinct: ['city'],
  })

  const filteredPandits = pandits.filter((pandit) => {
    if (language) {
      const langs = JSON.parse(pandit.languages || '[]')
      if (!langs.includes(language)) return false
    }
    return true
  })

  const languages = ['Hindi', 'Sanskrit', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Gujarati']

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl mb-2">Find Your Pandit</h1>
          <p className="text-text-secondary">Choose from our verified and experienced pandits</p>
        </div>

        <div className="bg-surface rounded-2xl p-4 mb-8">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <select 
                name="city" 
                defaultValue={city || ''}
                className="w-full px-4 py-2 rounded-lg border focus:border-primary outline-none"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c.city} value={c.city}>{c.city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select 
                name="language" 
                defaultValue={language || ''}
                className="w-full px-4 py-2 rounded-lg border focus:border-primary outline-none"
              >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Specialization</label>
              <select 
                name="specialization" 
                defaultValue={specialization || ''}
                className="w-full px-4 py-2 rounded-lg border focus:border-primary outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <select 
                name="rating" 
                defaultValue={rating || ''}
                className="w-full px-4 py-2 rounded-lg border focus:border-primary outline-none"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {filteredPandits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">No pandits found matching your criteria</p>
            <Link href="/pandits" className="text-primary hover:underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPandits.map((pandit) => (
              <PanditCard 
                key={pandit.id} 
                pandit={{
                  ...pandit,
                  languages: JSON.parse(pandit.languages || '[]'),
                  specializations: JSON.parse(pandit.specializations || '[]'),
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
