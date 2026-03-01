import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { emailService } from '../../src/services/email.service.js';
import { db } from '../../src/lib/db.js';
import { resetState } from '../helpers.js';

describe('registration flow integration', () => {
  beforeEach(() => resetState());

  it('register -> mail -> verify updates account to VERIFIED', async () => {
    const app = buildApp();
    const registerRes = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'flow@example.com', password: 'Password123' },
    });
    expect(registerRes.statusCode).toBe(201);

    const userId = registerRes.json().userId;
    expect(db.users.get(userId)?.status).toBe('UNVERIFIED');
    expect(emailService.getOutbox()).toHaveLength(1);

    const link = emailService.getOutbox()[0].html.match(/href="([^"]+)"/)?.[1] ?? '';
    const token = new URL(link).searchParams.get('token');
    const verifyRes = await app.inject({ method: 'GET', url: `/auth/verify-email?token=${token}` });
    expect(verifyRes.statusCode).toBe(200);
    expect(db.users.get(userId)?.status).toBe('VERIFIED');
  });
});

