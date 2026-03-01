import { AppError } from '../lib/errors.js';
import { auditLog } from '../lib/audit-logger.js';
import { env } from '../config/env.js';
import { userAccountRepository } from '../repositories/user-account.repository.js';
import { emailService } from './email.service.js';
import { emailVerificationTokenService } from './email-verification-token.service.js';
import { passwordHashService } from './password-hash.service.js';

export const registrationService = {
  async register(email: string, password: string): Promise<{ userId: string; status: 'UNVERIFIED' }> {
    const existing = await userAccountRepository.findByEmailInsensitive(email);
    if (existing) {
      throw new AppError(409, 'EMAIL_EXISTS', 'Email already exists');
    }

    const passwordHash = await passwordHashService.hash(password);
    const user = await userAccountRepository.create(email, passwordHash);
    const { token } = emailVerificationTokenService.create(user.id, user.email);
    user.lastVerificationSentAt = new Date();
    await userAccountRepository.save(user);

    const link = `${env.appBaseUrl}/auth/verify-email?token=${encodeURIComponent(token)}`;
    await emailService.sendVerificationEmail(user.email, link);

    auditLog({
      eventType: 'REGISTRATION_SUBMITTED',
      userId: user.id,
      email: user.email,
      result: 'SUCCESS',
      reasonCode: null,
      metadata: {},
    });

    return { userId: user.id, status: 'UNVERIFIED' };
  },
};

