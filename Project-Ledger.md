# PROJECT LEDGER

## Project Name
Iranian Persian E-Commerce Platform

## Project Description
Production-oriented Persian RTL e-commerce platform for Iranian customers. The product direction is inspired by the breadth and usability of leading Iranian marketplaces, but intentionally aims for a lighter, faster, cleaner, more modern, and more distinctive experience.

## Current Version
0.8.0 — Storefront + transactional checkout foundation

## Current Development Phase
Phase 7 — Customer storefront and purchase journey

## Current Mode
MODE A — GITHUB WRITE MODE

## GitHub Repository
`artinasd/E-commerce`

## Current Branch
`main`

## Latest Commit
This ledger update is the latest verified repository write.

## Architecture Summary
Next.js App Router full-stack application using React, JavaScript, TailwindCSS, Next.js Route Handlers, raw parameterized SQL through `mysql2`, relational MySQL persistence, application-managed HTTP-only sessions, RBAC, modular repositories/services, and a custom RTL-first storefront design system.

Backend flow: `Route Handler → auth/validation → service → repository/transaction → MySQL`.
Frontend flow: `Server Component → server API/data source → reusable storefront components → client interaction only where required`.
The client is not authoritative for pricing, inventory, cart persistence, authentication, or order creation.

## Technology Stack
- React 19
- Next.js 16 App Router
- JavaScript / ES6+
- TailwindCSS 4
- Next.js Route Handlers
- MySQL 8+
- `mysql2`
- Node `crypto` / scrypt
- npm
- Git
- GitHub

## Folder Structure
```text
E-commerce/
├── .github/
├── database/
│   ├── migrations/001_initial_schema.sql
│   ├── seeds/
│   └── README.md
├── docs/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── account/
│   │   │   ├── auth/
│   │   │   ├── brands/
│   │   │   ├── categories/
│   │   │   ├── cart/
│   │   │   ├── checkout/route.js
│   │   │   ├── health/route.js
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── addresses/route.js
│   │   ├── products/page.js
│   │   ├── products/[slug]/page.js
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   ├── components/storefront/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── ProductCard.js
│   │   ├── HomeSections.js
│   │   └── AddToCart.js
│   ├── lib/auth/
│   │   ├── password.js
│   │   └── session.js
│   └── server/
│       ├── account/
│       ├── address/service.js
│       ├── api/
│       ├── auth/
│       ├── catalog/
│       ├── cart/
│       ├── checkout/service.js
│       └── db/
│           ├── connection.js
│           ├── errors.js
│           └── repositories/
│               ├── auth.js
│               ├── catalog.js
│               ├── cart.js
│               ├── addresses.js
│               ├── checkout.js
│               └── orders.js
├── tests/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
└── Project-Ledger.md
```

## Database Schema
The verified migration is `database/migrations/001_initial_schema.sql` and defines:
users, sessions, categories, brands, products, product_variants, attributes, attribute_values, product_attributes, product_images, inventory, addresses, carts, cart_items, orders, order_items, payments, coupons, order_coupons, favorites, reviews, and audit_logs.

Important verified facts:
- Address table is `addresses`.
- Inventory is a separate `inventory` table keyed by `variant_id`.
- Product variants do not contain stock quantities directly.
- Orders contain historical shipping snapshots.
- Order items contain historical product/SKU/price/quantity snapshots.

## Database Relationships
- User → Sessions, Addresses, Cart, Orders, Favorites, Reviews, Audit Logs
- Category → child Categories and Products
- Brand → Products
- Product → Variants, Images, Attributes, Reviews
- Variant → Inventory and Cart/Order Items
- Cart → Cart Items
- Order → Order Items, Payments, Coupons

## Database Design Decisions
- InnoDB for transactional integrity.
- `utf8mb4` for Persian/Unicode support.
- Monetary values are integer amounts.
- SQL is parameterized.
- Foreign keys and unique constraints protect integrity.
- Indexes cover major catalog/account/cart/order lookups.
- Soft deletion follows the existing schema.
- Addresses are ownership-scoped; the schema has no address `deleted_at`.
- Checkout uses a database transaction and revalidates inventory on the server.
- Checkout increments `inventory.reserved_quantity` and removes cart items atomically.
- Orders begin `PENDING` / `UNPAID`; payment integration and reservation release rules remain outstanding.

