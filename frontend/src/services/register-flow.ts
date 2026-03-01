import { authApi } from './auth-api.js';

export const runRegisterFlow = async (email: string, password: string): Promise<'PENDING_CODE'> => {
  const res = await authApi.register(email, password);
  if (!res.ok) throw new Error('REGISTER_FAILED');
  return 'PENDING_CODE';
};

