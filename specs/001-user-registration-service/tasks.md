# Tasks: 使用者註冊與電子郵件驗證

**Input**: Design documents from `/specs/001-user-registration-service/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are MANDATORY. Every user story MUST include executable tests mapped to FR 與風險。

**Organization**: Tasks are grouped by user story for independent delivery and verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no direct dependency)
- **[Story]**: User story label, required in user-story phases (`[US1]`, `[US2]`, `[US3]`)
- Every task line uses exact format: `- [x] T### ...` and includes concrete file path(s)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: baseline tooling and test runtime for backend/frontend + E2E.

- [x] T001 對齊執行腳本（test/e2e/lint）於 package.json
- [x] T002 [P] 設定 Playwright baseURL、trace、screenshot、video 策略於 playwright.config.ts
- [x] T003 [P] 建立 E2E 環境變數範本（含驗證網址）於 .env.example
- [x] T004 建立 E2E 共用測試輔助（啟動流程、測試資料清理、郵件 stub 讀取）於 tests/e2e/helpers/e2e-test-helpers.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: core primitives required before implementing any story-specific tasks.

**⚠️ CRITICAL**: No user story work begins before this phase is complete.

- [x] T005 建立註冊/驗證測試資料工廠與共用 fixture 於 backend/tests/helpers.ts
- [x] T006 [P] 對齊驗證 token 與狀態欄位模型規格於 backend/src/models/email-verification-token.ts
- [x] T007 [P] 對齊帳號狀態與驗證時間欄位規格於 backend/src/models/user-account.ts
- [x] T008 [P] 對齊稽核事件欄位與遮罩策略於 backend/src/models/registration-audit-event.ts
- [x] T009 建立驗證與重發流程的共用錯誤碼映射於 backend/src/lib/errors.ts

**Checkpoint**: Foundation ready; user stories can proceed.

---

## Phase 3: User Story 1 - 建立帳號並完成驗證 (Priority: P1) 🎯 MVP

**Goal**: 完成「註冊 → 收到驗證連結 → 成功驗證」主流程。

**Independent Test**: 執行註冊與驗證流程後，帳號狀態由 `UNVERIFIED` 轉為 `VERIFIED`。

### Tests for User Story 1 (MANDATORY) ✅

- [x] T010 [P] [US1] 更新 `/auth/register` 契約測試案例與回應欄位驗證於 backend/tests/contract/auth-register.contract.test.ts
- [x] T011 [P] [US1] 更新 `/auth/verify-email` 契約測試（有效/過期/已使用 token）於 backend/tests/contract/auth-verify-email.contract.test.ts
- [x] T012 [P] [US1] 更新註冊與驗證整合測試流程於 backend/tests/integration/auth-registration-flow.integration.test.ts
- [x] T013 [US1] 解除 skip 並實作可執行「register-and-verify」E2E 流程於 tests/e2e/register-and-verify.e2e.spec.ts

### Implementation for User Story 1

- [x] T014 [P] [US1] 對齊註冊輸入驗證規則與錯誤訊息於 backend/src/api/schemas/register.schema.ts
- [x] T015 [P] [US1] 對齊驗證 token 查驗與 query schema 於 backend/src/api/schemas/verify-email.schema.ts
- [x] T016 [US1] 對齊註冊服務（建立未驗證帳號 + 發送驗證信）於 backend/src/services/registration.service.ts
- [x] T017 [US1] 對齊驗證服務（token 驗證 + 狀態轉移）於 backend/src/services/verify-email.service.ts
- [x] T018 [US1] 對齊註冊/驗證路由回應格式與錯誤碼於 backend/src/api/routes/auth.routes.ts
- [x] T019 [US1] 對齊驗證結果頁成功/失敗/重發導引文案於 frontend/src/pages/verify-email-result.tsx

**Checkpoint**: US1 can be demonstrated as MVP.

---

## Phase 4: User Story 2 - 防止未驗證帳號直接使用服務 (Priority: P2)

**Goal**: 未驗證帳號存取受保護資源時被阻擋並收到一致提示。

**Independent Test**: 未驗證帳號對受保護資源回傳 `403 + EMAIL_UNVERIFIED`，已驗證帳號可通行。

### Tests for User Story 2 (MANDATORY) ✅

- [x] T020 [P] [US2] 更新受保護資源契約測試（401/403/200）於 backend/tests/contract/protected-resource.contract.test.ts
- [x] T021 [P] [US2] 更新驗證狀態授權整合測試（未驗證阻擋、已驗證放行）於 backend/tests/integration/verified-access.integration.test.ts
- [x] T022 [US2] 解除 skip 並實作可執行「unverified-access-blocked」E2E 流程於 tests/e2e/unverified-access-blocked.e2e.spec.ts

### Implementation for User Story 2

- [x] T023 [US2] 對齊驗證狀態授權邏輯與錯誤碼輸出於 backend/src/middleware/auth.ts
- [x] T024 [US2] 對齊受保護資源 API 回應與錯誤格式於 backend/src/api/routes/protected.routes.ts
- [x] T025 [US2] 對齊未驗證提示元件與重發入口於 frontend/src/components/unverified-notice.tsx

