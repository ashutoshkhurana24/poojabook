'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Recommendation {
  recommendedPooja: {
    slug: string
    name: string
    reason: string
    whatToExpect: string
    duration: string
    auspiciousTip: string
  }
  alternativePooja: {
    slug: string
    name: string
    reason: string
  }
  personalizedMessage: string
}

const QUESTIONS = [
  {
    id: 'occasion',
    question: "What's the occasion?",
    emoji: '🎯',
    options: [
      { label: 'New Home / Griha Pravesh', value: 'new_home' },
      { label: 'New Business / Shop Opening', value: 'new_business' },
      { label: 'Wedding / Engagement', value: 'wedding' },
      { label: 'Birth of a Child', value: 'birth' },
      { label: 'Death Anniversary / Shraddh', value: 'shraddh' },
      { label: 'Personal Wish / Mannat', value: 'wish' },
      { label: 'Health & Wellbeing', value: 'health' },
      { label: 'General Blessings', value: 'blessings' },
    ]
  },
  {
    id: 'location',
    question: 'Where do you want it performed?',
    emoji: '📍',
    options: [
      { label: '🏠 At My Home', value: 'AT_HOME' },
      { label: '🏛 At a Temple', value: 'IN_TEMPLE' },
      { label: '💻 Online', value: 'ONLINE' },
    ]
  },
  {
    id: 'budget',
    question: "What's your budget?",
    emoji: '💰',
    options: [
      { label: 'Under ₹1,000', value: 'budget_low' },
      { label: '₹1,000 – ₹3,000', value: 'budget_mid' },
      { label: '₹3,000 – ₹10,000', value: 'budget_high' },
      { label: 'Above ₹10,000', value: 'budget_premium' },
    ]
  },
  {
    id: 'timing',
    question: 'When do you need it?',
    emoji: '📅',
    options: [
      { label: 'This Week', value: 'this_week' },
      { label: 'This Month', value: 'this_month' },
      { label: 'On an Auspicious Date', value: 'auspicious' },
      { label: "I'm Flexible", value: 'flexible' },
    ]
  },
  {
    id: 'language',
    question: 'Preferred language for the ceremony?',
    emoji: '🗣',
    options: [
      { label: 'Hindi', value: 'hindi' },
      { label: 'Sanskrit Only', value: 'sanskrit' },
      { label: 'Tamil', value: 'tamil' },
      { label: 'Telugu', value: 'telugu' },
      { label: 'Bengali', value: 'bengali' },
      { label: "Any / Doesn't Matter", value: 'any' },
    ]
  },
]

export default function PanditMatchmaker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const currentQuestion = QUESTIONS[step]
  const isFirstStep = step === 0
  const isLastStep = step === QUESTIONS.length - 1
  const progress = ((step + 1) / QUESTIONS.length) * 100

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)

    if (isLastStep) {
      submitAnswers(newAnswers)
    } else {
      setStep(step + 1)
    }
  }

  const submitAnswers = async (finalAnswers: Record<string, string>) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalAnswers),
      })

      const data = await res.json()

      if (data.success) {
        setRecommendation(data.recommendation)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to get recommendation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetMatchmaker = () => {
    setStep(0)
    setAnswers({})
    setRecommendation(null)
    setError(null)
  }

  const handleClose = () => {
    resetMatchmaker()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
        >
          ✕
        </button>

        {loading && (
          <div className="p-12">
            <div className="text-center py-12">
              <div className="text-6xl animate-bounce mb-4">🪔</div>
              <p className="text-orange-600 font-medium text-lg">Consulting the sacred texts...</p>
              <p className="text-gray-400 text-sm mt-2">Finding your perfect pooja match</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">😔</div>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => submitAnswers(answers)}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        )}

        {recommendation && !loading && (
          <div className="p-6 max-h-[85vh] overflow-y-auto">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
              <div className="text-center mb-6">
                <p className="text-orange-600 font-medium italic text-lg">"{recommendation.personalizedMessage}"</p>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-md mb-4 border-2 border-orange-400">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">✨ Best Match</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{recommendation.recommendedPooja.name}</h3>
                <p className="text-gray-600 mt-2">{recommendation.recommendedPooja.reason}</p>
                <div className="mt-3 space-y-1 text-sm text-gray-500">
                  <p>⏱ Duration: {recommendation.recommendedPooja.duration}</p>
                  <p>🌟 {recommendation.recommendedPooja.whatToExpect}</p>
                  <p>📿 Tip: {recommendation.recommendedPooja.auspiciousTip}</p>
                </div>
                <button 
                  onClick={() => router.push(`/poojas/${recommendation.recommendedPooja.slug}`)}
                  className="mt-4 w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                >
                  Book This Pooja →
                </button>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <p className="text-xs text-gray-400 font-medium uppercase mb-1">Also Consider</p>
                <h4 className="font-semibold text-gray-700">{recommendation.alternativePooja.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{recommendation.alternativePooja.reason}</p>
                <button
                  onClick={() => router.push(`/poojas/${recommendation.alternativePooja.slug}`)}
                  className="mt-3 text-orange-500 text-sm font-medium hover:underline"
                >
                  View Details →
                </button>
              </div>

              <button onClick={resetMatchmaker} className="mt-4 w-full text-gray-400 text-sm hover:text-gray-600">
                ↩ Start Over
              </button>
            </div>
          </div>
        )}

        {!loading && !recommendation && !error && (
          <>
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4">
              <div className="flex items-center justify-between text-white">
                <span className="font-medium">🪔 AI Pooja Matchmaker</span>
                <span className="text-sm opacity-90">Step {step + 1} of {QUESTIONS.length}</span>
              </div>
              <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block">{currentQuestion.emoji}</span>
                <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.question}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className="p-4 text-left rounded-xl border-2 border-gray-100 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 font-medium text-gray-700 hover:text-orange-700"
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {!isFirstStep && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="mt-6 text-gray-400 hover:text-gray-600 text-sm"
                >
                  ← Go Back
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
