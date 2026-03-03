import type { Metadata } from 'next'
import GuideList from '@/components/guide/GuideList'

export const metadata: Metadata = {
  title: 'Pooja Guide & Wiki — Learn About Hindu Poojas | PoojaBook',
  description:
    'Comprehensive guides for Hindu poojas — samagri lists, step-by-step rituals, mantras, and auspicious timings for Ganesh Puja, Lakshmi Puja, Rudrabhishek, Durga Puja, and more.',
  openGraph: {
    title: 'Pooja Guide & Wiki | PoojaBook',
    description: 'Everything you need to know about Hindu poojas.',
    url: 'https://poojabook.in/guide',
  },
}

export default function GuidePage() {
  return <GuideList />
}
