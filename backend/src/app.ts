import Fastify, { type FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { registerAuthRoutes } from './api/routes/auth.routes.js';
import { registerProtectedRoutes } from './api/routes/protected.routes.js';
import { registerErrorHandler } from './plugins/error-handler.js';

export const buildApp = (): FastifyInstance => {
  const app = Fastify();
  const frontendDistPath = path.resolve(process.cwd(), 'frontend/dist');

  app.register(fastifyStatic, {
    root: frontendDistPath,
    prefix: '/',
    wildcard: false,
  });

  registerErrorHandler(app);
  registerAuthRoutes(app);
  registerProtectedRoutes(app);

  app.setNotFoundHandler(async (req, reply) => {
    const pathname = req.url.split('?')[0] ?? '/';
    const isApiPath =
      pathname.startsWith('/api') || pathname.startsWith('/auth') || pathname.startsWith('/protected');
    if (isApiPath || req.method !== 'GET') {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: `Route ${req.method}:${pathname} not found`,
      });
    }
    const staticReply = reply.type('text/html') as typeof reply & {
      sendFile: (filename: string) => unknown;
    };
    return staticReply.sendFile('index.html');
  });

  return app;
};