## Authentication Strategy
Application-managed sessions using the `sessions` table and secure HTTP-only `ecom_session` cookie. Passwords use Node `crypto.scrypt`; raw session tokens are not persisted. Sessions expire after 30 days. Cookies use HttpOnly, SameSite=Lax, Path=/, and Secure in production. `requireUser()` and `requireRole()` enforce server-side authorization.

## Authorization Strategy
RBAC roles: CUSTOMER, ADMIN, SUPER_ADMIN. Customer resources are scoped by authenticated user ID. Administrative authorization remains server-side.

## API Routes — Verified Implemented
Authentication: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `POST /api/auth/password`.
Catalog: `GET /api/products`, `GET /api/products/[slug]`, `GET /api/categories`, `GET /api/categories/[slug]`, `GET /api/brands`, `GET /api/brands/[slug]`.
Cart: `GET /api/cart`, `POST /api/cart/items`, `PATCH /api/cart/items/[itemId]`, `DELETE /api/cart/items/[itemId]`.
Account: existing profile/address APIs plus `GET /api/addresses` and `POST /api/addresses`.
Checkout: `POST /api/checkout`.
Orders: existing order read/list repository and API architecture is present.

## Business Logic Completed
- MySQL connection pool and transactions
- Parameterized repository queries
- Authentication/session management
- Catalog reads/search/sorting/pagination
- Inventory availability calculation
- Cart create/read/add/update/remove
- Product detail aggregation with variants/images
- Customer address validation and creation
- Atomic cart-to-order conversion
- Server-side inventory revalidation and reservation during checkout
- Order historical snapshots
- Shared API response/error handling

## Storefront UI Completed
Global shell: RTL document, design tokens, light-first visual system, header, responsive navigation, search entry, account/cart entry points, footer, focus treatment, reduced-motion support.

Homepage: editorial hero, category discovery, API-driven newest products, service/trust section, responsive product grid.

Product discovery: `/products`, server-rendered listing, search, sorting, pagination, filter sidebar foundation, empty/error states, responsive grid.

Product detail: `/products/[slug]`, dynamic metadata, breadcrumbs, gallery, brand/category, description, variants, inventory-aware availability, quantity selector, real cart API integration, not-found state.

Cart: server-backed cart UI with quantity/removal synchronization and authentication handling.

## Pages Completed
- `/`
- `/products`
- `/products/[slug]`
- `/cart`

Checkout and customer order pages remain to be built in the UI.

## Admin Pages Completed
None.

## Shared Components
- `Header`
- `Footer`
- `ProductCard`
- `HomeSections`
- `AddToCart`

## Utilities
Database query/transaction helpers, password hashing, session management, API response/error normalization, catalog/cart/address/checkout validation, and Persian number formatting at presentation boundaries.

## Middleware
No global middleware currently required. Sensitive operations enforce authentication inside server route/service boundaries.

