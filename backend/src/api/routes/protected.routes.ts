import type { FastifyInstance } from 'fastify';
import { authMiddleware } from '../../middleware/auth.js';

export const registerProtectedRoutes = (app: FastifyInstance): void => {
  app.get('/protected/resource', { preHandler: authMiddleware }, async () => ({ message: 'access granted' }));
};

