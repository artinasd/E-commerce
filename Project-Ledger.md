# PROJECT LEDGER

## Project Name
Iranian Persian E-Commerce Platform

## Project Description
Production-quality Persian RTL e-commerce platform for Iranian users, inspired by the breadth and usability of major Iranian marketplaces while intentionally pursuing a more modern, refined, lightweight, and distinctive UX.

## Current Version
0.3.0 — Data Access Foundation

## Current Development Phase
Phase 4 — Database / Data Access Foundation

## Current Mode
MODE A — GITHUB WRITE MODE

## GitHub Repository
`artinasd/E-commerce`

## Current Branch
`main`

## Latest Commit
`3421ba009839866478f6a294e44cf64bc86e39f8` — Add database repository exports

## Architecture Summary
Next.js App Router full-stack application using React, JavaScript, TailwindCSS, Next.js Route Handlers, raw parameterized SQL through `mysql2`, relational MySQL persistence, session-based authentication, RBAC, modular repositories/services, and a custom RTL-first design system.

## Technology Stack
- React
- Next.js App Router
- JavaScript / ES6+
- TailwindCSS
- Next.js Route Handlers
- MySQL
- `mysql2`
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
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── middleware/
│   └── server/
│       ├── db/
│       │   ├── connection.js
│       │   ├── errors.js
│       │   └── repositories/
│       │       ├── index.js
│       │       ├── users.js
│       │       ├── catalog.js
│       │       ├── inventory.js
│       │       ├── cart.js
│       │       └── orders.js
│       └── ...
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
Planned secure session-based authentication using the existing `sessions` table and a server-managed HTTP-only cookie. Authentication implementation is not yet complete.

## Authorization Strategy
Server-enforced RBAC with:
- CUSTOMER
- ADMIN
- SUPER_ADMIN

## API Routes
Planned namespaces:
- `/api/auth`
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

No feature API routes have been implemented yet.

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

## Middleware
Not yet implemented.

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

A lockfile has not yet been generated/verified because dependency installation is performed in the developer environment rather than by the GitHub connector.

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

## Current Task
Phase 4 data-access foundation completed. The repositories now provide the server-side persistence primitives needed for authentication and commerce APIs.

## Next Planned Task
Phase 5 — Authentication foundation: password hashing, credential validation, session creation/rotation/revocation, secure HTTP-only cookies, authentication service, and route protection.

## Known Issues
- MySQL schema has not been executed against a real database in this environment.
- npm dependencies have not been installed/executed in this environment.
- No automated test run has been performed yet.
- Authentication is not implemented yet.
- No feature API routes are implemented yet.

## Technical Debt
- Migration runner/tooling is not yet implemented.
- Database seed data is not yet implemented.
- Automated schema verification is not yet implemented.
- Repository-level integration tests remain outstanding.

## Outstanding Features
All customer, admin, authentication, commerce, and operational features remain to be implemented.

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
Not started. Repository files have been reviewed after writes, but no runtime test execution is available through the current GitHub connector.

## Repository Verification Status
Verified repository files after the data-access writes. The latest commit on `main` is `3421ba009839866478f6a294e44cf64bc86e39f8`.

## Notes For Future Continuation
Do not recreate the project. Continue from the latest task. The database migration is the schema contract. Repositories must remain the only direct SQL access layer for application services. Do not expose raw database errors through public APIs.

## Conversation Summary
The user requested a production-quality Persian RTL Iranian e-commerce platform with a modern, lightweight UI inspired by but not copied from major Iranian e-commerce products. The GitHub repository `artinasd/E-commerce` was verified as empty and writable. The initial Next.js foundation was created directly in GitHub. Phase 4 established the relational MySQL schema, database connection/transaction abstraction, environment contract, and the first server-side repository layer for users, catalog, inventory, carts, and orders. Shared database errors and repository exports were also added. Authentication is the next major phase.
