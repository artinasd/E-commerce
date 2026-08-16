# PROJECT LEDGER

## Project
Iranian Persian E-Commerce Platform

Production-oriented Persian RTL e-commerce for Iranian customers. Direction: lighter, faster, cleaner and more modern than conventional marketplace UX, inspired by leading Iranian marketplaces without copying them.

## Current Version
0.9.0 — Storefront discovery + purchase journey + favorites foundation

## Current Development Phase
Phase 7 — Customer storefront and purchase journey

## Repository
`artinasd/E-commerce` — branch `main`

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

## Canonical Structure
```text
src/
├── app/
│   ├── api/
│   │   ├── account/
│   │   ├── addresses/
│   │   ├── auth/
│   │   ├── brands/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── checkout/
│   │   ├── favorites/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── products/
│   │   └── shipping/
│   ├── brands/page.js
│   ├── categories/page.js
│   ├── favorites/page.js
│   ├── products/page.js
│   ├── products/[slug]/page.js
│   ├── cart/
│   ├── checkout/
│   ├── orders/[id]/
│   └── page.js
├── components/storefront/
│   ├── Header.js
│   ├── Footer.js
│   ├── ProductCard.js
│   ├── HomeSections.js
│   ├── AddToCart.js
│   ├── CheckoutForm.js
│   └── FavoriteButton.js
├── lib/auth/
└── server/
    ├── account/
    ├── address/
    ├── auth/
    ├── catalog/
    ├── cart/
    ├── checkout/
    ├── favorites/
    ├── orders/
    ├── payments/
    └── db/repositories/
```

## Database
`database/migrations/001_initial_schema.sql` defines users, sessions, categories, brands, products, product_variants, attributes, attribute_values, product_attributes, product_images, inventory, addresses, carts, cart_items, orders, order_items, payments, coupons, order_coupons, favorites, reviews and audit_logs.

Additional migrations cover payment/inventory lifecycle, shipping methods, payment integrity, promotions and shipping.

Important rules:
- Monetary values are integer amounts.
- Inventory is stored separately and reservations are tracked with `reserved_quantity`.
- Orders store historical shipping/product/price snapshots.
- Favorites are unique per `(user_id, product_id)`.
- Reviews support 1–5 ratings and moderation states.

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

Product discovery supports search, category, brand, pagination, sorting, minimum price, maximum price and in-stock filtering.

### Cart
`GET /api/cart`
`POST /api/cart/items`
`PATCH /api/cart/items/[itemId]`
`DELETE /api/cart/items/[itemId]`

### Addresses
`GET /api/addresses`
`POST /api/addresses`
`GET /api/addresses/[id]`
`PATCH /api/addresses/[id]`
`DELETE /api/addresses/[id]`
`POST /api/addresses/[id]/default`

### Checkout / Shipping
`POST /api/checkout`
`GET /api/shipping/methods`

Checkout is transactional and server-side. Inventory is revalidated and reserved during order creation. Shipping uses the canonical shipping-method/pricing model.

### Orders
Customer-scoped order retrieval/list architecture exists. `/api/orders/[id]` only exposes the authenticated customer's order.

### Payments
Payment records and provider abstraction exist. No gateway is configured yet by design. When no provider is configured, the system does not fake success; it returns a controlled payment-unavailable state. Gateway adapters can be added later without redesigning orders/checkout.

### Favorites
`GET /api/favorites`
`GET /api/favorites/[productId]`
`POST /api/favorites/[productId]`

Favorites are customer-scoped and backed by the existing `favorites` table.

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
- Cart
- Customer addresses
- Province-aware shipping
- Checkout UI and transactional order creation
- Customer order detail/payment-unavailable state
- Favorites API, favorite button and `/favorites` page

## Current Storefront Gaps
- Reviews UI/API/service is not yet implemented despite the database table existing.
- Customer account dashboard/profile/order-history UI needs a complete audit.
- Category/brand detail pages can be enriched further.
- Product detail needs richer specifications, delivery information, reviews and related products.
- Mobile navigation/search UX needs refinement.
- Loading/error/empty-state polish and accessibility need a final pass.

## Admin
Admin/CMS remains to be audited and implemented where genuinely missing.

## Production Hardening Remaining
- Automated tests
- Full end-to-end checkout tests
- Payment gateway adapter + callback verification when credentials/provider are supplied
- Reservation expiry/release background lifecycle verification
- Security audit/rate limiting/CSRF review where applicable
- Performance/SEO audit
- Production deployment verification

## Recent Commits
- Product discovery price/stock filters
- Favorites repository/service/API/UI
- Public categories page
- Public brands page
- Checkout/address integration
- Order architecture cleanup
- Payment-ready/no-gateway flow

## Development Rules
1. Inspect existing code before creating new architecture.
2. Prefer canonical existing services/repositories over duplicates.
3. Never fake payment success.
4. Keep customer data ownership enforced server-side.
5. Keep prices/inventory/order totals authoritative on the server.
6. Update this ledger after every major architectural or feature milestone.
