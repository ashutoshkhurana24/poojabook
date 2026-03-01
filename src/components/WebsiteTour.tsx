'use client'

import { useState, useEffect } from 'react'

interface TourStep {
  id: string
  target?: string
  title: string
  message: string
  position: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PoojaBook!',
    message: "Welcome to PoojaBook! Let me guide you through the key features of the website. Follow along to explore our services and make the most of your visit!",
    position: 'center',
  },
  {
    id: 'hero',
    target: 'hero-section',
    title: 'Homepage Overview',
    message: 'On the homepage, you can explore various services: Book Poojas, Browse by Category, and see Upcoming Auspicious Days.',
    position: 'bottom',
  },
  {
    id: 'categories',
    target: 'categories-section',
    title: 'Browse by Category',
    message: 'Explore different poojas like Ganesh, Lakshmi, and Satyanarayan Pooja. You can book these poojas either in temples or at home.',
    position: 'top',
  },
  {
    id: 'featured',
    target: 'featured-section',
    title: 'Featured Poojas',
    message: "Check out our Featured Poojas! Here, you can find the most popular and well-rated poojas. If you're looking for something specific, this section is a great place to start.",
    position: 'top',
  },
  {
    id: 'auspicious',
    target: 'auspicious-section',
    title: 'Upcoming Auspicious Days',
    message: 'Plan ahead! See the upcoming auspicious days like Mahashivratri or Diwali where you can book poojas and ceremonies.',
    position: 'top',
  },
  {
    id: 'how-it-works',
    target: 'how-it-works-section',
    title: 'How It Works',
    message: "Here's how it works: Browse poojas, select your location, book a slot, and confirm your pooja. It's that easy!",
    position: 'top',
  },
  {
    id: 'partner',
    target: 'partner-section',
    title: 'Partner With Us',
    message: "Are you a Pandit or Temple? You can join PoojaBook to offer your services to devotees. Start providing your pooja services today!",
    position: 'top',
  },
  {
    id: 'complete',
    title: "You're All Set!",
    message: "You're now all set to explore PoojaBook! Feel free to ask me anything or dive into the services right away.",
    position: 'center',
  },
]

export default function WebsiteTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setShowPopup(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Scroll to target section when step has a target (e.g. hero-section, categories-section)
  useEffect(() => {
    if (!showPopup) return
    const step = tourSteps[currentStep]
    if (step?.target) {
      const el = document.getElementById(step.target)
      if (el) {
        const t = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
        return () => clearTimeout(t)
      }
    }
  }, [currentStep, showPopup])

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowPopup(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const closeTour = () => {
    setShowPopup(false)
  }

  const step = tourSteps[currentStep]
  const isLastStep = currentStep === tourSteps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <>
      {/* Floating Tour Button - Always Visible */}
      <button
        onClick={() => {
          window.dispatchEvent(new CustomEvent('start-full-tour'))
        }}
        className="fixed bottom-32 right-5 z-[60] bg-orange-600 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-orange-700 transition flex items-center gap-2 font-semibold"
        style={{ boxShadow: '0 6px 25px rgba(234, 88, 12, 0.5)' }}
      >
        <span className="text-xl">🎯</span> 
        <span>Take Tour</span>
      </button>

      {/* Tour Popup - Auto shows after 2 seconds */}
      {mounted && showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeTour} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 animate-in zoom-in-95">
            <button
              onClick={closeTour}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <span className="text-sm text-gray-500">Step {currentStep + 1} of {tourSteps.length}</span>
            </div>

            <div className="w-full bg-gray-100 h-1 rounded-full mb-4">
              <div
                className="bg-orange-600 h-1 rounded-full transition-all"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>

            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600 mb-6">{step.message}</p>

            <div className="flex items-center justify-between">
              <div></div>
              <div className="flex items-center gap-3">
                {!isFirstStep && (
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition"
                >
                  {isLastStep ? 'Finish' : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
