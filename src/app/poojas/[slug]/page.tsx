import { notFound } from 'next/navigation'
import Link from 'next/link'

const poojasData: Record<string, {
  title: string
  description: string
  instructions: string
  samagri: string[]
  duration: number
  basePrice: number
  mode: string
  category: string
  rating: number
  reviews: number
  addOns: { name: string; description: string; price: number }[]
}> = {
  'ganesh-puja': {
    title: 'Ganesh Puja',
    description: 'Invoke the blessings of Lord Ganesha, the remover of obstacles. This puja is performed for new beginnings, success in ventures, and removal of hurdles. Lord Ganesha is worshipped first before any other deity as he removes all obstacles and grants wisdom.',
    instructions: 'Chant Om Gan Gan Gana Varte at the beginning and end. Offer modak, durva grass, and red flowers. Perform puja during muhurta for maximum benefits.',
    samagri: ['Modak (21 pieces)', 'Durva Grass', 'Red Flowers', 'Coconut', 'Laddu', 'Sandalwood', 'Incense', 'Camphor'],
    duration: 60,
    basePrice: 1100,
    mode: 'IN_TEMPLE',
    category: 'Ganesh',
    rating: 4.8,
    reviews: 124,
    addOns: [
      { name: 'Premium Pandit', description: 'Highly experienced senior pandit', price: 500 },
      { name: 'Samagri Kit', description: 'All items pre-arranged and delivered', price: 300 },
      { name: 'Prasad Delivery', description: 'Prasad delivered to your home', price: 200 },
    ]
  },
  'lakshmi-puja': {
    title: 'Lakshmi Puja',
    description: 'Propitiate Goddess Lakshmi for wealth, prosperity, and abundance. Performed especially on Diwali and Fridays. Lakshmi is the goddess of wealth, fortune, and prosperity.',
    instructions: 'Chant Lakshmi Ashtakam. Offer lotus, gold coins, and sweet rice. Perform during Shubh Muhurat.',
    samagri: ['Lotus', 'Gold Coins', 'Sweet Rice', 'Kumkum', 'Sandalwood', 'Flowers', 'Fruits', 'Sweets'],
    duration: 90,
    basePrice: 2100,
    mode: 'IN_TEMPLE',
    category: 'Lakshmi',
    rating: 4.9,
    reviews: 89,
    addOns: [
      { name: 'Premium Pandit', description: 'Highly experienced senior pandit', price: 500 },
      { name: 'Gold Plating', description: 'Special gold-plated altar', price: 1000 },
      { name: 'Prasad Delivery', description: 'Prasad delivered to your home', price: 200 },
    ]
  },
  'navgraha-shanti': {
    title: 'Navgraha Shanti',
    description: 'Pacify the nine planetary influences for harmony in life. Recommended for those facing doshas in their horoscope.',
    instructions: 'Recite Navgraha stotram. Offer nine different grains and specific colored cloths to each planet.',
    samagri: ['Nine Grains', 'Nine-colored Cloth', 'Camphor', 'Ghee', 'Incense', 'Fruits', 'Flowers'],
    duration: 120,
    basePrice: 5100,
    mode: 'AT_HOME',
    category: 'Navgraha',
    rating: 4.7,
    reviews: 56,
    addOns: [
      { name: 'Premium Pandit', description: 'Expert in astrology', price: 1000 },
      { name: 'Gemstones', description: 'Recommended gemstones', price: 2500 },
      { name: 'Yantra', description: 'Sacred yantra for home', price: 1500 },
    ]
  },
}

const defaultPooja = {
  title: 'Satyanarayan Puja',
  description: 'Perform this sacred puja for mental peace, prosperity, and fulfillment of wishes.',
  instructions: 'Listen to or read Satyanarayan Katha. Offer banana, milk, and puri.',
  samagri: ['Banana', 'Milk', 'Puri', 'Halwa', 'Flowers', 'Coconut', 'Sandalwood', 'Incense'],
  duration: 90,
  basePrice: 2500,
  mode: 'AT_HOME',
  category: 'Satyanarayan',
  rating: 4.8,
  reviews: 203,
  addOns: [
    { name: 'Premium Pandit', description: 'Highly experienced senior pandit', price: 500 },
    { name: 'Samagri Kit', description: 'All items pre-arranged and delivered', price: 300 },
  ]
}

export default function PoojaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = 'ganesh-puja' // Default for demo
  const pooja = poojasData[slug] || defaultPooja

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-accent/20 text-accent-dark text-sm rounded-full">
                  {pooja.category}
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {pooja.mode.replace('_', ' ')}
                </span>
              </div>
              
              <h1 className="font-heading text-3xl mb-4">{pooja.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-warning text-xl">★</span>
                  <span className="font-semibold">{pooja.rating}</span>
                  <span className="text-text-secondary">({pooja.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-text-secondary">
                  <span>{pooja.duration} mins</span>
                </div>
              </div>

              <p className="text-text-secondary">{pooja.description}</p>
            </div>

            {pooja.samagri && pooja.samagri.length > 0 && (
              <div className="bg-surface rounded-2xl p-6 mb-6">
                <h2 className="font-heading text-xl mb-4">Samagri (Items Required)</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {pooja.samagri.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-text-secondary">
                      <span className="text-primary">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pooja.instructions && (
              <div className="bg-surface rounded-2xl p-6 mb-6">
                <h2 className="font-heading text-xl mb-4">Instructions</h2>
                <p className="text-text-secondary">{pooja.instructions}</p>
              </div>
            )}

            {pooja.addOns && pooja.addOns.length > 0 && (
              <div className="bg-surface rounded-2xl p-6 mb-6">
                <h2 className="font-heading text-xl mb-4">Add-ons</h2>
                <div className="space-y-3">
                  {pooja.addOns.map((addon, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{addon.name}</p>
                        <p className="text-sm text-text-secondary">{addon.description}</p>
                      </div>
                      <span className="text-primary font-semibold">+₹{addon.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-surface rounded-2xl p-6">
              <h2 className="font-heading text-xl mb-4">Reviews</h2>
              <p className="text-text-secondary">{pooja.reviews} people have booked this pooja</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface rounded-2xl p-6 sticky top-24">
              <div className="text-3xl font-heading mb-2">₹{pooja.basePrice.toLocaleString()}</div>
              <p className="text-text-secondary text-sm mb-4">Base price (excludes add-ons & taxes)</p>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Demo Mode:</strong> Connect a database to enable booking.
                </p>
              </div>

              <Link 
                href="/login"
                className="block w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition text-center"
              >
                Login to Book
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
