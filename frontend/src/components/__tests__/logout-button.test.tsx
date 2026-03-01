import { describe, expect, it } from 'vitest';
import { authSession } from '../../services/auth-session.js';

describe('logout transition', () => {
  it('returns to ANONYMOUS', () => {
    authSession.login('t', 'u@example.com');
    authSession.logout();
    expect(authSession.get().status).toBe('ANONYMOUS');
  });
});

