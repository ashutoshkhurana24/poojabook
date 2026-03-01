'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { TOUR_STEPS, getCurrentStep, setStep, endTour, isTourActive, isTourCompleted } from '@/lib/tour-steps'

export default function TourOverlay() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState(-1)
  const [active, setActive] = useState(false)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const findAndShowStep = useCallback(async (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= TOUR_STEPS.length) {
      endTour()
      setActive(false)
      setVisible(false)
      return
    }

    const step = TOUR_STEPS[stepIndex]
    setLoading(true)

    // Wait for element to appear
    let element: Element | null = null
    for (let i = 0; i < 50; i++) {
      element = document.querySelector(step.selector)
      if (element) break
      await new Promise(r => setTimeout(r, 100))
    }

    if (!element) {
      // Element not found, skip to next step
      setLoading(false)
      const nextStep = stepIndex + 1
      if (nextStep < TOUR_STEPS.length) {
        setStep(nextStep)
        setCurrentStep(nextStep)
        findAndShowStep(nextStep)
      } else {
        endTour()
        setActive(false)
      }
      return
    }

    // Scroll to element first
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    
    // Wait for scroll animation to complete
    await new Promise(r => setTimeout(r, 500))

    const rect = element.getBoundingClientRect()
    setTargetRect(rect)
    setCurrentStep(stepIndex)
    setLoading(false)
    setVisible(true)
  }, [])

  const goToNext = useCallback(() => {
    const nextIndex = currentStep + 1
    if (nextIndex >= TOUR_STEPS.length) {
      endTour()
      setActive(false)
      setVisible(false)
      return
    }

    const nextStep = TOUR_STEPS[nextIndex]
    setStep(nextIndex)
    localStorage.setItem('poojabook_tour_active', 'true') // Ensure active flag is set
    setVisible(false)

    if (nextStep.route !== window.location.pathname) {
      window.location.href = nextStep.route
    } else {
      setTimeout(() => findAndShowStep(nextIndex), 300)
    }
  }, [currentStep, findAndShowStep])

  const goToPrev = useCallback(() => {
    const prevIndex = Math.max(0, currentStep - 1)
    setStep(prevIndex)
    setVisible(false)
    setTimeout(() => findAndShowStep(prevIndex), 300)
  }, [currentStep, findAndShowStep])

  const skipTour = useCallback(() => {
    endTour()
    setActive(false)
    setVisible(false)
  }, [])

  // Initialize on mount and when pathname changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Always check for active tour
    const step = getCurrentStep()
    const active = isTourActive()
    const completed = isTourCompleted()
    
    console.log('TourOverlay init:', { step, active, completed, pathname })
    
    if (!completed && active) {
      console.log('TourOverlay: Resuming tour at step', step)
      setActive(true)
      const stepData = TOUR_STEPS[step]
      if (stepData && stepData.route === window.location.pathname) {
        findAndShowStep(step)
      } else if (stepData) {
        window.location.href = stepData.route
      }
    }
  }, [pathname, findAndShowStep])

  // Listen for tour start
  useEffect(() => {
    console.log('TourOverlay: Setting up listener')
    const handleStart = () => {
      console.log('TourOverlay: Tour start event received!')
      localStorage.removeItem('poojabook_tour_completed') // Allow restart even if completed before
      setActive(true)
      findAndShowStep(0)
    }
    window.addEventListener('start-poojabook-tour', handleStart)
    return () => window.removeEventListener('start-poojabook-tour', handleStart)
  }, [findAndShowStep])

  if (!active || !visible || currentStep < 0) return null

  const step = TOUR_STEPS[currentStep]
  if (!step) return null

  const isLastStep = currentStep === TOUR_STEPS.length - 1

  // Calculate tooltip position
  const tooltipStyle: React.CSSProperties = targetRect ? {
    position: 'fixed',
    top: Math.min(targetRect.bottom + 15, window.innerHeight - 250),
    left: Math.max(10, Math.min(targetRect.left, window.innerWidth - 350)),
    width: Math.min(320, window.innerWidth - 20),
    zIndex: 9999,
  } : {}

  return (
    <>
      {/* Dark overlay with cutout */}
      {targetRect && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            boxShadow: `0 0 0 9999px rgba(0,0,0,0.7), 
              -${targetRect.left}px -${targetRect.top}px 0 0 transparent,
              ${window.innerWidth - targetRect.right}px -${targetRect.top}px 0 0 transparent,
              -${targetRect.left}px ${window.innerHeight - targetRect.bottom}px 0 0 transparent,
              ${window.innerWidth - targetRect.right}px ${window.innerHeight - targetRect.bottom}px 0 0 transparent`,
          }}
        />
      )}

      {/* Loading indicator */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          background: 'white',
          padding: '20px 40px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
            <div>Finding next step...</div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {!loading && (
        <div style={tooltipStyle}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </span>
              <button 
                onClick={skipTour}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#999' }}
              >
                ✕
              </button>
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1F2937' }}>
              {step.title}
            </h3>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px', lineHeight: '1.5' }}>
              {step.body}
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              {currentStep > 0 && (
                <button
                  onClick={goToPrev}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={() => {
                  if (isLastStep) {
                    endTour()
                    setActive(false)
                    setVisible(false)
                    // Show congratulations - could redirect to /poojas
                    window.location.href = '/poojas'
                  } else {
                    goToNext()
                  }
                }}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#EA580C',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {isLastStep ? 'Finish Tour 🪔' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
