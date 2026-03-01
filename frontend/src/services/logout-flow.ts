import { authApi } from './auth-api.js';
import { authSession } from './auth-session.js';

export const runLogoutFlow = async (): Promise<void> => {
  const token = authSession.get().token ?? undefined;
  await authApi.logout(token);
  authSession.logout();
};

