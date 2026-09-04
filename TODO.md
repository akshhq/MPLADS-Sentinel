# 📋 MPLADS Sentinel — Complete Master TODO List & Technical Debt Register

> **System:** MPLADS Sentinel (रक्षक) — AI-Powered Risk Intelligence & Evidence Verification Platform  
> **Beneficiary:** Ministry of Statistics and Programme Implementation (MoSPI), Government of India  
> **Problem Statement:** SIH26102  
> **Generated:** September 2026  
> **Status:** Post-Architecture & 5-Pillar Multi-Modal AI Upgrade Audit  

---

## 📊 Executive Summary of Current System Audit

| Subsystem | Audit Status | Current State | Root Bottleneck / Immediate Action |
|---|---|---|---|
| **Supabase PostgreSQL** | ✅ **Tables Deployed & Verified** | All 10 tables (`profiles`, `projects`, `evidence`, `investigations`, `datasets`, `state_metrics`, `district_metrics`, `geographic_risk_points`, `national_analytics`, `audit_logs`) are **live and responding**! | Live connection verified. Ready for initial data seeding. |
| **Supabase Storage** | ⚠️ **Buckets Missing** | Storage returns `[]`. Public buckets `datasets` and `evidence` need to be created in Supabase Dashboard. | Create public `datasets` and `evidence` buckets in Supabase Storage. |
| **Supabase Credentials** | 🟡 **Standard Key Connected** | Client successfully connects via `SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_KEY` currently contains the base64 JWT Secret instead of the `service_role` API key. | Replace with actual `service_role` key from "Project API keys" section (starts with `sb_secret_` or `eyJhbGciOi...`). |
| **Data Seeder** | ⏳ **Ready to Run** | Ready-to-run SQL seed script created at [`backend/seed_data.sql`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/seed_data.sql) for 1-click execution in Supabase SQL Editor. | Run `backend/seed_data.sql` in Supabase SQL Editor. |
| **AI Engine (Python)** | ✅ **Fully Operational** | 21 modules structured. 5 core multi-modal forensic pillars verified (all-MiniLM-L6-v2, IsolationForest, dHash + CLIP, NetworkX Louvain, ELA). | Connect live binary PDF OCR (PaddleOCR) and dynamic PDF dossier generation. |
| **Backend API (Node)** | ✅ **Operational & Connected** | Express REST API connected to live Supabase PostgreSQL instance. Gracefully falls back to fixtures if tables are empty. | Add `multer` multipart streaming to Supabase Storage for physical evidence files. |
| **Frontend (Next.js)** | ✅ **Operational** | 7-role RBAC layouts, National Command Center, Digital Twins, Ingestion Hub, and AI Copilot active. | Enhance interactive GIS parcel map and live Supabase Realtime alerts. |

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

- [ ] **2.2 Dedicated System Administrator Management Portal**
  - **Current State**: Admin user edit modal lives partially in `CommandCenterPage.jsx#admin-users` and saves to `localStorage`.
  - **Target**: Create dedicated route [`/app/admin`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/frontend/src/app/app/admin) (or `/app/users`) restricted strictly to `system_admin`:
    - CRUD user profiles directly in `public.profiles`.
    - Change user role and jurisdictional bounds (State, District, Parliamentary Constituency).
    - Toggle account status (`active` / `suspended`).
    - View live immutable system audit logs.

- [ ] **2.3 Align 6 vs 7 User Roles in Backend Auth Controller**
  - **Observation**: `backend/controllers/authController.js` defines `OFFICIAL_ROLES` with 6 roles, omitting `system_admin` (which is in `frontend/src/lib/authContext.jsx` and `SYSTEM_ARCHITECTURE_AND_DETECTION_FLOW.md`).
  - **Action**: Add `system_admin` to `OFFICIAL_ROLES` in `backend/controllers/authController.js` and `DEMO_PERSONA_MAP` in `backend/middleware/authMiddleware.js`.

---

## 🟡 Phase 3: Backend API, Storage Streaming & File Pipelines (Priority 2)

- [ ] **3.1 Multipart/Form-Data File Upload via Multer**
  - **Current State**: `POST /api/evidence` in [`backend/controllers/evidenceController.js`](file:///d:/Clg/SIH'26/MPLADS-Sentinel/backend/controllers/evidenceController.js) only receives JSON metadata with hardcoded Unsplash image URLs.
  - **Target**:
    - Add `multer` memory storage middleware to `backend/routes/evidenceRoutes.js`.
    - Stream uploaded binary files directly to Supabase Storage `evidence` bucket (`/photos/`, `/bills/`, `/certificates/`).
    - Compute real SHA-256 hash using Node's `crypto.createHash('sha256')` from file buffer.
    - Extract EXIF metadata (GPS latitude/longitude, capture timestamp) from uploaded JPEG/PNG binaries.

- [ ] **3.2 Investigation Case State Machine & Escalation Triggers**
  - **Current State**: Case status can be updated via `PATCH /api/investigations/:id`.
  - **Target**:
    - Enforce valid state transitions: `new` ➔ `under_review` ➔ `evidence_requested` ➔ `escalated` ➔ `cleared` / `confirmed_irregularity` ➔ `closed`.
    - When status changes to `evidence_requested`, automatically dispatch a field inspection warrant with target coordinates to `field_verification_officer`.
    - When status changes to `confirmed_irregularity`, automatically trigger Active Learning feedback (Module 21) and flag the project in `public.projects` as `under_audit`.

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

- [ ] **6.1 Unified End-to-End Health Check Endpoint**
  - **Action**: Enhance `GET /api/health` in `backend/server.js` to report:
    - Supabase PostgreSQL connection status & latency.
    - Supabase Storage bucket accessibility.
    - Python AI Engine microservice status (`/health` ping).
    - Ingestion cache size & memory usage.

- [ ] **6.2 Automated Cross-Tier Integration Test Suite**
  - **Action**: Create a root test script `npm run test:e2e` that validates:
    1. AI Engine microservices (running `ai-engine/test_all_upgrades.py`).
    2. Backend API routes with JWT and mock headers.
    3. Supabase database read/write operations.
    4. Frontend Next.js build compilation (`npm run build`).

- [ ] **6.3 Environment Parity Check on Render & Vercel**
  - **Action**:
    - Verify that Render Backend environment variables match `backend/.env` (especially `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY`).
    - Verify that Vercel Frontend environment variables match `frontend/.env` (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`).
