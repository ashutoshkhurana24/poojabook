import Link from 'next/link'

const poojas = [
  { id: '1', title: 'Ganesh Puja', slug: 'ganesh-puja', description: 'Invoke the blessings of Lord Ganesha, the remover of obstacles.', price: 1100, category: 'Ganesh', mode: 'IN_TEMPLE', rating: 4.8, reviews: 124 },
  { id: '2', title: 'Lakshmi Puja', slug: 'lakshmi-puja', description: 'Propitiate Goddess Lakshmi for wealth, prosperity, and abundance.', price: 2100, category: 'Lakshmi', mode: 'IN_TEMPLE', rating: 4.9, reviews: 89 },
  { id: '3', title: 'Navgraha Shanti', slug: 'navgraha-shanti', description: 'Pacify the nine planetary influences for harmony in life.', price: 5100, category: 'Navgraha', mode: 'AT_HOME', rating: 4.7, reviews: 56 },
  { id: '4', title: 'Satyanarayan Puja', slug: 'satyanarayan-puja', description: 'Perform this sacred puja for mental peace and prosperity.', price: 2500, category: 'Satyanarayan', mode: 'AT_HOME', rating: 4.8, reviews: 203 },
  { id: '5', title: 'Rudrabhishek', slug: 'rudrabhishek', description: 'Abhishek of Lord Shiva with milk, honey, ghee, and sacred items.', price: 8100, category: 'Rudrabhishek', mode: 'AT_HOME', rating: 4.9, reviews: 45 },
  { id: '6', title: 'Vishnu Sahasranamam', slug: 'vishnu-sahasranamam', description: 'Recitation of the 1000 names of Lord Vishnu.', price: 3100, category: 'Vishnu', mode: 'ONLINE', rating: 4.7, reviews: 78 },
  { id: '7', title: 'Hanuman Chalisa', slug: 'hanuman-chalisa', description: 'Recitation of Hanuman Chalisa for courage and protection.', price: 510, category: 'Hanuman', mode: 'AT_HOME', rating: 4.9, reviews: 312 },
  { id: '8', title: 'Durga Puja', slug: 'durga-puja', description: 'Worship of Goddess Durga for power and removal of obstacles.', price: 10100, category: 'Durga', mode: 'IN_TEMPLE', rating: 4.8, reviews: 67 },
  { id: '9', title: 'Ganga Aarti', slug: 'ganga-aarti', description: 'Experience the divine Ganga Aarti virtually.', price: 510, category: 'Ganga', mode: 'ONLINE', rating: 4.6, reviews: 156 },
  { id: '10', title: 'Saraswati Puja', slug: 'saraswati-puja', description: 'Worship Goddess Saraswati for knowledge and wisdom.', price: 1500, category: 'Saraswati', mode: 'IN_TEMPLE', rating: 4.7, reviews: 89 },
  { id: '11', title: 'Mahashivratri', slug: 'mahashivratri', description: 'The great night of Lord Shiva with Rudra abhishek.', price: 15100, category: 'Shiva', mode: 'AT_HOME', rating: 5.0, reviews: 23 },
  { id: '12', title: 'Diwali Lakshmi Puja', slug: 'diwali-lakshmi-puja', description: 'Special Lakshmi puja performed on Diwali evening.', price: 3100, category: 'Lakshmi', mode: 'AT_HOME', rating: 4.9, reviews: 178 },
]

const categories = [
  { name: 'Ganesh', slug: 'ganesh' },
  { name: 'Lakshmi', slug: 'lakshmi' },
  { name: 'Navgraha', slug: 'navgraha' },
  { name: 'Satyanarayan', slug: 'satyanarayan' },
  { name: 'Rudrabhishek', slug: 'rudrabhishek' },
  { name: 'Vishnu', slug: 'vishnu' },
  { name: 'Hanuman', slug: 'hanuman' },
  { name: 'Durga', slug: 'durga' },
]

export default function PoojasPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; city?: string; mode?: string; search?: string }>
}) {
  const params = { category: '', city: '', mode: '', search: '' }
  
  const filteredPoojas = poojas.filter(p => {
    if (params.category && p.category.toLowerCase() !== params.category) return false
    if (params.mode && p.mode !== params.mode) return false
    if (params.search && !p.title.toLowerCase().includes(params.search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-surface rounded-2xl p-6 sticky top-24">
              <h2 className="font-heading text-xl mb-6">Filters</h2>
              
              <form method="get" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mode</label>
                  <select
                    name="mode"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none"
                  >
                    <option value="">All Modes</option>
                    <option value="IN_TEMPLE">In Temple</option>
                    <option value="AT_HOME">At Home</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          {/* Poojas Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-heading text-2xl">All Poojas</h1>
              <span className="text-text-secondary">{filteredPoojas.length} results</span>
            </div>

            {filteredPoojas.length === 0 ? (
              <div className="bg-surface rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-heading text-xl mb-2">No poojas found</h3>
                <p className="text-text-secondary">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPoojas.map((pooja) => (
                  <Link
                    key={pooja.id}
                    href={`/poojas/${pooja.slug}`}
                    className="bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group"
                  >
                    <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-5xl">🪔</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-accent/20 text-accent-dark text-xs rounded-full">
                          {pooja.category}
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
                          <span className="text-sm font-medium">{pooja.rating}</span>
                          <span className="text-text-secondary text-sm">({pooja.reviews})</span>
                        </div>
                        <div className="text-primary font-semibold">
                          ₹{pooja.price.toLocaleString()}
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
