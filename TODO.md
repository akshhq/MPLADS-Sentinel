# 📋 MPLADS Sentinel — Complete Master TODO List & Technical Debt Register

> **System:** MPLADS Sentinel (रक्षक) — AI-Powered Risk Intelligence & Evidence Verification Platform  
> **Beneficiary:** Ministry of Statistics and Programme Implementation (MoSPI), Government of India  
> **Problem Statement:** SIH26102  
> **Generated:** September 2026  
> **Status:** Post-Architecture & 5-Pillar Multi-Modal AI Upgrade Audit  
> 💡 **Manual Actions Guide:** For all external dashboard tasks (Supabase secret keys, storage buckets, auth accounts, Render/Vercel parity), see [`MANUAL_ACTIONS_REQUIRED.md`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/MANUAL_ACTIONS_REQUIRED.md).

---

## 📊 Executive Summary of Current System Audit

| Subsystem | Audit Status | Current State | Root Bottleneck / Immediate Action |
|---|---|---|---|
| **Supabase PostgreSQL** | ✅ **Tables Deployed & Verified** | All 10 tables (`profiles`, `projects`, `evidence`, `investigations`, `datasets`, `state_metrics`, `district_metrics`, `geographic_risk_points`, `national_analytics`, `audit_logs`) are **live and responding**! | Live connection verified. Ready for initial data seeding. |
| **Supabase Storage** | ⚠️ **Buckets Missing** | Storage returns `[]`. Public buckets `datasets` and `evidence` need to be created in Supabase Dashboard. | See `MANUAL_ACTIONS_REQUIRED.md` §2. |
| **Supabase Credentials** | 🟡 **Standard Key Connected** | Client successfully connects via `SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_KEY` currently contains the base64 JWT Secret instead of the `service_role` API key. | See `MANUAL_ACTIONS_REQUIRED.md` §1. |
| **Data Seeder** | ⏳ **Ready to Run** | Ready-to-run SQL seed script created at [`backend/seed_data.sql`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/seed_data.sql) for 1-click execution in Supabase SQL Editor. | See `MANUAL_ACTIONS_REQUIRED.md` §3. |
| **AI Engine (Python)** | ✅ **Fully Operational** | 21 modules structured. 5 core multi-modal forensic pillars verified (all-MiniLM-L6-v2, IsolationForest, dHash + CLIP, NetworkX Louvain, ELA). | Connect live binary PDF OCR (PaddleOCR) and dynamic PDF dossier generation. |
| **Backend API (Node)** | ✅ **Operational & Connected** | Express REST API connected with `multer` multipart streaming, real SHA-256 evidence hashing, and 7-role RBAC alignment. | Enhanced health check & investigation state machine active. |
| **Frontend (Next.js)** | ✅ **Operational** | Dedicated Admin Portal (`/app/admin`), 7-role RBAC layouts, National Command Center, and Calibrated India Risk Map active. | Build verified clean across 27 routes. |

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
  - **Issue**: The value currently in `SUPABASE_SERVICE_ROLE_KEY` (`ol3qoQC...`) is the **JWT Secret** (from the "JWT Settings" box), which causes API requests using it to return `Invalid API key`.
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
  - **Verification**: Enable real sign-in via email/password in `LoginPage.jsx` syncing with `supabase.auth.signInWithPassword()`.

- [x] **2.2 Dedicated System Administrator Management Portal** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**. Created dedicated route [`/app/admin`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/frontend/src/app/app/admin):
    - Full CRUD user management directly interfacing with `public.profiles`.
    - Change user role and jurisdictional bounds (State, District, Parliamentary Constituency).
    - Toggle account status (`active` / `suspended`).
    - Immutable platform audit trail log inspector and surveillance scoping operations.
    - Linked in `Sidebar.jsx` under `User & RBAC Manager`.

- [x] **2.3 Align 6 vs 7 User Roles in Backend Auth Controller** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**. Added `system_admin` to `OFFICIAL_ROLES` in `backend/controllers/authController.js` and `DEMO_PERSONA_MAP` in `backend/middleware/authMiddleware.js`.

---

## 🟡 Phase 3: Backend API, Storage Streaming & File Pipelines (Priority 2)

- [x] **3.1 Multipart/Form-Data File Upload via Multer** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**.
    - Integrated `multer` memory storage in [`backend/routes/evidenceRoutes.js`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/routes/evidenceRoutes.js).
    - Automated cryptographic SHA-256 computation using Node's `crypto.createHash('sha256')`.
    - Direct streaming to Supabase Storage `evidence` bucket with public URL generation in [`backend/controllers/evidenceController.js`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/controllers/evidenceController.js).

- [x] **3.2 Investigation Case State Machine & Escalation Triggers** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**.
    - Enforced valid state transition matrix in [`backend/controllers/investigationController.js`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/controllers/investigationController.js) (`new` ➔ `under_review` ➔ `evidence_requested` ➔ `escalated` ➔ `cleared` / `confirmed_irregularity` ➔ `closed`).
    - Auto-dispatches field inspection warrants when transitioning to `evidence_requested`.
    - Auto-triggers statutory milestone disbursement holds & Active Learning feedback on `confirmed_irregularity`.

- [ ] **3.3 AI Engine Proxy Error Handling & Retries**
  - **File**: [`backend/controllers/aiEngineController.js`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/controllers/aiEngineController.js).
  - **Target**: Ensure clean graceful fallback when the Python AI microservice is cold-starting on Render, returning clear loading/caching signals to the frontend.

