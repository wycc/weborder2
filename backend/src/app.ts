import Fastify, { type FastifyInstance } from 'fastify';
import { registerAuthRoutes } from './api/routes/auth.routes.js';
import { registerProtectedRoutes } from './api/routes/protected.routes.js';
import { registerErrorHandler } from './plugins/error-handler.js';

export const buildApp = (): FastifyInstance => {
  const app = Fastify();
  registerErrorHandler(app);
  registerAuthRoutes(app);
  registerProtectedRoutes(app);
  return app;
};

