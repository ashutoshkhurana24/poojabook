import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import BookingForm from '@/components/BookingForm'

export const dynamic = 'force-dynamic'

export default async function PoojaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const user = await getAuthUser()

  const pooja = await prisma.pooja.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!pooja) {
    return notFound()
  }

  const samagri = JSON.parse(pooja.samagri || '[]')

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-accent/20 text-accent-dark text-sm rounded-full">
                  {pooja.category?.name}
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {pooja.mode}
                </span>
              </div>
              <h1 className="font-heading text-3xl mb-4">{pooja.title}</h1>
              <p className="text-text-secondary mb-6">{pooja.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <span className="text-warning">★</span>
                  <span className="font-medium">4.8</span>
                </div>
                <span className="text-text-secondary">|</span>
                <span className="text-text-secondary">{pooja.duration} minutes</span>
                <span className="text-text-secondary">|</span>
                <span className="text-text-secondary">124 people booked</span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 mb-6">
              <h2 className="font-heading text-xl mb-4">Samagri (Items Needed)</h2>
              <div className="flex flex-wrap gap-2">
                {samagri.map((item: string, i: number) => (
                  <span key={i} className="px-3 py-2 bg-background rounded-lg text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6">
              <h2 className="font-heading text-xl mb-4">Instructions</h2>
              <p className="text-text-secondary">{pooja.instructions || 'Follow the pandit\'s guidance during the puja.'}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface rounded-2xl p-6 sticky top-24">
              <div className="text-3xl font-heading mb-2">₹{pooja.basePrice.toLocaleString()}</div>
              <p className="text-text-secondary text-sm mb-4">Base price (excludes add-ons & taxes)</p>

              {user ? (
                <BookingForm poojaId={pooja.id} basePrice={pooja.basePrice} />
              ) : (
                <Link 
                  href="/login"
                  className="block w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition text-center"
                >
                  Login to Book
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
