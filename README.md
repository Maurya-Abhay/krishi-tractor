# Krishi Tractor Management System

A production-ready digital record-keeping app for a tractor owner providing
agricultural services — replacing notebook records with Customers, Work
Entries, Payments, and Reports.

## Tech Stack

Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS · shadcn/ui ·
PostgreSQL · Prisma · NextAuth (Credentials) · Zod · React Hook Form ·
TanStack Query & Table · Sonner · pdf-lib · Recharts

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env: set DATABASE_URL, NEXTAUTH_SECRET (openssl rand -base64 32),
# SEED_ADMIN_* and (for production) UPSTASH_REDIS_REST_URL/TOKEN.

# 3. Create the database schema
npm run db:migrate

# 4. Seed the admin user and the 3 fixed services
npm run db:seed

# 5. Run the app
npm run dev
```

Visit `http://localhost:3000`, sign in with the phone/password you set in
`SEED_ADMIN_PHONE` / `SEED_ADMIN_PASSWORD`.

## Architecture Summary

- **Rate immutability**: `WorkEntry.rate` and `WorkEntry.total` are snapshotted
  at creation time from `Service.defaultRate`. Updating a service's rate only
  affects future entries — see `prisma/schema.prisma` and
  `app/api/work-entries/route.ts`.
- **No stored balance**: Customer pending amount is always derived as
  `SUM(WorkEntry.total) − SUM(Payment.amount)` (see `lib/data/customers.ts`,
  `lib/calculations.ts`) — never a stored, driftable field.
- **Shared calculation layer**: `lib/calculations.ts` is the single place
  totals, decimal-hour conversion, and currency/date formatting are computed,
  used identically by the server (authoritative) and client (live preview).
- **Zod-first types**: every domain schema in `lib/validations/*.ts` is the
  source of truth for TypeScript types via `z.infer`, shared by forms and API
  routes.
- **`withApiHandler`**: one wrapper (`lib/api-handler.ts`) provides auth
  checks, rate limiting, and consistent error responses to every route
  handler, eliminating repeated boilerplate.
- **Server Components for reads, Route Handlers + TanStack Query for writes**:
  Dashboard, Customers list, Customer profile, Services are Server Components
  fetching directly via `lib/data/*.ts`. Forms are client components using
  TanStack Query mutations.

## Production Checklist

- [ ] Set a strong, unique `NEXTAUTH_SECRET` (never reuse across environments)
- [ ] Set `DATABASE_URL` to a managed PostgreSQL instance with SSL enabled
- [ ] Configure `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — rate
      limiting fails closed in production if these are missing
- [ ] Change the seeded admin password immediately after first login
      (a "change password" flow can be added if multiple staff accounts are
      needed — currently single-admin by design, matching the brief)
- [ ] Run `npm run build` and fix any TypeScript/ESLint errors before deploy
- [ ] Enable HTTPS/TLS termination at your host or reverse proxy (Content
      Security Policy headers assume HTTPS)
- [ ] Set up automated PostgreSQL backups (this is the system of record —
      treat it like the notebooks it replaces)
- [ ] Review `next.config.mjs` CSP headers if you add any third-party
      scripts/fonts
- [ ] Set up error monitoring (e.g. Sentry) — `console.error` calls in
      `lib/api-handler.ts` are the natural hook point
- [ ] Load-test the dashboard aggregate queries once work-entry volume is
      known; add `@@index` entries or a materialized view only if needed

## Project Structure

```
app/
  (auth)/login/              Public login page
  (dashboard)/                Protected pages (dashboard, customers, services)
  api/                        Route Handlers (customers, services, work-entries,
                               payments, reports, auth)
components/
  ui/                         Shared shadcn-style primitives
  layout/                     Sidebar, header, mobile nav
  customers/ work-entries/    Feature-specific components
  payments/ services/ reports/ dashboard/
  shared/                     Cross-feature reusable pieces
lib/
  validations/                Zod schemas (source of truth for types)
  data/                       Shared Prisma query layer (server-only)
  prisma.ts auth.ts calculations.ts api-handler.ts rate-limit.ts pdf.ts utils.ts
hooks/                        TanStack Query hooks, one file per resource
prisma/                       schema.prisma, seed.ts
```
