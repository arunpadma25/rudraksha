# Rudraksha Store — Roadmap

Future enhancements, grouped by priority. Items are checked off as they ship.

## Done
- [x] Deployable on Vercel (Postgres + Vercel Blob uploads)
- [x] User-icon account menu with correct auth state
- [x] Case-insensitive product search
- [x] Shop filters: mukhi + price range
- [x] Product JSON-LD (rich Google results: price, availability, rating)
- [x] Admin sales dashboard (14-day revenue chart, top sellers, AOV)

## Quick wins (small, high impact)
- [ ] **Order confirmation emails** — transactional email (Resend or Nodemailer)
      on order placed + status changes. Needs an email provider API key.
      Touch points: `src/app/api/checkout/route.ts`, `src/app/api/payment/verify/route.ts`.
- [ ] **`next/image` optimization** — replace plain `<img>` with `next/image`;
      add Vercel Blob domain to `images.remotePatterns` in `next.config.ts`.
      Improves LCP, bandwidth, and Core Web Vitals.
- [ ] **Add-to-cart toast + Buy Now** — tighten the purchase loop (Toaster exists).

## Conversion / UX
- [ ] Search autocomplete / suggestions in the navbar search.
- [ ] "Recently viewed" products + smarter related products
      (currently `getRelatedProducts` just orders by `featured`).
- [ ] Stock urgency ("Only 3 left") and back-in-stock email notify.

## Trust & retention
- [ ] Reviews with photos + verified-buyer badge (Review model already exists;
      cross-check against the buyer's orders).
- [ ] Coupons / discount codes at checkout (new `Coupon` model + validation).
- [ ] Order tracking page with a status timeline.

## Admin / ops
- [ ] Order management: update status, add tracking number, resend invoice.
- [ ] Bulk product import/export (CSV).
- [ ] Automated low-stock email alerts.

## Infrastructure / hardening
- [ ] Separate local dev database from production (Neon branch) so local work
      doesn't read/write live data.
- [ ] Rotate `JWT_SECRET` and DB credentials for a real production launch.
- [ ] Migrate `package.json#prisma` config to `prisma.config.ts` (Prisma 7).
