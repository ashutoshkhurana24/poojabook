'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: string
  partnerProfile?: {
    type: string
    isApproved: boolean
    appliedAt: Date
  }
}

export default function PendingApprovalPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.data)
        } else {
          router.push('/login')
        }
      })
      .catch(() => {
        router.push('/login')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center py-12 px-4">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-lg w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-100 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="font-heading text-3xl mb-2 text-gray-800">Application Under Review</h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for applying as a {user?.partnerProfile?.type === 'TEMPLE' ? 'Temple Partner' : 'Pandit Partner'} on PoojaBook.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-amber-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-amber-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1">✓</span>
                Our team will review your application within 24 hours
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">✓</span>
                You will receive an email once your application is approved
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">✓</span>
                After approval, you can access your dashboard and start receiving bookings
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 mb-4">
              Need to update your application? Contact us at support@poojabook.com
            </p>
            
            <button
              onClick={handleLogout}
              className="text-orange-600 hover:underline font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-orange-600 transition">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
