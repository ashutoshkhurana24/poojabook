import Link from 'next/link'

const featuredPoojas = [
  { title: 'Ganesh Puja', slug: 'ganesh-puja', price: 1100, category: 'Ganesh', mode: 'IN_TEMPLE' },
  { title: 'Lakshmi Puja', slug: 'lakshmi-puja', price: 2100, category: 'Lakshmi', mode: 'IN_TEMPLE' },
  { title: 'Navgraha Shanti', slug: 'navgraha-shanti', price: 5100, category: 'Navgraha', mode: 'AT_HOME' },
  { title: 'Satyanarayan Puja', slug: 'satyanarayan-puja', price: 2500, category: 'Satyanarayan', mode: 'AT_HOME' },
  { title: 'Rudrabhishek', slug: 'rudrabhishek', price: 8100, category: 'Rudrabhishek', mode: 'AT_HOME' },
  { title: 'Hanuman Chalisa', slug: 'hanuman-chalisa', price: 510, category: 'Hanuman', mode: 'AT_HOME' },
]

const categories = [
  { name: 'Ganesh', slug: 'ganesh', icon: '🐘' },
  { name: 'Lakshmi', slug: 'lakshmi', icon: '💰' },
  { name: 'Navgraha', slug: 'navgraha', icon: '🪐' },
  { name: 'Satyanarayan', slug: 'satyanarayan', icon: '🔱' },
  { name: 'Rudrabhishek', slug: 'rudrabhishek', icon: '🗿' },
  { name: 'Vishnu', slug: 'vishnu', icon: '🪷' },
  { name: 'Hanuman', slug: 'hanuman', icon: '🐒' },
  { name: 'Durga', slug: 'durga', icon: '⚔️' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-secondary/90 to-secondary py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Book Divine Poojas<br />Across India
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Connect with experienced pandits, book temple services, or arrange at-home poojas with just a few clicks.
            </p>

            {/* Search Box */}
            <form action="/poojas" className="bg-surface rounded-2xl p-4 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search poojas, temples..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <select
                    name="city"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  >
                    <option value="">Select City</option>
                    <option value="Mumbai">Mumbai, Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore, Karnataka</option>
                    <option value="Varanasi">Varanasi, UP</option>
                    <option value="Chennai">Chennai, Tamil Nadu</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition font-semibold"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-surface">
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
      <section className="py-16">
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
                  <span className="text-6xl">🪔</span>
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

      {/* How It Works */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="font-heading text-xl mb-2">Browse & Select</h3>
              <p className="text-text-secondary">Explore poojas by category, location, or mode. View details, pricing, and available slots.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="font-heading text-xl mb-2">Book Your Slot</h3>
              <p className="text-text-secondary">Choose your preferred date and time, add any extras, and complete your booking.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-heading text-xl mb-2">Divine Experience</h3>
              <p className="text-text-secondary">Receive confirmation and enjoy a peaceful, authentic pooja experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary text-white">
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
