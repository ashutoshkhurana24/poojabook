export const TOUR_STEPS = [
  { step: 0, route: '/', selector: '[data-tour="search"]', title: 'Find Poojas Near You', body: 'Start by selecting your city.' },
  { step: 1, route: '/', selector: '[data-tour="categories"]', title: 'Browse by Deity', body: 'Choose from Ganesh, Lakshmi, Rudrabhishek and more.' },
  { step: 2, route: '/', selector: '[data-tour="featured"]', title: 'Featured Poojas', body: 'Our most booked poojas — click any to see details.' },
  { step: 3, route: '/poojas', selector: '[data-tour="filters"]', title: 'Filter Your Search', body: 'Filter by Temple, At Home, or Online.' },
  { step: 4, route: '/poojas/ganesh-puja', selector: '[data-tour="booking-form"]', title: 'Book This Pooja', body: 'Review the price and details, then book your slot.' },
]

export function getCurrentStep(): number {
  if (typeof window === 'undefined') return 0
  const saved = localStorage.getItem('poojabook_tour_step')
  return saved ? parseInt(saved) : 0
}

export function setStep(step: number) {
  localStorage.setItem('poojabook_tour_step', String(step))
}

export function startTour() {
  localStorage.setItem('poojabook_tour_active', 'true')
  localStorage.setItem('poojabook_tour_step', '0')
}

export function endTour() {
  localStorage.setItem('poojabook_tour_completed', 'true')
  localStorage.removeItem('poojabook_tour_active')
  localStorage.removeItem('poojabook_tour_step')
}

export function isTourCompleted(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('poojabook_tour_completed') === 'true'
}

export function isTourActive(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('poojabook_tour_active') === 'true'
}
