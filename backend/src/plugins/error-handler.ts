import type { FastifyInstance } from 'fastify';
import { AppError } from '../lib/errors.js';

export const registerErrorHandler = (app: FastifyInstance): void => {
  app.setErrorHandler((error, _req, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        code: error.code,
        message: error.message,
        action: error.action,
      });
    }

    return reply.status(500).send({
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      action: null,
    });
  });
};

