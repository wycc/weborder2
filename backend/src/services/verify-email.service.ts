import { AppError } from '../lib/errors.js';
import { auditLog } from '../lib/audit-logger.js';
import { userAccountRepository } from '../repositories/user-account.repository.js';
import { emailVerificationTokenService } from './email-verification-token.service.js';

const mapTokenError = (code: string): AppError => {
  if (code === 'TOKEN_EXPIRED') {
    return new AppError(400, 'TOKEN_EXPIRED', 'Token expired', 'RESEND_VERIFICATION');
  }
  if (code === 'TOKEN_USED') {
    return new AppError(400, 'TOKEN_USED', 'Token already used', 'RESEND_VERIFICATION');
  }
  return new AppError(400, 'TOKEN_INVALID', 'Token invalid', 'RESEND_VERIFICATION');
};

export const verifyEmailService = {
  async verify(token: string): Promise<{ status: 'VERIFIED'; message: string }> {
    try {
      const record = emailVerificationTokenService.validate(token);
      const user = await userAccountRepository.findById(record.userId);
      if (!user) {
        throw new AppError(400, 'TOKEN_INVALID', 'Token invalid', 'RESEND_VERIFICATION');
      }
      user.status = 'VERIFIED';
      user.verifiedAt = new Date();
      await userAccountRepository.save(user);
      emailVerificationTokenService.markUsed(record.jti);

      auditLog({
        eventType: 'VERIFICATION_SUCCEEDED',
        userId: user.id,
        email: user.email,
        result: 'SUCCESS',
        reasonCode: null,
        metadata: {},
      });

      return { status: 'VERIFIED', message: 'Email verified' };
    } catch (error) {
      const appError = mapTokenError((error as Error).message);
      auditLog({
        eventType: 'VERIFICATION_FAILED',
        userId: null,
        email: 'unknown@example.com',
        result: 'FAILURE',
        reasonCode: appError.code,
        metadata: {},
      });
      throw appError;
    }
  },
};

