import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function PanditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const pandit = await prisma.pandit.findUnique({
    where: { id },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!pandit) {
    return notFound()
  }

  const languages = JSON.parse(pandit.languages || '[]')
  const specializations = JSON.parse(pandit.specializations || '[]')

  const firstSpecialization = specializations[0] || 'ganesh'

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-secondary/90 to-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-white/10 border-4 border-white/20">
                {pandit.photo ? (
                  <img
                    src={pandit.photo}
                    alt={pandit.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🧑‍🎓
                  </div>
                )}
              </div>
              {pandit.isVerified && (
                <div className="absolute bottom-0 right-0 bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  ✓ Verified
                </div>
              )}
            </div>

            <div className="text-center md:text-left text-white">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <h1 className="font-heading text-3xl">{pandit.name}</h1>
                {pandit.verificationBadge && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {pandit.verificationBadge}
                  </span>
                )}
              </div>
              
              <p className="text-gray-300 mb-4">
                {pandit.city}, {pandit.state}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">⭐ {pandit.rating.toFixed(1)}</div>
                  <div className="text-sm text-gray-300">{pandit.totalReviews} reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{pandit.totalPoojasCompleted}</div>
                  <div className="text-sm text-gray-300">Poojas Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{pandit.experienceYears}</div>
                  <div className="text-sm text-gray-300">Years Exp.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {pandit.bio && (
              <div className="bg-surface rounded-2xl p-6">
                <h2 className="font-heading text-xl mb-4">About</h2>
                <p className="text-text-secondary">{pandit.bio}</p>
              </div>
            )}

            <div className="bg-surface rounded-2xl p-6">
              <h2 className="font-heading text-xl mb-4">Specializes In</h2>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec: string) => (
                  <Link
                    key={spec}
                    href={`/poojas?category=${spec}`}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition"
                  >
                    {spec.charAt(0).toUpperCase() + spec.slice(1)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6">
              <h2 className="font-heading text-xl mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang: string) => (
                  <span key={lang} className="px-4 py-2 bg-gray-100 rounded-full">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6">
              <h2 className="font-heading text-xl mb-4">Reviews</h2>
              {pandit.reviews.length === 0 ? (
                <p className="text-text-secondary">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {pandit.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">⭐ {review.rating}</span>
                        <span className="text-text-secondary text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-text-secondary">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface rounded-2xl p-6 sticky top-24">
              <h3 className="font-heading text-lg mb-4">Book With This Pandit</h3>
              <p className="text-text-secondary text-sm mb-4">
                Get expert guidance for your pooja from {pandit.name}
              </p>
              <Link
                href={`/poojas?specialization=${firstSpecialization}`}
                className="block w-full py-3 bg-primary text-white text-center rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Browse Poojas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
