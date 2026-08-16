# Authentication foundation

Authentication uses password hashing with Node.js `scrypt`, opaque random session tokens, SHA-256 token hashes in MySQL, and secure HTTP-only cookies.

Authentication routes are added under `src/app/api/auth` as the API layer is completed.
