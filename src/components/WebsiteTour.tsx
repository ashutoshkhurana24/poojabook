'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

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
  const [isVisible, setIsVisible] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const tourShown = useRef(false)
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('poojabook_tour_seen')
    if (!hasSeenTour && !tourShown.current) {
      tourShown.current = true
      setTimeout(() => setIsVisible(true), 2000)
    }
  }, [])

  const speak = (text: string) => {
    if (!synth) return
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    synth.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synth) synth.cancel()
    setSpeaking(false)
  }

  const nextStep = () => {
    stopSpeaking()
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      speak(tourSteps[currentStep + 1].message)
    } else {
      closeTour()
    }
  }

  const prevStep = () => {
    stopSpeaking()
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      speak(tourSteps[currentStep - 1].message)
    }
  }

  const closeTour = () => {
    stopSpeaking()
    setIsVisible(false)
    localStorage.setItem('poojabook_tour_seen', 'true')
  }

  const restartTour = () => {
    localStorage.removeItem('poojabook_tour_seen')
    setCurrentStep(0)
    setIsVisible(true)
    speak(tourSteps[0].message)
  }

  if (!isVisible) {
    return (
      <button
        onClick={restartTour}
        className="fixed bottom-24 right-5 z-40 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-dark transition flex items-center gap-2"
      >
        <span>🎯</span> Take Tour
      </button>
    )
  }

  const step = tourSteps[currentStep]
  const isLastStep = currentStep === tourSteps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => {}} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 animate-in zoom-in-95">
        <button
          onClick={closeTour}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎯</span>
          <span className="text-sm text-gray-500">Step {currentStep + 1} of {tourSteps.length}</span>
        </div>

        <div className="w-full bg-gray-100 h-1 rounded-full mb-4">
          <div
            className="bg-primary h-1 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-gray-600 mb-6">{step.message}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopSpeaking()
                speak(step.message)
              }}
              className={`p-2 rounded-full hover:bg-gray-100 transition ${speaking ? 'text-red-500' : 'text-gray-500'}`}
              title={speaking ? 'Stop' : 'Read aloud'}
            >
              {speaking ? '🔊' : '🔈'}
            </button>
          </div>

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
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition"
            >
              {isLastStep ? 'Finish' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
