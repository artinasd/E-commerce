import crypto from 'node:crypto';

const ALGORITHM = 'scrypt';
const KEY_LENGTH = 64;
const SALT_BYTES = 16;
const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 128 * 1024 * 1024,
};

export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must contain at least 8 characters.');
  }

  const salt = crypto.randomBytes(SALT_BYTES);
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });

  return `${ALGORITHM}$${SCRYPT_OPTIONS.N}$${SCRYPT_OPTIONS.r}$${SCRYPT_OPTIONS.p}$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`;
}

export async function verifyPassword(password, encodedHash) {
  if (typeof password !== 'string' || typeof encodedHash !== 'string') return false;

  const [algorithm, n, r, p, saltEncoded, keyEncoded] = encodedHash.split('$');
  if (algorithm !== ALGORITHM || !n || !r || !p || !saltEncoded || !keyEncoded) return false;

  const salt = Buffer.from(saltEncoded, 'base64url');
  const expectedKey = Buffer.from(keyEncoded, 'base64url');
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, expectedKey.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: 128 * 1024 * 1024,
    }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });

  return crypto.timingSafeEqual(expectedKey, derivedKey);
}
