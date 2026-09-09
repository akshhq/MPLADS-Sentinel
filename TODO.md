# 📋 MPLADS Sentinel — Complete Master TODO List & Technical Debt Register

> **System:** MPLADS Sentinel (रक्षक) — AI-Powered Multi-Source Risk Intelligence & Evidence Verification Platform  
> **Beneficiary:** Ministry of Statistics and Programme Implementation (MoSPI), Government of India  
> **Problem Statement:** SIH26102  
> **Status:** Post-Architecture, Multipage Refactor & Persistent Reports DB Audit  
> 💡 **Manual Actions Guide:** For all external dashboard tasks (Supabase secret keys, storage buckets, auth accounts, Render/Vercel parity), see [`MANUAL_ACTIONS_REQUIRED.md`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/MANUAL_ACTIONS_REQUIRED.md).

---

## 📊 Executive Summary of Current System Audit

| Subsystem | Audit Status | Current State | Root Bottleneck / Immediate Action |
|---|---|---|---|
| **Supabase PostgreSQL** | ✅ **Tables Deployed & Verified** | All 10 tables (`profiles`, `projects`, `evidence`, `investigations`, `datasets`, `state_metrics`, `district_metrics`, `geographic_risk_points`, `national_analytics`, `audit_logs`) are **live and responding**! | Live connection verified. Cloud sync operational. |
| **Persistent Reports DB** | ✅ **Active & Persisted** | Backed by `backend/services/reportsDatabaseService.js` and durably stored in `backend/data/reports_db.json`. 50-batch rolling store. | Real data survives server restarts. Instant 1-click administrative scope reset. |
| **Zero Fake Data Policy** | ✅ **Enforced Across Platform** | All synthetic fallback data eliminated. When un-ingested, rests at authentic baseline (`0 works`, `₹0 Cr`, `0 flags`). | Computes live metrics dynamically upon dataset ingestion. |
| **1-Click Batch Ingest** | ✅ **Operational & Tested** | Ingests all 12 statutory official datasets (45,806+ records across Lok Sabha & Rajya Sabha) in a single click from Command Center or Ingestion Hub. | Full schema normalization and multi-vector risk evaluation. |
| **System Activity Telemetry** | ✅ **Live in Sidebar Footer** | Real-time health card embedded in sidebar (`GET /api/system/activity`) tracking Database, Backend port 5000, and 21/21 AI Modules. | Live telemetry with sub-second polling. |
| **National Geospatial Risk Map** | ✅ **Calibrated & Interactive** | Official India state-boundary geographic risk map (`/maps/india-states.png`) with calibrated WGS84 Geodetic normalization and pulsing radar pins. | State/UT filtering, severity toggles, and Digital Twin side drawer. |
| **Multipage Next.js Layout** | ✅ **Multipage Architecture** | Pure multipage Next.js 16 App Router. Root `/` redirects to `/app/command-center`. Catch-all route `/app/projects/[...projectId]` supports slash-delimited work IDs. | Clean production build across 27 routes. Dynamic API resolution (`getApiBase()`). |
| **Supabase Storage** | ⚠️ **Buckets Missing** | Storage returns `[]`. Public buckets `datasets` and `evidence` need to be created in Supabase Dashboard. | See `MANUAL_ACTIONS_REQUIRED.md` §2. |
| **Supabase Credentials** | 🟡 **Standard Key Connected** | Client successfully connects via `SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_KEY` currently contains the base64 JWT Secret instead of the `service_role` API key. | See `MANUAL_ACTIONS_REQUIRED.md` §1. |
| **AI Engine (Python)** | ✅ **Fully Operational** | 21 modules structured. 5 core multi-modal forensic pillars verified (all-MiniLM-L6-v2, IsolationForest, dHash + CLIP, NetworkX Louvain, ELA). | Connect live binary PDF OCR (PaddleOCR) and dynamic PDF dossier generation. |
| **Backend API (Node)** | ✅ **Operational & Connected** | Express REST API connected with `multer` multipart streaming, real SHA-256 evidence hashing, and 7-role RBAC alignment. | Enhanced health check & investigation state machine active. |

---

## 🔴 Phase 1: Database & Cloud Storage Activation (Priority 1 — Blocker)

- [x] **1.1 Execute Master PostgreSQL Schema in Supabase** *(Completed on 04-Sep-2026)*
  - **Status**: ✅ **VERIFIED & LIVE**. All 10 core tables are active in Supabase PostgreSQL:
    - `public.profiles` (Auth user trigger `on_auth_user_created` verified working)
    - `public.projects`
    - `public.evidence`
    - `public.investigations`
    - `public.datasets`
    - `public.state_metrics`
    - `public.district_metrics`
    - `public.geographic_risk_points`
    - `public.national_analytics`
    - `public.audit_logs`

