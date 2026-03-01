import { renderRegisterPage } from './pages/register-page.js';
import { renderVerifyEmailResult } from './pages/verify-email-result.js';
import { renderLoginPage } from './pages/login-page.js';

export const renderAuthApp = (route: '/register' | '/verify' | '/login'): string => {
  if (route === '/register') return renderRegisterPage();
  if (route === '/verify') return renderVerifyEmailResult(false, '請輸入註冊碼完成驗證');
  return renderLoginPage();
};

