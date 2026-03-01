# Tasks: 前端登入註冊與註冊碼驗證流程

**Input**: Design documents from `/specs/001-add-auth-pages/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are MANDATORY. Every user story includes test tasks mapped to FR-001~FR-010 and risk scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app paths: `backend/src/`, `frontend/src/`, `backend/tests/`, `tests/e2e/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish shared frontend test/runtime baseline for auth pages.

- [X] T001 Create auth page routing skeleton for register/verify/login in frontend/src/app.tsx
- [X] T002 [P] Add shared auth API client scaffold in frontend/src/services/auth-api.ts
- [X] T003 [P] Add shared auth form utilities and constants in frontend/src/components/auth-form-utils.ts
- [X] T004 Add E2E helper wiring for auth flow navigation in tests/e2e/helpers/e2e-test-helpers.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core cross-story foundation that blocks all user stories until complete.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Implement shared auth session state provider and guard hook in frontend/src/services/auth-session.ts
- [X] T006 [P] Implement shared error mapping (`code/message/action`) for auth APIs in frontend/src/services/auth-error-mapper.ts
- [X] T007 [P] Implement shared form validation rules for email/password/code in frontend/src/services/auth-validation.ts
- [X] T008 Implement protected route gate integration for frontend shell in frontend/src/components/authenticated-shell.tsx
- [X] T009 Align backend protected-route unauthorized response fixture for frontend guard behavior in backend/tests/contract/protected-resource.contract.test.ts

**Checkpoint**: Foundation ready - user story implementation can begin.

---

## Phase 3: User Story 1 - 新使用者註冊並輸入註冊碼 (Priority: P1) 🎯 MVP

**Goal**: User can register, enter email verification code, and complete account verification with clear retry guidance.

**Independent Test**: Register with new email, land on verify-code page, submit valid code to see success; invalid/expired/used code shows actionable error and allows retry.

### Tests for User Story 1 (MANDATORY) ✅

- [X] T010 [P] [US1] Add contract test for `POST /auth/register` success/duplicate in backend/tests/contract/auth-register.contract.test.ts
- [X] T011 [P] [US1] Add contract test for `POST /auth/verify-code` success/failure in backend/tests/contract/auth-verify-email.contract.test.ts
- [X] T012 [P] [US1] Add frontend unit test for register form validation and submit disable behavior in frontend/src/components/__tests__/register-form.test.tsx
- [X] T013 [P] [US1] Add frontend unit test for verify-code input validation and error rendering in frontend/src/components/__tests__/verify-code-form.test.tsx
- [X] T014 [US1] Add integration test for register→verify-code journey in backend/tests/integration/auth-registration-flow.integration.test.ts
- [X] T015 [US1] Add E2E scenario for register→verify-code success/failure paths in tests/e2e/register-and-verify.e2e.spec.ts

### Implementation for User Story 1

- [X] T016 [P] [US1] Implement register page UI (email/password + submit state) in frontend/src/pages/register-page.tsx
- [X] T017 [P] [US1] Implement verify-code page UI (email/code + retry guidance) in frontend/src/pages/verify-email-result.tsx
- [X] T018 [US1] Implement register submit handler and transition to pending-code state in frontend/src/services/register-flow.ts
- [X] T019 [US1] Implement verify-code submit handler with failure-code mapping (`CODE_INVALID`,`CODE_EXPIRED`,`CODE_USED`) in frontend/src/services/verify-code-flow.ts
- [X] T020 [US1] Add unverified notice and next-action CTA behavior in frontend/src/components/unverified-notice.tsx

**Checkpoint**: US1 is independently functional and testable (FR-001~FR-005).

---

## Phase 4: User Story 2 - 既有使用者登入 (Priority: P2)

**Goal**: Verified existing user can login and see authenticated shell with logout button visible.

**Independent Test**: Submit valid credentials on login page and observe authenticated shell + logout button; wrong credentials stay on login page with clear error.

### Tests for User Story 2 (MANDATORY) ✅

- [X] T021 [P] [US2] Add contract test for `POST /auth/login` success/401/403 in backend/tests/contract/protected-resource.contract.test.ts
- [X] T022 [P] [US2] Add frontend unit test for login form validation and error state in frontend/src/components/__tests__/login-form.test.tsx
- [X] T023 [US2] Add integration test for login success/failure and verified-only access in backend/tests/integration/verified-access.integration.test.ts
- [X] T024 [US2] Add E2E scenario for existing verified user login success and invalid-credential failure in tests/e2e/unverified-access-blocked.e2e.spec.ts

### Implementation for User Story 2

