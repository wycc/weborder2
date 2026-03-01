# Quickstart — 前端登入註冊與註冊碼驗證流程

## Prerequisites
- Node.js 20 LTS
- npm 10+

## Install
```bash
npm install
```

## Run locally
```bash
npm run dev
```

## Quality gates
```bash
npm test && npm run lint
```

## Frontend tech baseline
- React（TypeScript）
- Material UI（表單、按鈕、訊息提示、版面）

## Test plan mapping (FR -> Test)
- FR-001: 註冊頁顯示與必填驗證（frontend unit + e2e）
- FR-002: 註冊成功後進入註冊碼輸入畫面（integration + e2e）
- FR-003: 註冊碼畫面提交 email + code（frontend unit + contract）
- FR-004: 正確註冊碼驗證成功（integration + e2e）
- FR-005: 無效/過期/已使用註冊碼錯誤回饋（integration + e2e）
- FR-006: 登入頁提交憑證（frontend unit + integration）
- FR-007: 登入成功顯示已登入狀態與登出按鍵（e2e）
- FR-008: 登入失敗不建立 session（integration + e2e）
- FR-009: 點擊登出結束 session（e2e）
- FR-010: 登出後阻擋受保護內容（integration + e2e）

## Playwright E2E scenarios
1. 新使用者註冊成功後，進入註冊碼輸入頁並完成驗證。
2. 已驗證使用者登入成功，頁面顯示登出按鍵。
3. 登出後重新存取受保護內容，系統要求重新登入。
4. 註冊碼錯誤/過期時顯示一致錯誤與下一步導引。

## Run E2E
```bash
npm run e2e
```

## E2E artifacts
- 失敗案例保留 screenshot/video。
- retry 產生 trace 供除錯。

## Performance validation
- 量測註冊送出、註冊碼送出、登入送出、登出後回到未登入畫面時間。
- 驗收門檻：95% 步驟在 3 秒內顯示結果。

## UX consistency checklist
- 錯誤訊息皆含可理解原因與下一步。
- 命名一致使用：註冊、註冊碼驗證、登入、登出。
- Material UI 元件語彙一致（button, text field, alert）。