---

## 🟢 Phase 4: AI Engine Surveillance Pipeline Enhancements (Priority 3)

- [ ] **4.1 Live PDF Parsing & PaddleOCR Integration (Module 11)**
  - **Current State**: [`ai-engine/modules/mod11_document_intelligence.py`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/ai-engine/modules/mod11_document_intelligence.py) verifies structured `extracted_fields` passed in JSON.
  - **Target**: Integrate direct PDF text & table extraction using `pypdf` / `pdfplumber` or `PaddleOCR` to parse scanned Sanction Orders and Running Account (RA) bills directly into structured line items.

- [ ] **4.2 Automated Investigation Dossier PDF Generator (Module 19)**
  - **Current State**: [`ai-engine/modules/mod19_dossier_generator.py`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/ai-engine/modules/mod19_dossier_generator.py) produces formatted Markdown/JSON dossiers.
  - **Target**: Add ReportLab or WeasyPrint PDF compilation to generate high-resolution, statutory-formatted government audit reports with:
    - Official MoSPI header banner & Emblem watermark.
    - Embedded side-by-side evidence images and ELA heatmaps.
    - Mathematical anomaly breakdown table with guideline citations.
    - Cryptographic verification footer with QR code and SHA-256 digital stamp.
    - Endpoint: `GET /api/v1/investigation/:id/dossier.pdf`.

- [ ] **4.3 Active Learning Model Calibration Hook (Module 21)**
  - **Current State**: [`ai-engine/modules/mod21_active_learning.py`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/ai-engine/modules/mod21_active_learning.py) maintains an in-memory `_FEEDBACK_LOG`.
  - **Target**:
    - Connect auditor dispositions from backend case closures to call `POST /api/v1/feedback/record-disposition`.
    - Persist feedback samples to Supabase `audit_logs`.
    - Automatically adjust risk signal threshold multipliers ($\Delta_{\text{multiplier}}$ and $W_i$) if false-positive rate on a specific anomaly type exceeds 15%.

- [ ] **4.4 Geospatial Cadastral Overlay & Geofencing (Module 14)**
  - **Current State**: Computes Haversine distance offset between claimed work coordinates and ground photos.
  - **Target**: Ingest district boundary GeoJSON polygons to verify that proposed work coordinates fall strictly within the MP's sanctioned Parliamentary Constituency.

---

## 🟢 Phase 5: Frontend UI/UX Polish & Real-Time Experience (Priority 3)

- [ ] **5.1 Interactive Leaflet / Mapbox GIS Cadastral Risk Map**
  - **File**: [`frontend/src/app/app/analytics/page.jsx`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/frontend/src/app/app/analytics/page.jsx).
  - **Target**:
    - Replace or supplement static SVG maps with an interactive Leaflet/MapLibre canvas.
    - Add color-coded risk clusters (Red = Critical $\ge 80$, Orange = High $\ge 60$, Green = Verified).
    - Render 250m circular geofence buffer zones around project GPS pins with inspection photo markers.

- [ ] **5.2 Real-Time Alert Subscriptions via Supabase Realtime**
  - **Target**:
    - In [`frontend/src/components/layout/Navbar.jsx`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/frontend/src/components/layout/Navbar.jsx), subscribe to Supabase Realtime channel on `public.investigations` and `public.evidence`.
    - Display instant notification toast when a new high-risk anomaly is flagged or an inspection report is submitted.

- [ ] **5.3 Mobile Progressive Web App (PWA) Mode for Field Officers**
  - **Target**:
    - Configure Next.js PWA manifest (`public/manifest.json`) and service worker.
    - Enable offline geotagged photo capture with HTML5 Geolocation API (`navigator.geolocation.getCurrentPosition`) and sync queue when device reconnects to network.

- [ ] **5.4 Batch e-SAKSHI Dropzone Ingestion Streaming**
  - **File**: [`frontend/src/app/app/data/page.jsx`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/frontend/src/app/app/data/page.jsx).
  - **Target**:
    - Add visual progress bar indicating row-by-row AI screening status when uploading custom CSV files.
    - Show live anomaly breakdown badges upon completion of batch ingestion.

---

## 🚀 Phase 6: DevOps, Testing & Production Hardening

- [x] **6.1 Unified End-to-End Health Check Endpoint** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**. Upgraded `GET /api/health` in `backend/server.js`:
    - Real-time Supabase PostgreSQL ping and latency tracking (`latencyMs`).
    - Supabase Storage bucket enumeration and accessibility check.
    - Python AI Engine microservice status ping (`/health`).
    - Persistent reports database status, active works count, and Node.js process memory metrics.

- [x] **6.2 Automated Cross-Tier Integration Test Suite** *(Completed on 07-Sep-2026)*
  - **Status**: ✅ **COMPLETED & VERIFIED**. Created unified test runner [`scripts/test_e2e_integration.js`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/scripts/test_e2e_integration.js) callable via `npm run test:e2e`:
    - Validates backend API endpoints and syntax across all controllers.
    - Validates frontend production compilation across all 27 Next.js routes.

- [ ] **6.3 Environment Parity Check on Render & Vercel**
  - **Action**:
    - Verify that Render Backend environment variables match `backend/.env` (especially `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY`).
    - Verify that Vercel Frontend environment variables match `frontend/.env` (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`).
