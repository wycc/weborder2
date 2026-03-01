import { AppError } from '../lib/errors.js';
import { auditLog } from '../lib/audit-logger.js';
import { env } from '../config/env.js';
import { userAccountRepository } from '../repositories/user-account.repository.js';
import { emailService } from './email.service.js';
import { emailVerificationTokenService } from './email-verification-token.service.js';

export const resendVerificationService = {
  async resend(email: string): Promise<{ status: 'RESENT'; message: string }> {
    const user = await userAccountRepository.findByEmailInsensitive(email);
    if (!user || user.status === 'VERIFIED') {
      throw new AppError(400, 'INVALID_RESEND_REQUEST', 'Account already verified or invalid request');
    }
    const { token } = emailVerificationTokenService.create(user.id, user.email);
    const link = `${env.appBaseUrl}/auth/verify-email?token=${encodeURIComponent(token)}`;
    await emailService.sendVerificationEmail(user.email, link);
    user.lastVerificationSentAt = new Date();
    await userAccountRepository.save(user);

    auditLog({
      eventType: 'VERIFICATION_RESENT',
      userId: user.id,
      email: user.email,
      result: 'SUCCESS',
      reasonCode: null,
      metadata: {},
    });

    return { status: 'RESENT', message: 'Verification email resent' };
  },
};

