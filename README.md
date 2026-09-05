# 🛡️ MPLADS Sentinel (रक्षक)
### Multi-Source AI Surveillance, Predictive Risk Intelligence & Governance Platform for MPLADS

> **Statutory Alignment**: Ministry of Statistics and Programme Implementation (MoSPI) — Data Informatics & Innovation Division (DIID)  
> **Problem Statement**: **SIH26102** — AI-Powered Multi-Source Surveillance, Risk-Intelligence, and Vigilance Governance Layer for the MPLAD Scheme  
> **Core Operating Philosophy**: *e-SAKSHI records what happened; MPLADS Sentinel verifies whether what happened makes sense, connects evidence across datasets, explains why a case is risky, and prioritizes investigation queues.*

---

## 🔄 Operational Relationship: e-SAKSHI vs. MPLADS Sentinel

```text
┌────────────────────────────────────────────────────────┐
│               e-SAKSHI (System of Record)              │
│  • Work Proposals & MP Recommendations                 │
│  • Administrative (AS) & Financial (FS) Sanctions      │
│  • Measurement Books & Contractor RA Bills             │
│  • Mobile Geo-tagged Milestone Site Photos             │
│  • PFMS Treasury Vouchers & Utilization Certificates   │
└──────────────────────────┬─────────────────────────────┘
                           │ Data Ingestion Pipeline (Upload / API Webhooks)
┌──────────────────────────▼─────────────────────────────┐
│             MPLADS SENTINEL (Surveillance Layer)       │
│  • 21-Module AI Detection Grid                         │
│  • Multi-Source Evidence Cross-Reconciliation          │
│  • Cost Anomaly (CPWD) & Divergence Analysis           │
│  • Visual Deduplication (dHash 99.4%) & Geo-Fencing    │
│  • Calibrated Composite Risk Scoring (0 to 100)        │
│  • Prioritized Investigation Queues & Audit Briefs     │
└────────────────────────────────────────────────────────┘
```

> **Key Architectural Principle**:  
> **MPLADS Sentinel does NOT replace e-SAKSHI.** e-SAKSHI is the statutory transaction and workflow system. Sentinel serves as an **autonomous AI-powered surveillance, verification, and risk-intelligence layer** that consumes data generated across the project lifecycle.

---

## 🌟 Core System Pillars & Latest Capabilities

1. **Zero-Fake-Data Enforcement**:
   - Strictly presents **only authentic, ingested/uploaded data**.
   - All synthetic/mock fallback data has been eliminated. When un-ingested, the system rests at a clean zero baseline (`0 works monitored`, `₹0 Cr sanctioned`, `₹0 Cr disbursed`, `0 risk flags`).
   - Surveillance metrics and anomaly queues populate strictly from uploaded work registers or statutory batches.

2. **Persistent Reports Database (`reports_db.json`)**:
   - Backed by `backend/services/reportsDatabaseService.js` and durably stored in `backend/data/reports_db.json` (with Supabase cloud sync).
   - Every processed audit run, canonical work ledger, and itemized risk dossier is automatically saved and survives server restarts.
   - Fully retrievable from the frontend at **Uploaded Reports** (`/app/reports`) and via REST API (`GET /api/datasets/reports`).
   - Supports active surveillance scoping (`mode: "unloaded" | "uploaded"`) with 1-click administrative scope reset.

3. **1-Click Batch Ingestion for System Administrators**:
   - Ingest all 12 statutory official datasets (Lok Sabha & Rajya Sabha across all 6 lifecycle stages: Recommended, Sanctioned, Completed, Expenditure, Installments, Calamity) in a single click from the Command Center (`/app/command-center`) or Ingestion Hub (`/app/data`).
   - Automatically executes schema normalization, cross-dataset entity matching, and multi-vector anomaly detection.

4. **Live System Activity Telemetry (Bottom-Left Sidebar)**:
   - Real-time operational health card embedded in the sidebar footer (`GET /api/system/activity`):
     - **Database**: Status (`Connected` / `Online`), live record count, and active provider.
     - **Backend**: Express port `5000`, process uptime, and heartbeat status.
     - **AI Modules**: `21/21 Ready`, surveillance assurance tier, active model registry.

