import { describe, expect, it } from 'vitest';
import { mapAuthError } from '../../services/auth-error-mapper.js';

describe('login error mapping', () => {
  it('maps 401 invalid credentials', () => {
    expect(mapAuthError('AUTH_INVALID_CREDENTIALS').action).toBe('RETRY');
  });
});

