# PROJECT LEDGER

## Project Name
Iranian Persian E-Commerce Platform

## Project Description
Production-oriented Persian RTL e-commerce platform for Iranian customers, inspired by the breadth and usability of major Iranian marketplaces while intentionally pursuing a lighter, faster, more modern, refined, and distinctive UX.

## Current Version
0.6.0 — Backend commerce foundation

## Current Development Phase
Phase 6 — Backend/API foundation and customer commerce services

## Current Mode
MODE A — GITHUB WRITE MODE

## GitHub Repository
`artinasd/E-commerce`

## Current Branch
`main`

## Latest Commit
`e8c2ad429aae9705e9b760be8d6475afa5e38a3d` — Re-export centralized API error handling for existing route imports

## Architecture Summary
Next.js App Router full-stack application using React, JavaScript, TailwindCSS, Next.js Route Handlers, raw parameterized SQL through `mysql2`, relational MySQL persistence, server-managed session authentication, RBAC, modular repositories/services, and a custom RTL-first design system. The backend follows Route Handler → validation → service → repository/transaction → MySQL separation.

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
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── seeds/
│   └── README.md
├── docs/
├── public/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── account/
│   │       │   ├── profile/route.js
│   │       │   └── addresses/
│   │       │       ├── route.js
│   │       │       └── [id]/route.js
│   │       ├── auth/
│   │       │   ├── register/route.js
│   │       │   ├── login/route.js
│   │       │   ├── logout/route.js
│   │       │   ├── me/route.js
│   │       │   └── password/route.js
│   │       ├── brands/
│   │       ├── categories/
│   │       ├── cart/
│   │       ├── health/route.js
│   │       ├── orders/
│   │       └── products/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   │   └── auth/
│   │       ├── password.js
│   │       └── session.js
│   └── server/
│       ├── account/
│       │   ├── service.js
│       │   └── validation.js
│       ├── api/
│       │   ├── errors.js
│       │   └── response.js
│       ├── auth/
│       │   ├── rate-limit.js
│       │   ├── service.js
│       │   └── validation.js
│       ├── catalog/
│       │   ├── service.js
│       │   └── validation.js
│       ├── cart/
│       │   ├── service.js
│       │   └── validation.js
│       ├── orders/
│       │   ├── service.js
│       │   └── validation.js
│       └── db/
│           ├── connection.js
│           ├── errors.js
│           └── repositories/
│               ├── index.js
│               ├── users.js
│               ├── auth.js
│               ├── catalog.js
│               ├── inventory.js
│               ├── cart.js
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
Implemented in `database/migrations/001_initial_schema.sql`:
- users
- sessions
- categories
- brands
- products
- product_variants
- attributes
- attribute_values
- product_attributes
- product_images
- inventory
- addresses
- carts
- cart_items
- orders
- order_items
- payments
- coupons
- order_coupons
- favorites
- reviews
- audit_logs

Important verified schema fact: the address table is named `addresses`, not `user_addresses`, and it currently has no `deleted_at` column. Account services were corrected to use the verified `addresses` schema rather than inventing a table.

## Database Relationships
- User → Sessions, Addresses, Cart, Orders, Favorites, Reviews, Audit Logs
- Category → child Categories and Products
- Brand → Products
- Product → Variants, Images, Attributes, Reviews
- Variant → Inventory and Cart/Order Items
- Cart → Cart Items
- Order → Order Items, Payments, Coupons

## Database Design Decisions
- InnoDB is used for transactional integrity.
- `utf8mb4` is the database character-set foundation.
- Monetary values are stored as integer amounts.
- Foreign keys protect relational integrity.
- Unique constraints protect slugs, SKUs, coupon codes, and user identifiers.
- Indexes target catalog, account, cart, order, and operational queries.
- Orders retain historical shipping/product snapshots.
- Soft deletion is used selectively for users and catalog entities where defined by the schema; addresses currently use ownership-scoped deletion because the verified schema does not define soft deletion for addresses.
- Multi-step business operations use transactions.
- Migrations are numbered and should be treated as immutable after shared deployment.
- Checkout locks inventory rows and revalidates available inventory inside the order transaction.

## Authentication Strategy
Server-managed session authentication using the `sessions` table and secure HTTP-only cookie `ecom_session`.
- Passwords are hashed with Node `crypto.scrypt` using random salts.
- Raw session tokens are never stored in the database; SHA-256 token hashes are stored.
- Sessions expire after 30 days.
- Session cookies use HttpOnly, SameSite=Lax, Path=/, and Secure in production.
- Sessions can be individually revoked or revoked for all sessions belonging to a user.
- Password changes revoke all existing sessions and clear the current cookie.

