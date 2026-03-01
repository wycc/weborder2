import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { resetState } from '../helpers.js';

describe('POST /auth/register contract', () => {
  beforeEach(() => resetState());

  it('returns 201 with expected schema', async () => {
    const app = buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'a@example.com', password: 'Password123' },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.status).toBe('UNVERIFIED');
    expect(body.userId).toBeTypeOf('string');
    expect(body.message).toBeTypeOf('string');
  });
});

