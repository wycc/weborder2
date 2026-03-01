import { isCode, isEmail, isPassword } from '../components/auth-form-utils.js';

export const authValidation = {
  email: (v: string): boolean => isEmail(v),
  password: (v: string): boolean => isPassword(v),
  code: (v: string): boolean => isCode(v),
};

