import { describe, expect, it } from 'vitest';
import { authValidation } from '../../services/auth-validation.js';

describe('register form validation', () => {
  it('invalid email/password should fail validation', () => {
    expect(authValidation.email('bad')).toBe(false);
    expect(authValidation.password('123')).toBe(false);
  });
});

