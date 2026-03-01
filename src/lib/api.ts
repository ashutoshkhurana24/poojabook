import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { getAuthUser, type JWTPayload } from '@/lib/auth'

export function successResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function validationError(error: ZodError) {
  return NextResponse.json(
    { success: false, error: 'Validation failed', details: error.issues },
    { status: 400 }
  )
}

export function unauthorized() {
  return errorResponse('Unauthorized', 401)
}

export function forbidden(message = 'Forbidden') {
  return errorResponse(message, 403)
}

export function notFound(message = 'Not found') {
  return errorResponse(message, 404)
}

export function serverError(error?: unknown) {
  console.error('Server error:', error)
  const message = error instanceof Error ? error.message : String(error)
  return errorResponse('Internal server error: ' + message, 500)
}

type AuthGuardResult =
  | { auth: JWTPayload; response: null }
  | { auth: null; response: NextResponse }

export async function requireAuth(): Promise<AuthGuardResult> {
  const auth = await getAuthUser()
  if (!auth) return { auth: null, response: unauthorized() }
  return { auth, response: null }
}

export async function requireRole(role: string): Promise<AuthGuardResult> {
  const auth = await getAuthUser()
  if (!auth) return { auth: null, response: unauthorized() }
  if (auth.role !== role) return { auth: null, response: forbidden() }
  return { auth, response: null }
}
