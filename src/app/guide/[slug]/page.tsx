import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
  if (!guide) notFound()

  return <GuideDetail guide={guide} />
}
