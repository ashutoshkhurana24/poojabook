# PoojaBook Technical Architecture Document

## Table of Contents
1. [Tech Stack](#1-tech-stack)
2. [Project Structure](#2-project-structure)
3. [Database Schema](#3-database-schema)
4. [Authentication Flow](#4-authentication-flow)
5. [API Architecture](#5-api-architecture)
6. [State Management](#6-state-management)
7. [Payment Flow](#7-payment-flow)
8. [Third Party Integrations](#8-third-party-integrations)
9. [Performance & Caching](#9-performance--caching)
10. [Known Issues & Technical Debt](#10-known-issues--technical-debt)

---

## 1. Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.6 (App Router) |
| **Language** | TypeScript 5.x |
| **CSS Framework** | Tailwind CSS 4.x with PostCSS |
| **Database** | PostgreSQL (via Supabase) |
| **ORM** | Prisma 5.22.0 |
| **Authentication** | NextAuth.js 4.24.13 + Custom JWT |
| **Payment Gateway** | Razorpay |
| **SMS/OTP** | Twilio + Fast2SMS |
| **Push Notifications** | Firebase Cloud Messaging + OneSignal |
| **Deployment** | Vercel |
| **Package Manager** | npm |

### Key Dependencies

```json
{
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "@prisma/client": "^5.22.0",
    "next-auth": "^4.24.13",
    "@auth/prisma-adapter": "^1.6.0",
    "razorpay": "^2.9.6",
    "twilio": "^5.12.2",
    "firebase": "^12.9.0",
    "react-onesignal": "^3.5.0",
    "zod": "^4.3.6",
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.3",
    "swr": "^2.4.0",
    "driver.js": "^1.4.0"
  }
}
```

---

## 2. Project Structure

### Directory Overview

```
poojabook/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── pending-approval/
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── page.tsx
│   │   │   ├── orders/
│   │   │   ├── vendors/
│   │   │   └── notifications/
│   │   ├── vendor/            # Vendor dashboard
│   │   │   ├── page.tsx
│   │   │   └── orders/
│   │   ├── poojas/            # Pooja listings
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   ├── pandits/           # Pandit listings
│   │   ├── my-orders/         # Customer orders
│   │   ├── calendar/          # Hindu calendar
│   │   ├── api/               # API routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/            # React components
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript types
│   └── data/                  # Static data
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── scripts/                   # Build/dev scripts
└── node_modules/
```

### Routing Structure

#### Pages (Frontend Routes)

| Path | Description | Auth |
|------|-------------|------|
| `/` | Homepage with hero, categories, featured poojas | Public |
| `/poojas` | Browse all poojas with filters | Public |
| `/poojas/[slug]` | Individual pooja detail page | Public |
| `/pandits` | List of pandits | Public |
| `/pandits/[id]` | Pandit profile page | Public |
| `/calendar` | Hindu calendar with auspicious days | Public |
| `/login` | User login page | Guest |
| `/register` | User registration page | Guest |
| `/forgot-password` | Password reset request | Guest |
| `/reset-password` | Password reset form | Guest |
| `/pending-approval` | Partner approval pending page | Partner |
| `/my-orders` | Customer's order history | Customer |
| `/my-orders/[id]` | Order detail page | Customer |
| `/admin` | Admin dashboard | Admin |
| `/admin/orders` | Manage all orders | Admin |
| `/admin/vendors` | Manage vendors | Admin |
| `/admin/notifications` | Send notifications | Admin |
| `/vendor` | Vendor dashboard | Vendor/Pandit |
| `/vendor/orders` | Vendor's assigned orders | Vendor |

#### API Routes

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth` | Auth actions (OTP, login, register) | Public |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handlers | Public |
| GET | `/api/auth/me` | Get current user | Required |
| POST | `/api/auth/logout` | Logout user | Required |
| GET | `/api/poojas` | List poojas with filters | Public |
| GET | `/api/poojas/[id]` | Get single pooja | Public |
| GET | `/api/categories` | List categories | Public |
| POST | `/api/categories` | Create category | Admin |
| GET | `/api/pandits` | List pandits | Public |
| POST | `/api/pandits` | Create pandit | Admin |
| GET | `/api/orders` | List user orders | Required |
| POST | `/api/orders` | Create new order | Required |
| GET | `/api/orders/[id]` | Get order details | Required |
| POST | `/api/payment/create-order` | Create Razorpay order | Required |
| POST | `/api/payment/verify` | Verify payment | Required |
| GET | `/api/locations` | List locations | Public |
| POST | `/api/locations` | Create location | Admin |
| GET | `/api/admin/dashboard` | Admin stats | Admin |
| GET/POST | `/api/admin/orders` | Manage orders | Admin |
| GET/POST | `/api/admin/vendors` | Manage vendors | Admin |
| POST | `/api/admin/promote` | Promote user to vendor | Admin |
| GET/POST | `/api/vendor/orders` | Vendor orders | Vendor |
| GET | `/api/vendor/dashboard` | Vendor stats | Vendor |
| POST | `/api/notifications/register` | Register FCM token | Public |
| POST | `/api/notifications/send` | Send push notification | Admin |
| POST | `/api/matchmaker` | AI pooja recommendation | Public |

### Business Logic vs UI Logic Separation

- **Business Logic**: `src/lib/` - Contains all backend utilities
  - `auth.ts` - JWT generation, password hashing, token verification
  - `prisma.ts` - Database client singleton
  - `api.ts` - Response helpers, auth guards
  - `razorpay.ts` - Payment processing
  - `twilio.ts` - SMS/OTP functionality
  - `fast2sms.ts` - Backup SMS provider
  - `firebase.ts` - FCM client initialization
  - `validations.ts` - Zod validation schemas

- **UI Logic**: `src/components/` and `src/app/`
  - Components are presentational
  - Server components used for initial data fetching
  - Client components for interactivity

---

## 3. Database Schema

### Entity Relationship Diagram

```
User (1) ──────< CustomerProfile
User (1) ──────< Vendor
User (1) ──────< PartnerProfile
User (1) ──────< Order (customer)
User (1) ──────< Review
User (1) ──────< AuditLog
User (1) ──────< OtpVerification
User (1) ──────< NotificationToken

PoojaCategory (1) ──────< Pooja
Pooja (1) ──────< PoojaSlot
Pooja (1) ──────< AddOn
Pooja (1) ──────< Review
Pooja (1) ──────< Order

PoojaLocation (1) ──────< PoojaSlot

Vendor (1) ──────< PoojaSlot
Vendor (1) ──────< Order

Pandit (1) ──────< Order
Pandit (1) ──────< PanditReview

Order (1) ──────< OrderItem
Order (1) ──────< Payment
Order (1) ──────< Notification
Order (1) ──────< Review

AddOn (1) ──────< OrderItem

Coupon (1) ──────<
PasswordResetToken (1) ──────<
```

### Prisma Models

#### User
```prisma
model User {
  id                    String   @id @default(uuid())
  email                 String?  @unique
  phone                 String?  @unique
  name                  String
  role                  String   @default("CUSTOMER")  // CUSTOMER, ADMIN, VENDOR, PANDIT, TEMPLE
  passwordHash          String?
  googleId              String?
  city                  String?
  phoneVerified         Boolean  @default(false)
  emailVerified         Boolean  @default(false)
  isVerified            Boolean  @default(false)
  notificationToken     String?
  notificationPreferences String?
  createdAt            DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  // Relations
  customerProfile       CustomerProfile?
  vendor                Vendor?
  partnerProfile        PartnerProfile?
  orders                Order[]
  reviews               Review[]
  auditLogs             AuditLog[]
  otpVerifications      OtpVerification[]
  notificationTokens    NotificationToken[]
  
  @@index([role])
}
```

#### OtpVerification
```prisma
model OtpVerification {
  id            String   @id @default(uuid())
  phoneNumber   String
  otpHash       String
  expiresAt     DateTime
  isUsed        Boolean  @default(false)
  attemptCount  Int      @default(0)
  createdAt     DateTime @default(now())
  user          User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId        String?
  
  @@index([phoneNumber])
  @@index([expiresAt])
}
```

#### PartnerProfile
```prisma
model PartnerProfile {
  id                String   @id @default(uuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type              String   // "PANDIT" | "TEMPLE"
  bio               String?
  experienceYears   Int?
  languages         String   @default("[]")     // JSON array
  specializations   String   @default("[]")    // JSON array
  city              String?
  state             String?
  isApproved        Boolean  @default(false)
  appliedAt         DateTime @default(now())
  approvedAt        DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

#### CustomerProfile
```prisma
model CustomerProfile {
  id           String   @id @default(uuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  addresses    String   @default("[]")   // JSON array
  preferences  String   @default("{}")  // JSON object
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

#### Vendor
```prisma
model Vendor {
  id            String   @id @default(uuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  businessName  String
  description   String?
  languages     String   @default("[]")
  serviceAreas  String   @default("[]")
  isVerified    Boolean  @default(false)
  rating        Float    @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  poojaSlots    PoojaSlot[]
  orders        Order[]
}
```

#### PoojaCategory
```prisma
model PoojaCategory {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  icon        String?
  imageUrl    String?
  poojas      Pooja[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Pooja
```prisma
model Pooja {
  id           String   @id @default(uuid())
  title        String
  slug         String   @unique
  description  String
  instructions String?
  samagri      String   @default("[]")   // JSON array of items
  duration     Int                    // in minutes
  basePrice    Float
  mode         String   @default("IN_TEMPLE")  // IN_TEMPLE, AT_HOME, ONLINE
  imageUrl     String?
  categoryId   String
  category     PoojaCategory @relation(fields: [categoryId], references: [id])
  isActive     Boolean  @default(true)
  isRecurring  Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  poojaSlots   PoojaSlot[]
  addOns       AddOn[]
  orders       Order[]
  reviews      Review[]
}
```

#### PoojaLocation
```prisma
model PoojaLocation {
  id          String   @id @default(uuid())
  name        String
  address     String
  city        String
  state       String
  pincode     String?
  latitude    Float?
  longitude   Float?
  templeName  String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  poojaSlots  PoojaSlot[]
}
```

#### PoojaSlot
```prisma
model PoojaSlot {
  id           String   @id @default(uuid())
  poojaId      String
  pooja        Pooja    @relation(fields: [poojaId], references: [id], onDelete: Cascade)
  locationId   String
  location     PoojaLocation @relation(fields: [locationId], references: [id])
  vendorId     String?
  vendor       Vendor?  @relation(fields: [vendorId], references: [id])
  date         String
  startTime    String
  capacity     Int      @default(1)
  bookedCount  Int      @default(0)
  isAvailable  Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  orders       Order[]
  
  @@index([poojaId])
  @@index([date, isAvailable])
}
```

#### AddOn
```prisma
model AddOn {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  poojaId     String
  pooja       Pooja    @relation(fields: [poojaId], references: [id], onDelete: Cascade)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orderItems  OrderItem[]
}
```

#### Order
```prisma
model Order {
  id               String      @id @default(uuid())
  orderNo          String      @unique
  customerId       String
  customer         User        @relation(fields: [customerId], references: [id])
  poojaId          String
  pooja            Pooja       @relation(fields: [poojaId], references: [id])
  slotId           String
  slot             PoojaSlot   @relation(fields: [slotId], references: [id])
  vendorId         String?
  vendor           Vendor?     @relation(fields: [vendorId], references: [id])
  panditId         String?
  pandit           Pandit?     @relation(fields: [panditId], references: [id])
  status           String      @default("BOOKED")  // BOOKED, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED, PAYMENT_FAILED
  mode             String
  attendeeName     String
  attendeePhone    String
  address          String?
  notes            String?
  baseAmount       Float
  addOnAmount      Float       @default(0)
  taxAmount        Float       @default(0)
  totalAmount      Float
  cancellationReason String?
  refundAmount     Float?
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
  
  orderItems       OrderItem[]
  payments         Payment[]
  notifications    Notification[]
  reviews          Review[]
  
  @@index([customerId])
  @@index([poojaId])
  @@index([vendorId])
  @@index([status])
  @@index([createdAt])
}
```

#### OrderItem
```prisma
model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  addOnId   String
  addOn     AddOn    @relation(fields: [addOnId], references: [id])
  quantity  Int      @default(1)
  price     Float
}
```

#### Payment
```prisma
model Payment {
  id           String   @id @default(uuid())
  orderId      String
  order        Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  provider     String   // RAZORPAY, MOCK
  status       String   @default("PENDING")  // PENDING, SUCCESS, FAILED
  amount       Float
  paymentRef   String?  // Razorpay order ID
  rawResponse  String?  // JSON response
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

#### Notification
```prisma
model Notification {
  id         String   @id @default(uuid())
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  type       String   // SMS, PUSH, EMAIL
  status     String   @default("PENDING")  // PENDING, SENT, FAILED
  recipient  String
  subject    String?
  body       String
  sentAt     DateTime?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

#### Review
```prisma
model Review {
  id         String   @id @default(uuid())
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  customerId String
  customer   User     @relation(fields: [customerId], references: [id])
  poojaId    String
  pooja      Pooja    @relation(fields: [poojaId], references: [id])
  rating     Int
  comment    String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

#### Pandit
```prisma
model Pandit {
  id                    String   @id @default(uuid())
  name                  String
  photo                 String?
  bio                   String?
  experienceYears       Int      @default(0)
  languages             String   @default("[]")
  specializations       String   @default("[]")
  city                  String
  state                 String
  rating                Float    @default(0)
  totalReviews          Int      @default(0)
  totalPoojasCompleted  Int      @default(0)
  isVerified            Boolean  @default(false)
  verificationBadge     String?
  isAvailable           Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  reviews               PanditReview[]
  orders                Order[]
}
```

#### Other Models
- **AuditLog**: Tracks user actions
- **Coupon**: Discount codes
- **PanditReview**: Reviews for pandits
- **PasswordResetToken**: Password reset tokens
- **NotificationToken**: FCM tokens for push notifications

---

## 4. Authentication Flow

### Authentication Methods

1. **Phone + OTP** - Primary method for Indian users
2. **Email + Password** - Traditional login
3. **Google OAuth** - Social login (configured but limited)
4. **Phone + Password** - Alternative phone-based login

### JWT Token Structure

```typescript
interface JWTPayload {
  userId: string
  phone: string
  role: string  // CUSTOMER, ADMIN, VENDOR, PANDIT, TEMPLE
}
```

- **Token Generation**: `generateToken()` in `src/lib/auth.ts`
- **Secret**: `JWT_SECRET` from environment (default: "poojabook-secret-key-change-in-production")
- **Expiry**: 7 days (30 days if "rememberMe" is selected)
- **Cookie Name**: `auth-token`

### OTP Flow

```
1. User enters phone number
   ↓
2. POST /api/auth { action: 'send-otp', phone: '9876543210' }
   ↓
3. Rate limit check (3 OTPs per 15 minutes)
   ↓
4. Generate 6-digit OTP
   ↓
5. Hash OTP with bcrypt (salt rounds: 10)
   ↓
6. Store in OtpVerification table (expires in 10 minutes)
   ↓
7. Send via Twilio/Fast2SMS
   ↓
8. Return masked phone (9876 543210)
```

### Login Flow

```
1. POST /api/auth { action: 'verify-otp', phone, otp }
   OR
   POST /api/auth { action: 'login-email', email, password }
   OR
   POST /api/auth { action: 'login-phone', phone, password }
   ↓
2. Validate credentials
   ↓
3. Generate JWT token
   ↓
4. Set auth-token cookie (httpOnly, secure, sameSite: lax)
   ↓
5. Return user object + redirect path based on role
```

### Role-Based Redirects

| Role | Redirect After Login |
|------|---------------------|
| ADMIN | /admin |
| VENDOR | /vendor |
| PANDIT | /vendor |
| TEMPLE | /vendor |
| CUSTOMER | / |
| Partner (pending approval) | /pending-approval |

### Protected Routes

- `/admin*` - ADMIN only
- `/vendor*` - VENDOR, PANDIT, TEMPLE only
- `/my-orders*` - Authenticated users
- `/api/admin/*` - ADMIN only
- `/api/vendor/*` - VENDOR only
- `/api/orders` - Authenticated users
- `/api/auth/me` - Authenticated users

### Auth Guard Implementation

```typescript
// src/lib/api.ts
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
```

---

## 5. API Architecture

### Response Format

All API responses follow a consistent structure:

```typescript
// Success
{ "success": true, "data": <payload> }

// Error
{ "success": false, "error": "Error message" }

// Validation Error
{ "success": false, "error": "Validation failed", "details": [...] }

// With Status Code
{ "success": true, "data": <payload> }  // 201 Created
```

### API Endpoints Summary

#### Authentication (`/api/auth`)

| Action | Method | Description | Auth |
|--------|--------|-------------|------|
| send-otp | POST | Send OTP to phone | Public |
| verify-otp | POST | Verify OTP, auto-login | Public |
| register-devotee | POST | Register customer | Public |
| register-partner | POST | Register pandit/temple | Public |
| login-email | POST | Email + password login | Public |
| login-phone | POST | Phone + password login | Public |
| forgot-password | POST | Request password reset | Public |
| reset-password | POST | Reset password with token | Public |

#### Poojas (`/api/poojas`)

| Method | Query Params | Description |
|--------|--------------|-------------|
| GET | category, city, mode, search, page, limit | List poojas with filters |
| POST | pooja data | Create pooja (Admin) |

#### Categories (`/api/categories`)

| Method | Description |
|--------|-------------|
| GET | List all categories |
| POST | Create category (Admin) |

#### Pandits (`/api/pandits`)

| Method | Query Params | Description |
|--------|--------------|-------------|
| GET | city, category, limit | List available pandits |
| POST | pandit data | Create pandit (Admin) |

#### Orders (`/api/orders`)

| Method | Description | Auth |
|--------|-------------|------|
| GET | List user's orders | Required |
| POST | Create new order | Required |

#### Payment (`/api/payment`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /create-order | POST | Create Razorpay order |
| /verify | POST | Verify payment signature |

#### Locations (`/api/locations`)

| Method | Query Params | Description |
|--------|--------------|-------------|
| GET | state, city | List locations |
| POST | location data | Create location (Admin) |

#### Admin (`/api/admin`)

| Endpoint | Methods | Description |
|----------|---------|-------------|
| /dashboard | GET | Stats, recent orders, top poojas |
| /orders | GET, PATCH | Manage orders |
| /vendors | GET, POST, PATCH | Manage vendors |
| /promote | POST | Promote user to vendor |

#### Vendor (`/api/vendor`)

| Endpoint | Methods | Description |
|----------|---------|-------------|
| /dashboard | GET | Vendor stats |
| /orders | GET | Vendor's orders |

#### Notifications (`/api/notifications`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /register | POST | Register FCM token |
| /send | POST | Send push notification |
| /test | POST | Send test notification |
| /debug | GET | Debug endpoint |

#### Matchmaker (`/api/matchmaker`)

| Method | Description |
|--------|-------------|
| POST | AI-powered pooja recommendation using Anthropic Claude |

### Error Handling

All API routes use centralized error handling:

```typescript
// src/lib/api.ts
export function successResponse(data: any, status = 200)
export function errorResponse(message: string, status = 400)
export function validationError(error: ZodError)
export function unauthorized()
export function forbidden(message?)
export function notFound(message?)
export function serverError(error?)
```

### Validation

Zod schemas are defined in `src/lib/validations.ts`:
- `sendOtpSchema`
- `verifyOtpSchema`
- `registerDevoteeSchema`
- `registerPartnerSchema`
- `loginWithPasswordSchema`
- `loginWithPhoneSchema`
- `forgotPasswordSchema`
- `resetPasswordSchema`
- `createOrderSchema`
- `createPoojaSchema`
- `createSlotSchema`
- `updateOrderStatusSchema`

---

## 6. State Management

### Server State (Data Fetching)

**Primary Method**: Next.js built-in fetching with SWR for client-side updates

```typescript
// Server-side (Next.js App Router)
const res = await fetch('/api/poojas', { next: { revalidate: 60 } })

// Client-side with SWR
const { data } = useSWR('/api/poojas', fetcher)
```

### Client State

**Local State**: React useState/useReducer for component-level state

```typescript
const [user, setUser] = useState<User | null>(null)
const [menuOpen, setMenuOpen] = useState(false)
```

**Session State**: NextAuth session with SessionProvider wrapper

```typescript
// src/components/SessionProvider.tsx
'use client'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export function SessionProvider({ children }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
```

### Global Context

No formal React Context API usage for global state. Instead:
- JWT stored in HTTP-only cookie
- User data fetched from `/api/auth/me` on page load
- LocalStorage for non-sensitive preferences

### Notification State

Custom event system for cross-component notifications:

```typescript
// Dispatch
window.dispatchEvent(new CustomEvent('poojabook-notification', { 
  detail: { title, body } 
}))

// Listen
window.addEventListener('poojabook-notification', (e) => { ... })
```

---

## 7. Payment Flow

### Razorpay Integration

#### Order Creation
```
1. User selects pooja, add-ons, fills booking form
2. Client calls POST /api/payment/create-order
3. Server validates order, creates Razorpay order
4. Server creates Payment record (status: PENDING)
5. Returns razorpay order_id to client
```

```typescript
// src/lib/razorpay.ts
export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  const order = await getRazorpay().orders.create({
    amount: Math.round(amount * 100),  // Razorpay expects paise
    currency,
    receipt: `poojabook_${Date.now()}`,
  })
  return order
}
```

#### Payment Verification
```
1. Client initializes Razorpay checkout
2. User completes payment
3. Client receives razorpay_payment_id, razorpay_signature
4. Client calls POST /api/payment/verify
5. Server verifies signature
6. Server updates Payment status to SUCCESS
7. Server updates Order status to CONFIRMED
```

```typescript
// src/lib/razorpay.ts
export const verifyPayment = (
  razorpayOrderId: string, 
  razorpayPaymentId: string, 
  razorpaySignature: string
) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')
  return generatedSignature === razorpaySignature
}
```

### Order Creation Flow

```
1. POST /api/orders with booking details
2. Validate pooja, slot availability
3. Calculate amounts (base + add-ons + 18% tax)
4. Prisma transaction:
   a. Create Order record
   b. Create OrderItems (if add-ons)
   c. Update PoojaSlot.bookedCount
   d. Create Payment (mock success for development)
   e. Create Notification (SMS)
5. Return complete order
```

### Payment Status Handling

| Payment Status | Order Status | Description |
|----------------|--------------|-------------|
| PENDING | BOOKED | Order created, payment not complete |
| SUCCESS | CONFIRMED | Payment verified |
| FAILED | PAYMENT_FAILED | Payment verification failed |

---

## 8. Third Party Integrations

### Database
- **Provider**: Supabase (PostgreSQL)
- **Connection Pooler**: `postgres.tunblyuocswpyarquwze@aws-1-ap-south-1.pooler.supabase.com`
- **Connection Limits**: 1 connection, 20s timeout

### SMS/OTP Services

#### Twilio (Primary)
- Account SID, Auth Token, Phone Number
- Used for OTP delivery
- Configured in `.env`

#### Fast2SMS (Backup)
- API Key: `qbqaovSBVJryx08V4RHXzO4MSHARBVSIAu8WcajqG3fIByZyJtBiW4wv0ZYh`
- Fallback when Twilio fails

### Push Notifications

#### Firebase Cloud Messaging (FCM)
- Client-side: `firebase/messaging`
- Server key configured in `.env`
- Service worker: `/firebase-messaging-sw.js`

#### OneSignal
- App ID: `75298ded-5296-49ac-870c-48738419e42f`
- Integrated via OneSignalSDK.js

### AI Services

#### Anthropic Claude (AI Matchmaker)
- API: `https://api.anthropic.com/v1/messages`
- Model: `claude-opus-4-20250514`
- Used in `/api/matchmaker` for AI-powered pooja recommendations

### Authentication

#### NextAuth.js Providers
- Credentials (email/password, phone/password)
- Google OAuth (configured but limited)

### Image Storage
- Remote patterns configured in `next.config.ts`:
  - `static.wixstatic.com`
  - `artworkbird.co.in`
  - `servdharm.com`
  - `www.bhaktiphotos.com`

### Required Environment Variables

```env
# Database
DATABASE_URL="postgres://...supabase.com:5432/postgres"

# Authentication
JWT_SECRET="poojabook-secret-key-change-in-production"
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="https://poojabook.vercel.app"
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"

# SMS/OTP
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"
FAST2SMS_API_KEY="your_fast2sms_api_key"

# Push Notifications
NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="your_vapid_key"
FIREBASE_SERVER_KEY="your_firebase_server_key"

# Payments
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

# AI
ANTHROPIC_API_KEY="sk-ant-api03-..."
```

---

## 9. Performance & Caching

### Caching Strategies

#### Server-Side Caching
```typescript
// API route response headers
{
  'Cache-Control': 's-maxage=60, stale-while-revalidate=300'
}

// Next.js fetch
fetch('/api/poojas', { next: { revalidate: 60 } })
```

| Endpoint | Cache Duration | Stale While Revalidate |
|----------|---------------|----------------------|
| /api/poojas | 60s | 300s |
| /api/categories | 60s | 300s |
| /api/locations | 60s | 300s |

### Server vs Client Components

#### Server Components (Default)
- `/src/app/page.tsx` - Homepage (uses client features via 'use client')
- `/src/app/poojas/page.tsx` - Pooja listing
- API routes

#### Client Components (Explicit 'use client')
- All pages with interactivity
- Components with state/effects
- Header, BookingForm, etc.

### Image Optimization

```typescript
// next.config.ts
images: {
  unoptimized: true,  // Currently disabled
  remotePatterns: [
    { protocol: 'https', hostname: 'static.wixstatic.com' },
    { protocol: 'https', hostname: 'artworkbird.co.in' },
    { protocol: 'https', hostname: 'servdharm.com' },
    { protocol: 'https', hostname: 'www.bhaktiphotos.com' },
  ],
}
```

### Database Indexes

```prisma
// User
@@index([role])

// OtpVerification
@@index([phoneNumber])
@@index([expiresAt])

// PoojaSlot
@@index([poojaId])
@@index([date, isAvailable])

// Order
@@index([customerId])
@@index([poojaId])
@@index([vendorId])
@@index([status])
@@index([createdAt])
```

### Prisma Performance

- Global Prisma client singleton to prevent connection exhaustion
- Selective field fetching with `select: {}`
- Promise.all for parallel queries

---

## 10. Known Issues & Technical Debt

### Incomplete Features

1. **Google OAuth** - Configured in NextAuth but returns error "not configured yet"
   - Location: `/src/app/api/auth/route.ts` line 551-553

2. **Review System** - Schema exists but no UI to submit reviews
   - No review submission form
   - No review display on pooja pages

3. **Vendor Dashboard** - Basic structure, needs enhancement
   - Limited order management
   - No earnings tracking

4. **Image Upload** - No image upload functionality
   - All images via URLs
   - No cloud storage integration (AWS S3, Cloudinary, etc.)

5. **Email Notifications** - Not implemented
   - Only SMS and push notifications

6. **Coupons/Discounts** - Schema exists but not used
   - No UI to apply coupons

7. **Saved Items** - Menu link exists but no implementation

8. **Profile/Settings Pages** - Menu links exist but not implemented

### Technical Debt

1. **Hardcoded Values**
   - Tax rate (18%) hardcoded in order creation
   - Order number prefix "PB-" in auth.ts

2. **Demo/Fallback Tokens**
   - FCM demo tokens for development
   - OneSignal hardcoded App ID

3. **No Rate Limiting on All Routes**
   - Rate limiting only on OTP endpoint
   - Other endpoints vulnerable to abuse

4. **In-Memory Rate Limiting**
   - `rateLimitStore` and `passwordResetRateLimitStore` are Maps
   - Not suitable for serverless/Vercel (resets on cold start)

5. **Console.log Debugging**
   - Extensive console.log statements throughout codebase
   - Should use proper logging (e.g., Winston, Pino)

6. **Missing Error Boundaries**
   - No React error boundaries for graceful failure handling
   - Only basic error.tsx files

7. **Type Safety**
   - Some `any` types in use
   - Some type assertions with `as any`

8. **Missing Tests**
   - No unit tests
   - No integration tests
   - No E2E tests

9. **No Input Sanitization**
   - Potential XSS vulnerabilities in some components

10. **Hardcoded Messages**
    - Error/success messages scattered throughout code
    - Should use i18n system

### Improvements Needed

1. **Add comprehensive test coverage**
2. **Implement proper logging system**
3. **Add rate limiting middleware** (e.g., Upstash Rate Limit)
4. **Implement image upload** with cloud storage
5. **Add email notification service**
6. **Implement complete review system**
7. **Add i18n for multi-language support**
8. **Add SEO optimization** (meta tags, sitemap, robots.txt)
9. **Implement PWA features** (manifest.json, service worker)
10. **Add comprehensive API documentation**

---

## Appendix: File Structure Summary

```
poojabook/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   └── pending-approval/page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── vendors/page.tsx
│   │   │   └── notifications/page.tsx
│   │   ├── vendor/
│   │   │   ├── page.tsx
│   │   │   └── orders/page.tsx
│   │   ├── poojas/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       ├── error.tsx
│   │   │       └── loading.tsx
│   │   ├── pandits/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── my-orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── vendor/
│   │   │   ├── orders/
│   │   │   ├── poojas/
│   │   │   ├── categories/
│   │   │   ├── pandits/
│   │   │   ├── locations/
│   │   │   ├── payment/
│   │   │   ├── notifications/
│   │   │   └── matchmaker/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── BookingForm.tsx
│   │   ├── LocationSelector.tsx
│   │   ├── PanditCard.tsx
│   │   ├── PanditMatchmaker.tsx
│   │   ├── RazorpayPayment.tsx
│   │   ├── MockPayment.tsx
│   │   ├── ChatWidget.tsx
│   │   ├── NotificationPrompt.tsx
│   │   ├── AuspiciousDaysSection.tsx
│   │   ├── BestDatesSection.tsx
│   │   ├── WebsiteTour.tsx
│   │   ├── TourOverlay.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── CrossPageTour.tsx
│   │   └── SessionProvider.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── api.ts
│   │   ├── razorpay.ts
│   │   ├── twilio.ts
│   │   ├── fast2sms.ts
│   │   ├── firebase.ts
│   │   ├── validations.ts
│   │   ├── panchang.ts
│   │   └── tour-steps.ts
│   ├── types/
│   │   └── next-auth.d.ts
│   ├── data/
│   │   └── panchang.json
│   └── auth.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── firebase-messaging-sw.js
│   └── *.svg
├── scripts/
│   ├── vercel-build.js
│   ├── check-slugs.ts
│   ├── check-category.ts
│   └── update-categories.ts
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

*Document generated: March 2026*
*Version: 1.0*
*For questions, contact the development team*
