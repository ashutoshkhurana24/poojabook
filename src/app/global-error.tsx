'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-4">⚠️</div>
        <h1 className="font-heading text-4xl mb-2">Something Went Wrong</h1>
        <p className="text-text-secondary mb-8 max-w-md">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
