import twilio from 'twilio'

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

let twilioClient: twilio.Twilio | null = null

function getTwilioClient() {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio credentials not configured')
  }
  
  if (!twilioClient) {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  }
  return twilioClient
}

export interface TwilioResponse {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendOTPViaTwilio(phoneNumber: string, otp: string): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('[Twilio] Credentials not configured')
    throw new Error('SMS service not configured. Please contact support.')
  }

  const cleanPhone = phoneNumber.replace(/^\+91/, '').replace(/\D/g, '')
  const fullPhoneNumber = `+91${cleanPhone}`

  if (cleanPhone.length !== 10) {
    throw new Error('Invalid phone number format')
  }

  try {
    const client = getTwilioClient()
    
    const message = await client.messages.create({
      body: `Your PoojaBook OTP is ${otp}. Valid for 10 minutes. Do not share this code.`,
      from: TWILIO_PHONE_NUMBER,
      to: fullPhoneNumber,
    })

    console.log(`[Twilio] OTP sent successfully to ${cleanPhone}, SID: ${message.sid}`)
    return true
  } catch (error: any) {
    console.error('[Twilio] Error sending OTP:', error.message)
    throw new Error(error.message || 'Failed to send OTP')
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
