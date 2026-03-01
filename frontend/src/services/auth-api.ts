export type ApiError = { code: string; message: string; action?: string };

const toJson = async <T>(res: Response): Promise<T> => (await res.json()) as T;

export const authApi = {
  register: (email: string, password: string) =>
    fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),
  verifyCode: (email: string, code: string) =>
    fetch('http://localhost:3000/auth/verify-code', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, code }),
    }),
  login: (email: string, password: string) =>
    fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),
  logout: (token?: string) =>
    fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      headers: token ? { authorization: `Bearer ${token}` } : undefined,
    }),
  parse: toJson,
};

