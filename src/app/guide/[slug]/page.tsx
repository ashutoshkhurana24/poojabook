import type { Metadata } from 'next'
import Link from 'next/link'
import { getPoojaGuide, POOJA_GUIDES } from '@/lib/poojaGuides'
import GuideDetail from '@/components/guide/GuideDetail'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return POOJA_GUIDES.map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getPoojaGuide(slug)
  if (!guide) return {}

  const title = `${guide.name} — Complete Guide, Samagri & Process | PoojaBook`
  const description = `${guide.shortDesc} Learn how to perform ${guide.name} with a step-by-step process, required samagri, mantras, and benefits.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://poojabook.in/guide/${guide.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params
  const guide = getPoojaGuide(slug)

  if (!guide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6 py-20">
          <p className="text-6xl mb-6">📖</p>
          <h1 className="font-heading text-3xl mb-3">Guide Coming Soon</h1>
          <p className="text-text-secondary mb-2">
            We&apos;re crafting a detailed guide for this pooja — it will be ready shortly.
          </p>
          <p className="text-text-secondary text-sm mb-8">
            In the meantime, you can book this pooja with one of our expert pandits.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/poojas/${slug}`}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition"
            >
              Book This Pooja
            </Link>
            <Link
              href="/guide"
              className="px-6 py-3 border border-primary text-primary rounded-xl font-semibold hover:bg-primary/10 transition"
            >
              Browse All Guides
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <GuideDetail guide={guide} />
}