## Authorization Strategy
Server-enforced RBAC with CUSTOMER, ADMIN, and SUPER_ADMIN roles. `requireUser()` and `requireRole()` provide server-side authorization primitives. Customer cart/order/account APIs scope records to the authenticated user's ID.

## API Routes
Implemented:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/password`
- `GET /api/health`
- `GET /api/products`
- `GET /api/products/[slug]`
- `GET /api/categories`
- `GET /api/categories/[slug]`
- `GET /api/brands`
- `GET /api/brands/[slug]`
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/[id]`
- `DELETE /api/cart/items/[id]`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/[id]`
- `GET /api/account/profile`
- `PATCH /api/account/profile`
- `GET /api/account/addresses`
- `POST /api/account/addresses`
- `DELETE /api/account/addresses/[id]`

Planned namespaces:
- `/api/favorites`
- `/api/reviews`
- `/api/checkout` when a dedicated payment/checkout state machine is needed
- `/api/admin`
- `/api/inventory`
- payment provider callbacks/webhooks

## Business Logic Completed
- MySQL connection pooling
- Parameterized query helper
- Transaction helper
- User lookup repository
- Catalog read repository
- Category/brand read repositories
- Inventory lookup/reservation/release/decrement primitives
- Cart creation/read/add/update/remove operations
- Order read/list repository operations
- Transactional checkout/order creation
- Server-side inventory revalidation and locking during checkout
- Order historical item snapshots
- Customer profile read/update
- Customer address list/create/delete
- Shared API response/error normalization
- Request validation for catalog, cart, orders, and account features
- Authentication rate-limit foundation

## UI Components Completed
Initial application shell only. Production storefront component system remains outstanding.

## Pages Completed
Initial Next.js application shell only. Storefront/account/admin pages remain outstanding.

## Admin Pages Completed
None.

## Shared Components
Initial shell only; feature component system remains outstanding.

## Utilities
- Database query helper
- Database transaction helper
- Database/domain error normalization
- Password hashing/verification
- Session cookie management
- Authentication validation
- Authentication rate limiting
- API success/error response helpers
- Catalog query parsing
- Cart/order/account validation

## Middleware
Not yet implemented. Route-level/server-side authentication primitives are currently used. Middleware may be introduced later for broad request policies, but authorization remains enforced at the server boundary.

## Environment Variables
- `NEXT_PUBLIC_APP_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_CONNECTION_LIMIT`
- `AUTH_SECRET`

No production secrets are stored in GitHub.

## Dependencies Installed
Declared:
- next
- react
- react-dom
- mysql2
- tailwindcss
- @tailwindcss/postcss
- postcss
- eslint
- eslint-config-next

No ORM or external authentication package is used.

## Configuration Files
- `.env.example`
- `.gitignore`
- `eslint.config.mjs`
- `next.config.mjs`
- `postcss.config.mjs`
- `package.json`

## Coding Conventions
- JavaScript only
- ES6+
- Feature-oriented organization
- Separation of concerns
- Reusable components
- Parameterized SQL
- Server-side authorization
- Explicit error handling
- No ORM
- Repository functions encapsulate SQL access
- Transaction boundaries are explicit
- Public APIs avoid exposing raw database errors
- Sensitive API responses use `Cache-Control: no-store`

## Naming Conventions
- React components: PascalCase
- Functions/variables: camelCase
- API resources: lowercase plural resource paths
- Database naming: snake_case
- Migration files: sequential numeric prefix plus descriptive name

## Important Design Decisions
1. GitHub is the source of truth.
2. MODE A is active and verified.
3. Repository `artinasd/E-commerce` is being built directly in GitHub.
4. JavaScript is mandatory.
5. npm is mandatory.
6. MySQL is mandatory.
7. Raw SQL is mandatory.
8. `mysql2` is used for promise-based MySQL access.
9. No ORM is used.
10. Next.js App Router is the full-stack foundation.
11. Persian RTL is a first-class requirement.
12. The application is initially single-store rather than marketplace/multi-vendor.
13. Security, accessibility, performance, and production concerns remain first-class requirements.
14. Authentication uses application-managed sessions.
15. Checkout prices are authoritative on the server and are never trusted from the client.
16. Inventory is authoritative in the `inventory` table, not `product_variants`.
17. Checkout locks inventory rows in deterministic variant order to reduce deadlock risk.
18. Existing route imports of API error handling are supported by a re-export from `response.js`.

## Git Workflow
- `main` is the current default branch.
- Logical commits are used.
- Repository state is verified after writes.
- Feature branches may be introduced for substantial feature work.
- No GitHub operation is claimed without verification.

## Completed Tasks
- Repository inspection and GitHub capability verification
- Initial project bootstrap
- Next.js application foundation
- Environment contract
- Initial relational MySQL schema
- MySQL connection pool and transactions
- Database documentation
- User, catalog, inventory, cart, and order repositories
- Password hashing and secure sessions
- Authentication services and complete authentication API
- API response/error foundation
- Catalog service and APIs
- Cart service and APIs
- Checkout/order service and APIs
- Customer profile/address service and APIs
- Schema reconciliation after detecting that the address table is `addresses`
- Checkout correction after detecting that inventory is stored separately from product variants
- API helper compatibility correction for existing numeric-status route calls

## Current Task
Backend commerce foundation has been implemented and reconciled against the verified initial database schema.

## Next Planned Task
Begin the customer-facing storefront architecture and implementation: global RTL layout, typography/design tokens, header/navigation, search, product listing, product detail, cart UI, account UI, and responsive mobile navigation. Backend feature work will continue only where a storefront feature requires it.

## Known Issues
- MySQL schema has not been executed against a real database in this environment.
- npm dependencies have not been installed/executed in this environment.
- No automated test suite has been executed yet.
- Runtime authentication, catalog, cart, account, and checkout behavior has not been exercised against a live database.
- In-memory authentication rate limiting is process-local and should be replaced/augmented with shared infrastructure before horizontal production scaling.
- Payment gateway integration is not implemented.
- Order cancellation/refund state transitions are not implemented yet.
- Address editing/default-address API is not implemented yet.

## Technical Debt
- Migration runner/tooling is not yet implemented.
- Database seed data is not yet implemented.
- Automated schema verification is not yet implemented.
- Repository-level integration tests remain outstanding.
- Distributed rate limiting is outstanding for multi-instance deployment.
- Email/SMS verification and password reset flows are outstanding.
- Payment webhook idempotency and provider integration remain outstanding.

## Outstanding Features
- Modern Persian RTL storefront
- Product search/filtering UI
- Product detail UI
- Cart UI
- Checkout UI
- Iranian payment gateway integration
- Order tracking/cancellation/refunds
- Customer account UI
- Address editing/default selection
- Favorites
- Reviews
- Admin dashboard
- Product/category/brand management
- Inventory administration
- Coupon management
- Audit/operations tooling
- Automated tests
- Deployment configuration and CI/CD validation

## Future Improvements
- Iranian payment gateways
- SMS verification
- shipping integrations
- advanced search/indexing
- recommendations
- loyalty/wallet/gift cards
- observability
- distributed caching/rate limiting
- marketplace functionality if requirements expand

## Deployment Status
Not started.

## Testing Status
Not started. Source-level consistency reviews have been performed after writes, including schema reconciliation, but no live runtime or automated test execution is currently available through the GitHub connector.

## Repository Verification Status
GitHub writes are verified on `main`. The latest verified commit is `e8c2ad429aae9705e9b760be8d6475afa5e38a3d`. The initial schema was directly inspected and confirmed to define `addresses` and a separate `inventory` table.

## Notes For Future Continuation
Do not recreate the project. Continue from the current repository. Treat `database/migrations/001_initial_schema.sql` as the current schema contract. Repositories remain the direct SQL access layer for services. Do not expose raw database errors through public APIs. Before production deployment, replace process-local rate limiting with shared infrastructure appropriate to the deployment topology and implement payment/webhook idempotency, verification flows, and automated tests. The storefront should be built against the already-established APIs rather than duplicating business logic in client components.

## Conversation Summary
The user requested a production-quality Persian RTL Iranian e-commerce platform with a modern, lightweight UI inspired by but not copied from major Iranian e-commerce products. The repository `artinasd/E-commerce` was verified as writable and became the source of truth. The project was bootstrapped directly in GitHub. The relational MySQL schema, database layer, authentication, catalog APIs, cart APIs, transactional checkout/order APIs, and customer profile/address APIs have now been implemented. During continuation, the database schema was re-inspected and two important inconsistencies were corrected: the account service had incorrectly referenced a nonexistent `user_addresses` table, while the verified schema uses `addresses`; and checkout had incorrectly treated inventory as a column on `product_variants`, while the verified schema stores stock in `inventory`. API response/error helpers were also hardened for existing route usage. The next major focus is the customer-facing storefront UI and its integration with the established backend.
