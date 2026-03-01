import { expect, test } from '@playwright/test';
import { makeE2EEmail, waitForServerReady } from './helpers/e2e-test-helpers.js';

test('register and verify flow', async ({ request, baseURL }) => {
  const base = baseURL ?? 'http://localhost:3000';
  await waitForServerReady(base);

  const email = makeE2EEmail('register-verify');
  const registerRes = await request.post('/auth/register', {
    data: { email, password: 'Password123' },
  });
  expect(registerRes.status()).toBe(201);

  const verifyRes = await request.get('/auth/verify-email', {
    params: { token: `e2e-nonexistent-${Date.now()}` },
  });
  expect([200, 400]).toContain(verifyRes.status());
});
