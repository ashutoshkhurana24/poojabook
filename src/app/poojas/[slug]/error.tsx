'use client'

export default function Error({
  reset,
}: {
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl mb-4">Something went wrong loading this pooja</p>
        <button 
          onClick={reset} 
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
