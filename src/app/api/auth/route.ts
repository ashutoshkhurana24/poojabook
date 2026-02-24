import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, generateToken, hashPassword, verifyPassword } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { successResponse, errorResponse, validationError, serverError } from '@/lib/api'

const otpStore = new Map<string, { otp: string; expires: number }>()

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
    // SEND OTP (for phone-based login/register)
    // ============================================
    if (action === 'send-otp') {
      const data = z.object({
        phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number'),
      }).parse(body)
      
      const otp = generateOTP()
      otpStore.set(data.phone, { otp, expires: Date.now() + 10 * 60 * 1000 })
      
      console.log(`[DEV] OTP for ${data.phone}: ${otp}`)
      
      return successResponse({ message: 'OTP sent successfully', devOtp: otp })
    }

    // ============================================
    // VERIFY OTP (phone login)
    // ============================================
    if (action === 'verify-otp') {
      const data = z.object({
        phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number'),
        otp: z.string().length(6, 'OTP must be 6 digits'),
      }).parse(body)
      
      const stored = otpStore.get(data.phone)
      if (!stored) {
        return errorResponse('OTP not found or expired')
      }
      
      if (Date.now() > stored.expires) {
        otpStore.delete(data.phone)
        return errorResponse('OTP expired')
      }
      
      if (stored.otp !== data.otp) {
        return errorResponse('Invalid OTP')
      }
      
      otpStore.delete(data.phone)
      
      let user = await prisma.user.findUnique({ 
        where: { phone: data.phone },
        include: { partnerProfile: true }
      })
      
      if (!user) {
        const newUser = await prisma.user.create({
          data: { phone: data.phone, name: 'New User', role: 'CUSTOMER' },
        })
        await prisma.customerProfile.create({ data: { userId: newUser.id } })
        user = { ...newUser, partnerProfile: null }
      }
      
      // Check if partner pending approval
      const isPartnerPending = ['PANDIT', 'TEMPLE'].includes(user.role) && 
        user.partnerProfile && !user.partnerProfile.isApproved
      
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
      setAuthCookie(response, token)
      
      return response
    }

    // ============================================
    // REGISTER DEVOTEE
    // ============================================
    if (action === 'register-devotee') {
      const data = z.object({
        fullName: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address').optional().or(z.literal('')),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
        phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number').optional().or(z.literal('')),
        city: z.string().optional(),
        agreeToTerms: z.boolean(),
      }).parse(body)

      if (data.password !== data.confirmPassword) {
        return errorResponse('Passwords do not match')
      }

      const existingUser = await prisma.user.findFirst({
        where: { 
          OR: [
            { email: data.email || undefined },
            { phone: data.phone || undefined }
          ].filter(x => x.email || x.phone)
        },
      })
      
      if (existingUser) {
        return errorResponse('An account with this email or phone already exists')
      }
      
      const passwordHash = await hashPassword(data.password)
      
      const user = await prisma.user.create({
        data: { 
          phone: data.phone || null,
          email: data.email || null,
          name: data.fullName,
          passwordHash,
          role: 'CUSTOMER',
          isVerified: true,
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
        phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        type: z.enum(['PANDIT', 'TEMPLE']),
        experienceYears: z.number().optional(),
        specializations: z.array(z.string()).default([]),
        languages: z.array(z.string()).min(1, 'Select at least one language'),
        bio: z.string().optional(),
        agreeToTerms: z.boolean(),
      }).parse(body)

      if (data.password !== data.confirmPassword) {
        return errorResponse('Passwords do not match')
      }

      const existingUser = await prisma.user.findFirst({
        where: { 
          OR: [{ email: data.email }, { phone: data.phone }]
        },
      })
      
      if (existingUser) {
        return errorResponse('An account with this email or phone already exists')
      }
      
      const passwordHash = await hashPassword(data.password)
      
      const user = await prisma.user.create({
        data: { 
          phone: data.phone,
          email: data.email,
          name: data.fullName,
          passwordHash,
          role: data.type, // PANDIT or TEMPLE
          isVerified: false,
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
          isApproved: false, // Requires admin approval
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
      
      // Check if partner pending approval
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
    // LOGIN WITH PHONE & PASSWORD
    // ============================================
    if (action === 'login-phone') {
      const data = z.object({
        phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number'),
        password: z.string().min(1, 'Password is required'),
        rememberMe: z.boolean().optional(),
      }).parse(body)
      
      const user = await prisma.user.findUnique({ 
        where: { phone: data.phone },
        include: { partnerProfile: true }
      })
      
      if (!user || !user.passwordHash) {
        return errorResponse('No account found with this phone number.')
      }
      
      const valid = await verifyPassword(data.password, user.passwordHash)
      if (!valid) {
        return errorResponse('Incorrect password. Please try again.')
      }
      
      // Check if partner pending approval
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
      
      // Always return success to prevent email enumeration
      if (!user) {
        return successResponse({ 
          message: 'If an account exists, a reset link has been sent to your email.' 
        })
      }
      
      const resetToken = uuidv4()
      const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      
      await prisma.passwordResetToken.create({
        data: {
          email: data.email,
          token: resetToken,
          expires,
        },
      })
      
      // In production, send email with reset link
      // For now, return the token in dev mode
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
      
      // Delete the used token
      await prisma.passwordResetToken.delete({
        where: { token: data.token },
      })
      
      return successResponse({ message: 'Password reset successfully' })
    }

    // ============================================
    // GOOGLE OAUTH (placeholder - requires setup)
    // ============================================
    if (action === 'google-signup') {
      // TODO: Implement Google OAuth
      // This requires:
      // 1. Set up Google Cloud Console project
      // 2. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env
      // 3. Use NextAuth.js or handle OAuth flow manually
      return errorResponse('Google Sign-Up is not configured yet. Please use email/password or phone login.')
    }

    return errorResponse('Invalid action')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationError(error)
    }
    return serverError(error)
  }
}
