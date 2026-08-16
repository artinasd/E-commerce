# PROJECT LEDGER

## Project Name
Persian Commerce — Iranian RTL E-Commerce Platform

## Project Description
A modern, lightweight, production-oriented Persian RTL e-commerce platform for Iranian customers. The product aims for the breadth and usability of a major marketplace while using a cleaner, more contemporary, custom visual system rather than cloning an existing store.

## Current Version
0.1.0

## Current Development Phase
Phase 2 — Repository and folder bootstrap

## Current Mode
MODE A — GITHUB WRITE MODE

## GitHub Repository
`artinasd/E-commerce`

## Current Branch
`main`

A feature branch could not be created before the first commit because GitHub reported that the repository was empty. The initial bootstrap therefore began on the existing default branch. A dedicated feature branch may be introduced after the repository has a valid commit history.

## Latest Commit
`3ec63bdc54afac0727b5b29d1a598179b853cb54` — Document project foundation and development workflow

## Architecture Summary
Next.js App Router full-stack application using React, JavaScript, Tailwind CSS, Next.js Route Handlers, raw SQL through the `mysql` npm package, MySQL persistence, secure session-oriented authentication, RBAC, service/repository separation, and a custom RTL-first design system.

## Technology Stack

- Next.js 16.2.11
- React 19.2
- JavaScript / ES6+
- Tailwind CSS 4.3
- PostCSS
- ESLint 9
- MySQL
- `mysql` 2.18.1
- npm
- Git / GitHub

Next.js 16.2.11 was selected because it is verified by the official Next.js support information as an Active LTS release as of the project start. Tailwind CSS 4.3 is the current major styling baseline used by the official Next.js integration guidance available during implementation.

## Folder Structure

Current implemented structure:

```text
E-commerce/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── Project-Ledger.md
└── src/
    └── app/
        ├── globals.css
        ├── layout.js
        └── page.js
```

Planned structure will expand into feature modules, database repositories, services, API Route Handlers, authentication, admin, tests, database migrations/seeds, documentation, and CI workflows.

## Database Schema

Planned entities:

- Users
- Authentication/session records as required by the selected auth implementation
- Addresses
- Categories
- Brands
- Products
- Product Variants
- Product Attributes / Values
- Product Images
- Inventory
- Carts
- Cart Items
- Orders
- Order Items
- Payments
- Coupons / Discounts
- Favorites
- Reviews
- Audit records where appropriate

No database tables have been implemented yet.

## Database Relationships

- User → Addresses
- User → Orders
- User → Cart
- User → Favorites
- User → Reviews
- Category → child Categories
- Category → Products
- Brand → Products
- Product → Variants
- Product → Images
- Product → Reviews
- Variant → Inventory
- Cart → Cart Items
- Variant → Cart Items
- Order → Order Items
- Variant → Order Items
- Order → Payment records

## Authentication Strategy

Not implemented yet. The intended architecture is secure session-oriented authentication using HTTP-only secure cookies in production. The concrete implementation will be selected during Phase 5 after the application foundation is ready.

## Authorization Strategy

Server-enforced role-based access control. Initial roles:

- CUSTOMER
- ADMIN
- SUPER_ADMIN

Not implemented yet.

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

No API routes have been implemented yet.

## Business Logic Completed

None yet. The current implementation is project bootstrap only.

## UI Components Completed

- Initial root layout
- Initial Persian RTL storefront landing shell
- Initial global design tokens and base styles

## Pages Completed

- `/` — initial storefront shell

## Admin Pages Completed

None.

## Shared Components

None yet. The initial landing page intentionally contains only bootstrap-level presentation and will be refactored into reusable components during the core frontend phase.

## Utilities

None yet.

## Middleware

None yet.

## Environment Variables

Defined in `.env.example`:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `AUTH_SECRET`

No real secrets are stored in GitHub.

## Dependencies Installed

Declared in `package.json`:

Production:

- `next@16.2.11`
- `react@19.2.0`
- `react-dom@19.2.0`
- `mysql@2.18.1`

Development:

- `@tailwindcss/postcss@4.3.0`
- `eslint@9.35.0`
- `eslint-config-next@16.2.11`
- `postcss@8.5.6`
- `tailwindcss@4.3.0`

A lockfile does not yet exist because dependencies have not been installed in a local runtime by the connected GitHub environment.

## Configuration Files

Implemented:

- `.gitignore`
- `.env.example`
- `next.config.mjs`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `package.json`

