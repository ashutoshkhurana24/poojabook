export const TOUR_STEPS = [
  { step: 0, route: '/', selector: '[data-tour="search"]', title: 'Find Poojas Near You', body: 'Start by selecting your city.' },
  { step: 1, route: '/', selector: '[data-tour="categories"]', title: 'Browse by Deity', body: 'Choose from Ganesh, Lakshmi, Rudrabhishek and more.' },
  { step: 2, route: '/', selector: '[data-tour="featured"]', title: 'Featured Poojas', body: 'Our most booked poojas — click any to see details.' },
  { step: 3, route: '/poojas', selector: '[data-tour="filters"]', title: 'Filter Your Search', body: 'Filter by Temple, At Home, or Online.' },
  { step: 4, route: '/poojas/ganesh-puja', selector: '[data-tour="date-picker"]', title: 'Pick Your Date & Time', body: 'Choose an auspicious date and available time slot.' },
  { step: 5, route: '/poojas/ganesh-puja', selector: '[data-tour="pandit-select"]', title: 'Choose Your Pandit', body: 'Browse verified pandits and select one for your ceremony.' },
  { step: 6, route: '/poojas/ganesh-puja', selector: '[data-tour="addons"]', title: 'Enhance Your Pooja', body: 'Add samagri kits, flowers, or prasad to your booking.' },
  { step: 7, route: '/poojas/ganesh-puja', selector: '[data-tour="customer-info"]', title: 'Enter Your Details', body: 'Fill in your name, phone number, and address for the pandit.' },
  { step: 8, route: '/poojas/ganesh-puja', selector: '[data-tour="book-button"]', title: 'Complete Your Booking', body: 'Review everything and proceed to secure payment. 🪔' },
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
