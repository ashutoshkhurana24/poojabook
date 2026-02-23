'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [devOtp, setDevOtp] = useState('')

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp', phone: '+91' + phone }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error)
        return
      }

      setDevOtp(data.data.devOtp || '')
      setStep('otp')
    } catch (err) {
      setError('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-otp', phone: '+91' + phone, otp }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error)
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-heading text-2xl">🪔</span>
            </div>
          </Link>
          <h1 className="font-heading text-3xl mb-2">Welcome Back</h1>
          <p className="text-text-secondary">Login to book divine poojas</p>
        </div>

        <div className="bg-surface rounded-2xl p-8 shadow-sm">
          {devOtp && step === 'otp' && (
            <div className="mb-4 p-3 bg-accent/20 text-accent-dark rounded-lg text-sm">
              Dev OTP: {devOtp}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-error/10 text-error rounded-lg text-sm">{error}</div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="flex">
                  <span className="px-4 py-3 bg-background border border-r-0 rounded-l-lg text-text-secondary">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-3 border rounded-r-lg focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 border rounded-lg focus:border-primary outline-none text-center text-2xl tracking-widest"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full py-2 text-text-secondary hover:text-primary"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
