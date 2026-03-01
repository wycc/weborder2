import { request } from '@playwright/test';

export const waitForServerReady = async (baseURL: string, timeoutMs = 10000): Promise<void> => {
  const start = Date.now();
  const api = await request.newContext({ baseURL });
  try {
    while (Date.now() - start < timeoutMs) {
      const res = await api.post('/auth/register', {
        data: { email: 'readiness-probe@example.com', password: 'short' },
      });
      if ([400, 409, 201].includes(res.status())) return;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error(`Server not ready within ${timeoutMs}ms (${baseURL})`);
  } finally {
    await api.dispose();
  }
};

export const makeE2EEmail = (prefix: string): string => `${prefix}.${Date.now()}@example.com`;

export const extractHrefFromHtml = (html: string): string => {
  const link = html.match(/href="([^"]+)"/)?.[1];
  if (!link) throw new Error('No href found in html content');
  return link;
};

export const extractTokenFromVerifyLink = (url: string): string => {
  const token = new URL(url).searchParams.get('token');
  if (!token) throw new Error('Missing token in verification URL');
  return token;
};

export const measureStepMs = async (fn: () => Promise<unknown>): Promise<number> => {
  const start = Date.now();
  await fn();
  return Date.now() - start;
};

export const assertP95Under3s = (samples: number[]): boolean => {
  if (samples.length === 0) return false;
  const sorted = [...samples].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
  return sorted[idx] < 3000;
};
