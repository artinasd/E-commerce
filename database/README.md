# Database

The application uses MySQL with raw parameterized SQL through `mysql2`.

## Setup

1. Create a MySQL database/server.
2. Copy `.env.example` to `.env.local`.
3. Set the database credentials.
4. Execute `database/migrations/001_initial_schema.sql` against the MySQL server.

## Conventions

- All tables use InnoDB.
- Text-capable columns use `utf8mb4` through the database/table defaults.
- Monetary values are stored as integer minor units appropriate to the application's configured currency representation.
- Foreign keys are used to preserve relational integrity.
- Parameterized queries are mandatory.
- Multi-step business operations such as order creation must use transactions.
- Historical order data is stored as snapshots so catalog changes cannot rewrite completed orders.

## Migration strategy

Migration files are numbered and immutable. Once a migration has been applied to a shared environment, it should not be edited destructively. Future schema changes should be added as new numbered migrations.
