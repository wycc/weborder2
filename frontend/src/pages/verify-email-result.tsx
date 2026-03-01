export const renderVerifyEmailResult = (ok: boolean, message: string): string => {
  const title = ok ? '驗證成功' : '驗證失敗';
  return `<main><h1>${title}</h1><p>${message}</p></main>`;
};

