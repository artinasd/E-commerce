import crypto from 'node:crypto';
import mysql from 'mysql2/promise';

const ADMIN_EMAIL = 'admin@iranian-ecommerce.local';
const ADMIN_PASSWORD = 'Admin@12345!';
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 128 * 1024 * 1024 };

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, SCRYPT_OPTIONS, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
  return `scrypt$${SCRYPT_OPTIONS.N}$${SCRYPT_OPTIONS.r}$${SCRYPT_OPTIONS.p}$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const pool = mysql.createPool({
  host: required('DB_HOST'),
  port: Number(required('DB_PORT')),
  user: required('DB_USER'),
  password: process.env.DB_PASSWORD || '',
  database: required('DB_NAME'),
  waitForConnections: true,
  connectionLimit: 2,
});

try {
  const passwordHash = await hashPassword(ADMIN_PASSWORD);
  const [existing] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [ADMIN_EMAIL]);

  if (existing.length > 0) {
    await pool.execute(
      `UPDATE users SET password_hash = ?, first_name = ?, last_name = ?, role = 'SUPER_ADMIN',
       is_active = TRUE, email_verified_at = COALESCE(email_verified_at, CURRENT_TIMESTAMP), deleted_at = NULL
       WHERE id = ?`,
      [passwordHash, 'System', 'Administrator', existing[0].id],
    );
    console.log(`Updated local SUPER_ADMIN: ${ADMIN_EMAIL}`);
  } else {
    await pool.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, email_verified_at)
       VALUES (?, ?, ?, ?, 'SUPER_ADMIN', TRUE, CURRENT_TIMESTAMP)`,
      [ADMIN_EMAIL, passwordHash, 'System', 'Administrator'],
    );
    console.log(`Created local SUPER_ADMIN: ${ADMIN_EMAIL}`);
  }

  console.log(`Password: ${ADMIN_PASSWORD}`);
} finally {
  await pool.end();
}
