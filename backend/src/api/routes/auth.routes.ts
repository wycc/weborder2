import type { FastifyInstance } from 'fastify';
import { AppError } from '../../lib/errors.js';
import { registerSchema } from '../schemas/register.schema.js';
import { verifyEmailSchema } from '../schemas/verify-email.schema.js';
import { registrationService } from '../../services/registration.service.js';
import { verifyEmailService } from '../../services/verify-email.service.js';
import { resendVerificationService } from '../../services/resend-verification.service.js';

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
};

