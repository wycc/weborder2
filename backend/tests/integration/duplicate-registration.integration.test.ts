import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { db } from '../../src/lib/db.js';
import { resetState } from '../helpers.js';

describe('duplicate registration integration', () => {
  beforeEach(() => resetState());

  it('returns 409 and does not create duplicate account', async () => {
    const app = buildApp();
    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'dup@example.com', password: 'Password123' },
    });

    const second = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'DUP@example.com', password: 'Password123' },
    });
    expect(second.statusCode).toBe(409);
    expect(Array.from(db.users.values()).filter((u) => u.email === 'dup@example.com')).toHaveLength(1);
  });
});

