import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { signJwt } from '../../src/lib/jwt.js';
import { resetState } from '../helpers.js';

describe('GET /protected/resource contract', () => {
  beforeEach(() => resetState());

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
});

