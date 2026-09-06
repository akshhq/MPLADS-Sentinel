# MPLADS Sentinel: End-to-End Data Flow & Surveillance Architecture

This document visually details the complete lifecycle of data across the **MPLADS Sentinel AI Multi-Source Surveillance Platform**—from raw statutory data ingestion and multi-vector AI screening to persistent reports compilation and institutional command center delivery.

---

## 1. High-Level Platform Architecture Flow

```mermaid
flowchart TD
    subgraph SOURCES["📁 Layer 1: Data Sources & Field Ingestion"]
        S1["🏛️ 12 Official Government CSVs<br/>(Lok Sabha & Rajya Sabha across 6 stages)"]
        S2["📄 e-SAKSHI Uploads<br/>(PFMS Vouchers, Contractor Bills, AS Orders)"]
        S3["📷 Mobile Field Evidence<br/>(Site Photos with EXIF Geotags & Timestamps)"]
    end

    subgraph INGEST["⚙️ Layer 2: Ingestion, Integrity & Normalization Engine"]
        I1["🔒 Cryptographic SHA-256 Hashing<br/>(Tamper-evident evidence audit vault)"]
        I2["🔄 Schema Standardizer<br/>(Normalizes heterogeneous column naming)"]
        I3["🧠 Entity Resolution Engine<br/>(Levenshtein fuzzy matching of contractors & agencies)"]
        I4["📦 Canonical Work Profile<br/>(Unified digital twin for each work item)"]
    end

    subgraph AI_GRID["🤖 Layer 3: 21-Module Multi-Vector AI Surveillance Grid"]
        direction TB
        M1["Mod 01-04: Statutory & Financial Compliance<br/>(Split Tendering, Sanction Caps, Timeline Drift)"]
        M2["Mod 05-08: Cost & Divergence Analysis<br/>(CPWD Rate Deviations, Physical vs Financial Gap)"]
        M3["Mod 09-12: Duplicate & Anomaly AI<br/>(SBERT Text Similarity, Proximity Clusters, LOF/IForest)"]
        M4["Mod 13-16: Visual & Geospatial AI<br/>(dHash Perceptual Image Reuse, WGS84 Geofencing)"]
        M5["Mod 17: Risk Fusion Engine<br/>(Calibrated Composite Score 0-100 OR Duplicate Flag)"]
        M6["Mod 18-21: Copilot & Statutory Dossier Generator<br/>(MoSPI Guidelines Citations, Inspection Warrant Drafts)"]
    end

    subgraph PERSIST["💾 Layer 4: Persistent Reports DB & Storage"]
        P1["🗄️ reports_db.json<br/>(Durable atomic local database engine)"]
        P2["☁️ Supabase PostgreSQL<br/>(Relational project twins, RLS & cloud backup)"]
        P3["🎯 Active Surveillance Scope<br/>(mode: 'uploaded' | 'unloaded' with 1-click restore)"]
    end

    subgraph API_LAYER["🔌 Layer 5: Express REST API & RBAC Security"]
        A1["/api/datasets/reports — Batch Ledger Catalog"]
        A2["/api/projects — Digital Twin Query & Filter Engine"]
        A3["/api/system/activity — Real-Time Health Telemetry"]
        A4["Strict 7-Role RBAC Authorization Guard"]
    end

    subgraph UI_LAYER["💻 Layer 6: Frontend Command Centers & Statutory Dossiers"]
        U1["📊 National Command Center (/app/command-center)<br/>(Live screening velocity, risk donut, priority queue)"]
        U2["📑 Reports Panel (/app/reports)<br/>(A4 Official HTML Statutory Dossier Viewer & Batch Ledger)"]
        U3["🚨 Risk Intelligence Hubs (/app/risk, /duplicates, /financial)"]
        U4["🔍 Project Digital Twins (/app/projects/:id)"]
    end

    SOURCES --> INGEST
    S1 --> I1
    S2 --> I1
    S3 --> I1
    I1 --> I2 --> I3 --> I4
    I4 --> AI_GRID
    M1 & M2 & M3 & M4 --> M5 --> M6
    AI_GRID --> PERSIST
    M5 & M6 --> P1 & P2
    P1 & P2 --> P3
    PERSIST --> API_LAYER
    API_LAYER --> UI_LAYER
```

---

