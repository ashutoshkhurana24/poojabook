import { Suspense } from 'react'

export default function PoojasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-orange-600">🪔 Loading...</p>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
