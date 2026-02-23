import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

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

export function serverError(error?: any) {
  console.error('Server error:', error)
  return errorResponse('Internal server error', 500)
}
