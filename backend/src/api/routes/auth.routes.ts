import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../lib/errors.js';
import { registerSchema } from '../schemas/register.schema.js';
import { verifyEmailSchema } from '../schemas/verify-email.schema.js';
import { registrationService } from '../../services/registration.service.js';
import { verifyEmailService } from '../../services/verify-email.service.js';
import { resendVerificationService } from '../../services/resend-verification.service.js';
import { userAccountRepository } from '../../repositories/user-account.repository.js';
import { passwordHashService } from '../../services/password-hash.service.js';
import { signJwt } from '../../lib/jwt.js';
import { db } from '../../lib/db.js';

export const registerAuthRoutes = (app: FastifyInstance): void => {
  app.post('/auth/register', async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid email/password format');
    }
    const result = await registrationService.register(parsed.data.email, parsed.data.password);
    return reply.status(201).send({
      userId: result.userId,
      status: result.status,
      message: 'Registration successful, verification email sent',
    });
  });

  app.post('/auth/verify-code', async (req) => {
    const body = req.body as { email?: string; code?: string };
    if (!body?.email || !body?.code || typeof body.email !== 'string' || typeof body.code !== 'string') {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid verify-code request', 'RETRY');
    }
    return verifyEmailService.verify(body.code);
  });

  app.get('/auth/verify-email', async (req) => {
    const parsed = verifyEmailSchema.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError(400, 'TOKEN_INVALID', 'Token invalid', 'RESEND_VERIFICATION');
    }
    return verifyEmailService.verify(parsed.data.token);
  });

  app.post('/auth/resend-verification', async (req, reply) => {
    const body = req.body as { email?: string };
    if (!body?.email || typeof body.email !== 'string') {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid request');
    }
    const result = await resendVerificationService.resend(body.email);
    return reply.status(202).send(result);
  });

  app.post('/auth/login', async (req) => {
    const body = req.body as { email?: string; password?: string };
    if (!body?.email || !body?.password || typeof body.email !== 'string' || typeof body.password !== 'string') {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid email/password format');
    }
    const user = await userAccountRepository.findByEmailInsensitive(body.email);
    if (!user) {
      throw new AppError(401, 'AUTH_INVALID_CREDENTIALS', 'Invalid credentials', 'RETRY');
    }
    if (user.status !== 'VERIFIED') {
      throw new AppError(403, 'EMAIL_UNVERIFIED', 'Email verification required', 'RESEND_VERIFICATION');
    }
    const ok = await passwordHashService.verify(body.password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, 'AUTH_INVALID_CREDENTIALS', 'Invalid credentials', 'RETRY');
    }
    const jti = randomUUID();
    const token = signJwt({ sub: user.id, email: user.email, status: user.status, jti }, '1h');
    return {
      status: 'AUTHENTICATED',
      message: 'Login successful',
      user: { id: user.id, email: user.email },
      token,
    };
  });

  app.post('/auth/logout', async (req) => {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      try {
        const token = header.slice('Bearer '.length);
        const payload = (await import('../../lib/jwt.js')).verifyJwt(token);
        if (payload.jti) {
          db.revokedJti.add(payload.jti);
        }
      } catch {
        // idempotent logout
      }
    }
    return { status: 'ANONYMOUS', message: 'Logout successful' };
  });
};
