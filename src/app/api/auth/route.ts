import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, hashPassword, verifyPassword } from '@/lib/auth'
import { 
  sendOTPViaFast2SMS, 
  generateOTP, 
  hashOTP, 
  verifyOTP, 
  sanitizePhoneNumber, 
  validatePhoneNumber,
  maskPhoneNumber
} from '@/lib/fast2sms'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import { z } from 'zod'
import { successResponse, errorResponse, validationError, serverError } from '@/lib/api'

const OTP_RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const OTP_MAX_ATTEMPTS = 3
const OTP_EXPIRY_MINUTES = 10

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(phoneNumber: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = sanitizePhoneNumber(phoneNumber)
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + OTP_RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: OTP_MAX_ATTEMPTS - 1, resetTime: now + OTP_RATE_LIMIT_WINDOW }
  }
  
  if (record.count >= OTP_MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  record.count++
  return { allowed: true, remaining: OTP_MAX_ATTEMPTS - record.count, resetTime: record.resetTime }
}

function setAuthCookie(response: NextResponse, token: string, rememberMe?: boolean) {
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  })
}

function getRedirectPath(role: string, isApproved?: boolean): string {
  switch (role) {
    case 'ADMIN':
      return '/admin'
    case 'VENDOR':
    case 'PANDIT':
    case 'TEMPLE':
      if (isApproved === false) {
        return '/pending-approval'
      }
      return '/vendor'
    default:
      return '/'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    // ============================================
    // SEND OTP
    // ============================================
    if (action === 'send-otp') {
      const data = z.object({
        phone: z.string().min(10, 'Phone number required'),
      }).parse(body)

      const phoneNumber = sanitizePhoneNumber(data.phone)
      
      if (!validatePhoneNumber(phoneNumber)) {
        return errorResponse('Invalid phone number. Must be 10 digits starting with 6, 7, 8, or 9.')
      }

      const rateLimit = checkRateLimit(phoneNumber)
      if (!rateLimit.allowed) {
        const minutesLeft = Math.ceil((rateLimit.resetTime - Date.now()) / 60000)
        return errorResponse(`Too many OTP requests. Try again in ${minutesLeft} minutes.`, 429)
      }

      const otp = generateOTP()
      const otpHash = await hashOTP(otp)
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

      await prisma.otpVerification.create({
        data: {
          phoneNumber,
          otpHash,
          expiresAt,
          isUsed: false,
          attemptCount: 0,
        },
      })

      try {
        await sendOTPViaFast2SMS(phoneNumber, otp)
      } catch (smsError) {
        console.error('[send-otp] Fast2SMS error:', smsError)
        return errorResponse('Failed to send OTP. Please try again.')
      }

      return successResponse({ 
        message: 'OTP sent successfully',
        maskedPhone: maskPhoneNumber(phoneNumber),
      })
    }

    // ============================================
    // VERIFY OTP
    // ============================================
    if (action === 'verify-otp') {
      const data = z.object({
        phone: z.string().min(10, 'Phone number required'),
        otp: z.string().length(6, 'OTP must be 6 digits'),
      }).parse(body)

      const phoneNumber = sanitizePhoneNumber(data.phone)
      
      if (!validatePhoneNumber(phoneNumber)) {
        return errorResponse('Invalid phone number format')
      }

      const otpRecord = await prisma.otpVerification.findFirst({
        where: {
          phoneNumber,
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      })

      if (!otpRecord) {
        return errorResponse('OTP expired or not found. Please request a new OTP.')
      }

      if (otpRecord.attemptCount >= 5) {
        return errorResponse('Too many failed attempts. Please request a new OTP.')
      }

      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { attemptCount: { increment: 1 } },
      })

      const isValid = await verifyOTP(data.otp, otpRecord.otpHash)
      
      if (!isValid) {
        const remaining = 5 - otpRecord.attemptCount - 1
        return errorResponse(`Invalid OTP. ${remaining} attempts remaining.`)
      }

      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      })

      await prisma.user.updateMany({
        where: { phone: phoneNumber },
        data: { phoneVerified: true },
      })

      return successResponse({ 
        verified: true, 
        message: 'Phone number verified successfully' 
      })
    }

    // ============================================
    // REGISTER DEVOTEE
    // ============================================
    if (action === 'register-devotee') {
      const data = z.object({
        fullName: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
        phone: z.string().optional(),
        city: z.string().optional(),
        agreeToTerms: z.boolean(),
      }).parse(body)

      if (data.password !== data.confirmPassword) {
        return errorResponse('Passwords do not match')
      }

      const phone = data.phone ? sanitizePhoneNumber(data.phone) : undefined
      const phoneVerified = phone ? true : false

      const existingUser = await prisma.user.findFirst({
        where: { 
          OR: [
            { email: data.email },
            { phone: phone || null }
          ].filter(x => x.email || x.phone)
        },
      })
      
      if (existingUser) {
        return errorResponse('An account with this email or phone already exists')
      }
      
      const passwordHash = await hashPassword(data.password)
      
      const user = await prisma.user.create({
        data: { 
          phone: phone || null,
          email: data.email,
          name: data.fullName,
          passwordHash,
          role: 'CUSTOMER',
          isVerified: true,
          phoneVerified: phoneVerified || false,
          emailVerified: true,
          city: data.city || null,
        },
      })
      
      await prisma.customerProfile.create({ 
        data: { 
          userId: user.id,
          addresses: JSON.stringify(data.city ? [{ city: data.city }] : []),
        } 
      })
      
      const token = generateToken({
        userId: user.id,
        phone: user.phone || '',
        role: user.role,
      })
      
      const response = successResponse({ 
        user: { ...user, passwordHash: undefined },
        token,
        message: 'Account created successfully'
      })
      setAuthCookie(response, token)
      
      return response
    }

    // ============================================
    // REGISTER PARTNER (Pandit/Temple)
    // ============================================
    if (action === 'register-partner') {
      const data = z.object({
        fullName: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
        phone: z.string().min(10, 'Phone number required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        type: z.enum(['PANDIT', 'TEMPLE']),
        experienceYears: z.number().optional(),
        specializations: z.array(z.string()).default([]),
        languages: z.array(z.string()).min(1, 'Select at least one language'),
        bio: z.string().optional(),
        agreeToTerms: z.boolean(),
        phoneVerified: z.boolean(),
      }).parse(body)

      if (!data.phoneVerified) {
        return errorResponse('Please verify your phone number first')
      }

      if (data.password !== data.confirmPassword) {
        return errorResponse('Passwords do not match')
      }

      const phone = sanitizePhoneNumber(data.phone)

      const existingUser = await prisma.user.findFirst({
        where: { 
          OR: [{ email: data.email }, { phone }]
        },
      })
      
      if (existingUser) {
        return errorResponse('An account with this email or phone already exists')
      }
      
      const passwordHash = await hashPassword(data.password)
      
      const user = await prisma.user.create({
        data: { 
          phone,
          email: data.email,
          name: data.fullName,
          passwordHash,
          role: data.type,
          isVerified: false,
          phoneVerified: true,
          city: data.city,
        },
      })
      
      await prisma.customerProfile.create({ data: { userId: user.id } })
      
      await prisma.partnerProfile.create({
        data: {
          userId: user.id,
          type: data.type,
          bio: data.bio || null,
          experienceYears: data.experienceYears || null,
          languages: JSON.stringify(data.languages),
          specializations: JSON.stringify(data.specializations),
          city: data.city,
          state: data.state,
          isApproved: false,
        },
      })
      
      return successResponse({ 
        message: 'Application submitted successfully. You will be notified within 24 hours.',
        requiresApproval: true,
      })
    }

    // ============================================
    // LOGIN WITH EMAIL & PASSWORD
    // ============================================
    if (action === 'login-email') {
      const data = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
        rememberMe: z.boolean().optional(),
      }).parse(body)
      
      const user = await prisma.user.findUnique({ 
        where: { email: data.email },
        include: { partnerProfile: true }
      })
      
      if (!user || !user.passwordHash) {
        return errorResponse('No account found with this email.')
      }
      
      const valid = await verifyPassword(data.password, user.passwordHash)
      if (!valid) {
        return errorResponse('Incorrect password. Please try again.')
      }
      
      const isPartnerPending = ['PANDIT', 'TEMPLE'].includes(user.role) && 
        user.partnerProfile && !user.partnerProfile.isApproved
      
      if (isPartnerPending) {
        return errorResponse('Your partner application is under review. We\'ll notify you within 24 hours.')
      }
      
      const token = generateToken({
        userId: user.id,
        phone: user.phone || '',
        role: user.role,
      })
      
      const response = successResponse({ 
        user: { ...user, passwordHash: undefined },
        token,
        redirectTo: getRedirectPath(user.role, user.partnerProfile?.isApproved)
      })
      setAuthCookie(response, token, data.rememberMe)
      
      return response
    }

    // ============================================
    // LOGIN WITH PHONE & PASSWORD
    // ============================================
    if (action === 'login-phone') {
      const data = z.object({
        phone: z.string().min(10, 'Phone number required'),
        password: z.string().min(1, 'Password is required'),
        rememberMe: z.boolean().optional(),
      }).parse(body)
      
      const phone = sanitizePhoneNumber(data.phone)
      
      const user = await prisma.user.findUnique({ 
        where: { phone },
        include: { partnerProfile: true }
      })
      
      if (!user || !user.passwordHash) {
        return errorResponse('No account found with this phone number.')
      }
      
      const valid = await verifyPassword(data.password, user.passwordHash)
      if (!valid) {
        return errorResponse('Incorrect password. Please try again.')
      }
      
      const isPartnerPending = ['PANDIT', 'TEMPLE'].includes(user.role) && 
        user.partnerProfile && !user.partnerProfile.isApproved
      
      if (isPartnerPending) {
        return errorResponse('Your partner application is under review.')
      }
      
      const token = generateToken({
        userId: user.id,
        phone: user.phone || '',
        role: user.role,
      })
      
      const response = successResponse({ 
        user: { ...user, passwordHash: undefined },
        token,
        redirectTo: getRedirectPath(user.role, user.partnerProfile?.isApproved)
      })
      setAuthCookie(response, token, data.rememberMe)
      
      return response
    }

    // ============================================
    // FORGOT PASSWORD
    // ============================================
    if (action === 'forgot-password') {
      const data = z.object({
        email: z.string().email('Invalid email address'),
      }).parse(body)
      
      const user = await prisma.user.findUnique({ 
        where: { email: data.email }
      })
      
      if (!user) {
        return successResponse({ 
          message: 'If an account exists, a reset link has been sent to your email.' 
        })
      }
      
      const resetToken = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 60 * 60 * 1000)
      
      // Delete existing token for this email if any
      await prisma.passwordResetToken.deleteMany({
        where: { email: data.email }
      })
      
      await prisma.passwordResetToken.create({
        data: {
          email: data.email,
          token: resetToken,
          expires,
        },
      })
      
      console.log(`[DEV] Password reset token for ${data.email}: ${resetToken}`)
      
      return successResponse({ 
        message: 'If an account exists, a reset link has been sent to your email.',
        devToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined
      })
    }

    // ============================================
    // RESET PASSWORD
    // ============================================
    if (action === 'reset-password') {
      const data = z.object({
        token: z.string().min(1, 'Token is required'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
      }).parse(body)

      if (data.password !== data.confirmPassword) {
        return errorResponse('Passwords do not match')
      }

      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token: data.token },
      })
      
      if (!resetToken) {
        return errorResponse('Invalid reset token')
      }
      
      if (new Date() > resetToken.expires) {
        return errorResponse('Reset token has expired')
      }
      
      const passwordHash = await hashPassword(data.password)
      
      await prisma.user.update({
        where: { email: resetToken.email },
        data: { passwordHash },
      })
      
      await prisma.passwordResetToken.delete({
        where: { token: data.token },
      })
      
      return successResponse({ message: 'Password reset successfully' })
    }

    // ============================================
    // GOOGLE OAUTH (placeholder)
    // ============================================
    if (action === 'google-signup' || action === 'google-login') {
      return errorResponse('Google Sign-In is not configured yet. Please use email/password login.')
    }

    return errorResponse('Invalid action')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationError(error)
    }
    return serverError(error)
  }
}
