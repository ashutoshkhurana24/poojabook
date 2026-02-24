import { z } from 'zod'

export const sendOtpSchema = z.object({
  phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number'),
})

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export const registerDevoteeSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number').optional().or(z.literal('')),
  city: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to Terms & Conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const registerPartnerSchema = z.object({
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
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to Partner Terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginWithPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export const loginWithPhoneSchema = z.object({
  phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const registerSchema = z.object({
  phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number'),
  email: z.string().email().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number'),
  password: z.string().min(1, 'Password is required'),
})

export const createOrderSchema = z.object({
  poojaId: z.string().uuid(),
  slotId: z.string().uuid(),
  attendeeName: z.string().min(2, 'Name is required'),
  attendeePhone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone number'),
  address: z.string().optional(),
  notes: z.string().optional(),
  addOnIds: z.array(z.string().uuid()).optional(),
  mode: z.enum(['IN_TEMPLE', 'AT_HOME', 'ONLINE']),
})

export const createPoojaSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  instructions: z.string().optional(),
  samagri: z.array(z.string()).optional(),
  duration: z.number().min(15),
  basePrice: z.number().min(0),
  mode: z.enum(['IN_TEMPLE', 'AT_HOME', 'ONLINE']),
  categoryId: z.string().uuid(),
  isRecurring: z.boolean().optional(),
})

export const createSlotSchema = z.object({
  poojaId: z.string().uuid(),
  locationId: z.string().uuid(),
  date: z.string(),
  startTime: z.string(),
  capacity: z.number().min(1),
  vendorId: z.string().uuid().optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
})
