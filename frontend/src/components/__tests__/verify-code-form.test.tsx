import { describe, expect, it } from 'vitest';
import { authValidation } from '../../services/auth-validation.js';

describe('verify code validation', () => {
  it('requires min length', () => {
    expect(authValidation.code('123')).toBe(false);
    expect(authValidation.code('123456')).toBe(true);
  });
});

