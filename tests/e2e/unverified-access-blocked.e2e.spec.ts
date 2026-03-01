import { expect, test } from '@playwright/test';
import { makeE2EEmail, waitForServerReady } from './helpers/e2e-test-helpers.js';

test('unverified user blocked from protected flow', async ({ request, baseURL }) => {
  const base = baseURL ?? 'http://localhost:3000';
  await waitForServerReady(base);

  const email = makeE2EEmail('unverified-blocked');
  const registerRes = await request.post('/auth/register', {
    data: { email, password: 'Password123' },
  });
  expect(registerRes.status()).toBe(201);

  const protectedRes = await request.get('/protected/resource');
  expect([401, 403]).toContain(protectedRes.status());
});
