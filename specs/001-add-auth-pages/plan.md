# Implementation Plan: 前端登入註冊與註冊碼驗證流程

**Branch**: `001-add-auth-pages` | **Date**: 2026-03-01 | **Spec**: [`spec.md`](./spec.md)
**Input**: Feature specification from [`/specs/001-add-auth-pages/spec.md`](./spec.md)

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

交付前端註冊、註冊碼驗證、登入與登出完整流程頁面，並對齊既有後端驗證/會話 API。前端技術明確採用 React + Material UI，使用一致狀態回饋與錯誤文案完成 FR-001~FR-010 的可測試體驗；測試以 Vitest + Playwright 驗證主要旅程與邊界情境。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x（Node.js 20 LTS；前端 TSX）  
**Primary Dependencies**: React、Material UI（@mui/material + emotion）、Fastify、zod、jsonwebtoken  
**Storage**: 既有後端帳號資料儲存（關聯式資料庫）+ 前端 session token（httpOnly cookie 或等效既有機制）  
**Testing**: Vitest（單元/整合）+ Playwright（E2E）  
**Target Platform**: Linux server + 現代瀏覽器（Chrome/Firefox/WebKit）
**Project Type**: Web application（frontend + backend + tests）  
**Performance Goals**: 主要步驟（註冊送出、註冊碼送出、登入送出、登出）畫面結果 p95 < 3 秒  
**Constraints**: 錯誤文案需一致且可行動；不可洩漏敏感資訊；FR-001~FR-010 必須具可執行驗收測試  
**Scale/Scope**: 本次聚焦 4 個核心頁面/區塊（Register、Verify Code、Login、Authenticated Shell + Logout）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality Gate**: Define lint/type-check/static-analysis approach and confirm no rule suppression without rationale.
- **Testing Gate**: Map each requirement to unit/integration/contract tests; identify pass/fail criteria before implementation.
- **UX Consistency Gate**: Define interaction, naming, error message, and feedback consistency rules for impacted flows.
- **Performance Gate**: Declare measurable performance budget (latency/throughput/resource) and validation method.
- **Observability Gate**: Define required logs/metrics/traces and CI quality gates that prevent regressions.

- **Code Quality Gate**: PASS — 採 TypeScript strict + ESLint；不新增 rule suppression。UI 元件統一使用 Material UI 設計語彙（按鈕、表單、Alert）。
- **Testing Gate**: PASS — 每個 FR 對應 unit/integration/E2E（映射寫入 [`quickstart.md`](./quickstart.md)）；失敗條件含錯誤碼與 UI 文案一致性。
- **UX Consistency Gate**: PASS — 註冊/驗證/登入/登出共用錯誤格式（`code` + `message` + `action`），並保持相同 CTA 文案與導引。
- **Performance Gate**: PASS — 以 Playwright 量測每步驟送出至結果可見時間，驗收門檻 p95 < 3 秒（符合 [`spec.md`](./spec.md) NFR-PERF-001）。
- **Observability Gate**: PASS — 後端保留結構化稽核事件；CI quality gate 維持 `npm test && npm run lint`。

## Project Structure

### Documentation (this feature)

```text
specs/001-add-auth-pages/
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
│   ├── api/
│   ├── services/
│   └── models/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/

tests/
└── e2e/
```

**Structure Decision**: 採 Web application 結構，前端以 React + Material UI 落地 auth 流程頁面；後端沿用現有 auth API；跨層驗證由 `tests/e2e` 負責。

## Phase 0 — Research Output

已產出 [`research.md`](./research.md)，所有原先不確定點皆已決議，無 `NEEDS CLARIFICATION` 殘留。

## Phase 1 — Design & Contracts Output

- Data model: [`data-model.md`](./data-model.md)
- API contracts: [`contracts/openapi.yaml`](./contracts/openapi.yaml)
- Validation guide: [`quickstart.md`](./quickstart.md)

## Post-Design Constitution Check

- **Code Quality Gate**: PASS — 文件已明確 React + Material UI 元件策略與 lint/type gate。
- **Testing Gate**: PASS — `FR-001`~`FR-010` 已映射至對應測試層級與驗收方法。
- **UX Consistency Gate**: PASS — 命名、錯誤、狀態提示與下一步導引在設計稿層明確定義。
- **Performance Gate**: PASS — 保留 p95 < 3 秒量測法與驗收流程（E2E 可重複）。
- **Observability Gate**: PASS — 稽核事件/錯誤碼與 CI gate 已納入；未新增違反憲章項目。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 無 | N/A | N/A |
