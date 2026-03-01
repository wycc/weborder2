import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';
import { emailService } from '../../src/services/email.service.js';
import { resetState } from '../helpers.js';

describe('resend verification integration', () => {
  beforeEach(() => resetState());

  it('resends verification email for unverified account', async () => {
    const app = buildApp();
    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'resend@example.com', password: 'Password123' },
    });

    const res = await app.inject({
      method: 'POST',
      url: '/auth/resend-verification',
      payload: { email: 'resend@example.com' },
    });
    expect(res.statusCode).toBe(202);
    expect(emailService.getOutbox().length).toBeGreaterThanOrEqual(2);
  });
});

