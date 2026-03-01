export const env = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:3000',
};

