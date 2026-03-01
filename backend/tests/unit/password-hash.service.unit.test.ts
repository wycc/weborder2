import { describe, expect, it } from 'vitest';
import { passwordHashService } from '../../src/services/password-hash.service.js';

describe('password hash service', () => {
  it('hashes and verifies password', async () => {
    const hash = await passwordHashService.hash('Password123');
    expect(hash).not.toBe('Password123');
    await expect(passwordHashService.verify('Password123', hash)).resolves.toBe(true);
  });
});

