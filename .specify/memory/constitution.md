<!--
Sync Impact Report
- Version change: N/A -> 1.0.0
- Modified principles:
  - PRINCIPLE_1_NAME -> I. 程式碼品質為預設要求
  - PRINCIPLE_2_NAME -> II. 測試標準不可妥協
  - PRINCIPLE_3_NAME -> III. 使用者體驗一致性
  - PRINCIPLE_4_NAME -> IV. 效能預算與驗證
  - PRINCIPLE_5_NAME -> V. 可觀測性與回歸防護
- Added sections:
  - 品質交付門檻
  - 開發與審查工作流程
- Removed sections:
  - 無
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ⚠ pending: .specify/templates/commands/*.md（目錄不存在，無需調整）
- Deferred TODOs:
  - 無
-->

# Speckit Order Weborder2 Constitution

## Core Principles

### I. 程式碼品質為預設要求
所有變更 MUST 維持可讀性、可維護性與可審查性：
- MUST 通過 lint 與型別檢查，且不得以停用規則規避問題。
- MUST 以小步驟提交，避免單一 PR 混入無關重構。
- MUST 為非直觀邏輯補充註解與設計理由，避免知識只存在於口頭。

Rationale: 穩定的品質基線可降低長期維護成本，並提升跨人員協作效率。

### II. 測試標準不可妥協
所有功能與修補 MUST 具備對應測試，且測試層級需符合風險：
- MUST 至少包含單元測試；跨模組流程或 API 契約變更 MUST 補整合/契約測試。
- MUST 在合併前通過自動化測試流程，且新增功能不得降低既有覆蓋重點。
- MUST 先定義可驗證行為（測試或驗收情境）再實作，避免不可測需求落地。

Rationale: 測試是可重複驗證的規格，能防止回歸並提高交付可預期性。

### III. 使用者體驗一致性
面向使用者的流程 MUST 維持一致、可預測且可恢復：
- MUST 使用一致的命名、互動模式、錯誤訊息與回饋時機。
- MUST 以可理解文案描述失敗原因與下一步，不得僅回傳技術錯誤碼。
- MUST 在規格中定義關鍵使用者旅程與邊界情境，並以驗收情境覆蓋。

Rationale: 一致 UX 可降低學習成本與操作錯誤，直接影響轉換與滿意度。

### IV. 效能預算與驗證
每項功能 MUST 宣告可量測的效能目標，並在交付前驗證：
- MUST 在規劃階段定義 latency/throughput/resource 的至少一項門檻。
- MUST 於測試或基準中呈現結果，若未達標不得宣告完成。
- SHOULD 先採低複雜度方案達成目標，再以量測結果驅動優化。

Rationale: 未被量測的效能無法管理；預算化能避免後期高成本救火。

### V. 可觀測性與回歸防護
系統 MUST 提供足夠訊號支持問題定位與品質守門：
- MUST 對關鍵流程輸出結構化日誌與錯誤脈絡（不含敏感資訊）。
- MUST 在 CI 以品質門檻阻擋回歸（lint、測試、必要效能檢查）。
- SHOULD 追蹤主要體驗與效能指標，支持趨勢觀測與異常預警。

Rationale: 可觀測性與自動化守門可縮短 MTTR，並降低問題外溢風險。

## 品質交付門檻

- 任一規格 MUST 同時包含功能需求與非功能需求（品質、測試、UX、效能）。
- 任一計畫 MUST 提供 Constitution Check，明確對應每條核心原則。
- 任一任務清單 MUST 顯示測試、UX 驗收與效能驗證任務，不得僅列開發任務。
- 合併前 MUST 通過 `npm test && npm run lint`，必要時補充效能驗證證據。

## 開發與審查工作流程

1. 規格階段 MUST 定義使用者旅程、驗收情境、效能與一致性準則。
2. 計畫階段 MUST 進行憲章對照，標記不符合項目與補救方案。
3. 實作階段 MUST 先補足測試與驗證，再提交功能程式碼。
4. 審查階段 MUST 檢查品質門檻與量測證據；不符合者不得合併。

## Governance

本憲章優先於一般慣例與臨時流程。任何 PR、規格、計畫與任務文件都 MUST
通過憲章符合性檢查。

修訂流程：
- 修訂提案 MUST 說明動機、影響範圍、遷移或補強計畫。
- 至少一位維護者審核通過後方可生效，並同步更新相關模板。

版本政策（Semantic Versioning）：
- MAJOR：移除或重定義既有原則，造成治理不相容。
- MINOR：新增原則/章節，或對現有要求做實質擴張。
- PATCH：文字釐清、錯字修正、非語意調整。

合規審查期望：
- 每次功能開發在 plan 與 PR 皆 MUST 記錄憲章符合證據。
- 每次憲章修訂 MUST 檢查 `.specify/templates/` 下相依模板是否同步。

**Version**: 1.0.0 | **Ratified**: 2026-03-01 | **Last Amended**: 2026-03-01
