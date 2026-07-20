# Velora Black Car — Animated Full-Stack Website

Yeh project luxury black-car booking business ke liye ready-made full-stack website hai.

## Included features

- Premium responsive React website
- Cinematic hero and page photography
- Scroll reveal, page transition, hover, floating-card, and image-pan animations
- Services and fleet pages
- Multi-step ride booking form
- Automatic estimated price calculation
- Booking confirmation/reference number
- Customer booking-status lookup
- Admin login with JWT + bcrypt
- Admin dashboard for all bookings
- Status and payment-status management
- Contact form
- Optional Stripe Checkout payment
- Optional Gmail/Nodemailer confirmation email
- MongoDB Atlas support
- Zero-setup JSON database mode for local development

## Easiest Windows setup

1. ZIP extract karo.
2. `setup-windows.bat` double-click karo.
3. Setup complete hone ke baad `run-windows.bat` double-click karo.
4. Website: `http://localhost:5173`
5. API: `http://localhost:5000/api/health`
6. Admin login: `http://localhost:5173/admin/login`

Default local admin:

```text
Email: admin@velora.local
Password: VeloraAdmin2026!
```

Deployment se pehle password aur JWT secret zaroor change karo.

## Manual setup

```powershell
cd velora-black-car-animated
npm install
npm run install:all
copy server\.env.example server\.env
copy client\.env.example client\.env
npm run seed:admin
npm run dev
```

## Database mode

Default mode local JSON database hai. Is se MongoDB install kiye baghair project foran chal jata hai:

```env
STORAGE_DRIVER=json
```

MongoDB Atlas use karne ke liye `server/.env` mein:

```env
STORAGE_DRIVER=mongodb
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/velora?retryWrites=true&w=majority
```

Atlas mein current IP ko Network Access list mein add karna aur Database Access user banana zaroori hai.

## Stripe setup (optional)

`server/.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Stripe keys blank hon to website “Pay later” mode mein perfectly kaam karti rahegi.

## Gmail confirmation emails (optional)

Google account mein 2-Step Verification enable karke App Password banao, phir:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-character-app-password
EMAIL_FROM=Velora Black Car <your-email@gmail.com>
ADMIN_NOTIFICATION_EMAIL=your-email@gmail.com
```

Email settings blank hon to booking fail nahi hoti; server sirf email skip karta hai.

## Production deployment

- Client: Vercel / Netlify
- Server: Render / Railway / Fly.io
- Database: MongoDB Atlas
- `CLIENT_URL`, `VITE_API_URL`, secure cookies, Stripe webhook URL, and environment secrets update karo.

## Main API routes

```text
GET    /api/health
GET    /api/public/config
POST   /api/bookings/quote
POST   /api/bookings
POST   /api/bookings/lookup
POST   /api/contact
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
GET    /api/admin/bookings
PATCH  /api/admin/bookings/:id
DELETE /api/admin/bookings/:id
POST   /api/payments/checkout
GET    /api/payments/session/:sessionId
POST   /api/payments/webhook
```
