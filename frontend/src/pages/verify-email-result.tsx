const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const renderVerifyEmailResult = (ok: boolean, message: string): string => {
  const title = ok ? '驗證成功' : '輸入註冊碼完成驗證';
  const hint = ok
    ? '您的 Email 已完成驗證，現在可以登入。'
    : '請輸入註冊時使用的 Email 與註冊碼。若失敗，請重新確認或重新取得註冊碼後再試。';
  const safeMessage = escapeHtml(message);

  return [
    '<main>',
    `<h1>${title}</h1>`,
    `<p>${hint}</p>`,
    '<form aria-label="verify-code-form">',
    '<label for="verify-email">Email</label>',
    '<input id="verify-email" name="email" type="email" autocomplete="email" required />',
    '<label for="verify-code">註冊碼</label>',
    '<input id="verify-code" name="code" type="text" inputmode="text" autocomplete="one-time-code" required />',
    '<button type="submit">送出註冊碼</button>',
    '</form>',
    `<p role="status">${safeMessage}</p>`,
    '<p>若未收到或註冊碼已失效，請使用「重發驗證信」並重試。</p>',
    '<a href="/register">返回註冊</a> | <a href="/login">前往登入</a>',
    '</main>',
  ].join('');
};
