# Phase 0 Research — 使用者註冊與電子郵件驗證

## Decision 1: 後端框架採用 Fastify + zod
- **Decision**: 以 Fastify 建立 HTTP API，並以 zod 做 request/response schema 驗證。
- **Rationale**: Fastify 在 Node.js 生態具高效能與型別友善；zod 可同步作為執行期驗證與 TypeScript 型別來源，減少規格與實作偏差。
- **Alternatives considered**:
  - Express + joi：社群成熟但型別整合較分散。
  - NestJS：結構完整但對本功能規模偏重。

## Decision 2: 密碼雜湊採用 @node-rs/argon2
- **Decision**: 使用 Argon2id（由 @node-rs/argon2 提供）儲存密碼雜湊。
- **Rationale**: Argon2id 對 GPU 暴力破解防護較佳，符合 FR-005 與 NFR-SEC-001 的不可逆保存要求。
- **Alternatives considered**:
  - bcrypt：相容性高但在記憶體硬化特性不如 Argon2。
  - scrypt：可行但在本專案既有技術脈絡較少。

## Decision 3: 驗證 token 以 JWT 簽章 + 一次性資料庫狀態
- **Decision**: 驗證連結 token 使用 JWT（含 `sub`, `jti`, `exp`），並在資料庫保存 token 記錄（是否已使用、到期時間）。
- **Rationale**: JWT 可無狀態驗簽，資料庫狀態可確保一次性與可撤銷，滿足 FR-004 與 edge case（過期/已使用）。
- **Alternatives considered**:
  - 純隨機碼：安全可行，但驗簽與傳遞資訊需額外欄位管理。
  - 純 JWT 無落庫：無法嚴格達成一次性使用與稽核追蹤。

## Decision 4: 郵件傳送採 nodemailer，測試以 stub/攔截
- **Decision**: 正式流程使用 nodemailer；測試環境以 transport stub 或攔截器驗證寄送內容。
- **Rationale**: 可在不依賴外部 SMTP 的情況驗證 FR-003/FR-008，提升測試穩定性與速度。
- **Alternatives considered**:
  - 直接串第三方 API（如 SES）於測試：整合成本與脆弱性較高。

## Decision 5: 測試策略採 Vitest + Playwright
- **Decision**: Vitest 負責單元與整合，Playwright 驗證完整使用者旅程（註冊→收信→驗證→存取保護功能）。
- **Rationale**: 橫跨 FR 與 UX/NFR 的最佳覆蓋組合，符合憲章測試原則。
- **Alternatives considered**:
  - 僅 API 測試：無法完整驗證前端回饋一致性與關鍵旅程。
  - Cypress：可行，但專案既定偏好 Playwright。

## Decision 6: 可觀測性採結構化稽核事件
- **Decision**: 對 `registration_submitted`, `verification_succeeded`, `verification_failed`, `verification_resent` 輸出結構化事件，遮罩敏感資訊。
- **Rationale**: 符合 FR-009 與憲章 V（可觀測性與回歸防護）。
- **Alternatives considered**:
  - 純文字 log：不利查詢與稽核，且容易洩漏敏感資料。

## Clarification Resolution Summary
- 所有 Technical Context 欄位已可明確填寫。
- 無 `NEEDS CLARIFICATION` 殘留。
