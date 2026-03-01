export const renderRegisterPage = (): string =>
  [
    '<main>',
    '<h1>建立帳號</h1>',
    '<p>完成註冊後，請輸入寄送到 Email 的註冊碼完成驗證。</p>',
    '<form aria-label="register-form">',
    '<label for="register-email">Email</label>',
    '<input id="register-email" name="email" type="email" autocomplete="email" required />',
    '<label for="register-password">Password</label>',
    '<input id="register-password" name="password" type="password" autocomplete="new-password" required />',
    '<button type="submit">送出註冊</button>',
    '</form>',
    '<p>已經有帳號？<a href="/login">前往登入</a></p>',
    '</main>',
  ].join('');
