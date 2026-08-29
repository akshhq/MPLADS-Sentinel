# MPLADS Sentinel — Frontend Implementation Roadmap & TODO

> **Source of Truth:** `MPLADS_Sentinel_Frontend_UI_UX_Specification.md` & `MPLADS_Sentinel_Frontend_Implementation_Prompt.txt`
> **Status Legend:**
> `[x]` ALL PHASES COMPLETE & COMPILED WITH ZERO ERRORS

---

## PHASE 1 — FOUNDATION & DESIGN SYSTEM
- [x] Inspect existing workspace and initialize Next.js App Router with TypeScript & Tailwind CSS
- [x] Configure design tokens, CSS variables, typography, and dark/light color themes
- [x] Implement semantic risk badge utilities (Low, Medium, High, Critical) and Indian currency formatters (`₹ Lakhs / Crores`)
- [x] Create domain TypeScript models (`Project`, `RiskSummary`, `RiskReason`, `Evidence`, `InvestigationCase`, `Milestone`, `Dataset`)
- [x] Build robust Mock API and structured dataset fixtures (`src/lib/mock/` & `src/lib/api/`)
- [x] Create global App Shell layout (TopNav, Collapsible Sidebar, Breadcrumbs, Theme Switcher, Quick Search, User Profile)
- [x] Build Global Command Palette (`Cmd+K` / `Ctrl+K`) and Notification Drawer

---

## PHASE 2 — COMMAND CENTER (`/app/command-center`)
- [x] Dashboard Layout with responsive 12-column grid
- [x] Top KPI Row Cards: Works Monitored (18,432), High Risk (127), Critical (34), Flagged Value (₹42.8 Cr)
- [x] Risk Trend Interactive Chart (Area chart with 7D, 30D, 3M, 1Y filters)
- [x] Risk Distribution Donut Chart with live category breakdowns
- [x] Priority Investigation Queue Table with row click navigation, risk badges, primary signals, and action triggers
- [x] Sentinel Live Insight Card highlighting current regional risk patterns
- [x] Quick filter controls (Region, Date range, Severity) with URL synchronization

---

## PHASE 3 — MASTER PROJECTS DIRECTORY (`/app/projects`)
- [x] Searchable, filterable Project Data Table with column sorting and pagination
- [x] Filter Bar (State, District, Category, Status, Risk Level, Date Range) with URL query persistence (`/app/projects?state=...&risk=...`)
- [x] Column visibility controls and export data trigger (CSV)
- [x] Responsive table with mobile card fallback
- [x] Loading skeleton, empty state, and error handling

---

## PHASE 4 — DIGITAL PROJECT TWIN (`/app/projects/[projectId]`)
- [x] Project Header with ID, title, status, and Composite Risk Score Gauge (e.g. 87/100 HIGH)
- [x] Financial Summary Metric Cards (Recommended, Sanctioned, Committed, Paid, Verified Expenditure)
- [x] Financial vs Physical Progress Visual Mismatch Indicator (88% vs 52% gap alert)
- [x] Interactive Horizontal Lifecycle & Milestone Timeline (Site Prep -> Foundation -> Structure -> Finishing)
- [x] Risk Breakdown Bar Chart by category (Financial, Timeline, Image, Document, Graph, Duplicate)
- [x] Mandatory "Why Flagged?" Explainable Risk Reasons card with clickable evidence links
- [x] Evidence Preview Grid with status badges (Sanction, Work Order, Progress Report, Site Images, GPS)
- [x] AI Explanation & Assessment Panel with model confidence
- [x] Action Bar: [Review Evidence], [Ask Sentinel], [Create Investigation Case]

---

## PHASE 5 — RISK INTELLIGENCE SUITE (`/app/risk/*`)
- [x] `/app/risk`: Risk Overview Hub with category breakdown cards
- [x] `/app/risk/financial`: Cost anomaly detection, payment velocity, split payment clustering, expenditure vs progress scatter
- [x] `/app/risk/timeline`: Milestone planned vs actual delay timeline, stalled work alerts, deadline risk probability model
- [x] `/app/risk/duplicates`: Side-by-side Project A vs Project B comparison (Text 92%, GIS 97%, Cost 89% similarity breakdown)
- [x] `/app/risk/documents`: OCR extracted fields & Cross-Document Inconsistency Matrix (Sanction vs Work Order vs Final Bill vs UC)
- [x] `/app/risk/visual`: Computer Vision site photo verification, 99.4% image reuse detection, GPS coordinate distance delta, stage mismatch (Stage 3/7 vs 6/7)