## 2. Detailed Data Transformation Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Officer as Institutional Officer / Admin
    participant Frontend as Next.js 16 Command Center
    participant API as Express API Server (:5000)
    participant Ingest as Dynamic Ingestion Service
    participant AIEngine as 21-Module AI Grid
    participant DB as Persistent Reports DB
    participant Supabase as Supabase Cloud Sync

    Officer->>Frontend: Clicks 'Ingest All 12 Official Datasets' or Uploads e-SAKSHI CSV
    Frontend->>API: POST /api/datasets/admin/ingest-all (or /upload)
    API->>Ingest: Stream multi-dataset buffers (Lok Sabha & Rajya Sabha)
    
    rect rgb(240, 248, 255)
        note over Ingest: Step 1: Ingestion & Integrity
        Ingest->>Ingest: Compute SHA-256 digital stamp for each dataset
        Ingest->>Ingest: Parse CSV rows & normalize column headers
    end

    rect rgb(255, 245, 245)
        note over Ingest, AIEngine: Step 2: Entity Matching & Anomaly Surveillance
        Ingest->>AIEngine: Pass work candidates across all lifecycle stages
        AIEngine->>AIEngine: Mod 09: SBERT cosine similarity (>88%) for duplicate detection
        AIEngine->>AIEngine: Mod 08: Financial disbursement vs Physical progress gap (>25%)
        AIEngine->>AIEngine: Mod 05: CPWD benchmark unit cost deviation (>28%)
        AIEngine->>AIEngine: Mod 17: Fuse anomalies into Composite Risk Score (0-100)
        AIEngine-->>Ingest: Return itemized anomaly signals & statutory citations
    end

    rect rgb(245, 255, 245)
        note over Ingest, DB: Step 3: Persistence & Scope Commitment
        Ingest->>DB: Save batch run, itemized ledger, analytics & state metrics to reports_db.json
        Ingest->>DB: Set active surveillance scope = 'uploaded'
        Ingest-->>Supabase: Sync project digital twins & investigation cases
    end

    Ingest-->>API: 200 OK (Batch ID, works count, risk distribution)
    API-->>Frontend: Ingestion summary payload
    Frontend->>Frontend: Re-render Command Center, Anomaly Velocity Chart & Reports Panel
    Frontend-->>Officer: Live visual dashboard update with zero latency
```

---

## 3. Stage-by-Stage Processing Lifecycle

### Stage 1: Data Ingestion & Tamper-Evident Hashing
- **Inputs**: 
  - 12 Official Parliamentary Datasets (Lok Sabha & Rajya Sabha: Recommended, Sanctioned, Completed, Expenditures, Installments, Calamity Relief).
  - Ad-hoc e-SAKSHI uploads (measurement books, PFMS release vouchers, contractor bills, geotagged site photographs).
- **Execution**:
  - `crypto.createHash("sha256")` stamps incoming payloads to prevent post-audit modification.
  - Multi-part streaming buffers are read atomically without locking system memory.

### Stage 2: Schema Normalization & Entity Resolution
- **Transformation**: Heterogeneous government column names (`Work_Title`, `work_desc`, `PROJ_NAME`, `Sanctioned_Cost_INR`, `amt_in_lakhs`) are mapped to the uniform `CanonicalWorkProfile`:
```json
{
  "work_id": "WS/MP18152/2024",
  "title": "Construction of MID DAY Meal Shed in Govt Primary school",
  "state": "Punjab",
  "district": "Faridkot",
  "implementing_agency": "FARIDKOT(DEPUTY COMMISSIONER FARIDKOT_IDA)",
  "category": "Normal/Others",
  "sanction_amount": 250000,
  "disbursed_amount": 217500,
  "financial_progress": 87,
  "physical_progress": 52
}
```
- **Levenshtein Contractor Alias Matching**: Fuzzy matches agency variations (e.g., `CPWD Div-IV`, `Exec Eng CPWD 4`, `C.P.W.D. Division 4`) to a single canonical agency UID.

### Stage 3: Multi-Vector AI Anomaly Detection Grid (21 Modules)
Each work item passes through the 6 surveillance dimensions:

| Dimension | Key AI Modules | Anomaly Trigger Criteria | Statutory Citation |
|---|---|---|---|
| **1. Financial Integrity** | Mod 08: Physical-Financial Divergence | Financial disbursement ≥80% while physical execution ≤55% | MPLADS Guidelines 2023 §3.4 |
| **2. Duplicate Asset AI** | Mod 09: SBERT Semantic & Spatial Overlap | Title semantic similarity >88% within <450m proximity | MPLADS Guidelines 2023 §2.4 |
| **3. Cost Benchmarking** | Mod 05: CPWD Schedule of Rates Outlier | Unit cost exceeds state CPWD benchmark by >28% | GFR 2017 Rule 130 |
| **4. Visual Verification** | Mod 13: Perceptual Image Reuse (dHash) | Hamming distance ≤5 between uploaded foundation photo and historical project | Annexure III (Photo Authentication) |
| **5. Geospatial Boundary** | Mod 14: WGS84 Geofencing AI | Geotagged coordinates fall >15 km outside sanctioned constituency | WGS84 Geodetic Norms |
| **6. Splitting & Procurement** | Mod 03: Split Invoicing AI | Multiple vouchers under ₹10 Lakhs issued within 72 hours to bypass e-tendering | CVC Guidelines §4.2 |

---

## 4. Risk Calibration & Tier Classification Matrix

```mermaid
graph TD
    A["Work Item Evaluated by AI Grid"] --> B{"Is Work a Duplicate?<br/>(Mod 09 Match > 88%)"}
    
    B -- "YES" --> C["🚫 NOT RATED (Duplicate Work)<br/>• Level: 'duplicate'<br/>• Score: null (No Rating)<br/>• Risk Band: 'DUPLICATE'<br/>• Badge: Purple (CopyCheck Icon)"]
    
    B -- "NO" --> D["Calculate Composite Risk Score (0 - 100)<br/>Mod 17 Risk Fusion Formula"]
    
    D --> E{"Composite Risk Score Range"}
    E -- "80 - 100" --> F["🚨 CRITICAL RISK<br/>• Immediate Vigilance Inquiry<br/>• Automatic Physical Inspection Warrant"]
    E -- "60 - 79" --> G["⚠️ HIGH RISK<br/>• Audit Review Queue<br/>• Call for Measurement Book (MB)"]
    E -- "35 - 59" --> H["⚡ MEDIUM RISK<br/>• Desk Monitoring<br/>• Normal Progression Check"]
    E -- "0 - 34" --> I["✅ LOW RISK<br/>• Fully Compliant<br/>• Routine Milestone Clearance"]
