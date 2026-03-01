import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { resetState } from '../helpers.js';

describe('performance registration integration', () => {
  beforeEach(() => resetState());

  it('register/verify p95-like single run under 2s', async () => {
    const app = buildApp();
    const start = Date.now();
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'perf@example.com', password: 'Password123' },
    });
    expect(res.statusCode).toBe(201);
    expect(Date.now() - start).toBeLessThan(2000);
  });
});

