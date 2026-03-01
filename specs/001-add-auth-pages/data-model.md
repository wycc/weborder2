# Data Model — 前端登入註冊與註冊碼驗證流程

## 1) AuthFormState

> 前端表單狀態模型，供 Register/Login/Verify Code 共用。

| Field | Type | Required | Rules |
|---|---|---:|---|
| email | string | Yes | RFC 合法格式；提交前 trim/lowercase normalization |
| password | string | Conditional | Register/Login 必填；最小長度依後端契約 |
| verificationCode | string | Conditional | Verify Code 必填；允許字母數字，需去除前後空白 |
| submitting | boolean | Yes | 送出中時禁用重複提交 |
| fieldErrors | Record<string,string> | No | 欄位層級錯誤；需可重試修正 |

### Validation Rules
- `email` 必須合法且非空白。
- `password` 在註冊/登入不可為空，長度與複雜度由後端規則回饋。
- `verificationCode` 不可空白，過長/格式異常需在前端即時提示。

### State Transitions
- `IDLE -> SUBMITTING -> SUCCESS`
- `IDLE -> SUBMITTING -> ERROR_VALIDATION | ERROR_BUSINESS`

---

## 2) AuthSessionView

> 前端登入會話呈現模型（非敏感 token 儲存細節）。

| Field | Type | Required | Rules |
|---|---|---:|---|
| status | enum(`ANONYMOUS`,`AUTHENTICATED`) | Yes | 預設 `ANONYMOUS` |
| userId | string \| null | No | 已登入時存在 |
| email | string \| null | No | 已登入時存在 |
| verified | boolean | Yes | 未驗證帳號不得視為可用 authenticated content |
| expiresAt | datetime \| null | No | 用於 session 失效判斷 |

### Validation Rules
- 僅當 `status=AUTHENTICATED` 且 `verified=true` 才可進入受保護內容。
- 登出或 session 失效時必須回到 `ANONYMOUS`。

### State Transitions
- `ANONYMOUS -> AUTHENTICATED`：登入成功且驗證狀態合法。
- `AUTHENTICATED -> ANONYMOUS`：使用者登出或 session 失效。

---

## 3) VerificationFlowState

> 註冊後至註冊碼驗證的流程狀態。

| Field | Type | Required | Rules |
|---|---|---:|---|
| status | enum(`PENDING_CODE`,`VERIFIED`,`FAILED`) | Yes | 註冊成功後預設 `PENDING_CODE` |
| failureCode | string \| null | No | 例如 `CODE_INVALID`,`CODE_EXPIRED`,`CODE_USED` |
| message | string | Yes | 對使用者可理解之回饋 |
| nextAction | enum(`RETRY`,`RESEND`,`GO_LOGIN`) \| null | No | UI CTA 導引 |

### Validation Rules
- `FAILED` 狀態必須有 `failureCode` 與 `nextAction`。
- `VERIFIED` 狀態應提供 `GO_LOGIN` 或自動導向登入。

### State Transitions
- `PENDING_CODE -> VERIFIED`：驗證碼成功。
- `PENDING_CODE -> FAILED`：驗證碼無效/過期/已使用。
- `FAILED -> PENDING_CODE`：使用者修正後重試或重發後再次輸入。

---

## Relationships
- `AuthFormState` 驅動 `VerificationFlowState` 的提交行為與錯誤顯示。
- `AuthSessionView` 受 `Login/Logout` API 結果更新，並控制受保護頁可見性。
- `VerificationFlowState.VERIFIED` 為 `AuthSessionView.AUTHENTICATED` 的必要前置（首次登入情境）。
