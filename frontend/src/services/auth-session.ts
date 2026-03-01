export type AuthSessionState = {
  status: 'ANONYMOUS' | 'AUTHENTICATED';
  token: string | null;
  email: string | null;
  verified: boolean;
};

let state: AuthSessionState = {
  status: 'ANONYMOUS',
  token: null,
  email: null,
  verified: false,
};

export const authSession = {
  get: (): AuthSessionState => state,
  login: (token: string, email: string): void => {
    state = { status: 'AUTHENTICATED', token, email, verified: true };
  },
  logout: (): void => {
    state = { status: 'ANONYMOUS', token: null, email: null, verified: false };
  },
  requireAuthenticated: (): boolean => state.status === 'AUTHENTICATED' && state.verified,
};

