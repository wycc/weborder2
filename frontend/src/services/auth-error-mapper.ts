export type UiError = { code: string; message: string; action: 'RETRY' | 'RESEND_VERIFICATION' | 'LOGIN' };

export const mapAuthError = (code: string): UiError => {
  if (code === 'AUTH_INVALID_CREDENTIALS') return { code, message: '帳號或密碼錯誤，請再試一次。', action: 'RETRY' };
  if (code === 'EMAIL_UNVERIFIED') return { code, message: '帳號尚未完成驗證，請先驗證 Email。', action: 'RESEND_VERIFICATION' };
  if (code === 'CODE_INVALID' || code === 'TOKEN_INVALID') return { code, message: '註冊碼無效，請重新輸入。', action: 'RETRY' };
  if (code === 'CODE_EXPIRED' || code === 'TOKEN_EXPIRED') return { code, message: '註冊碼已過期，請重新取得。', action: 'RESEND_VERIFICATION' };
  if (code === 'CODE_USED' || code === 'TOKEN_USED') return { code, message: '註冊碼已使用，請改為登入。', action: 'LOGIN' };
  return { code, message: '發生未知錯誤，請稍後再試。', action: 'RETRY' };
};

