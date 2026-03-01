import { authApi } from './auth-api.js';
import { authSession } from './auth-session.js';

export const runLoginFlow = async (email: string, password: string): Promise<void> => {
  const res = await authApi.login(email, password);
  if (!res.ok) throw new Error('AUTH_INVALID_CREDENTIALS');
  const body = (await authApi.parse<{ token: string; user: { email: string } }>(res));
  authSession.login(body.token, body.user.email);
};