5. **National Geospatial Project Risk Map**:
   - Official India state-boundary geographic risk map (`/maps/india-states.png`) with calibrated WGS84 Geodetic normalization.
   - Real-time geocoded anomaly points with animated pulsing radar pins (`animate-ping` for Critical/High risks).
   - Interactive state/UT scope filtering, risk severity toggles (`Critical`, `High`, `Normal`), hover tooltips, and click-to-inspect Digital Project Twin side drawer.

6. **Clean, Essential-Stats UI**:
   - Streamlined, high-signal presentation across all pages.
   - Eliminates decorative clutter and focuses exclusively on essential statutory metrics (Total Sanctioned, Total Disbursed, High/Critical Risk Concentration, and Avg Risk Score).

---

## 🌐 Live Deployments & Cloud Endpoints

| Component | Technology | Live URL |
|---|---|---|
| **Frontend Web App** | Next.js 16 (App Router) • React 19 • Tailwind CSS v4 | [https://mplads-sentinel-omega.vercel.app](https://mplads-sentinel-omega.vercel.app) |
| **Backend REST API** | Node.js • Express.js • Supabase PostgreSQL | [https://mplads-sentinel-1.onrender.com](https://mplads-sentinel-1.onrender.com) |
| **Python AI Engine** | FastAPI • 21 AI Modules • Gemini 2.0 Flash | [https://mplads-sentinel-2.onrender.com](https://mplads-sentinel-2.onrender.com) |
| **AI Swagger / Docs**| Interactive OpenAPI Playground | [https://mplads-sentinel-2.onrender.com/docs](https://mplads-sentinel-2.onrender.com/docs) |
| **Cloud Datasets** | Supabase Storage (`datasets` public bucket CDN) | [12 Official Datasets (45,806 Records)](https://vehldtcasdnmghnoktay.supabase.co) |

---

## 🛠️ Architecture & Technology Stack

```text
ML & Analysis:
Python • Pandas • NumPy • SciPy • RapidFuzz • NetworkX (Graph Analytics) • Perceptual Image Hashing (dHash) • Multi-Vector Risk Fusion (21 AI Modules)

Backend & API:
Node.js (Express.js Gateway & RBAC) • Python (FastAPI AI Engine) • Supabase PostgreSQL • Supabase Auth & Storage CDN • Persistent JSON File Database

Frontend & GIS:
Next.js 16 • React 19 • Tailwind CSS v4 • Recharts • Calibrated WGS84 Geodetic India State-Boundary Projection • Lucide React

XAI & COPILOT:
Google Gemini 2.0 Flash • Grounded RAG (MPLADS Guidelines 2023 & GFR 2017) • Explainable Multi-Source Evidence Lineage
```

---

## 🏗️ Monorepo Codebase Structure

```text
MPLADS-Sentinel/
├── ai-engine/                  # 🧠 Python FastAPI Microservice (21 AI Modules)
│   ├── models/                 # Pydantic data schemas (CanonicalWorkProfile, EvidenceCard, Dossier)
│   ├── modules/                # 21 Individual AI Detection Modules (Mod 1 - Mod 21)
│   ├── services/               # Pipeline Orchestrator & Supabase Cloud Dataset Streaming
│   ├── tests/                  # Automated unit test suite (30 unit tests, 100% pass)
│   ├── api.py                  # FastAPI REST & SSE Token Streaming Server
│   ├── config.py               # Weights, thresholds, SLA constants, Supabase URLs
│   ├── Dockerfile              # Production container definition
│   └── requirements.txt        # Python dependencies (google-genai, scikit-learn, networkx)
│
├── backend/                    # ⚙️ Node.js Express Backend
│   ├── config/                 # Supabase client configuration
│   ├── controllers/            # REST endpoint controllers (Auth, Projects, Copilot, Datasets, Analytics)
│   ├── data/                   # 💾 Persistent storage (reports_db.json durable store)
│   ├── middleware/             # RBAC and role enforcement middleware
│   ├── routes/                 # Express API routes (/api/datasets, /api/analytics, /api/system)
│   ├── services/               # Dynamic ingestion, persistent reports DB service, Supabase service
│   ├── utils/                  # Supabase cloud CSV streaming loader & memory cache
│   └── server.js               # Express application entrypoint (port 5000)
│
├── frontend/                   # 🌐 Next.js 16 Web Application (Pure JavaScript/JSX)
│   ├── public/maps/            # 🗺️ Calibrated India State-Boundary Map Asset (india-states.png)
│   ├── src/app/                # 26 App Router pages:
│   │   ├── app/command-center/ # Surveillance Command Center (1-Click Ingest, Live Risk Anomaly Table)
│   │   ├── app/analytics/      # National Analytics & Geospatial Project Risk Map
│   │   ├── app/reports/        # Uploaded Final Reports & Audit Runs Dossier Explorer
│   │   ├── app/data/           # e-SAKSHI Ingestion Hub (Multi-stream upload & batch ingest)
│   │   ├── app/projects/       # Canonical Digital Project Twins & Work Details
│   │   └── app/copilot/        # Grounded AI Audit Copilot with Statutory Citations
│   ├── src/components/         # Reusable UI design system, RiskMapPanel, Sidebar with Live Telemetry
│   ├── src/lib/                # AuthContext (7 Institutional Roles), API client, and formatters
│   └── package.json            # React 19, Tailwind CSS v4, Lucide React, Recharts
│
└── Docs/                       # 📚 Canonical Documentation & Architecture Specifications
    ├── SYSTEM_ARCHITECTURE_AND_DETECTION_FLOW.md       # Master architecture & anomaly taxonomy
    ├── MPLADS_Sentinel_Custom_AI_Specification.md     # 21 AI modules technical specification
    ├── MPLADS_Sentinel_User_Types_RBAC.md             # 7-Role institutional permissions matrix
    ├── MPLADS_Sentinel_Frontend_UI_UX_Specification.md# Frontend design system & UX guide
    ├── SYSTEM_OPERATIONAL_FLOW.md                     # Case state machine & triage lifecycle
    └── SIH26102_Complete_Knowledge_Base.md            # Scheme rules, GFR 2017 & CAG findings
```

---

## 🧠 21-Module AI Detection Grid

$$\begin{array}{|c|l|l|l|l|}
\hline
\textbf{\#} & \textbf{AI Module} & \textbf{Input Data} & \textbf{Core Technique} & \textbf{Primary Output} \\ \hline
1 & \text{Data Quality AI} & \text{Cloud CSVs / Schemas} & \text{Pydantic / Type checks / Hash sets} & \text{Data Quality Score \& Bad-row Flags} \\ \hline
2 & \text{Entity Resolution AI} & \text{Work IDs, Names, Dates} & \text{Levenshtein + Date delta + Embeddings} & \text{Canonical Work Profile \& Link Graph} \\ \hline
3 & \text{Proposal Intelligence} & \text{Work Description, Estimates} & \text{Restricted Lexicon + Median Drift} & \text{Pre-Sanction Price \& Scope Risk} \\ \hline
4 & \text{Statutory Compliance AI} & \text{Category, MP Limits, Dates} & \text{Deterministic Rules + Regex Lexicons} & \text{Guideline Violation Flags \& Citations} \\ \hline
5 & \text{Cost Anomaly AI} & \text{Sanction, Spend, Unit rates} & \text{Isolation Forest + IQR Outlier Models} & \text{Cost Inflation / Deflation Outlier Score} \\ \hline
6 & \text{Timeline Intelligence} & \text{Recom, Sanction, Comp dates} & \text{State Machine + Historical SLA distributions} & \text{SLA Breach Score \& Stalled Status Flag} \\ \hline
7 & \text{Financial Intelligence} & \text{Expenditure vouchers, Amounts} & \text{Installment IQR Spikes, Benford's Law} & \text{Split Payment \& Structuring Alert} \\ \hline
8 & \text{Physical-Financial Divergence} & \text{PFMS spend vs Progress \%} & \text{Ratio gap arithmetic (\delta = \%spend - \%phys)} & \text{Disbursement Advance Risk Score} \\ \hline
9 & \text{Duplicate / Split Work AI} & \text{Descriptions, Costs, Locations} & \text{Semantic RapidFuzz Sim + Distance threshold} & \text{Ghost Work \& Work Splitting Probability} \\ \hline
10 & \text{Vendor Intelligence} & \text{Vendor names, Work values} & \text{Fuzzy string clustering + HHI concentration} & \text{Shell Vendor \& Monopoly Index Flag} \\ \hline
11 & \text{Document Intelligence (OCR)} & \text{PDF Sanctions, Bills} & \text{OCR text & bounding box extraction} & \text{Sanction-vs-Bill Inconsistency Flag} \\ \hline
12 & \text{Document Similarity AI} & \text{Scanned Certificates} & \text{Document Fingerprinting + Layout match} & \text{Reused Certificate Alert} \\ \hline
13 & \text{Visual Verification AI} & \text{Site Photographs} & \text{pHash, dHash, EXIF validation} & \text{Reused Photo \& Stage Mismatch Alert} \\ \hline
14 & \text{Geospatial Intelligence} & \text{GPS coordinates, Geofences} & \text{Haversine Distance Metric} & \text{Geofence Breach (>250m) Flag} \\ \hline
15 & \text{Graph Intelligence} & \text{MP-Agency-Vendor Network} & \text{NetworkX Degree \& Betweenness Centrality} & \text{Collusion \& IDA Self-Dealing Subgraphs} \\ \hline
16 & \text{Predictive Risk AI} & \text{Historical milestone velocities} & \text{Velocity regression / Survival model} & \text{Probability of Chronic Delay (>80\%)} \\ \hline
17 & \text{Risk Fusion Engine} & \text{All module sub-scores (S_i)} & \text{Weighted Multi-Signal Confirmation Matrix} & \text{Composite Risk Score (0-100) \& Band} \\ \hline
18 & \text{Explanation Engine} & \text{Triggered rules, Source rows} & \text{Attribution trees + Statutory Citations} & \text{Plain English Evidence Summary} \\ \hline
19 & \text{Investigation Dossier Gen.} & \text{Work Twin, Audit logs, Hash} & \text{Dynamic Evidence Card + SHA-256 Stamp} & \text{Auditor-Ready Investigation Brief} \\ \hline
20 & \text{Grounded Audit Copilot} & \text{Natural Language auditor query} & \text{Google Gemini 2.0 Flash + Statutory RAG} & \text{Cited Guideline Answers \& Data Cohorts} \\ \hline
21 & \text{Active Feedback & Learning} & \text{Auditor disposition outcomes} & \text{Bayesian Weight Updating / Drift model} & \text{Recalibrated Thresholds} \\ \hline
\end{array}$$

---

## 🏛️ 7-Role Institutional Governance Model

Public self-registration is permanently disabled. User accounts are provisioned exclusively by the **Platform System Administrator** with strict jurisdictional role boundaries:

```text
🏛️ MoSPI Central Ministry Officer  ──► National surveillance, Policy thresholds, All-India scope
📍 State Nodal Authority (SNA)     ──► Statewide multi-district audits, Inter-agency reviews
🇮🇳 Member of Parliament (MP)       ──► Constituency proposal tracking, Fund utilization view
🏗️ Implementing Agency (IA)        ──► Milestone submissions, Invoice & contractor bill uploads
🔍 Vigilance Investigator          ──► Dossier examination, Fraud escalation, Inquiries, Fund freezes
📋 Field Verification Officer      ──► On-site GPS inspection, Geo-tagged photo evidence
⚙️ Platform System Administrator   ──► Technical governance, User & RBAC provisioning, 1-click batch ingest, Scope restore
```

---

## ⚡ Local Development Quickstart

### Prerequisites
- Node.js >= 18.x
- Python >= 3.10
- npm >= 9.x

### 1. Install Dependencies
```bash
# Install Node dependencies across monorepo
npm install

# Install Python AI dependencies
pip install -r ai-engine/requirements.txt
```

### 2. Start All Services Concurrently
```bash
npm run dev:all
```
This launches:
- 🌐 **Frontend (Next.js)**: `http://localhost:3000`
- ⚙️ **Backend (Express)**: `http://localhost:5000`
- 🧠 **AI Engine (FastAPI)**: `http://localhost:8000` *(Interactive Swagger docs at `/docs`)*

### 3. Run Automated AI Unit Tests
```bash
npm run test:ai
# Or: python -m unittest discover ai-engine/tests
```
*(30 unit tests covering all 21 modules with 100% pass rate)*

---

## 📄 License & Attribution
Developed for the **Ministry of Statistics and Programme Implementation (MoSPI)** under project MPLADS Sentinel - **SIH26102** by Team WebShastra.
