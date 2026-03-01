# Tasks: 使用者註冊與電子郵件驗證

**Input**: Design documents from `/specs/001-user-registration-service/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are MANDATORY. Every user story includes contract/integration/e2e or unit tests mapped to FR 與風險。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Each task includes exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline tooling for TypeScript + Fastify + Playwright

- [X] T001 建立後端與前端目錄骨架於 backend/src/, backend/tests/, frontend/src/, tests/e2e/
- [X] T002 初始化 Node.js TypeScript 專案設定於 package.json 與 tsconfig.json
- [X] T003 [P] 設定 ESLint/Prettier 規則於 .eslintrc.cjs 與 .prettierrc
- [X] T004 [P] 設定 Vitest 與 Playwright 基礎設定於 vitest.config.ts 與 playwright.config.ts
- [X] T005 [P] 建立環境變數範本與載入機制於 .env.example 與 backend/src/config/env.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 建立 Fastify 啟動與路由掛載入口於 backend/src/app.ts 與 backend/src/server.ts
- [X] T007 [P] 建立資料庫連線與 repository 基礎介面於 backend/src/lib/db.ts 與 backend/src/repositories/base-repository.ts
- [X] T008 [P] 建立共用錯誤格式與 HTTP error handler 於 backend/src/lib/errors.ts 與 backend/src/plugins/error-handler.ts
- [X] T009 [P] 建立 JWT 驗簽與 auth middleware 基礎於 backend/src/lib/jwt.ts 與 backend/src/middleware/auth.ts
- [X] T010 [P] 建立結構化稽核日誌元件（含敏感欄位遮罩）於 backend/src/lib/audit-logger.ts
- [X] T011 建立使用者、驗證 token、稽核事件基礎 schema/model 於 backend/src/models/user-account.ts、backend/src/models/email-verification-token.ts、backend/src/models/registration-audit-event.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 建立帳號並完成驗證 (Priority: P1) 🎯 MVP

**Goal**: 使用者可完成註冊、收到驗證連結並成功將帳號轉為 VERIFIED

**Independent Test**: 提交註冊資料後可取得驗證信（stub），使用有效 token 驗證成功且帳號狀態更新。

### Tests for User Story 1 (MANDATORY) ✅

- [X] T012 [P] [US1] 建立 `/auth/register` 契約測試於 backend/tests/contract/auth-register.contract.test.ts
- [X] T013 [P] [US1] 建立 `/auth/verify-email` 契約測試於 backend/tests/contract/auth-verify-email.contract.test.ts
- [X] T014 [P] [US1] 建立註冊與驗證整合測試於 backend/tests/integration/auth-registration-flow.integration.test.ts
- [X] T015 [P] [US1] 建立「註冊→收信→驗證」E2E 測試於 tests/e2e/register-and-verify.e2e.spec.ts

### Implementation for User Story 1

- [X] T016 [P] [US1] 實作註冊請求 zod schema 與 DTO 於 backend/src/api/schemas/register.schema.ts
- [X] T017 [P] [US1] 實作驗證 token 查驗 schema 於 backend/src/api/schemas/verify-email.schema.ts
- [X] T018 [US1] 實作密碼 Argon2 雜湊服務於 backend/src/services/password-hash.service.ts
- [X] T019 [US1] 實作驗證 token 產生/標記已使用服務於 backend/src/services/email-verification-token.service.ts
- [X] T020 [US1] 實作郵件寄送（含測試 stub）於 backend/src/services/email.service.ts
- [X] T021 [US1] 實作註冊流程服務（建立 UNVERIFIED 帳號+寄送驗證信）於 backend/src/services/registration.service.ts
- [X] T022 [US1] 實作驗證流程服務（有效性檢查+更新 VERIFIED）於 backend/src/services/verify-email.service.ts
- [X] T023 [US1] 實作 `POST /auth/register` 與 `GET /auth/verify-email` 路由於 backend/src/api/routes/auth.routes.ts
- [X] T024 [US1] 實作驗證結果頁（成功/失敗）於 frontend/src/pages/verify-email-result.tsx

**Checkpoint**: User Story 1 fully functional and independently testable

---

## Phase 4: User Story 2 - 防止未驗證帳號直接使用服務 (Priority: P2)

**Goal**: 未驗證帳號被拒絕存取受保護資源，並得到一致且可行動的提示

**Independent Test**: 未驗證帳號呼叫受保護 API 得到 403 + `EMAIL_UNVERIFIED`；驗證完成後可正常存取。

### Tests for User Story 2 (MANDATORY) ✅

- [X] T025 [P] [US2] 建立 `/protected/resource` 契約測試於 backend/tests/contract/protected-resource.contract.test.ts
- [X] T026 [P] [US2] 建立驗證狀態授權整合測試於 backend/tests/integration/verified-access.integration.test.ts
- [X] T027 [P] [US2] 建立未驗證阻擋與提示文案 E2E 測試於 tests/e2e/unverified-access-blocked.e2e.spec.ts

### Implementation for User Story 2

- [X] T028 [US2] 擴充 auth middleware 驗證 account status 並輸出一致錯誤碼於 backend/src/middleware/auth.ts
- [X] T029 [US2] 實作受保護資源路由於 backend/src/api/routes/protected.routes.ts
- [X] T030 [US2] 實作前端未驗證導引元件（含重發入口）於 frontend/src/components/unverified-notice.tsx

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: User Story 3 - 密碼安全保存與重複註冊處理 (Priority: P3)

**Goal**: 密碼不可逆保存且重複 email 註冊有一致回應，不建立重複帳號

**Independent Test**: 儲存層無明文密碼；同 email 重複註冊回傳一致 409 結果且資料筆數不增加。

### Tests for User Story 3 (MANDATORY) ✅

- [X] T031 [P] [US3] 建立密碼雜湊單元測試於 backend/tests/unit/password-hash.service.unit.test.ts
- [X] T032 [P] [US3] 建立重複註冊整合測試於 backend/tests/integration/duplicate-registration.integration.test.ts
- [X] T033 [P] [US3] 建立重複註冊錯誤回應契約測試於 backend/tests/contract/auth-register-duplicate.contract.test.ts

### Implementation for User Story 3

- [X] T034 [US3] 在註冊服務加入 email 唯一檢查與一致錯誤回應於 backend/src/services/registration.service.ts
- [X] T035 [US3] 在 repository 層加入大小寫不敏感 email 查找與唯一保護於 backend/src/repositories/user-account.repository.ts
- [X] T036 [US3] 強化註冊路由錯誤映射（400/409）於 backend/src/api/routes/auth.routes.ts

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T037 [P] 補齊 API 文件與範例回應於 specs/001-user-registration-service/contracts/openapi.yaml
- [X] T038 整理稽核事件覆蓋（註冊/驗證成功/失敗/重發）於 backend/src/services/audit-event.service.ts
- [X] T039 [P] 補齊重發驗證信 API 與流程（FR-008）測試於 backend/tests/integration/resend-verification.integration.test.ts
- [X] T040 實作重發驗證信路由與服務於 backend/src/api/routes/auth.routes.ts 與 backend/src/services/resend-verification.service.ts
- [X] T041 [P] 新增效能驗證測試（register/verify p95 < 2s）於 backend/tests/integration/performance-registration.integration.test.ts
- [X] T042 執行 quickstart 驗證指令並紀錄結果於 specs/001-user-registration-service/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: no dependencies
- **Phase 2 (Foundational)**: depends on Phase 1; blocks all user stories
- **Phase 3 (US1)**: depends on Phase 2
- **Phase 4 (US2)**: depends on Phase 2 and reuses US1 auth/token baseline
- **Phase 5 (US3)**: depends on Phase 2 and partially touches US1 registration flow
- **Phase 6 (Polish)**: depends on target user stories completed

### User Story Dependencies

- **US1 (P1)**: first deliverable, MVP baseline
- **US2 (P2)**: independent goal but depends on foundational auth/user status primitives
- **US3 (P3)**: independent goal but extends register flow implemented in US1

### Within Each User Story

- Tests first (contract/integration/e2e/unit)
- Schema/model before service
- Service before route/UI integration
- Complete story and run mapped tests before moving forward

### Parallel Opportunities

- Setup: T003, T004, T005 can run in parallel
- Foundational: T007, T008, T009, T010 parallelizable after T006
- US1: T012~T015 and T016~T017 parallelizable
- US2: T025~T027 parallelizable
- US3: T031~T033 parallelizable
- Polish: T037, T039, T041 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Tests in parallel
Task: "T012 [US1] backend/tests/contract/auth-register.contract.test.ts"
Task: "T013 [US1] backend/tests/contract/auth-verify-email.contract.test.ts"
Task: "T014 [US1] backend/tests/integration/auth-registration-flow.integration.test.ts"

# Schemas in parallel
Task: "T016 [US1] backend/src/api/schemas/register.schema.ts"
Task: "T017 [US1] backend/src/api/schemas/verify-email.schema.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2
2. Complete Phase 3 (US1)
3. Validate independent test for US1
4. Demo/deploy MVP

### Incremental Delivery

1. Setup + Foundational
2. Deliver US1 and validate
3. Deliver US2 and validate
4. Deliver US3 and validate
5. Run Polish phase and full quality gate (`npm test && npm run lint`)

### Parallel Team Strategy

1. Team completes Setup + Foundational
2. Dev A focuses US1, Dev B US2, Dev C US3 (after Phase 2)
3. Merge by story checkpoints with contract + integration + e2e evidence

---

## Notes

- [P] tasks are intentionally separated by file to reduce merge conflicts
- Story labels [US1]/[US2]/[US3] provide requirement traceability
- All tasks follow required checklist format: `- [ ] Txxx [P?] [US?] description with file path`
