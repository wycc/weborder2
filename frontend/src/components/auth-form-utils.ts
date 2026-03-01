export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN = 8;
export const CODE_MIN = 6;

export const isEmail = (v: string): boolean => EMAIL_REGEX.test(v.trim());
export const isPassword = (v: string): boolean => v.length >= PASSWORD_MIN;
export const isCode = (v: string): boolean => v.trim().length >= CODE_MIN;

