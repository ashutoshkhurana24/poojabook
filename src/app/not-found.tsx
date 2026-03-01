import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🔍</div>
        <h1 className="font-heading text-4xl mb-2">Page Not Found</h1>
        <p className="text-text-secondary mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Go Home
          </Link>
          <Link
            href="/poojas"
            className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition"
          >
            Browse Poojas
          </Link>
        </div>
      </div>
    </div>
  )
}
