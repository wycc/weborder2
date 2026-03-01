# Phase 0 Research — 前端登入註冊與註冊碼驗證流程

## Decision 1: 前端框架採用 React（TypeScript）+ Material UI
- **Decision**: 前端頁面與互動層以 React（TSX）實作，視覺與元件系統統一採 Material UI。
- **Rationale**: 使用者明確要求 React + Material UI；MUI 提供可存取且一致的表單、按鈕、提示與版面元件，能快速落地一致 UX（符合憲章 III）。
- **Alternatives considered**:
  - 原生 HTML template string：實作速度快但可維護性與一致性不足。
  - 其他 UI 套件（Tailwind + Headless UI）：可行，但不符合本次明確指定。

## Decision 2: Auth 流程切分為四個前端頁面/狀態區塊
- **Decision**: 規劃 Register、Verify Code、Login、Authenticated Shell（含 Logout）四個核心頁面/狀態。
- **Rationale**: 直接對應 FR-001~FR-010 與三條 user story，可獨立測試且利於任務拆分。
- **Alternatives considered**:
  - 單頁多 modal：流程可行，但狀態管理與 E2E 可讀性較差。
  - 將驗證碼流程併入註冊頁：不利於重試與錯誤導引設計。

## Decision 3: 前後端契約沿用既有 JSON 錯誤格式並擴充登入/登出語意
- **Decision**: 契約持續使用 `{ code, message, action? }` 失敗回應語意，並新增登入/登出所需 endpoint 契約。
- **Rationale**: 保持前端錯誤處理一致，降低文案分歧；便於測試驗證一致回饋（憲章 III、V）。
- **Alternatives considered**:
  - 各 API 自訂錯誤格式：短期可行但造成前端判斷分裂。
  - 僅以 HTTP status 判斷：缺乏可行動導引資訊。

## Decision 4: 驗證碼輸入採「使用者輸入 code + email」流程
- **Decision**: 註冊成功後顯示輸入驗證碼畫面，提交 email + code 至驗證 API。
- **Rationale**: 符合本次需求「註冊後有畫面讓使用者輸入 email 送達的註冊碼」，且支援重試與錯誤修正。
- **Alternatives considered**:
  - 僅支援郵件連結點擊驗證：不符合本次使用者明確要求。
  - 驗證碼僅綁定暫存 session：跨裝置/重新整理可用性較差。

## Decision 5: 測試策略為 Vitest + Playwright，E2E 驗證 UX 一致性
- **Decision**: 前端元件/狀態轉換以 Vitest 驗證；跨流程（註冊→驗證碼→登入→登出）以 Playwright 驗證。
- **Rationale**: 能完整覆蓋功能正確性與使用者旅程，並對性能門檻（NFR-PERF-001）進行可重複量測。
- **Alternatives considered**:
  - 僅單元測試：無法證明跨頁流程與實際互動。
  - 僅 E2E：定位問題成本較高，缺少元件層保護。

## Decision 6: Observability 延續後端稽核事件並增加前端可追蹤 correlation id
- **Decision**: 後端保留結構化稽核事件；前端在請求與錯誤回報攜帶/展示可追蹤識別（如 request id）。
- **Rationale**: 有助快速定位註冊或登入失敗原因，符合憲章 V 可觀測性與回歸防護。
- **Alternatives considered**:
  - 僅前端 toast 不記錄：故障追蹤能力不足。
  - 記錄過多 payload：有洩漏敏感資料風險。

## Clarification Resolution Summary
- React + Material UI 已明確納入 technical baseline。
- 驗證流程採「輸入 email + code」而非僅連結點擊。
- 錯誤格式、測試層級、性能驗收方式均已定義。
- 無 `NEEDS CLARIFICATION` 殘留。
