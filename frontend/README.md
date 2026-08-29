# MPLADS Sentinel (रक्षक) — MERN Stack Application

**Beneficiary Ministry:** Ministry of Statistics and Programme Implementation (MoSPI), Government of India  

MPLADS Sentinel is a full-stack **MERN** (MongoDB, Express.js, React 19 / Next.js 16, Node.js) surveillance and risk intelligence platform built for public infrastructure audit. It continuously screens project proposals, PFMS treasury disbursements, milestone execution timelines, OCR-extracted invoices, and site photographs to prioritize potentially irregular works for authorized human investigation.

> 📖 **Complete System Flow Documentation:** See [SYSTEM_OPERATIONAL_FLOW.md](./SYSTEM_OPERATIONAL_FLOW.md) for the in-depth architectural and operational lifecycle breakdown.

---

## 🏛️ MERN Stack Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│               REACT / NEXT.JS FRONTEND                 │
│         (Port 3000 - Turbopack, Tailwind CSS v4)       │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST (JSON)
┌──────────────────────────▼─────────────────────────────┐
│               EXPRESS.JS / NODE.JS API                 │
│             (Port 5000 - Modular Routes)               │
│                                                        │
│  • /api/projects        • /api/evidence                │
│  • /api/investigations  • /api/copilot                 │
│  • /api/analytics       • /api/datasets                │
│  • /api/layout          • /api/ai                      │
└──────────────────────────┬─────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼─────────────────────────────┐
│                   MONGODB DATABASE                     │
│         (Collections: Projects, Evidence,              │
│          Investigations, Analytics, Datasets)          │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 How to Run the MERN Stack Application

### Prerequisites
- **Node.js**: v18.18.0 or newer (Node.js 20+ recommended)
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI (optional; backend includes automatic in-memory fallback)

---

### Step 1: Install Dependencies
Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

---

### Step 2: Seed the MongoDB Database (Optional)
Populate MongoDB with realistic Indian project fixtures (`MPL-004821` showcase in New Delhi, `MPL-004822` duplicate, `MPL-005104` in Varanasi, `CASE-2026-00128`, evidence items, and geo coordinates):

```bash
npm run seed
```

---

### Step 3: Run the Application

#### Option A: Run Full MERN Stack Concurrently (Recommended)
Starts both the Express API server (port 5000) and Next.js frontend (port 3000) in a single terminal:

```bash
npm run dev:all
```

#### Option B: Run Services in Separate Terminals
```bash
# Terminal 1: Start Express.js API Backend (Port 5000)
npm run server

# Terminal 2: Start React / Next.js Frontend (Port 3000)
npm run dev
```

Open your browser at:
👉 **[http://localhost:3000](http://localhost:3000)**  
👉 **API Health Check:** **[http://localhost:5000/api/health](http://localhost:5000/api/health)**

---

## 🧭 Key Navigation Routes

### 🏛️ Core Operational Modules
- **[http://localhost:3000/app/command-center](http://localhost:3000/app/command-center)** — National Executive Command Center (18,432 works, 127 high risk, 34 critical, ₹42.8 Cr flagged value).
- **[http://localhost:3000/app/projects](http://localhost:3000/app/projects)** — Master Projects Directory with multi-column filtering, sorting, progress gap indicators, and CSV export.
- **[http://localhost:3000/app/projects/MPL-004821](http://localhost:3000/app/projects/MPL-004821)** — **Showcase Digital Project Twin** (Village Khera Community Hall, Risk 87/100, 88% financial vs 52% physical progress gap, 99.4% image reuse, ₹41L vs ₹35L invoice mismatch).
- **[http://localhost:3000/app/risk](http://localhost:3000/app/risk)** — Multi-Modal Risk Intelligence Suite (Financial, Timeline, Duplicates, Documents, Computer Vision).
- **[http://localhost:3000/app/risk/documents/compare](http://localhost:3000/app/risk/documents/compare)** — **Document & Layout Similarity Studio** (Drag & Drop file upload, coordinate bounding box matcher, and template fraud screening).
- **[http://localhost:3000/app/evidence](http://localhost:3000/app/evidence)** & **[http://localhost:3000/app/evidence/EVD-IMG-001](http://localhost:3000/app/evidence/EVD-IMG-001)** — Cryptographic Evidence Repository with SHA-256 provenance.
- **[http://localhost:3000/app/investigations](http://localhost:3000/app/investigations)** & **[http://localhost:3000/app/investigations/CASE-2026-00128](http://localhost:3000/app/investigations/CASE-2026-00128)** — Auditor Investigation Workspace with linear Evidence Chain, investigator notes feed, and printable Executive Brief export.
- **[http://localhost:3000/app/copilot](http://localhost:3000/app/copilot)** — Grounded AI Copilot assistant with guideline citations and action steps.
- **[http://localhost:3000/app/analytics](http://localhost:3000/app/analytics)** — National Geospatial Risk Map with clickable pins and state rankings.
- **[http://localhost:3000/app/data](http://localhost:3000/app/data)** — Ingestion Dataset Explorer with all 12 official CSV datasets from MoSPI and eSAKSHI.

### 🌐 Public & Transparency Pages
- **[http://localhost:3000/](http://localhost:3000/)** — Institutional Public Landing Page
- **[http://localhost:3000/about](http://localhost:3000/about)** — Mission & Governance Roles
- **[http://localhost:3000/how-it-works](http://localhost:3000/how-it-works)** — 5-Stage Verification Pipeline Explainer
- **[http://localhost:3000/methodology](http://localhost:3000/methodology)** — Hybrid AI Framework (Rules + ML + NLP + CV + XAI)
- **[http://localhost:3000/research](http://localhost:3000/research)** — Academic & CAG Performance Audit Citations
- **[http://localhost:3000/transparency](http://localhost:3000/transparency)** — Trust & Ethics Center (Human-In-The-Loop Declaration)

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **M** — Database | **MongoDB & Mongoose** | Schemas for Projects, Evidence, Investigations, Analytics, and Datasets |
| **E** — Backend API | **Express.js** | REST endpoints (`/api/projects`, `/api/investigations`, `/api/layout`, `/api/ai`, etc.) |
| **R** — Frontend | **React 19 & Next.js 16** | Turbopack, Tailwind CSS v4, Lucide Icons, Recharts |
| **N** — Runtime | **Node.js** | Modular architecture with concurrent multi-process support |