---

## PHASE 6 — EVIDENCE REPOSITORY & PROVENANCE (`/app/evidence/*`)
- [x] `/app/evidence`: Searchable evidence repository with type filters (Document, Image, Payment, Certificate, GPS, Inspection)
- [x] `/app/evidence/[evidenceId]`: Full Evidence Detail with file preview, OCR extraction, AI findings, uploader metadata, and timestamped provenance
- [x] Side-by-side visual comparison viewer with zoom and metadata diff

---

## PHASE 7 — INVESTIGATION WORKSPACE (`/app/investigations/*`)
- [x] `/app/investigations`: Investigation Queue with case priority, status tabs (New, Under Review, Evidence Requested, Escalated, Cleared, Closed), and assigned officers
- [x] `/app/investigations/[caseId]`: Dedicated Auditor Workspace
- [x] Visual Evidence Chain (`Risk` -> `Signal` -> `Claim` -> `Evidence` -> `Source Record`)
- [x] Activity timeline & audit log
- [x] Interactive Investigator Notes system (add note, mention evidence, tag reviewer)
- [x] Action buttons: Request Evidence, Assign Officer, Escalate, Mark Cleared, Confirm Irregularity
- [x] Exportable Investigation Brief generator

---

## PHASE 8 — AI COPILOT & CONTEXTUAL "ASK SENTINEL" (`/app/copilot`)
- [x] Full Copilot Workspace with suggested natural language query cards
- [x] Structured grounding response format (Answer -> Risk Signals -> Evidence Chips -> Guideline Source -> Action Steps)
- [x] Contextual "Ask Sentinel" Slide-over drawer accessible from any Project, Risk, Evidence, or Investigation page
- [x] Automatic context injection without requiring manual re-typing of Project ID

---

## PHASE 9 — ANALYTICS & DATA EXPLORER (`/app/analytics/*` & `/app/data`)
- [x] `/app/analytics`: National risk distribution, state rankings, expenditure patterns
- [x] `/app/analytics/states/[state]`: State-level deep-dive with district comparison and agency concentration
- [x] `/app/analytics/districts/[district]`: District-level analytics with project lists and signal breakdown
- [x] Interactive Project Risk Map with clustering and risk-colored markers
- [x] `/app/data`: MPLADS Grounding Data Explorer (Works Recommended, Sanctioned, Completed, Expenditure)

---

## PHASE 10 — PUBLIC INFORMATION & TRANSPARENCY PAGES
- [x] `/`: Modern Institutional Public Landing Page with Core Workflow Visualizer (`Data -> AI -> Risk -> Evidence -> Investigate`)
- [x] `/about`: Mission, institutional background, MoSPI SIH alignment
- [x] `/how-it-works`: Step-by-step verification pipeline explainer
- [x] `/methodology`: Hybrid AI Architecture (Rules + ML + NLP + CV + Graph + XAI)
- [x] `/research`: Academic and institutional research citations (Guidelines, CAG, SBERT, SHAP)
- [x] `/transparency`: Trust Center (Human-in-the-loop, AI ethics, synthetic data declaration, privacy)

---

## PHASE 11 — DOCUMENT & LAYOUT SIMILARITY STUDIO (`/app/risk/documents/compare`)
- [x] `/app/risk/documents/compare`: Drag-and-drop document upload (PDF, PNG, JPG, TIFF) with live OCR bounding box extraction
- [x] Side-by-side coordinate layout visualizer comparing Zone A (Letterhead), Zone B (Metadata), Zone C (Rates), Zone D (Seal Stamps)
- [x] Candidate repository template matching with discrepancy detection and direct investigation escalation

---

## PHASE 12 — QUALITY, ACCESSIBILITY, PERFORMANCE & VERIFICATION
- [x] Full responsiveness across Desktop (1920x1080, 1440x900), Tablet, and Mobile (375px+)
- [x] Keyboard navigation, ARIA attributes, semantic color + text labels, contrast checks
- [x] Skeleton loaders, empty states, error retry banners
- [x] End-to-end route verification, URL query persistence check, zero console errors
- [x] Clean Next.js 16 build passed with 24/24 production routes generated
