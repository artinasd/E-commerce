# فروشگاه فارسی

A modern, production-oriented Persian RTL e-commerce platform for Iranian customers.

## Technology

- Next.js 16.2.11 (App Router)
- React 19.2
- JavaScript / ES6+
- Tailwind CSS 4
- MySQL
- `mysql` npm package
- npm

## Development

Requirements:

- Node.js 20.9+
- npm
- MySQL 8+

Install dependencies:

```powershell
npm install
```

Create a local environment file from `.env.example` and configure the MySQL connection.

Start development:

```powershell
npm run dev
```

Lint the project:

```powershell
npm run lint
```

Build for production:

```powershell
npm run build
```

## Architecture

The application uses Next.js App Router with server-first rendering, Route Handlers for REST-style APIs, service/repository separation, raw parameterized SQL through `mysql`, and a custom RTL-first design system.

See `Project-Ledger.md` for the current implementation state and continuation instructions.