**Checkpoint**: US2 independently testable and shippable.

---

## Phase 5: User Story 3 - 密碼安全保存與重複註冊處理 (Priority: P3)

**Goal**: 密碼不可逆儲存，重複 email 不建立重複帳號且回應一致。

**Independent Test**: 密碼僅以雜湊儲存；重複註冊回傳一致錯誤並維持單一帳號。

### Tests for User Story 3 (MANDATORY) ✅

- [x] T026 [P] [US3] 更新密碼雜湊單元測試（Argon2id 驗證與明文排除）於 backend/tests/unit/password-hash.service.unit.test.ts
- [x] T027 [P] [US3] 更新重複註冊整合測試（資料唯一性）於 backend/tests/integration/duplicate-registration.integration.test.ts
- [x] T028 [P] [US3] 更新重複註冊契約測試（409 回應一致性）於 backend/tests/contract/auth-register-duplicate.contract.test.ts

### Implementation for User Story 3

- [x] T029 [US3] 對齊密碼雜湊參數與驗證邏輯於 backend/src/services/password-hash.service.ts
- [x] T030 [US3] 對齊 email 唯一檢查與大小寫正規化查找於 backend/src/repositories/user-account.repository.ts
- [x] T031 [US3] 對齊重複註冊錯誤映射（400/409）於 backend/src/api/routes/auth.routes.ts

**Checkpoint**: US3 independently testable and shippable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: hardening, documentation, and CI-quality evidence across stories.

- [x] T032 [P] 對齊 OpenAPI 與實際回應範例於 specs/001-user-registration-service/contracts/openapi.yaml
- [x] T033 [P] 補齊重發驗證信整合測試（FR-008）於 backend/tests/integration/resend-verification.integration.test.ts
- [x] T034 對齊重發驗證信流程實作與錯誤碼於 backend/src/services/resend-verification.service.ts
- [x] T035 [P] 補齊註冊/驗證流程效能驗證（p95 < 2s）於 backend/tests/integration/performance-registration.integration.test.ts
- [x] T036 [P] 補齊 E2E 執行說明與驗收步驟（含 trace/screenshot 產物）於 specs/001-user-registration-service/quickstart.md
- [x] T037 執行格式檢查與任務編號稽核（T001~T037）於 specs/001-user-registration-service/tasks.md

---

## Dependencies

### Phase Dependencies

- Phase 1 → no dependency
- Phase 2 → depends on Phase 1 completion
- Phase 3/4/5 (US1/US2/US3) → all depend on Phase 2 completion
- Phase 6 → depends on at least one completed story; final closeout after US1~US3

### User Story Dependencies

- **US1 (P1)**: first deliverable and MVP baseline
- **US2 (P2)**: depends on foundational auth primitives; functionally independent from US3
- **US3 (P3)**: depends on foundational data/security primitives; functionally independent from US2

### Within-story Ordering Rules

- Test tasks first → implementation tasks second
- Schema/model alignment before service updates
- Service updates before route/UI updates

---

## Parallel execution examples

### Example A: US1 tests in parallel

```bash
Task: "T010 [US1] backend/tests/contract/auth-register.contract.test.ts"
Task: "T011 [US1] backend/tests/contract/auth-verify-email.contract.test.ts"
Task: "T012 [US1] backend/tests/integration/auth-registration-flow.integration.test.ts"
```

### Example B: Foundational model alignment in parallel

```bash
Task: "T006 backend/src/models/email-verification-token.ts"
Task: "T007 backend/src/models/user-account.ts"
Task: "T008 backend/src/models/registration-audit-event.ts"
```

### Example C: Cross-cutting validation in parallel

```bash
Task: "T032 specs/001-user-registration-service/contracts/openapi.yaml"
Task: "T035 backend/tests/integration/performance-registration.integration.test.ts"
Task: "T036 specs/001-user-registration-service/quickstart.md"
```

---

## Implementation strategy

### MVP first (US1 only)

1. Complete Phase 1 and Phase 2.
2. Complete US1 test tasks (`T010`~`T013`) and then US1 implementation tasks (`T014`~`T019`).
3. Validate only US1 acceptance flow (register → verify).
4. Freeze MVP baseline before moving to US2/US3.

### Incremental delivery

1. Setup + Foundational complete.
2. Deliver US1 (MVP) and validate independently.
3. Deliver US2 and validate independently.
4. Deliver US3 and validate independently.
5. Execute Phase 6 for contract/perf/docs/format closure.

### Dependency-ordered execution intent

- Task IDs are ordered to follow executable dependency flow: Setup (`T001`~`T004`) → Foundation (`T005`~`T009`) → US1 (`T010`~`T019`) → US2 (`T020`~`T025`) → US3 (`T026`~`T031`) → Polish (`T032`~`T037`).

---

## Format validation

- Checklist format rule: every actionable task line is `- [x] T### ...`.
- `[P]` is used only on tasks explicitly parallelizable by file/dependency separation.
- Every user-story phase task contains `[US1]` / `[US2]` / `[US3]`.
- Every task description includes explicit file path(s).
