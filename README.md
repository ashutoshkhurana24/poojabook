# PoojaBook - Divine Services Platform

A production-ready web application for booking Hindu religious ceremonies (poojas) across India. Built with Next.js, Prisma, and SQLite.

## Features

- **Customer Portal**: Browse poojas by category, location, and mode; book slots; make payments
- **Admin Dashboard**: Manage poojas, vendors, orders; view analytics and revenue
- **Vendor Portal**: Receive and manage assigned orders, update status
- **Authentication**: OTP-based phone login (mock in dev)
- **Payment**: Mock payment gateway

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with OTP verification

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Navigate to project directory
cd poojabook

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with sample data
npm run db:seed
```

### Running the App

```bash
# Start development server
npm run dev
```

The app will be available at http://localhost:3000

### Login Credentials

**Admin:**
- Phone: +919999999999

**Vendor:**
- Phone: +919888888888, +919877777777, +919866666666

**Customer:**
- Register a new account or use the OTP login

## API Endpoints

### Authentication
- `POST /api/auth` - Send OTP, Verify OTP, Register, Login

### Poojas
- `GET /api/poojas` - List poojas with filters
- `GET /api/poojas/[id]` - Get pooja details
- `POST /api/categories` - Create category (admin)
- `GET /api/locations` - List locations
- `POST /api/locations` - Create location (admin)

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details
- `PATCH /api/orders/[id]` - Update order status

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/vendors` - Manage vendors

### Vendor
- `GET /api/vendor/dashboard` - Vendor dashboard
- `GET /api/vendor/orders` - Vendor's orders

## Seed Data

The seed script creates:
- 8 pooja categories (Ganesh, Lakshmi, Navgraha, etc.)
- 8 temple locations across India
- 3 vendor profiles with users
- 20 poojas with various modes
- Slots for the next 14 days

## Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key-change-in-production"
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with search |
| `/poojas` | Pooja listing with filters |
| `/poojas/[slug]` | Pooja details & booking |
| `/login` | OTP login |
| `/register` | Register new account |
| `/my-orders` | Customer's orders |
| `/my-orders/[id]` | Order details |
| `/admin` | Admin dashboard |
| `/admin/orders` | Order management |
| `/admin/vendors` | Vendor management |
| `/vendor` | Vendor dashboard |
| `/vendor/orders` | Vendor's order queue |

## License

MIT
