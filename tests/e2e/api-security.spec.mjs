import { test, expect } from '@playwright/test';

test('unauthenticated cart access is rejected', async ({ request }) => {
  const response = await request.get('/api/cart');

  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.success).toBe(false);
});

test('unauthenticated cart count access is rejected', async ({ request }) => {
  const response = await request.get('/api/cart/count');

  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.success).toBe(false);
});

test('login rejects invalid identity before authentication lookup', async ({ request }) => {
  const response = await request.post('/api/auth/login', {
    data: { email: 'not-an-email', password: 'password123' },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.success).toBe(false);
  expect(body.errors).toBeTruthy();
});

test('registration rejects invalid identity and short password', async ({ request }) => {
  const response = await request.post('/api/auth/register', {
    data: {
      firstName: 'E2E',
      lastName: 'Test',
      email: 'not-an-email',
      password: 'short',
    },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.success).toBe(false);
  expect(body.errors).toBeTruthy();
});