## Environment Variables
`NEXT_PUBLIC_APP_URL`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_CONNECTION_LIMIT`, `AUTH_SECRET`.
No production secrets are stored in the repository.

## Dependencies Installed / Declared
next, react, react-dom, mysql2, tailwindcss, @tailwindcss/postcss, postcss, eslint, eslint-config-next. No ORM or external component library.

## Configuration Files
`.env.example`, `.gitignore`, `eslint.config.mjs`, `next.config.mjs`, `postcss.config.mjs`, `package.json`.

## Coding Conventions
JavaScript only; ES6+; Server Components by default; Client Components only for interaction; repository owns SQL; services own business rules; route handlers own HTTP concerns; parameterized SQL; server authoritative for prices/stock/identity/permissions/order creation; no fake production APIs.

## Naming Conventions
Components PascalCase; functions/variables camelCase; database snake_case; API resource paths lowercase plural where applicable; migrations numbered descriptive names.

## Important Design Decisions
1. GitHub is the source of truth.
2. MODE A is active and verified.
3. `artinasd/E-commerce` is implemented directly in GitHub.
4. JavaScript, npm, MySQL, `mysql2`, raw SQL, and no ORM are mandatory.
5. Persian RTL is first-class.
6. Light-first UI is the visual direction.
7. Storefront code uses established backend APIs rather than duplicating business logic.
8. Prices come from server-side variants.
9. Inventory comes from `inventory`, not variants.
10. Checkout creates a `PENDING`/`UNPAID` order and reserves stock transactionally.
11. Payment processing is not simulated.
12. Address/order behavior was added only after verifying the actual database schema.

## Git Workflow
Current branch is `main`. Logical commits are used. Every GitHub write returns a real commit SHA. Existing files are fetched before replacement. No push/PR claim is made without an actual operation.

## Completed Tasks
Repository/capability inspection; application bootstrap; MySQL schema/database layer; authentication; catalog backend; cart backend; customer address foundation; transactional checkout backend; global storefront shell; homepage; product listing; product detail; cart UI.

## Current Task
Implement the customer purchase journey UI: `/checkout`, using `POST /api/checkout` and `GET/POST /api/addresses`.

## Next Planned Tasks
1. `/checkout` UI with address selection and new-address form.
2. Order confirmation page.
3. Customer order list/detail UI.
4. Address editing/default-address UI.
5. Payment gateway abstraction and Iranian provider integration.
6. Inventory reservation release/expiry policy.
7. Favorites and reviews.
8. Admin dashboard and management flows.
9. Automated tests.
10. Security/performance/accessibility audit.
11. Deployment/CI/CD.

## Known Issues
- No live MySQL database has been executed from this environment.
- npm/build/lint/tests have not been executed through the available GitHub connector.
- Checkout reserves inventory but payment settlement/release/expiry is not implemented.
- Address editing/default-address update API remains incomplete.
- Payment gateway integration is not implemented.
- Order cancellation/refund state transitions are not complete.
- Automated tests are outstanding.
- Process-local rate limiting is insufficient for horizontally scaled production.

## Technical Debt
Migration runner/tooling; seed data; runtime/integration tests; distributed rate limiting; payment idempotency/webhook processing; inventory reservation expiry/release worker; email/SMS verification and password reset; full admin authorization surface.

## Outstanding Features
Checkout UI; payment gateway; order history/detail UI; address management UI; favorites; reviews; admin dashboard; product/category/brand management; inventory administration; coupons; audit/operations UI; automated tests; CI/CD/deployment verification.

## Future Improvements
Iranian payment gateways, SMS verification, shipping-provider integrations, advanced search/indexing, recommendations, wallet/loyalty/gift cards, observability, distributed caching/rate limiting, and marketplace functionality only if later required.

## Deployment Status
Not started.

## Testing Status
No live runtime or automated suite has been executed through the current GitHub environment. Source-level consistency has been reviewed after implementation.

## Repository Verification Status
MODE A is verified. Files and writes are being performed directly against `artinasd/E-commerce` on `main`. The database migration was directly inspected from its Git blob and confirmed to contain order, address, cart, and separate inventory tables.

## Notes For Future Continuation
Do not rebuild existing functionality. Continue from the repository and this ledger. Treat `database/migrations/001_initial_schema.sql` as the schema contract. Do not invent a second order/address/cart model. The checkout UI must consume the real checkout/address APIs. Do not claim payment success until a real provider integration exists. Before production deployment, implement payment idempotency, reservation expiry/release, automated tests, distributed rate limiting, and runtime verification.

## Conversation Summary
The user requested a production-quality Persian RTL Iranian e-commerce platform with a modern, lightweight UI inspired by major Iranian marketplaces but not copied. GitHub write capability is available and the repository is the source of truth. The project was bootstrapped and the backend foundation was built first. The storefront shell, homepage, product discovery, product detail, and cart were implemented. During checkout planning, the actual migration was re-inspected and confirmed to contain `addresses`, `orders`, `order_items`, `payments`, and a separate `inventory` table. Rather than creating a duplicate schema, a customer address service/repository and an atomic checkout repository/service were added. Checkout validates that the authenticated user owns the selected address, locks the cart, verifies product/variant availability and stock, creates a historical order snapshot, reserves inventory, and clears cart items inside one transaction. The next exact task is the customer-facing `/checkout` page.
