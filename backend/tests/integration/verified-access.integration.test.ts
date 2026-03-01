import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { signJwt } from '../../src/lib/jwt.js';
import { db } from '../../src/lib/db.js';
import { registrationService } from '../../src/services/registration.service.js';
import { resetState } from '../helpers.js';

describe('verified access integration', () => {
  beforeEach(() => resetState());

  it('returns 403 EMAIL_UNVERIFIED for unverified user token', async () => {
    const app = buildApp();
    const token = signJwt({ sub: 'u1', email: 'u@example.com', status: 'UNVERIFIED' });
    const res = await app.inject({
      method: 'GET',
      url: '/protected/resource',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(403);
    expect(res.json().code).toBe('EMAIL_UNVERIFIED');
  });

  it('login success then logout blocks protected resource', async () => {
    const app = buildApp();
    const { userId } = await registrationService.register('verified-flow@example.com', 'Password123');
    const user = db.users.get(userId);
    if (user) user.status = 'VERIFIED';

    const loginRes = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'verified-flow@example.com', password: 'Password123' },
    });
    expect(loginRes.statusCode).toBe(200);
    const token = loginRes.json().token as string;

    const logoutRes = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(logoutRes.statusCode).toBe(200);

    const protectedRes = await app.inject({
      method: 'GET',
      url: '/protected/resource',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(protectedRes.statusCode).toBe(401);
  });
});
