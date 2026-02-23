import { NextResponse } from 'next/server'
import { successResponse } from '@/lib/api'

export async function POST() {
  const response = successResponse({ message: 'Logged out' })
  response.cookies.set('auth-token', '', { maxAge: 0 })
  return response
}
