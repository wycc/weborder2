# Quickstart — 使用者註冊與電子郵件驗證

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

## Test plan mapping (FR -> Test)
- FR-001/FR-002: 註冊 API 建立未驗證帳號（integration）
- FR-003: 註冊後寄送驗證信（integration with mail stub）
- FR-004: 驗證連結有效/過期/已使用情境（integration + e2e）
- FR-005: 密碼以 Argon2 雜湊保存（unit + integration）
- FR-006: 重複 email 不建立重複帳號（integration）
- FR-007: 未驗證存取受保護資源被拒（integration + e2e）
- FR-008: 重發驗證信（integration）
- FR-009: 稽核事件落地（integration）

## Playwright E2E scenarios
1. 新使用者註冊成功，取得驗證連結並完成驗證。
2. 未驗證帳號存取受保護頁面被阻擋並看到一致訊息。
3. 使用過期/已使用連結，頁面顯示可重發驗證信引導。

## Run E2E
```bash
npm run e2e
```

## E2E artifacts (trace/screenshot/video)
- 失敗測試會保留 screenshot 與 video（依 `playwright.config.ts`）。
- 若發生 retry，會保留 trace（`on-first-retry`）。
- 使用以下命令檢視 trace：

```bash
npx playwright show-trace <trace.zip>
```

## E2E acceptance checklist
- `register-and-verify` 與 `unverified-access-blocked` 兩個案例可執行。
- 失敗時可於產物中取得可重現資訊（trace/screenshot/video）。
- 驗證流程錯誤時，回應保持一致錯誤格式與導引資訊。

## Performance validation
- 在測試環境記錄 `POST /auth/register` 與 `GET /auth/verify-email` 延遲。
- 驗收門檻：有效情境 p95 < 2 秒。

## Observability checklist
- 稽核事件至少包含：eventType、occurredAt、result、reasonCode、emailMasked。
- 日誌不得含明文 password、token。
