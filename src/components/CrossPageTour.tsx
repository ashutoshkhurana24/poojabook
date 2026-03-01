'use client'

import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    Driver?: any
  }
}

const TOUR_STEPS = [
  { id: 0, route: '/', element: '#hero-section input', title: '🔍 Find Poojas', desc: 'Start by selecting your city to find poojas near you.' },
  { id: 1, route: '/', element: '#categories-section', title: '📚 Browse by Category', desc: 'Browse by deity or occasion — Ganesh, Lakshmi, Rudrabhishek and more.' },
  { id: 2, route: '/', element: '#featured-section', title: '⭐ Featured Poojas', desc: 'These are our most booked poojas. Click any to see details and pricing.' },
  { id: 3, route: '/', element: '#auspicious-section', title: '🗓️ Auspicious Days', desc: 'Plan your pooja on a sacred date for maximum auspiciousness.' },
  { id: 4, route: '/poojas', element: 'input[placeholder*="Search"]', title: '🔍 Search Poojas', desc: 'Find specific poojas by name or browse with filters.' },
  { id: 5, route: '/poojas/ganesh-puja', element: 'button:has-text("Book Now")', title: '📅 Book Your Pooja', desc: 'Review details and click Book Now when ready.' },
  { id: 6, route: '/poojas/ganesh-puja', element: 'input[type="text"]', title: '📝 Your Details', desc: 'Enter your name and contact information.' },
]

let driver: any = null

function initDriver() {
  if (typeof window === 'undefined') return null
  if (!window.Driver) return null
  
  if (driver) {
    try { driver.destroy() } catch (e) {}
  }
  
  driver = window.Driver.create({
    animate: true,
    opacity: 0.75,
    padding: 10,
    allowClose: true,
    overlayClickClose: false,
  })
  return driver
}

function waitForElement(selector: string, timeout: number = 5000): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      resolve(true)
      return
    }
    const start = Date.now()
    const interval = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(interval)
        resolve(true)
      } else if (Date.now() - start > timeout) {
        clearInterval(interval)
        reject(new Error('Timeout'))
      }
    }, 100)
  })
}

export default function CrossPageTour() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  const startTour = useCallback(async () => {
    localStorage.setItem('poojabook_tour_active', 'true')
    const savedStep = parseInt(localStorage.getItem('poojabook_tour_step') || '0')
    await showStep(savedStep)
  }, [])

  const showStep = async (stepId: number) => {
    const step = TOUR_STEPS[stepId]
    if (!step) {
      endTour()
      return
    }

    const d = initDriver()
    if (!d) return

    d.configure({
      steps: [{
        element: step.element,
        popover: {
          title: step.title,
          description: step.desc,
          position: 'bottom',
          showButtons: true,
          showProgress: true,
          nextBtnText: stepId === TOUR_STEPS.length - 1 ? 'Finish 🎉' : 'Next →',
          prevBtnText: stepId === 0 ? undefined : '← Back',
        },
      }],
    })

    d.on('next', () => handleNext(stepId))
    d.on('prev', () => handlePrev(stepId))
    d.on('close', () => handleClose(stepId))
    
    d.play()
  }

  const handleNext = (currentId: number) => {
    const nextId = currentId + 1
    if (nextId >= TOUR_STEPS.length) {
      endTour()
      return
    }
    const nextStep = TOUR_STEPS[nextId]
    localStorage.setItem('poojabook_tour_step', String(nextId))
    
    if (nextStep.route !== window.location.pathname) {
      window.location.href = nextStep.route
    } else {
      setTimeout(() => showStep(nextId), 500)
    }
  }

  const handlePrev = (currentId: number) => {
    const prevId = Math.max(0, currentId - 1)
    localStorage.setItem('poojabook_tour_step', String(prevId))
    setTimeout(() => showStep(prevId), 500)
  }

  const handleClose = (currentId: number) => {
    localStorage.setItem('poojabook_tour_step', String(currentId))
  }

  const endTour = () => {
    localStorage.setItem('poojabook_tour_completed', 'true')
    localStorage.removeItem('poojabook_tour_active')
    localStorage.removeItem('poojabook_tour_step')
    if (driver) {
      try { driver.destroy() } catch (e) {}
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.min.js'
    script.onload = () => setReady(true)
    document.body.appendChild(script)

    const link = document.createElement('link')
    link.href = 'https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    if (!ready) return
    
    const isCompleted = localStorage.getItem('poojabook_tour_completed')
    if (isCompleted === 'true') return

    const savedStep = parseInt(localStorage.getItem('poojabook_tour_step') || '0')
    const currentPath = window.location.pathname
    const targetStep = TOUR_STEPS.find(s => s.route === currentPath)

    if (!targetStep) return

    const stepIndex = TOUR_STEPS.findIndex(s => s.route === currentPath)
    if (stepIndex === -1) return

    const shouldStart = savedStep === stepIndex || (savedStep === 0 && stepIndex === 0)
    
    if (shouldStart) {
      setTimeout(() => showStep(stepIndex), 2000)
    }
  }, [ready])

  useEffect(() => {
    const handleStartTour = () => startTour()
    window.addEventListener('start-poojabook-tour', handleStartTour)
    return () => window.removeEventListener('start-poojabook-tour', handleStartTour)
  }, [startTour])

  return null
}
