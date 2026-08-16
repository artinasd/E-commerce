# PROJECT LEDGER

## Project Name
Iranian Persian E-Commerce Platform

## Project Description
Production-quality Persian RTL e-commerce platform for Iranian users, inspired by the breadth and usability of major Iranian marketplaces while intentionally pursuing a more modern, refined, lightweight, and distinctive UX.

## Current Version
0.4.0 — Authentication Foundation

## Current Development Phase
Phase 5 — Authentication Foundation

## Current Mode
MODE A — GITHUB WRITE MODE

## GitHub Repository
`artinasd/E-commerce`

## Current Branch
`main`

## Latest Commit
`121e814f3e35ca7de199eec14342554b5ffd2a4a` — Harden current-session API response handling

## Architecture Summary
Next.js App Router full-stack application using React, JavaScript, TailwindCSS, Next.js Route Handlers, raw parameterized SQL through `mysql2`, relational MySQL persistence, server-managed session authentication, RBAC, modular repositories/services, and a custom RTL-first design system.

## Technology Stack
- React
- Next.js App Router
- JavaScript / ES6+
- TailwindCSS
- Next.js Route Handlers
- MySQL
- `mysql2`
- Node.js `crypto` / scrypt
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
│   │       └── auth/
│   │           ├── register/route.js
│   │           ├── login/route.js
│   │           ├── logout/route.js
│   │           ├── me/route.js
│   │           └── password/route.js
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   │   └── auth/
│   │       ├── password.js
│   │       └── session.js
│   ├── middleware/
│   └── server/
│       ├── auth/
│       │   ├── rate-limit.js
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
- Monetary values use integer amounts rather than floating point.
- Foreign keys protect relational integrity.
- Unique constraints protect slugs, SKUs, coupon codes, and user identifiers.
- Indexes target catalog, account, cart, order, and operational queries.
- Orders retain historical shipping/product snapshots.
- Soft deletion is used selectively for catalog/user entities.
- Multi-step business operations use transactions.
- Migrations are numbered and should become immutable after shared deployment.

## Authentication Strategy
Server-managed session authentication using the `sessions` table and a secure HTTP-only cookie named `ecom_session`.
- Passwords are hashed with Node `crypto.scrypt` using a random salt.
- Raw session tokens are never stored in the database; SHA-256 token hashes are stored.
- Sessions expire after 30 days.
- Session cookies use `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` in production.
- Sessions can be individually revoked or revoked for all sessions belonging to a user.
- Password changes revoke all existing sessions and clear the current cookie.

## Authorization Strategy
Server-enforced RBAC with:
- CUSTOMER
- ADMIN
- SUPER_ADMIN

`requireUser()` and `requireRole()` provide server-side authorization primitives.

