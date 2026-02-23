import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, generateToken, hashPassword, verifyPassword } from '@/lib/auth'
import { sendOtpSchema, verifyOtpSchema, registerSchema, loginSchema } from '@/lib/validations'
import { successResponse, errorResponse, validationError, serverError } from '@/lib/api'

const otpStore = new Map<string, { otp: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'send-otp') {
      const data = sendOtpSchema.parse(body)
      const { phone } = data
      
      const otp = generateOTP()
      otpStore.set(phone, { otp, expires: Date.now() + 10 * 60 * 1000 })
      
      console.log(`[DEV] OTP for ${phone}: ${otp}`)
      
      return successResponse({ message: 'OTP sent successfully', devOtp: otp })
    }

    if (action === 'verify-otp') {
      const data = verifyOtpSchema.parse(body)
      const { phone, otp } = data
      
      const stored = otpStore.get(phone)
      if (!stored) {
        return errorResponse('OTP not found or expired')
      }
      
      if (Date.now() > stored.expires) {
        otpStore.delete(phone)
        return errorResponse('OTP expired')
      }
      
      if (stored.otp !== otp) {
        return errorResponse('Invalid OTP')
      }
      
      otpStore.delete(phone)
      
      let user = await prisma.user.findUnique({ where: { phone } })
      if (!user) {
        user = await prisma.user.create({
          data: { phone, name: 'New User', role: 'CUSTOMER' },
        })
        await prisma.customerProfile.create({ data: { userId: user.id } })
      }
      
      const token = generateToken({
        userId: user.id,
        phone: user.phone,
        role: user.role,
      })
      
      const response = successResponse({ user, token })
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })
      
      return response
    }

    if (action === 'register') {
      const data = registerSchema.parse(body)
      const { phone, email, name, password } = data
      
      const existing = await prisma.user.findFirst({
        where: { OR: [{ phone }, { email: email || undefined }] },
      })
      
      if (existing) {
        return errorResponse('User already exists')
      }
      
      const passwordHash = await hashPassword(password)
      
      const user = await prisma.user.create({
        data: { phone, email, name, passwordHash, role: 'CUSTOMER', isVerified: true },
      })
      
      await prisma.customerProfile.create({ data: { userId: user.id } })
      
      const token = generateToken({
        userId: user.id,
        phone: user.phone,
        role: user.role,
      })
      
      const response = successResponse({ user, token })
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })
      
      return response
    }

    if (action === 'login') {
      const data = loginSchema.parse(body)
      const { phone, password } = data
      
      const user = await prisma.user.findUnique({ where: { phone } })
      if (!user || !user.passwordHash) {
        return errorResponse('Invalid credentials')
      }
      
      const valid = await verifyPassword(password, user.passwordHash)
      if (!valid) {
        return errorResponse('Invalid credentials')
      }
      
      const token = generateToken({
        userId: user.id,
        phone: user.phone,
        role: user.role,
      })
      
      const response = successResponse({ user, token })
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })
      
      return response
    }

    return errorResponse('Invalid action')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationError(error)
    }
    return serverError(error)
  }
}

import { z } from 'zod'
