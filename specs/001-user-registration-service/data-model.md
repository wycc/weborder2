# Data Model — 使用者註冊與電子郵件驗證

## 1) UserAccount

| Field | Type | Required | Rules |
|---|---|---:|---|
| id | UUID | Yes | 主鍵 |
| email | string | Yes | RFC 合法格式、唯一鍵（case-insensitive normalized） |
| passwordHash | string | Yes | Argon2id 雜湊，不可為明文 |
| status | enum(`UNVERIFIED`,`VERIFIED`,`LOCKED`) | Yes | 預設 `UNVERIFIED` |
| createdAt | datetime | Yes | 建立時間 |
| verifiedAt | datetime \| null | No | 驗證成功時間 |
| lastVerificationSentAt | datetime \| null | No | 最近一次寄送驗證信時間 |

### Validation Rules
- email 必須正規化（trim + lower-case domain/local policy）。
- password 最低長度與強度依產品政策（至少長度門檻 + 基本複雜度）。
- `VERIFIED` 狀態下 `verifiedAt` 不可為 null。

### State Transitions
- `UNVERIFIED -> VERIFIED`：使用有效且未使用 token 驗證成功。
- `UNVERIFIED -> LOCKED`：可選安全策略（非本次必要）。

## 2) EmailVerificationToken

| Field | Type | Required | Rules |
|---|---|---:|---|
| id | UUID | Yes | 主鍵 |
| userId | UUID | Yes | FK -> UserAccount.id |
| jti | string | Yes | JWT ID，唯一索引 |
| tokenHash | string | Yes | token 雜湊或不可逆摘要 |
| expiresAt | datetime | Yes | 到期時間 |
| usedAt | datetime \| null | No | 首次使用時間；非 null 即不可再用 |
| sentAt | datetime | Yes | 郵件送出時間 |

### Validation Rules
- `expiresAt > sentAt`。
- 驗證時需同時滿足：存在、未過期、`usedAt` 為 null。

### State Transitions
- `ISSUED -> USED`：驗證成功。
- `ISSUED -> EXPIRED`：超過 `expiresAt`。

## 3) RegistrationAuditEvent

| Field | Type | Required | Rules |
|---|---|---:|---|
| id | UUID | Yes | 主鍵 |
| eventType | enum | Yes | `REGISTRATION_SUBMITTED`, `VERIFICATION_SUCCEEDED`, `VERIFICATION_FAILED`, `VERIFICATION_RESENT` |
| userId | UUID \| null | No | 可關聯帳號 |
| emailMasked | string | Yes | 僅遮罩版 email |
| result | enum(`SUCCESS`,`FAILURE`) | Yes | 結果 |
| reasonCode | string \| null | No | 失敗原因代碼（不含敏感資料） |
| occurredAt | datetime | Yes | 事件時間 |
| metadata | json | No | 結構化脈絡（不可含明文密碼/token） |

## Relationships
- UserAccount 1 --- N EmailVerificationToken
- UserAccount 1 --- N RegistrationAuditEvent

