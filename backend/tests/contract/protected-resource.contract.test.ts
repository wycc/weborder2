import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { signJwt } from '../../src/lib/jwt.js';
import { resetState } from '../helpers.js';

describe('GET /protected/resource contract', () => {
  beforeEach(() => resetState());

  it('returns 401 unauthorized fixture when auth header is missing', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/protected/resource',
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toMatchObject({
      code: 'AUTH_REQUIRED',
      message: 'Missing or invalid auth header',
      action: null,
    });
  });

  it('returns 401 unauthorized fixture when token is invalid', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/protected/resource',
      headers: { authorization: 'Bearer invalid-token' },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toMatchObject({
      code: 'AUTH_INVALID',
      message: 'Missing or invalid auth',
      action: null,
    });
  });

  it('returns 200 when verified user token', async () => {
    const app = buildApp();
    const token = signJwt({ sub: 'u1', email: 'u@example.com', status: 'VERIFIED' });
    const res = await app.inject({
      method: 'GET',
      url: '/protected/resource',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ message: 'access granted' });
  });

  it('POST /auth/login returns 401 for invalid credentials', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'nope@example.com', password: 'Password123' },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json().code).toBe('AUTH_INVALID_CREDENTIALS');
  });

  it('POST /auth/logout returns ANONYMOUS idempotently', async () => {
    const app = buildApp();
    const res = await app.inject({ method: 'POST', url: '/auth/logout' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ANONYMOUS' });
  });
});
