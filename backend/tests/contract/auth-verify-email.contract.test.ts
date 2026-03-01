import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { emailService } from '../../src/services/email.service.js';
import { resetState } from '../helpers.js';

describe('GET /auth/verify-email contract', () => {
  beforeEach(() => resetState());

  it('returns VERIFIED response for valid token', async () => {
    const app = buildApp();
    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'b@example.com', password: 'Password123' },
    });

    const link = emailService.getOutbox()[0].html.match(/href="([^"]+)"/)?.[1] ?? '';
    const token = new URL(link).searchParams.get('token');
    const res = await app.inject({ method: 'GET', url: `/auth/verify-email?token=${token}` });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'VERIFIED' });
  });
});