## Coding Conventions

- JavaScript only; no TypeScript
- ES6+
- Feature-oriented organization
- Separation of concerns
- Reusable components
- Parameterized SQL
- Server-side authorization
- Consistent API response conventions
- Explicit error handling
- Minimal dependency footprint

## Naming Conventions

- React components: PascalCase
- Functions and variables: camelCase
- API resources: lowercase plural nouns
- Files: Next.js conventions plus consistent project-specific naming
- Database naming convention will be finalized with the first migration/schema implementation

## Important Design Decisions

1. GitHub is the source of truth.
2. Repository `artinasd/E-commerce` is genuinely empty at project start.
3. MODE A is active and verified.
4. JavaScript is mandatory.
5. npm is mandatory.
6. MySQL is mandatory.
7. Raw SQL through `mysql` is mandatory.
8. No ORM unless explicitly approved.
9. Next.js App Router is the application foundation.
10. Persian RTL is a first-class requirement.
11. The UI will use a custom product-specific visual system rather than a generic component-library aesthetic.
12. The initial product model is single-store, not multi-vendor.
13. Security, accessibility, performance, and production-readiness are implementation requirements throughout the project.
14. The initial GitHub bootstrap had to use `main` because the empty repository had no commit from which a new branch could be created.

## Git Workflow

- `main` is the verified default branch.
- Initial bootstrap commits were made directly to `main` because the repository had no commit and branch creation requires an existing commit/base ref.
- Dedicated feature branches will be used for substantial work once the repository has a valid commit base.
- Commits must describe actual logical changes.
- Repository state must be verified after significant writes.

## Completed Tasks

- Inspected connected GitHub capabilities.
- Verified repository permissions.
- Verified `artinasd/E-commerce` is empty.
- Confirmed MODE A.
- Established architecture and roadmap.
- Created `package.json`.
- Created `.gitignore`.
- Created `.env.example`.
- Created Next.js configuration.
- Created Tailwind/PostCSS configuration.
- Created ESLint configuration.
- Created Persian RTL root layout.
- Created global CSS foundation.
- Created initial storefront page.
- Created README.
- Created this Project Ledger.

## Current Task

Finish Phase 2 repository bootstrap by establishing the remaining structural foundation needed before database implementation.

## Next Planned Task

Create the database/migration foundation, server/database utilities, reusable application configuration, and then validate the resulting repository tree and imports before proceeding to Phase 3/4.

## Known Issues

- No local `package-lock.json` has been generated because no local npm install has been executed by this connected GitHub environment.
- Authentication is not implemented.
- Database is not implemented.
- API is not implemented.
- The landing page is intentionally a bootstrap shell, not the final storefront design.
- No CI workflow exists yet.
- No automated tests exist yet.

## Technical Debt

None intentionally introduced at this stage.

## Outstanding Features

All commerce features remain to be implemented.

## Future Improvements

Potential future integrations include Iranian payment gateways, SMS, shipping providers, advanced search, recommendations, loyalty, wallet, gift cards, and marketplace functionality. These are not part of the current baseline unless requirements expand.

## Deployment Status

Not started.

## Testing Status

No tests executed. No local runtime is attached to the GitHub connector, so repository writes have been validated structurally through GitHub but the project has not yet been built or linted in a Node runtime.

## Repository Verification Status

Verified after bootstrap:

- Repository exists.
- Repository now contains the initial project files.
- Writes returned real Git commit SHAs.
- The latest documented commit is `3ec63bdc54afac0727b5b29d1a598179b853cb54`.

A full directory fetch and individual file verification should be performed before the next major phase.

## Notes For Future Continuation

Do not restart the project. Continue from the existing repository state. Before adding major application features, verify the current tree and the exact contents of the foundation files. The next implementation should focus on database architecture and server-side foundations, not prematurely build the entire storefront.

## Conversation Summary

The project is a production-quality Persian RTL e-commerce platform for Iranian customers. The user requires React, Next.js App Router, JavaScript, TailwindCSS, MySQL, raw SQL via the `mysql` npm package, npm, Git, GitHub, and PowerShell for local development. The connected repository `artinasd/E-commerce` was inspected and verified to be empty. Genuine GitHub write access is available, so MODE A is active. Phase 2 has begun and the initial Next.js project foundation has been written directly to GitHub. The repository currently contains configuration, environment template, README, RTL layout, global styles, and a minimal storefront landing shell. No database, authentication, API, or production commerce functionality has been implemented yet.
