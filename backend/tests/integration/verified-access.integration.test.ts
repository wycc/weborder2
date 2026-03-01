import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { signJwt } from '../../src/lib/jwt.js';
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
});

