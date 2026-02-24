'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

const CITIES = [
  { value: 'Mumbai', label: 'Mumbai, Maharashtra' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Bangalore', label: 'Bangalore, Karnataka' },
  { value: 'Varanasi', label: 'Varanasi, UP' },
  { value: 'Chennai', label: 'Chennai, Tamil Nadu' },
  { value: 'Hyderabad', label: 'Hyderabad, Telangana' },
  { value: 'Kolkata', label: 'Kolkata, West Bengal' },
  { value: 'Pune', label: 'Pune, Maharashtra' },
  { value: 'Ahmedabad', label: 'Ahmedabad, Gujarat' },
  { value: 'Jaipur', label: 'Jaipur, Rajasthan' },
  { value: 'Lucknow', label: 'Lucknow, UP' },
  { value: 'Kanpur', label: 'Kanpur, UP' },
  { value: 'Nagpur', label: 'Nagpur, Maharashtra' },
  { value: 'Indore', label: 'Indore, MP' },
  { value: 'Coimbatore', label: 'Coimbatore, Tamil Nadu' },
]

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
]

const LANGUAGES = [
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Sanskrit', label: 'Sanskrit' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Kannada', label: 'Kannada' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Gujarati', label: 'Gujarati' },
  { value: 'Malayalam', label: 'Malayalam' },
]

const SPECIALIZATIONS = [
  'Grah Shanti', 'Mahashivratri', 'Ganesh Chaturthi', 'Diwali',
  'Durga Puja', 'Navratri', 'Krishna Janmashtami', 'Ram Navami',
  'Satyanarayan Katha', 'Lakshmi Puja', 'Vishnu Puja', 'Hanuman Chalisa',
  'Pitra Dosha', 'Mangal Dosha', 'Kundli Matching', 'Vastu Shastra',
  'Griha Pravesh', 'Namkaran', 'Vivah', 'Shraadh',
]

type Tab = 'devotee' | 'partner'

interface FormErrors {
  [key: string]: string
}

function RegisterPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>('devotee')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (err) {
      setGoogleLoading(false)
    }
  }

  const [devoteeForm, setDevoteeForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    agreeToTerms: false,
  })

  useEffect(() => {
    const phoneParam = searchParams?.get('phone')
    if (phoneParam) {
      setDevoteeForm(prev => ({ ...prev, phone: phoneParam.slice(0, 10) }))
    }
  }, [searchParams])

  const [partnerForm, setPartnerForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    state: '',
    type: 'PANDIT' as 'PANDIT' | 'TEMPLE',
    experienceYears: '',
    specializations: [] as string[],
    languages: [] as string[],
    bio: '',
    agreeToTerms: false,
  })

  const getPasswordStrength = (password: string): { level: string; color: string } => {
    if (password.length === 0) return { level: '', color: '' }
    if (password.length < 6) return { level: 'Weak', color: 'bg-red-500' }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    
    if (strength <= 1) return { level: 'Weak', color: 'bg-red-500' }
    if (strength === 2) return { level: 'Medium', color: 'bg-yellow-500' }
    return { level: 'Strong', color: 'bg-green-500' }
  }

  const validateDevoteeForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!devoteeForm.fullName || devoteeForm.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }
    if (devoteeForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(devoteeForm.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (devoteeForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (devoteeForm.password !== devoteeForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!devoteeForm.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to Terms & Conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePartnerForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!partnerForm.fullName || partnerForm.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }
    if (!partnerForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerForm.email)) {
      newErrors.email = 'Valid email is required'
    }
    if (!partnerForm.phone || !/^\+91[0-9]{10}$/.test(partnerForm.phone)) {
      newErrors.phone = 'Valid phone number is required'
    }
    if (partnerForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (partnerForm.password !== partnerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!partnerForm.city) {
      newErrors.city = 'City is required'
    }
    if (!partnerForm.state) {
      newErrors.state = 'State is required'
    }
    if (partnerForm.languages.length === 0) {
      newErrors.languages = 'Select at least one language'
    }
    if (!partnerForm.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to Partner Terms'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDevoteeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!validateDevoteeForm()) return
    
    setLoading(true)
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register-devotee',
          ...devoteeForm,
          phone: devoteeForm.phone ? '+91' + devoteeForm.phone.replace(/\D/g, '').slice(0, 10) : undefined,
        }),
      })
      
      const data = await res.json()
      
      if (!data.success) {
        setError(data.error)
        return
      }
      
      setSuccess('Account created successfully!')
      setTimeout(() => {
        router.push(data.data.redirectTo || '/')
        router.refresh()
      }, 1000)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!validatePartnerForm()) return
    
    setLoading(true)
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register-partner',
          ...partnerForm,
          phone: '+91' + partnerForm.phone.replace(/\D/g, '').slice(0, 10),
          experienceYears: partnerForm.experienceYears ? parseInt(partnerForm.experienceYears) : undefined,
        }),
      })
      
      const data = await res.json()
      
      if (!data.success) {
        setError(data.error)
        return
      }
      
      setSuccess('Application submitted! We will review within 24 hours.')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = (lang: string) => {
    setPartnerForm(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }))
  }

  const toggleSpecialization = (spec: string) => {
    setPartnerForm(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }))
  }

  const passwordStrength = getPasswordStrength(activeTab === 'devotee' ? devoteeForm.password : partnerForm.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center py-12 px-4">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-lg w-full relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-heading text-2xl">🪔</span>
            </div>
          </Link>
          <h1 className="font-heading text-4xl mb-2 text-gray-800">Create Account</h1>
          <p className="text-gray-600">Join PoojaBook to book divine poojas</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-100">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => { setActiveTab('devotee'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
                activeTab === 'devotee' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Devotee
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('partner'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
                activeTab === 'partner' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Pandit / Temple
            </button>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full mb-4 py-3 px-4 bg-white border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'Signing up...' : 'Continue with Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">{success}</div>
          )}

          {/* Devotee Form */}
          {activeTab === 'devotee' && (
            <form onSubmit={handleDevoteeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={devoteeForm.fullName}
                  onChange={(e) => setDevoteeForm({ ...devoteeForm, fullName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={devoteeForm.email}
                  onChange={(e) => setDevoteeForm({ ...devoteeForm, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={devoteeForm.password}
                    onChange={(e) => setDevoteeForm({ ...devoteeForm, password: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {devoteeForm.password && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all`} 
                        style={{ width: devoteeForm.password.length < 6 ? '33%' : devoteeForm.password.length < 10 ? '66%' : '100%' }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-gray-500">{passwordStrength.level}</p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                <input
                  type="password"
                  value={devoteeForm.confirmPassword}
                  onChange={(e) => setDevoteeForm({ ...devoteeForm, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number (Optional)</label>
                <div className="flex">
                  <span className="px-4 py-3 bg-gray-100 border border-r-0 rounded-l-lg text-gray-600 text-sm">+91</span>
                  <input
                    type="tel"
                    value={devoteeForm.phone}
                    onChange={(e) => setDevoteeForm({ ...devoteeForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City (Optional)</label>
                <select
                  value={devoteeForm.city}
                  onChange={(e) => setDevoteeForm({ ...devoteeForm, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                >
                  <option value="">Select your city</option>
                  {CITIES.map(city => (
                    <option key={city.value} value={city.value}>{city.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="devotee-terms"
                  checked={devoteeForm.agreeToTerms}
                  onChange={(e) => setDevoteeForm({ ...devoteeForm, agreeToTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="devotee-terms" className="text-sm text-gray-600">
                  I agree to the <Link href="/terms" className="text-orange-600 hover:underline">Terms & Conditions</Link>
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Partner Form */}
          {activeTab === 'partner' && (
            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {partnerForm.type === 'TEMPLE' ? 'Temple Name' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  value={partnerForm.fullName}
                  onChange={(e) => setPartnerForm({ ...partnerForm, fullName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder={partnerForm.type === 'TEMPLE' ? 'Enter temple name' : 'Enter your full name'}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={partnerForm.email}
                  onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={partnerForm.password}
                    onChange={(e) => setPartnerForm({ ...partnerForm, password: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {partnerForm.password && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all`}
                        style={{ width: partnerForm.password.length < 6 ? '33%' : partnerForm.password.length < 10 ? '66%' : '100%' }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-gray-500">{passwordStrength.level}</p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                <input
                  type="password"
                  value={partnerForm.confirmPassword}
                  onChange={(e) => setPartnerForm({ ...partnerForm, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                <div className="flex">
                  <span className="px-4 py-3 bg-gray-100 border border-r-0 rounded-l-lg text-gray-600 text-sm">+91</span>
                  <input
                    type="tel"
                    value={partnerForm.phone}
                    onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                  <select
                    value={partnerForm.city}
                    onChange={(e) => setPartnerForm({ ...partnerForm, city: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select city</option>
                    {CITIES.map(city => (
                      <option key={city.value} value={city.value}>{city.label}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                  <select
                    value={partnerForm.state}
                    onChange={(e) => setPartnerForm({ ...partnerForm, state: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="PANDIT"
                      checked={partnerForm.type === 'PANDIT'}
                      onChange={() => setPartnerForm({ ...partnerForm, type: 'PANDIT' })}
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">Pandit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="TEMPLE"
                      checked={partnerForm.type === 'TEMPLE'}
                      onChange={() => setPartnerForm({ ...partnerForm, type: 'TEMPLE' })}
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">Temple</span>
                  </label>
                </div>
              </div>

              {partnerForm.type === 'PANDIT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience</label>
                  <input
                    type="number"
                    value={partnerForm.experienceYears}
                    onChange={(e) => setPartnerForm({ ...partnerForm, experienceYears: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="e.g., 10"
                    min="0"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages *</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => toggleLanguage(lang.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        partnerForm.languages.includes(lang.value)
                          ? 'bg-orange-100 text-orange-700 border border-orange-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                {errors.languages && <p className="text-red-500 text-xs mt-1">{errors.languages}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {SPECIALIZATIONS.map(spec => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialization(spec)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        partnerForm.specializations.includes(spec)
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Bio</label>
                <textarea
                  value={partnerForm.bio}
                  onChange={(e) => setPartnerForm({ ...partnerForm, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                  rows={3}
                  placeholder="Tell us about your experience..."
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="partner-terms"
                  checked={partnerForm.agreeToTerms}
                  onChange={(e) => setPartnerForm({ ...partnerForm, agreeToTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="partner-terms" className="text-sm text-gray-600">
                  I agree to the <Link href="/partner-terms" className="text-orange-600 hover:underline">Partner Terms</Link>
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  Your application will be reviewed within 24 hours. You will receive an email once approved.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Apply as Partner'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterPageInner />
    </Suspense>
  )
}
