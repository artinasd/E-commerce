# PROJECT LEDGER

## Project
Iranian Persian E-Commerce Platform — production-oriented Persian RTL e-commerce for Iranian customers.

## Current Version
0.9.7 — release-candidate hardening

## Current Phase
Phase 7 — Customer storefront / purchase journey / production hardening

## Repository
`artinasd/E-commerce` — `main`

## Latest Verified Commit
`5298e371` — `Add Playwright E2E test scripts`

Recent hardening:
- `ea74d40a` — harden reconciliation cron authentication
- `4c881149` — validate admin product image URLs
- `98ea2f4f` — unify `/favorites` with `/account/wishlist`
- `f0a5f8ea` — revoke session on logout

## Stack
- Next.js 16 App Router
- React 19
- JavaScript / ES modules
- TailwindCSS 4
- MySQL 8+
- mysql2 with parameterized SQL
- Server-side HTTP-only sessions
- Node crypto/scrypt authentication
- npm
- Playwright planned for production E2E coverage

## Architecture
Backend: `Route Handler → authentication/validation → service → repository/transaction → MySQL`.
Frontend: server-first rendering with client components only where interaction requires them.
The client is never authoritative for pricing, inventory, checkout, authentication, or order totals.

## Database
Existing MySQL schema is preserved. It includes users, sessions, catalog, variants, images, inventory, addresses, carts, orders, payments, coupons, favorites, reviews and audit logs, with additional lifecycle/promotion/shipping migrations.

Important rules:
- Monetary values are integer amounts.
- Inventory uses `reserved_quantity`.
- Orders retain historical product/price/shipping snapshots.
- Favorites are unique per user/product.
- Reviews are moderated and limited to eligible purchases.
- Sale pricing uses variant `price` and `compare_at_price`.

## Authentication / Authorization
- HTTP-only `ecom_session` cookie.
- Server-side sessions.
- scrypt password hashing.
- RBAC: CUSTOMER, ADMIN, SUPER_ADMIN.
- Customer ownership is enforced server-side.
- Logout revokes the current server-side session.
- Password changes revoke existing sessions.
- Admin services independently enforce roles.
- Reconciliation cron requires Bearer authentication using `RECONCILIATION_SECRET` or Vercel `CRON_SECRET`, with timing-safe token comparison.

## Storefront Completed
- Light-first RTL global shell
- Responsive header/footer/navigation
- Homepage
- Product discovery/search/filter/sort/pagination
- Category and brand pages
- Product detail, variants and inventory availability
- Favorites/wishlist
- Reviews and moderation flow
- Discount/original-price presentation
- Cart
- Customer addresses
- Province-aware shipping
- Transactional checkout/order creation
- Customer order/payment-unavailable state

Canonical wishlist: `/account/wishlist`; `/favorites` remains a compatibility redirect.

## Admin Completed
- Product CRUD
- Product image management and URL validation
- Product variants/SKUs
- Brand/category assignment
- Brand/category CMS
- Discount controls
- Review moderation
- Inventory management
- Order management
- Dashboard metrics

## Production Hardening Verified
- Secure HTTP-only sessions and logout revocation
- Server-side RBAC
- Transactional checkout
- Atomic inventory reservation/release
- Centralized API responses/errors
- Global security headers
- Vercel reservation-reconciliation cron every 5 minutes
- Hardened reconciliation authentication
- Payment-disabled mode without fake payment success
- Admin image URL protocol validation
- No obvious TODO/FIXME/debugger/console-log leftovers found in cleanup scan

## E2E Testing
- Added Playwright dependency and npm scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:headed`, `test:e2e:report`.
- Playwright configuration and critical-flow test suite still need to be added and installed locally with npm before execution.
- Tests must use a dedicated test database/environment and must never mutate production data.

## Remaining Release-Candidate Work
1. Run fresh `npm install`, `npm run lint` and `npm run build` from latest `main` checkout.
2. Add Playwright configuration and production-critical E2E tests.
3. Verify deployed reservation reconciliation lifecycle.
4. Final rate-limiting/CSRF/security review where applicable.
5. Performance/SEO audit.
6. Production deployment verification.
7. Final page-by-page mobile/RTL/loading/error/empty-state QA.
8. Payment gateway adapter/callback verification once a real provider is supplied.

## Development Rules
1. Inspect existing code before creating architecture.
2. Prefer canonical services/repositories over duplicates.
3. Never fake payment success.
4. Keep customer ownership server-side.
5. Keep prices/inventory/order totals server-authoritative.
6. Update this ledger after major milestones.
7. This repository and ledger are the continuity source of truth.
