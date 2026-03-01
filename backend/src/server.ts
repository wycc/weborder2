import { env } from './config/env.js';
import { buildApp } from './app.js';

const app = buildApp();

app.listen({ port: env.port, host: '0.0.0.0' }).catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});

