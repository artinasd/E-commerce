# PROJECT LEDGER

## Project
Iranian Persian E-Commerce Platform

Production-oriented Persian RTL e-commerce for Iranian customers. Direction: lighter, faster, cleaner and more modern than conventional marketplace UX, inspired by leading Iranian marketplaces without copying them.

## Current Version
0.9.5 — storefront mobile/navigation polish

## Current Development Phase
Phase 7 — Customer storefront and purchase journey / production hardening

## Repository
`artinasd/E-commerce` — branch `main`

## Latest Verified Commit
`77db220005208a0e4fd3c4030094e7bb610f9fe6` — `ui: use real category imagery on storefront home`

Previous immediate commit: `a486231d44852359e49ef7c3ea3d2d6172aade41` — `ui: refine mobile storefront navigation`.

## Stack
- Next.js 16 App Router
- React 19
- JavaScript / ES modules
- TailwindCSS 4
- MySQL 8+
- mysql2 with parameterized SQL
- Application-managed HTTP-only sessions
- Node crypto/scrypt authentication
- npm

## Architecture
Backend: `Route Handler → authentication/validation → service → repository/transaction → MySQL`.
Frontend: Server Components for data-heavy pages; Client Components only for interactive state/actions.
The client is never authoritative for pricing, inventory, cart persistence, authentication, checkout, or order creation.

## Database
`database/migrations/001_initial_schema.sql` defines users, sessions, categories, brands, products, product_variants, attributes, attribute_values, product_attributes, product_images, inventory, addresses, carts, cart_items, orders, order_items, payments, coupons, order_coupons, favorites, reviews and audit_logs.

Additional migrations cover payment/inventory lifecycle, shipping methods, payment integrity, promotions and shipping.

Important rules:
- Monetary values are integer amounts.
- Inventory is stored separately and reservations are tracked with `reserved_quantity`.
- Orders store historical shipping/product/price snapshots.
- Favorites are unique per `(user_id, product_id)`.
- Reviews support 1–5 ratings and moderation states.
- Product discounts use `product_variants.compare_at_price` as the original price and `product_variants.price` as the current sale price.

## Authentication / Authorization
- HTTP-only `ecom_session` cookie.
- Session records stored server-side.
- scrypt password hashing.
- RBAC: CUSTOMER, ADMIN, SUPER_ADMIN.
- Customer resources are scoped by authenticated user ID.
- Sensitive mutations enforce authorization server-side.

## Verified APIs
### Authentication
`POST /api/auth/register`
`POST /api/auth/login`
`POST /api/auth/logout`
`GET /api/auth/me`
`POST /api/auth/password`

### Catalog
`GET /api/products`
`GET /api/products/[slug]`
`GET /api/categories`
`GET /api/categories/[slug]`
`GET /api/brands`
`GET /api/brands/[slug]`

Product discovery supports search, category, brand, pagination, sorting, minimum price, maximum price and in-stock filtering. Storefront listing requests are now uncached so recently changed prices/discounts appear immediately. Active variant discount information is exposed for storefront presentation.

### Favorites
`GET /api/favorites`
`GET /api/favorites/[productId]`
`POST /api/favorites/[productId]`

### Reviews
`GET /api/products/[slug]/reviews`
`POST /api/products/[slug]/reviews`
`GET /api/products/[slug]/reviews/eligible`

Customers can rate and review delivered, paid purchases. The server verifies purchase eligibility and prevents duplicate reviews for the same purchased order item. New reviews enter the existing admin moderation queue as `PENDING`.

### Admin Catalog
`GET /api/admin/catalog/options`
`POST /api/admin/catalog/brands`
`POST /api/admin/catalog/categories`
`POST /api/admin/products/create`
`PATCH /api/admin/products/[id]`
`DELETE /api/admin/products/[id]`
`POST /api/admin/products/[id]/variants`
`PATCH /api/admin/products/[id]/variants/[variantId]`

The admin has a dedicated `/admin/catalog` CMS page for creating brands and categories, including optional slugs, descriptions, images/logos, category parents and sort order. The product creation UI consumes the same catalog options.

## Storefront Completed
- RTL/light-first global shell
- Responsive header/footer/navigation
- Homepage
- Product discovery
- Search
- URL-preserved filters
- Sorting
- Pagination
- Category and brand navigation pages
- Product detail
- Product variants and inventory-aware availability
- Product-card favorite action
- Product detail favorite action
- Customer review/rating form
- Review eligibility and moderation flow
- Visible product discount/original-price presentation
- Cart
- Customer addresses
- Province-aware shipping
- Checkout UI and transactional order creation
- Customer order detail/payment-unavailable state
- Favorites API and `/favorites` page

## Recent UI/UX Work Verified
- Storefront visual direction is light-first with neutral surfaces and restrained rose branding.
- Homepage composition and product-card hierarchy were previously redesigned.
- Product discovery and filters were recently redesigned.
- Mobile storefront navigation now exposes account/login access directly on small screens and keeps search/cart actions compact.
- Homepage category discovery now uses the real `categories.image_url` when present instead of always rendering a generated initial tile.
- The existing design intentionally avoids excessive rounded cards, dark surfaces and generic dashboard-style decoration.

## Admin Completed
- Product list/edit/delete/create flows
- Product image management
- Product variant/SKU management
- Brand/category assignment during product creation and editing
- Dedicated brand/category creation CMS
- Product variant price and compare-at-price discount controls
- Review moderation queue
- Live active-product metric on dashboard
- Inventory and order management

## Current Storefront Gaps
- Product detail can be enriched further with richer specifications, delivery information and related products.
- Mobile navigation/search UX has received a first refinement but still needs broader page-by-page responsive verification.
- Loading/error/empty-state polish and accessibility need a final pass.
- Image optimization warnings should be reviewed and migrated to `next/image` where practical without breaking arbitrary external image URLs.

## Production Hardening Remaining
- Run a fresh local lint/build from the latest `main` checkout and address any newly surfaced errors.
- Automated tests
- Full end-to-end checkout and review tests
- Payment gateway adapter + callback verification when credentials/provider are supplied
- Reservation expiry/release background lifecycle verification
- Security audit/rate limiting/CSRF review where applicable
- Performance/SEO audit
- Production deployment verification

## Development Rules
1. Inspect existing code before creating new architecture.
2. Prefer canonical existing services/repositories over duplicates.
3. Never fake payment success.
4. Keep customer data ownership enforced server-side.
5. Keep prices/inventory/order totals authoritative on the server.
6. Update this ledger after every major architectural or feature milestone.
7. The repository and this ledger are the continuity source of truth for future sessions.
