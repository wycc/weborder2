import { authApi } from './auth-api.js';

export const runVerifyCodeFlow = async (email: string, code: string): Promise<'VERIFIED'> => {
  const res = await authApi.verifyCode(email, code);
  if (!res.ok) throw new Error('CODE_INVALID');
  return 'VERIFIED';
};

