# Rudraksha Sacred Store

A full-stack e-commerce store for **home-grown, pure organic rudraksha** beads — cultivated on a
family farm near Mangalore, Karnataka. Built with **Next.js (App Router)**, **TypeScript**,
**Tailwind CSS**, **Prisma + SQLite**, with **multi-currency** pricing and **worldwide checkout**
(India + international).

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Quick start](#quick-start)
5. [Environment variables](#environment-variables)
6. [NPM scripts](#npm-scripts)
7. [Enabling real Razorpay payments](#enabling-real-razorpay-payments)
8. [Project structure](#project-structure)
9. [Default accounts](#default-accounts)
10. [Troubleshooting](#troubleshooting)
11. [Production readiness & go-live](#production-readiness--go-live)

---

## Features

**Storefront**
- Home page with hero, "Our Farm" organic story, featured beads, and a Mukhi explorer
- Product catalog with **search, filter (origin), and sort**
- Rich product detail pages with **image gallery**, spiritual details, and benefits
- **Multi-currency** pricing (INR base → USD/EUR/GBP/AED/AUD/CAD/SGD) with a currency switcher
- **Wishlist / favorites** (heart button, dedicated wishlist page)
- **Product reviews & ratings** (star ratings on cards + review form for logged-in users)
- Persistent **cart** with a slide-out cart drawer and toast notifications
- **WhatsApp "Chat with us"** floating button

**Checkout & accounts**
- Login-required checkout (guest checkout is blocked)
- **Saved addresses** — manage in account, pick/save at checkout
- Shipping rules (free domestic over a threshold; flat international)
- Order confirmation + **order history** (owner/admin-only access)

**Payments (free to run)**
- **Cash on Delivery**
- **Online payments via Razorpay** (test or live) — if no Razorpay keys are configured, a built-in
  **mock payment** completes instantly so you can test end-to-end without any account

**Admin panel** (`/admin`)
- Dashboard (products, orders, revenue, low-stock)
- Product CRUD with **multi-image upload, cropping/resizing, and a default image picker**
- Order management with status updates

**Branding & SEO**
- SVG logo, favicon, and a dynamic social-share (OpenGraph) image
- `robots.txt`, `sitemap.xml`, OpenGraph/Twitter metadata
- Auto-generated SVG bead images as a fallback when a product has no photo

---

## Tech stack

| Area      | Choice                                       |
| --------- | -------------------------------------------- |
| Framework | Next.js 16 (App Router) + React 19           |
| Language  | TypeScript                                   |
| Styling   | Tailwind CSS v4                              |
| Database  | SQLite via Prisma 6 (swap to Postgres later) |
| Auth      | `jose` (JWT) + `bcryptjs`, httpOnly cookie   |
| Payments  | Razorpay + Cash on Delivery + mock fallback  |
| State     | Zustand (cart, currency, wishlist, UI)       |
| Image crop| `react-easy-crop` (client-side)              |

---

## Prerequisites

- **Node.js 20 or newer** (project developed on Node 24)
- **npm** (comes with Node)
- A code editor (VS Code / Cursor recommended)

> Tip: this repo includes a `.nvmrc` file (Node 20). If you use `nvm`, run `nvm use` in the project
> folder to automatically switch to the correct Node version.

Check your versions:

```bash
node -v
npm -v
```

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file (then edit values as needed)
#    Windows (PowerShell):
copy .env.example .env
#    macOS / Linux:
cp .env.example .env

# 3. Set up the database (generate client + create schema + seed sample data)
npm run setup

# 4. Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

> The repo includes a project-local `.npmrc` pointing at the public npm registry so installs work
> behind corporate registries. See [Troubleshooting](#troubleshooting) if installs fail.

---

## Environment variables

Copy `.env.example` to `.env` and fill in values. All variables:

| Variable                       | Required | Description                                                        |
| ------------------------------ | -------- | ------------------------------------------------------------------ |
| `DATABASE_URL`                 | ✅       | Database connection. Default `file:./dev.db` (SQLite).             |
| `JWT_SECRET`                   | ✅       | Session signing secret. **Min 32 chars.** Generate a strong one.  |
| `NEXT_PUBLIC_SITE_URL`         | ✅       | Public base URL (no trailing slash). Used for SEO/sitemap/OG.     |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`  | optional | WhatsApp number, digits only, e.g. `919487789546`.                |
| `RAZORPAY_KEY_ID`              | optional | Razorpay key id. Leave blank to use the built-in mock payment.    |
| `RAZORPAY_KEY_SECRET`          | optional | Razorpay key secret (**keep private**).                           |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`  | optional | Must equal `RAZORPAY_KEY_ID` (used by the browser checkout popup). |
| `ADMIN_EMAIL`                  | optional | Seeded admin email (default `admin@rudraksha.test`).              |
| `ADMIN_PASSWORD`               | optional | Seeded admin password (default `admin12345`).                    |

Generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> **Note:** changes to `.env` only take effect after restarting the dev server.

---

## NPM scripts

| Script               | Description                                       |
| -------------------- | ------------------------------------------------- |
| `npm run dev`        | Start the development server (http://localhost:3000) |
| `npm run build`      | Production build                                   |
| `npm start`          | Run the production build                           |
| `npm run setup`      | Generate Prisma client + create DB + seed         |
| `npm run db:seed`    | (Re)seed sample catalog + accounts                |
| `npm run db:push`    | Apply schema changes to the database              |
| `npm run db:generate`| Regenerate the Prisma client                      |
| `npm run db:reset`   | Wipe & recreate the database, then seed           |
| `npm run db:studio`  | Open Prisma Studio (visual DB browser)            |
| `npm run lint`       | Run ESLint                                         |
| `npm run typecheck`  | Type-check with the TypeScript compiler           |

---

## Enabling real Razorpay payments

The store works out of the box with **Cash on Delivery** + a **mock online payment**. To use real
Razorpay:

1. Create a free account at https://dashboard.razorpay.com (no upfront/monthly fee).
2. **Test Mode** → **Settings → API Keys → Generate Test Key**. Copy the key id + secret.
3. Put them in `.env`:
   ```
   RAZORPAY_KEY_ID="rzp_test_xxxxxxxx"
   RAZORPAY_KEY_SECRET="your_secret"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxx"
   ```
4. **Restart** the dev server. Pay using Razorpay [test cards](https://razorpay.com/docs/payments/payments/test-card-details/).
5. To go live: complete KYC in the Razorpay dashboard, generate **Live keys** (`rzp_live_...`), and
   set them in your production environment.

> Razorpay processes in **INR**. The store displays prices in the customer's chosen currency but
> charges the INR equivalent online. Cash on Delivery works in any currency.

---

## Project structure

```
prisma/
  schema.prisma          # data model: User, Address, Product, ProductImage, Review, Order, OrderItem
  seed.ts                # sample catalog, accounts, and reviews
public/
  uploads/               # admin-uploaded product images (gitignored)
src/
  app/
    page.tsx             # home
    products/            # catalog + product detail (+ review actions)
    cart/ checkout/      # cart page + checkout flow
    wishlist/            # wishlist page
    account/             # profile, orders, saved addresses (+ address actions)
    order/[id]/          # order confirmation (owner/admin only)
    login/ register/     # auth pages
    admin/               # dashboard, product CRUD, orders (+ admin actions)
    api/                 # auth, checkout, payment verify, upload, product-image (SVG), auth/me
    icon.svg             # favicon
    opengraph-image.tsx  # dynamic social share image
    robots.ts sitemap.ts # SEO
  components/            # Navbar, Footer, ProductCard, CheckoutForm, CartDrawer, reviews, etc.
  lib/                   # prisma, auth, env, currency, shipping, queries, rate-limit, utils
  store/                 # zustand stores: cart, currency, wishlist, ui, toast
```

---

## Default accounts

Created by the seed (`npm run db:seed`):

- **Admin** — `admin@rudraksha.test` / `admin12345` → visit `/admin`
- **Customer** — `customer@rudraksha.test` / `customer12345`

> Change these via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`, then re-run `npm run db:seed`.

---

## Troubleshooting

**Installs fail with `401`/registry errors**
The repo ships a project-local `.npmrc` that uses the public npm registry. If your machine forces a
corporate registry, ensure `.npmrc` contains:
```
registry=https://registry.npmjs.org/
strict-ssl=false
```

**Prisma "self-signed certificate" when generating/pushing**
Corporate TLS proxies can block Prisma's engine download. Run the command once with TLS checks
disabled (dev machines only):
```bash
#   PowerShell:
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx prisma db push
#   macOS / Linux:
NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma db push
```

**Port 3000 already in use**
Another `next dev` is running. Stop it, or start on another port: `npm run dev -- -p 3001`.

**Changes to `.env` aren't applied**
Restart the dev server — environment variables are read at startup.

**Prisma client errors after editing `schema.prisma`**
Run `npm run db:push` (applies schema + regenerates the client). On Windows, stop the dev server
first if you see an `EPERM` lock error.

---

## Production readiness & go-live

Already in place:

- **Validated environment** (`src/lib/env.ts`) — refuses to boot in production with the default `JWT_SECRET`.
- **Security headers** (`next.config.ts`) + `x-powered-by` disabled.
- **Rate limiting** (`src/lib/rate-limit.ts`) on login, register, and checkout.
- **Server-trusted pricing** — checkout recomputes prices/stock from the DB.
- **Razorpay payment signature verification**.
- **Error/loading/not-found UI** and **SEO** (robots, sitemap, OpenGraph).
- **Accessibility** — visible focus styles, reduced-motion support.

Go-live checklist:

1. **Secrets**: set a strong `JWT_SECRET` and real `NEXT_PUBLIC_SITE_URL` (https).
2. **Database**: switch SQLite → **PostgreSQL** (change `datasource` + `DATABASE_URL`, run `npx prisma migrate deploy`).
3. **File uploads**: local `public/uploads` does not persist on serverless hosts — move to S3 / Cloudinary / Vercel Blob.
4. **Payments**: add **live** Razorpay keys and test with real cards.
5. **Rate limiting**: back it with Redis (e.g. Upstash) for multi-instance/serverless.
6. **Email**: wire order-confirmation emails (e.g. Resend / SES).
7. **Monitoring**: connect an error tracker (e.g. Sentry).
8. Run `npm run typecheck && npm run lint && npm run build` in CI before deploy.

---

## Notes

- Spiritual benefits described are based on traditional belief and are not medical claims.
- See [`WEBSITE_GUIDE.md`](./WEBSITE_GUIDE.md) for a non-technical, client-facing overview.
