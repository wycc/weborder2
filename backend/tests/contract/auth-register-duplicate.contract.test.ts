import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { resetState } from '../helpers.js';

describe('duplicate register contract', () => {
  beforeEach(() => resetState());

  it('returns 409 ErrorResponse', async () => {
    const app = buildApp();
    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'dup2@example.com', password: 'Password123' },
    });
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'dup2@example.com', password: 'Password123' },
    });
    expect(res.statusCode).toBe(409);
    expect(res.json()).toMatchObject({ code: 'EMAIL_EXISTS' });
  });
});

