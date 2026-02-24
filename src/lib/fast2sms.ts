import crypto from 'crypto'

const FAST2SMS_API_URL = 'https://www.fast2sms.com/dev/bulkV2'

export interface Fast2SMSResponse {
  return: boolean
  request_id?: string
  message?: string | string[]
}

export async function sendOTPViaFast2SMS(phoneNumber: string, otp: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY
  
  console.log('[Fast2SMS] ENV FAST2SMS_API_KEY exists:', !!process.env.FAST2SMS_API_KEY)
  console.log('[Fast2SMS] ENV FAST2SMS_API_KEY value:', process.env.FAST2SMS_API_KEY ? 'yes' : 'no')
  
  if (!apiKey) {
    console.error('[Fast2SMS] API key not configured')
    throw new Error('SMS service not configured. Please contact support.')
  }

  const cleanPhone = phoneNumber.replace(/^\+91/, '').replace(/\D/g, '')

  if (cleanPhone.length !== 10) {
    throw new Error('Invalid phone number format')
  }

  try {
    const response = await fetch(FAST2SMS_API_URL, {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: cleanPhone
      })
    })

    const data: Fast2SMSResponse = await response.json()
    console.log('[Fast2SMS] Response status:', response.status)
    console.log('[Fast2SMS] Response data:', JSON.stringify(data))

    if (!data.return) {
      console.error('[Fast2SMS] Failed to send OTP:', data.message)
      throw new Error(Array.isArray(data.message) ? data.message[0] : (data.message as string || 'Failed to send OTP'))
    }

    console.log(`[Fast2SMS] OTP sent successfully to ${cleanPhone}`)
    return true
  } catch (error) {
    console.error('[Fast2SMS] Error sending OTP:', error)
    throw error
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function hashOTP(otp: string): Promise<string> {
  const salt = await import('bcryptjs').then(bcrypt => bcrypt.genSalt(10))
  return import('bcryptjs').then(bcrypt => bcrypt.hash(otp, salt))
}

export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  return import('bcryptjs').then(bcrypt => bcrypt.compare(otp, hash))
}

export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/^\+91/, '').replace(/\D/g, '').slice(0, 10)
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = sanitizePhoneNumber(phone)
  return /^[6789]\d{9}$/.test(cleaned)
}

export function maskPhoneNumber(phone: string): string {
  const cleaned = sanitizePhoneNumber(phone)
  if (cleaned.length !== 10) return phone
  return cleaned.slice(0, 4) + ' ' + cleaned.slice(4)
}
