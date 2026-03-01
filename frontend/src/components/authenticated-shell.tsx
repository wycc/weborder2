import { authSession } from '../services/auth-session.js';
import { runLogoutFlow } from '../services/logout-flow.js';

export const renderAuthenticatedShell = (): string => {
  if (!authSession.requireAuthenticated()) {
    return '<section><h2>請先登入</h2><p>登入後即可存取受保護內容。</p></section>';
  }
  return '<section><h2>已登入</h2><button id="logout">登出</button></section>';
};

export const clickLogout = async (): Promise<void> => {
  await runLogoutFlow();
};

