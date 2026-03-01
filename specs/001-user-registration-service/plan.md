# Implementation Plan: 使用者註冊與電子郵件驗證

**Branch**: `001-user-registration-service` | **Date**: 2026-03-01 | **Spec**: [`spec.md`](./spec.md)
**Input**: Feature specification from [`/specs/001-user-registration-service/spec.md`](./spec.md)

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

建立一個以 TypeScript/Node.js 為核心的註冊服務，提供註冊、電子郵件驗證、重發驗證信與受保護資源存取檢查。後端採 Fastify + zod + Argon2 + JWT，並以 Playwright 實作端到端情境測試（搭配 Vitest 單元/整合層），確保 FR-001~FR-009 全數可驗證，且符合憲章對品質、測試、UX 一致性、效能預算、可觀測性的要求。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x on Node.js 20 LTS  
**Primary Dependencies**: Fastify, zod, @node-rs/argon2, jsonwebtoken, nodemailer  
**Storage**: 關聯式資料庫（建議 PostgreSQL；開發/測試可替換記憶體或 sqlite stub）  
**Testing**: Vitest（unit/integration） + Playwright（E2E 流程）  
**Target Platform**: Linux server（容器化部署）
**Project Type**: Web application（backend + frontend + tests）  
**Performance Goals**: 註冊 API 與驗證結果頁在有效情境下 p95 < 2 秒  
**Constraints**: 禁止明文密碼/token 落地或一般日誌外洩；重複註冊不得建立重複帳號；所有 FR 需對應測試  
**Scale/Scope**: 初期單一服務，支援 10k 級註冊帳號與日常高峰註冊流量

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality Gate**: Define lint/type-check/static-analysis approach and confirm no rule suppression without rationale.
- **Testing Gate**: Map each requirement to unit/integration/contract tests; identify pass/fail criteria before implementation.
- **UX Consistency Gate**: Define interaction, naming, error message, and feedback consistency rules for impacted flows.
- **Performance Gate**: Declare measurable performance budget (latency/throughput/resource) and validation method.
- **Observability Gate**: Define required logs/metrics/traces and CI quality gates that prevent regressions.

- **Code Quality Gate**: PASS — 以 TypeScript strict + ESLint + Prettier 為基線；CI 強制 `npm run lint` 與型別檢查，不允許無理由關閉規則。
- **Testing Gate**: PASS — FR-001~FR-009 對應單元/整合/E2E/契約測試；驗收條件寫入 [`quickstart.md`](./quickstart.md) 測試步驟。
- **UX Consistency Gate**: PASS — 註冊/驗證/重發流程統一錯誤命名與行動導引（例如 `EMAIL_UNVERIFIED` + 指向重發驗證）。
- **Performance Gate**: PASS — 以整合測試與 E2E 量測註冊與驗證流程 p95 latency < 2s。
- **Observability Gate**: PASS — 定義結構化稽核事件（註冊、驗證成功/失敗、重發），遮罩敏感欄位；CI gate 以測試+lint 阻擋回歸。

## Project Structure

### Documentation (this feature)

```text
specs/001-user-registration-service/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/
    ├── contract/
    ├── integration/
    └── unit/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

tests/
└── e2e/
```

**Structure Decision**: 採用 Web application 結構（`backend/` + `frontend/` + `tests/e2e`），因需求同時涵蓋 API 契約、驗證結果回饋頁面與跨流程 E2E 驗證。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 無 | N/A | N/A |
