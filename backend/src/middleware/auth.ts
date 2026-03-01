import type { FastifyRequest } from 'fastify';
import { AppError } from '../lib/errors.js';
import { verifyJwt } from '../lib/jwt.js';

export const authMiddleware = async (req: FastifyRequest): Promise<void> => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'AUTH_REQUIRED', 'Missing or invalid auth header');
  }
  const token = header.slice('Bearer '.length);
  let payload;
  try {
    payload = verifyJwt(token);
  } catch {
    throw new AppError(401, 'AUTH_INVALID', 'Missing or invalid auth');
  }
  if (payload.status !== 'VERIFIED') {
    throw new AppError(403, 'EMAIL_UNVERIFIED', 'Email verification required', 'RESEND_VERIFICATION');
  }
  (req as FastifyRequest & { user?: typeof payload }).user = payload;
};