- [ ] **1.2 Correct Service Role Secret Key in `backend/.env`**
  - **Issue**: The value currently in `SUPABASE_SERVICE_ROLE_KEY` is the base64 **JWT Secret**, which causes API requests using it to return `Invalid API key`.
  - **Action**: In Supabase Dashboard -> **Project Settings -> API -> Project API keys**:
    - Locate the key labeled **`service_role` (secret)** (begins with `sb_secret_` or `eyJhbGciOi...`).
    - Copy it and update `SUPABASE_SERVICE_ROLE_KEY` in [`backend/.env`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/.env).
  - *Note: Backend client has been upgraded to automatically use `SUPABASE_ANON_KEY` as a safe fallback for all read queries in the interim.*

- [ ] **1.3 Create Supabase Storage Buckets**
  - **Action**: In Supabase Dashboard -> **Storage -> New Bucket**:
    1. `datasets` — Set to **Public** (50 MB limit, for the 12 official MoSPI CSV files).
    2. `evidence` — Set to **Public** (25 MB limit, for site photographs, contractor bills, and inspection reports).

- [ ] **1.4 Seed Database with Baseline Projects & Analytics**
  - **Quickest Method (1 Click)**: Open Supabase Dashboard -> SQL Editor, copy and run the ready script:
    👉 [`backend/seed_data.sql`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/seed_data.sql)
  - **CLI Method**: Once the service role key from Step 1.2 is added, run:
    ```bash
    node backend/scripts/upload_datasets_to_supabase.js
    ```

- [x] **1.5 Add Missing `audit_logs` Table to SQL Schema** *(Completed on 04-Sep-2026)*
  - **Status**: ✅ **VERIFIED & LIVE**. `public.audit_logs` exists in database.