```

### Risk Score vs. Label Rule:
1. **Unrated Duplicate Rule**: Duplicate work is **strictly unrated** (`score: null`). It displays the purple `Duplicate` badge with the `CopyCheck` icon and is excluded from numerical averages.
2. **Quantitative Ground Truth**: For rated works, the numerical composite score (`score`) is the single ground truth that dictates the label, color, and icon across all badges, gauges, and tables:
   - **80 – 100** $\rightarrow$ `Critical` (Rose / Red)
   - **60 – 79** $\rightarrow$ `High` (Orange)
   - **35 – 59** $\rightarrow$ `Medium` (Amber / Yellow)
   - **0 – 34** $\rightarrow$ `Low` (Emerald / Green)

---

## 5. Reports Persistence & Surveillance Scoping Architecture

```mermaid
stateDiagram-v2
    [*] --> Unloaded_Clean_Baseline: Platform Startup (Zero Fake Data)
    
    state Unloaded_Clean_Baseline {
        direction TB
        Zero_Metrics: 0 Works Monitored • ₹0 Cr Sanctioned • 0 Risk Flags
        Clean_State: Ready for statutory batch ingestion or user CSV upload
    }

    Unloaded_Clean_Baseline --> Processing_Batch: User uploads dataset or runs Admin 1-Click Ingest
    
    state Processing_Batch {
        direction TB
        Parsing: Parse heterogeneous CSV streams
        AI_Run: Execute 21-module AI surveillance grid
        Aggregation: Compute national state metrics, geographic points & monthly trends
    }

    Processing_Batch --> Uploaded_Active_Scope: Commit to reports_db.json
    
    state Uploaded_Active_Scope {
        direction TB
        Catalog_Stored: Batch recorded in catalog (/api/datasets/reports)
        Command_Center_Populated: 500+ works monitored, live anomaly queue active
        Reports_Accessible: Official Statutory A4 Dossier & Itemized Ledger available
    }

    Uploaded_Active_Scope --> Unloaded_Clean_Baseline: Administrator clicks 'Reset Scope to Baseline' (/api/datasets/scope/restore)
```

---

## 6. Frontend Presentation & Command Centers

| Screen / Route | Primary Data Sources | Key Visual Capabilities |
|---|---|---|
| **Command Center**<br/>`/app/command-center` | `GET /api/datasets/scope/active`<br/>`GET /api/analytics/national` | • Dynamic **Risk Screening & Anomaly Velocity Chart** (Composed bar + rate trend line)<br/>• **National Risk Donut** with center total<br/>• **Priority Investigation Queue Table** with live audit action links |
| **Reports Panel**<br/>`/app/reports` | `GET /api/datasets/reports`<br/>`GET /api/datasets/reports/:batchId` | • **Official Statutory HTML Dossier Viewer** with A4 print/PDF export, zoom controls, and dynamic work switching<br/>• **Itemized Works Ledger** with CSV export, search, and duplicate filtering |
| **Risk Intelligence**<br/>`/app/risk`<br/>`/app/risk/duplicates`<br/>`/app/risk/financial` | `GET /api/projects?riskLevel=...` | • High-risk investigation matrix<br/>• Side-by-side duplicate work comparison (Project A vs Project B)<br/>• PFMS expenditure velocity & milestone divergence breakdowns |
| **Project Digital Twins**<br/>`/app/projects/:id` | `GET /api/projects/:id` | • Full physical vs. financial milestone progress gap bar<br/>• Itemized triggered AI anomaly signals with statutory citations<br/>• Geospatial site coordinates and photographic evidence verification |
| **Live Telemetry Card**<br/>(Sidebar Footer) | `GET /api/system/activity` | • Real-time heartbeat of Database engine, Express port `5000`, uptime, and `21/21 Ready` AI modules |