## API Routes
Implemented:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/password`

Planned namespaces:
- `/api/products`
- `/api/categories`
- `/api/brands`
- `/api/cart`
- `/api/checkout`
- `/api/orders`
- `/api/users`
- `/api/addresses`
- `/api/favorites`
- `/api/reviews`
- `/api/inventory`
- `/api/admin`

## Authentication Business Logic Completed
- Registration
- Login
- Logout
- Current-user resolution
- Password change
- Session creation
- Session revocation
- Revoke-all-sessions
- Password hashing and verification
- Registration/login/password-change validation
- Authentication rate-limit foundation
- Generic credential error responses

## Business Logic Completed
- MySQL connection pooling
- Parameterized query helper
- Transaction helper
- User lookup repository
- Product/catalog read repository
- Category and brand read repositories
- Inventory lookup/reservation/release/decrement operations
- Cart creation/read/add/update/remove operations
- Order read/list/create repository operations
- Shared database/domain error types
- Central repository exports

## UI Components Completed
None beyond the initial application shell from Phase 2.

## Pages Completed
Initial Next.js home/application shell only.

## Admin Pages Completed
None.

## Shared Components
Initial shell only; feature component system remains outstanding.

## Utilities
- Database query helper
- Database transaction helper
- Shared database/domain error normalization
- Password hashing/verification
- Session cookie management
- Authentication validation
- Authentication rate limiting

## Middleware
Not yet implemented. Route-level/server-side authentication primitives are currently used.

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

No new third-party authentication dependency was added; authentication uses Node crypto and application-level sessions.

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
- Public APIs return generic authentication errors where appropriate
- Sensitive API responses are marked `no-store`

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
14. Authentication uses application-managed sessions instead of introducing an external authentication dependency at this stage.
15. Authentication API responses do not expose raw database or internal implementation errors.

## Git Workflow
- `main` is the current default branch.
- Logical commits are used.
- Repository state is verified after writes.
- Feature branches may be introduced for substantial feature work.
- No GitHub operation is claimed without verification.

## Completed Tasks
- Repository inspection and capability verification
- Initial project bootstrap
- Initial Next.js application structure
- Environment contract
- Initial database architecture
- Initial MySQL schema migration
- MySQL connection pool
- Parameterized query helper
- Transaction helper
- Database setup documentation
- User repository
- Catalog repository
- Inventory repository
- Cart repository
- Order repository
- Shared database error classes
- Repository barrel exports
- Password hashing and verification
- Session persistence
- Session cookie management
- Authentication service
- Authentication validation
- Authentication rate-limit foundation
- Registration API
- Login API
- Logout API
- Current-session API
- Password-change API

## Current Task
Phase 5 authentication foundation completed at the source/API level.

## Next Planned Task
Phase 6 — Backend/API foundation: establish consistent API response/error infrastructure, request parsing, authentication/authorization guards, rate-limit integration, and reusable service/controller conventions before implementing storefront feature APIs.

## Known Issues
- MySQL schema has not been executed against a real database in this environment.
- npm dependencies have not been installed/executed in this environment.
- No automated test run has been performed yet.
- Authentication runtime behavior has not been exercised against a live database.
- In-memory authentication rate limiting is process-local and should be replaced/augmented with shared infrastructure before horizontal production scaling.

## Technical Debt
- Migration runner/tooling is not yet implemented.
- Database seed data is not yet implemented.
- Automated schema verification is not yet implemented.
- Repository-level integration tests remain outstanding.
- Distributed rate limiting is outstanding for multi-instance deployment.
- Email/SMS verification and password reset flows are outstanding.

## Outstanding Features
- Customer storefront
- Product search/filtering
- Product detail pages
- Cart UI/API integration
- Checkout
- Iranian payment gateway integration
- Order tracking
- Customer account area
- Reviews
- Favorites
- Admin dashboard
- Product/category/brand management
- Inventory administration
- Coupon management
- Audit/operations tooling

## Future Improvements
- Iranian payment gateway integration
- SMS services
- shipping integrations
- advanced search
- recommendations
- loyalty
- wallet
- gift cards
- marketplace functionality

## Deployment Status
Not started.

## Testing Status
Not started. Source-level consistency review performed after authentication writes, but no runtime test execution is available through the current GitHub connector.

## Repository Verification Status
Verified the authentication service and all authentication route files after writes. Latest verified `main` commit is `121e814f3e35ca7de199eec14342554b5ffd2a4a`.

## Notes For Future Continuation
Do not recreate the project. Continue from Phase 6. The database migration is the schema contract. Repositories must remain the direct SQL access layer for application services. Do not expose raw database errors through public APIs. Before production deployment, replace process-local rate limiting with shared infrastructure appropriate to the deployment topology and implement email/SMS verification and password reset flows.

## Conversation Summary
The user requested a production-quality Persian RTL Iranian e-commerce platform with a modern, lightweight UI inspired by but not copied from major Iranian e-commerce products. The GitHub repository `artinasd/E-commerce` was verified as empty and writable. The initial Next.js foundation was created directly in GitHub. Phase 4 established the relational MySQL schema, database connection/transaction abstraction, environment contract, and server-side repositories for users, catalog, inventory, carts, and orders. Phase 5 then implemented password hashing, secure application-managed sessions, authentication services, validation, rate-limit foundations, and the complete authentication API surface. The current project is ready to move into the reusable backend/API infrastructure phase.