- [x] **1.6 Implement Persistent Reports Database (`reports_db.json`)** *(Completed on 08-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**. Created `backend/services/reportsDatabaseService.js` backed by `backend/data/reports_db.json`:
    - Rolling 50-batch historical store with instant disk persistence.
    - Full catalog access via `GET /api/datasets/reports` and `GET /api/datasets/reports/:batchId`.
    - Surveillance scoping operations (`mode: "uploaded" | "unloaded"`) and 1-click restore.

---

## 🟡 Phase 2: Authentication, RBAC & Jurisdictional Security (Priority 2)

- [ ] **2.1 Live Supabase Auth User Provisioning**
  - **Current State**: Frontend uses simulated demo logins storing role in `localStorage` (`mplads_demo_role`) and headers (`x-demo-role`).
  - **Target**: Create the 7 official institutional accounts in Supabase Auth (`auth.users`) with fixed passwords or magic links for production readiness:
    1. `ministry@mpladssentinel.demo` (MoSPI Central Officer)
    2. `state@mpladssentinel.demo` (State Nodal Authority — Rajasthan)
    3. `mp@mpladssentinel.demo` (Hon'ble MP — New Delhi PC-04)
    4. `agency@mpladssentinel.demo` (Implementing Agency — JDA / DSIIDC)
    5. `investigator@mpladssentinel.demo` (Vigilance Investigator)
    6. `field@mpladssentinel.demo` (Field Verification Officer)
    7. `admin@mpladssentinel.demo` (Platform System Administrator)

- [x] **2.2 Dedicated System Administrator Management Portal** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**. Created dedicated route [`/app/admin`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/frontend/src/app/app/admin):
    - Full CRUD user management directly interfacing with `public.profiles`.
    - Change user role and jurisdictional bounds (State, District, Parliamentary Constituency).
    - Toggle account status (`active` / `suspended`).
    - Surveillance scoping operations (`POST /api/datasets/scope/restore`).

- [x] **2.3 Align 7 Institutional Roles in Backend Auth Controller** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**. Added `system_admin` to `OFFICIAL_ROLES` in `backend/controllers/authController.js` and `DEMO_PERSONA_MAP` in `backend/middleware/authMiddleware.js`.

---

## 🟡 Phase 3: Backend API, Storage Streaming & File Pipelines (Priority 2)

- [x] **3.1 Multipart/Form-Data File Upload via Multer** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**.
    - Integrated `multer` memory storage in [`backend/routes/evidenceRoutes.js`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/routes/evidenceRoutes.js).
    - Automated cryptographic SHA-256 computation using Node's `crypto.createHash('sha256')`.

- [x] **3.2 Investigation Case State Machine & Escalation Triggers** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**.
    - Enforced valid state transition matrix in [`backend/controllers/investigationController.js`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/controllers/investigationController.js).
    - Auto-dispatches field inspection warrants when transitioning to `evidence_requested`.
    - Auto-triggers statutory milestone disbursement holds on `confirmed_irregularity`.

- [x] **3.3 1-Click Batch Ingestion for System Administrators** *(Completed on 08-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**.
    - Implemented `POST /api/datasets/admin/ingest-all` in `backend/controllers/datasetController.js`.
    - Automatically streams all 12 statutory MoSPI CSVs (45,806+ records), normalizes schemas, and computes multi-vector anomalies.

- [x] **3.4 Real-Time System Activity Telemetry Endpoint** *(Completed on 08-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**.
    - Added `GET /api/system/activity` in `backend/routes/datasetRoutes.js`.
    - Reports live database record count, Express backend uptime on port 5000, and 21/21 AI module readiness.

---

## 🟢 Phase 4: AI Engine Surveillance Pipeline Enhancements (Priority 3)

- [ ] **4.1 Live PDF Parsing & PaddleOCR Integration (Module 11)**
  - **Current State**: [`ai-engine/modules/mod11_document_intelligence.py`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/ai-engine/modules/mod11_document_intelligence.py) verifies structured `extracted_fields` passed in JSON.
  - **Target**: Integrate direct PDF text & table extraction using `pypdf` / `pdfplumber` or `PaddleOCR` to parse scanned Sanction Orders and Running Account (RA) bills directly.

- [ ] **4.2 Automated Investigation Dossier PDF Generator (Module 19)**
  - **Current State**: [`ai-engine/modules/mod19_dossier_generator.py`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/ai-engine/modules/mod19_dossier_generator.py) produces formatted Markdown/JSON dossiers.
  - **Target**: Add ReportLab or WeasyPrint PDF compilation to generate downloadable, printable official dossiers with MoSPI watermarks and SHA-256 stamps.

- [ ] **4.3 Active Learning Model Calibration Hook (Module 21)**
  - **Current State**: [`ai-engine/modules/mod21_active_learning.py`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/ai-engine/modules/mod21_active_learning.py) maintains an in-memory `_FEEDBACK_LOG`.
  - **Target**: Persist feedback samples to Supabase `audit_logs` and adjust weights dynamically.

- [x] **4.4 Geospatial Cadastral Overlay & Geofencing (Module 14)** *(Completed on 08-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**.
    - Haversine distance metric calibrated against WGS84 Geodetic boundary projection.
    - Proximity clustering and out-of-constituency breach flagging active.

---

## 🟢 Phase 5: Frontend UI/UX Polish & Multipage Refactor (Priority 3)

- [x] **5.1 Calibrated National Geospatial Project Risk Map** *(Completed on 08-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**.
    - Integrated Survey of India calibrated base map asset (`/maps/india-states.png`) in `frontend/src/components/analytics/RiskMapPanel.jsx`.
    - Geocoded anomaly points with animated pulsing radar pins (`animate-ping`).
    - Interactive state/UT scope filtering, severity toggles (`Critical`, `High`, `Normal`), and Digital Project Twin side drawer.

- [x] **5.2 Pure Multipage Layout Refactor** *(Completed on 09-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**.
    - Eliminated standalone landing page; the National Command Center (`/app/command-center`) is now the main dashboard and primary entry point.
    - Root `/` automatically redirects to `/app/command-center`.
    - Created catch-all route [`/app/projects/[...projectId]`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/frontend/src/app/app/projects/[...projectId]/page.jsx) to reliably handle official Indian work IDs containing slashes (e.g., `WS/MP620/2024`).

- [x] **5.3 Dynamic API Resolution & Null-Safety Guarding** *(Completed on 09-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**.
    - Implemented `getApiBase()` in `frontend/src/lib/api/index.js` to automatically connect to local Express backend on port 5000 in browser environments.
    - Hardened `ProjectTable.jsx` and `PriorityQueueTable.jsx` with complete null-safe property accessors, preventing black-screen crashes upon data ingestion.

- [x] **5.4 Batch e-SAKSHI Dropzone Ingestion & 1-Click Add 12 Datasets** *(Completed on 08-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**.
    - Prominently integrated "Add All 12 Files at Once" in both Command Center and Ingestion Hub (`/app/data`).
    - Live anomaly breakdown badges upon completion of batch ingestion.

- [ ] **5.5 Real-Time Alert Subscriptions via Supabase Realtime**
  - **Target**: Subscribe to Supabase Realtime channel on `public.investigations` and display instant notification toasts.

- [ ] **5.6 Mobile Progressive Web App (PWA) Mode for Field Officers**
  - **Target**: Configure PWA manifest (`public/manifest.json`) and service worker for offline geotagged photo capture.

---

## 🚀 Phase 6: DevOps, Testing & Production Hardening

- [x] **6.1 Unified End-to-End Health Check Endpoint** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**. Upgraded `GET /api/health` in `backend/server.js`:
    - Real-time Supabase PostgreSQL ping and latency tracking (`latencyMs`).
    - Python AI Engine microservice status ping (`/health`).
    - Persistent reports database status, active works count, and process memory metrics.

- [x] **6.2 Automated Cross-Tier Integration Test Suite** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**. Created unified test runner [`scripts/test_e2e_integration.js`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/scripts/test_e2e_integration.js) callable via `npm run test:e2e`.

- [x] **6.3 Next.js Production Build Validation** *(Completed on 09-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**. `npm run build` exits with code 0 across all 27 Next.js App Router routes.

- [ ] **6.4 Environment Parity Check on Render & Vercel**
  - **Action**: Verify Render and Vercel environment variables match local `.env` files.