- [X] T025 [P] [US2] Implement login page UI and submit feedback states in frontend/src/pages/login-page.tsx
- [X] T026 [US2] Implement login request/response handling and authenticated session update in frontend/src/services/login-flow.ts
- [X] T027 [US2] Render authenticated shell state and ensure logout button visibility in frontend/src/components/authenticated-shell.tsx
- [X] T028 [US2] Add login error UX copy/action consistency for `401`/`403` outcomes in frontend/src/services/auth-error-mapper.ts

**Checkpoint**: US2 is independently functional and testable (FR-006~FR-008).

---

## Phase 5: User Story 3 - 已登入使用者登出 (Priority: P3)

**Goal**: Logged-in user can logout and immediately lose access to protected content until re-login.

**Independent Test**: Click logout from authenticated shell, return to anonymous state, and protected route requires login again.

### Tests for User Story 3 (MANDATORY) ✅

- [X] T029 [P] [US3] Add contract test for `POST /auth/logout` idempotent success in backend/tests/contract/protected-resource.contract.test.ts
- [X] T030 [P] [US3] Add frontend unit test for logout action state transition to `ANONYMOUS` in frontend/src/components/__tests__/logout-button.test.tsx
- [X] T031 [US3] Add integration test for logout then protected-resource block in backend/tests/integration/verified-access.integration.test.ts
- [X] T032 [US3] Add E2E scenario for logout and blocked protected re-entry in tests/e2e/unverified-access-blocked.e2e.spec.ts

### Implementation for User Story 3

- [X] T033 [P] [US3] Implement logout action handler and request lifecycle in frontend/src/services/logout-flow.ts
- [X] T034 [US3] Integrate logout button click behavior and redirect to login/public page in frontend/src/components/authenticated-shell.tsx
- [X] T035 [US3] Enforce post-logout protected route rejection and re-login prompt in frontend/src/services/auth-session.ts

**Checkpoint**: US3 is independently functional and testable (FR-009~FR-010).

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Hardening across all user stories.

- [X] T036 [P] Update auth flow quickstart verification notes and command examples in specs/001-add-auth-pages/quickstart.md
- [X] T037 Run and document quality gate output (`npm test && npm run lint`) in specs/001-add-auth-pages/quickstart.md
- [X] T038 [P] Add/refresh performance measurement steps for p95 < 3s across register/verify/login/logout in tests/e2e/helpers/e2e-test-helpers.ts
- [X] T039 Final UX consistency pass for auth copy/action terminology in frontend/src/pages/register-page.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story Phases (Phase 3~5)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on all target user stories complete.

### User Story Completion Order

1. **US1 (P1)** → MVP baseline (register + verify-code).
2. **US2 (P2)** → login on top of verified accounts.
3. **US3 (P3)** → logout/session invalidation hardening.

### Within Each User Story

- Write tests first (contract/unit/integration/e2e), then implement UI/services.
- UI scaffolding tasks marked [P] can run in parallel with non-overlapping files.
- Core flow handlers complete before final UX copy consistency pass.

### Parallel Opportunities

- Phase 1: T002 and T003 can run in parallel.
- Phase 2: T006 and T007 can run in parallel.
- US1: T010~T013 can run in parallel; T016 and T017 can run in parallel.
- US2: T021 and T022 can run in parallel; T025 can run parallel with T023.
- US3: T029 and T030 can run in parallel; T033 can run before T034/T035 integration.

---

## Parallel Example: User Story 1

```bash
# Parallel test authoring for US1
Task: "T010 [US1] Contract test for POST /auth/register in backend/tests/contract/auth-register.contract.test.ts"
Task: "T011 [US1] Contract test for POST /auth/verify-code in backend/tests/contract/auth-verify-email.contract.test.ts"
Task: "T012 [US1] Frontend unit test in frontend/src/components/__tests__/register-form.test.tsx"
Task: "T013 [US1] Frontend unit test in frontend/src/components/__tests__/verify-code-form.test.tsx"

# Parallel UI implementation for US1
Task: "T016 [US1] Register page in frontend/src/pages/register-page.tsx"
Task: "T017 [US1] Verify-code page in frontend/src/pages/verify-email-result.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate US1 independently via T010~T015.
5. Demo/deploy MVP increment.

### Incremental Delivery

1. Setup + Foundational complete.
2. Deliver US1 and validate independently.
3. Deliver US2 and validate independently.
4. Deliver US3 and validate independently.
5. Finish Polish phase and quality/performance checks.

---

## Notes

- [P] tasks use different files and no direct dependency.
- Setup/Foundational/Polish tasks intentionally do not include `[USx]` labels.
- Every task includes a concrete file path.
- User stories remain independently testable by their listed Independent Test criteria.
