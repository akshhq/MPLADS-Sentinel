# SIH26102 — Complete Working Knowledge Base

> **⚠️ Scope Lock:** We verified the real MPLADS export (see §20–21) contains no images and no document content — the "Image" field in Works Completed is a text placeholder (`"Images"`), not actual image data. Everything below involving Document/Image Intelligence is kept as designed *roadmap*, explicitly marked `[DEFERRED]`, and moved out of §27's MUST HAVE list. This keeps this doc consistent with `MPLADS_Sentinel_Custom_AI_Specification.md`.

> **Purpose:** Master reference containing everything established so far for the MPLADS AI monitoring project.

## 1. Problem Statement

**SIH26102:** Development of an AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation.

**Organization:** MoSPI  
**Division:** Data Informatics & Innovation Division (DIID)  
**Category:** Software  
**Theme:** Miscellaneous

### Core interpretation

The project should not be treated as merely an “AI fraud detector” or another dashboard.

The strongest interpretation is:

> **An evidence-driven, AI-powered lifecycle and risk-intelligence layer for MPLADS that continuously checks whether project claims, financial activity, documents, images, timelines and reported progress are consistent with the approved project plan and with each other.**

---

# 2. Existing Ecosystem Understanding

MPLADS is currently supported by the **eSAKSHI** digital ecosystem.

The current workflow should be understood approximately as:

```text
MP Recommendation
        ↓
District / Competent Authority
        ↓
Feasibility / Sanction
        ↓
Implementing Agency
        ↓
Work Execution
        ↓
Progress / Documents / Images
        ↓
Payment Requests
        ↓
PFMS / Government Payment Flow
        ↓
Completion / Closure
```

Important correction:

> The system should not be designed around the assumption that money simply flows from the ministry directly to an individual worker.

The current ecosystem includes Implementing Agencies, vendors, government authorities and PFMS/payment mechanisms.

### Product implication

Do **not** replace eSAKSHI unless required.

Preferred framing:

> **eSAKSHI + AI Trust / Intelligence Layer**

The existing platform records what stakeholders report. The proposed system checks:

> **Does the evidence support what was reported?**

---

# 3. Core Product Philosophy

The goal should not be:

> “Guarantee zero fraud.”

No software can honestly guarantee that.

The goal should be:

### **Fraud-resistant by design + continuously verifiable + difficult to manipulate + easy to investigate.**

Use three major control layers:

```text
PREVENTION
    ↓
DETECTION
    ↓
INVESTIGATION
```

### Prevention

- Role-based access
- Separation of duties
- Approval controls
- Budget locks
- Milestone dependencies
- Mandatory evidence
- Versioned records
- Direct/controlled payment workflow

### Detection

- Rule engine
- Statistical anomaly detection
- ML
- NLP
- Computer vision
- Graph analytics
- Predictive models

### Investigation

- Evidence-linked alerts
- Explainable risk scores
- Complete audit history
- Related documents
- Related payments
- Related projects
- Case management

---

# 4. Proposed End-to-End Lifecycle

```text
PROJECT PROPOSAL
      ↓
ELIGIBILITY / COMPLIANCE CHECK
      ↓
TECHNICAL ESTIMATION
      ↓
PROJECT BLUEPRINT
      ├── Scope
      ├── Budget
      ├── Timeline
      ├── Milestones
      ├── Dependencies
      └── Evidence Requirements
      ↓
ADMINISTRATIVE / TECHNICAL APPROVAL
      ↓
IMPLEMENTING AGENCY ASSIGNMENT
      ↓
EXECUTION
      ↓
MILESTONE-BASED PROGRESS
      ├── Report
      ├── Documents
      ├── Images
      ├── Measurements
      └── Financial Data
      ↓
CONTROL ENGINE
      ├── RBAC
      ├── Budget Controls
      ├── Approval Controls
      └── Immutable Audit Trail
      ↓
AI VERIFICATION
      ├── Financial
      ├── Timeline
      ├── Document
      ├── Image
      ├── NLP
      ├── Graph
      └── Prediction
      ↓
RISK ENGINE
      ↓
EXPLAINABLE ALERT
      ↓
HUMAN / AUTHORIZED REVIEW
      ↓
CASE OUTCOME
      ↓
FEEDBACK
```

---

# 5. Project Blueprint

Every approved project should have a structured digital blueprint.

## Project identity

- Project ID
- MP
- Constituency
- State
- District
- Village / ward
- Exact location
- GPS coordinates
- Work category
- Work description
- Beneficiary information
- Implementing Agency

## Scope

- Exact work
- Components
- Quantity
- Unit
- Specification
- Expected output
- Maintenance responsibility

## Timeline

Do not store only one completion date.

Use:

> **Work Breakdown Structure + Milestones + Dependencies**

Example:

```text
Site Preparation
      ↓
Foundation
      ↓
Structure
   ┌──┴───────┐
   ↓          ↓
Electrical   Plumbing
   └────┬─────┘
        ↓
    Finishing
        ↓
    Inspection
        ↓
    Completion
```

Each milestone should have:

- Planned start
- Planned end
- Actual start
- Actual end
- Dependency
- Responsible actor
- Expected output
- Budget
- Required evidence

---

# 6. Financial Model

Do not represent a project as only:

> Total project = ₹X

Use:

```text
Project Budget
    ↓
Component Budget
    ↓
Activity / Milestone Budget
    ↓
Commitments
    ↓
Payments
    ↓
Verified Expenditure
```

Recommended states:

1. Planned
2. Sanctioned
3. Committed
4. Paid / Disbursed
5. Verified Expenditure

Important principle:

> **Money transferred ≠ money spent ≠ expenditure verified.**

---

# 7. Evidence Architecture

Every important claim should have evidence.

Example:

### Claim

> Foundation completed.

Required evidence could include:

- Progress report
- Photograph
- GPS
- Timestamp
- Measurement
- Responsible person
- Inspection record
- Supporting document

Represent this as:

```text
CLAIM
  ↓
EVIDENCE
  ↓
VERIFICATION
  ↓
TRUST / RISK SIGNAL
```

Everything should be linked to the Project ID and milestone.

---

# 8. Document System

Potential documents:

- Proposal
- Estimate
- Feasibility report
- Technical sanction
- Administrative sanction
- Work order
- Invoice
- Bill
- Utilization certificate
- Progress report
- Inspection report
- Completion certificate
- Other supporting documents

AI should verify:

- Document type
- Required fields
- Project ID
- Dates
- Amounts
- Authority names
- Agency
- Milestone
- Cross-document consistency
- Duplicate documents
- Suspicious alterations

---

> **MVP reality check on §5–8:** these four sections describe the full target data model — useful as the north star, and worth keeping for onboarding/roadmap purposes. But for the SIH build, only these fields are actually populated in our real data: Work ID, MP, State, Constituency (not District/Village/GPS), Work category/description, IDA, Recommended/Sanctioned/Disbursed amounts, and dates. No milestones, no BOQ, no document system, no evidence architecture beyond what the structured CSVs give us. Build against real fields first; treat the rest as Phase 2 design.

---

# 9. Image Verification *(🔮 DEFERRED — no real image data, see Scope Lock)*

Major problem:

> Work is incomplete or incorrect, but a different / old / unrelated image is submitted and approved.

Potential controls:

## Capture controls

Capture through the application where possible.

Store:

- GPS
- Timestamp
- Project ID
- Milestone ID
- Device information
- Capture metadata

## AI checks

- Wrong asset type
- Reused image
- Near-duplicate image
- Inconsistent progress
- Possible image manipulation
- Image/location mismatch
- Image/project mismatch
- Repeated evidence

## Progress verification

Compare:

```text
Reported Progress
+
Milestone State
+
Previous Images
+
Current Image
+
Financial Utilization
```

Example:

> Reported progress = 80%  
> Financial utilization = 91%  
> Visual stage = approximately 50–60%

→ High-risk inconsistency.

---

# 10. Completion Certificate Verification *(🔮 DEFERRED — no real document data, see Scope Lock)*

A completion certificate should be checked for:

### Structural correctness

- Project ID
- Work description
- Amount
- Completion date
- Authority
- Agency
- Required fields
- Required signatures / approvals

### Cross-document consistency

Compare against:

- Sanction
- Work order
- Expenditure
- Progress reports
- Inspection report
- Images

Example:

```text
Completion certificate:
₹28 lakh

Ledger:
₹32 lakh

→ Financial inconsistency
```

---

# 11. Major Fraud / Irregularity Taxonomy

`✅ MVP` = detectable with real data now. `🔮 Deferred` = needs document/image/GPS data we don't have.

| Category | Example | Potential Detection | Status |
|---|---|---|---|
| 💰 Cost inflation | Estimate far above comparable work | Benchmark ML | ✅ MVP |
| 🔁 Duplicate project | Similar description, same constituency | NLP similarity | ✅ MVP |
| 💸 Payment anomaly | Unusual amount/timing/uniformity | ML/statistics | ✅ MVP |
| 🏦 Vendor concentration | One vendor dominates a district/MP | Graph/HHI | ✅ MVP — already validated on real data |
| 🏗️ Abandoned/stalled work | Status stuck, funds disbursed | Timeline + status model | ✅ MVP |
| 🔀 Budget/threshold violation | Work below ₹2.5L, missed SC/ST quota | Rules | ✅ MVP |
| 📉 Under-delivery | High spend, "In Progress" status persists | Financial vs. status proxy | ✅ MVP (proxy only — see §15 note) |
| 🧾 False billing | Invoice doesn't match work | Rules + NLP | 🔮 Deferred |
| 👻 Ghost work | Asset does not exist | CV + field verification | 🔮 Deferred |
| 🔁 Duplicate billing | Same expense submitted twice | Transaction matching | 🔮 Deferred — needs invoice-level data |
| 📦 Quantity fraud | Claimed quantity differs from evidence | Structured checks | 🔮 Deferred |
| 🧱 Quality substitution | Lower-grade material | Inspection/CV | 🔮 Deferred |
| ⏱️ False progress | Reported progress overstated | Timeline + CV | 🔮 Deferred — CV part only |
| 📝 Document manipulation | Altered records | Document AI | 🔮 Deferred |
| 🧑‍💼 Unauthorized action | Wrong role approves | RBAC | 🔮 Deferred — needs officer-action logs |
| 📍 Location mismatch | Work evidence elsewhere | GPS | 🔮 Deferred — no GPS in real data |
| 📸 Reused photos | Same evidence in multiple projects | Perceptual hashing/CV | 🔮 Deferred |
| 🧾 Unsupported certificate | Certificate lacks evidence | Document + evidence graph | 🔮 Deferred |
| 🔄 Repeated revisions | Frequent budget/scope changes | Version analytics | 🔮 Deferred — needs version history, not just snapshots |

---

# 12. Role-Based Accountability

Model actual responsibilities instead of putting every operational action on the MP.

Possible roles:

| Role | Responsibility |
|---|---|
| MP | Recommend work |
| District / Competent Authority | Administrative oversight and sanction |
| Technical Officer | Technical verification |
| Implementing Agency | Execution |
| Site Engineer / Responsible Officer | Progress and measurements |
| Finance Officer | Financial verification |
| Inspection Officer | Physical verification |
| MoSPI / Central Authority | Monitoring |
| Auditor | Audit / investigation |

Every important action should record:

```text
WHO
WHAT
WHEN
WHERE / SOURCE
OLD VALUE
NEW VALUE
REASON
SUPPORTING EVIDENCE
AUTHORIZATION
```

---

# 13. Versioning / Audit Trail

Never silently overwrite important records.

Example:

```text
Budget v1 = ₹40L
      ↓
Budget v2 = ₹43L
      ↓
Budget v3 = ₹47L
```

Store:

- Who changed it
- When
- Why
- Approval
- Supporting document

This creates an auditable history and enables AI to detect suspicious revision patterns.

---

# 14. Financial-Physical Consistency

One of the strongest detection concepts:

```text
Financial Progress
        +
Physical Progress
        +
Milestone Progress
        +
Evidence
```

Example:

```text
Physical completion
██████████░░░░░ 62%

Financial utilization
███████████████ 88%
```

→ **Financial–Physical Mismatch**

This is a risk signal, not proof of fraud.

---

# 15. Project Digital Twin *(MVP — trimmed to real fields)*

Every project can have a live state. Fields marked `🔮` are Phase 2 (need document/image data); everything else is buildable now.

```text
WORK #<Work ID from Expenditure.csv>

Sanctioned Amount
₹42,00,000

Financial Progress (disbursed ÷ sanctioned)
78%

Status Proxy ("In Progress" / "Completed")
"In Progress"

Recommend → Sanction Gap
38 days   (flag if > 45-day guideline SLA)

Documents               🔮 not available in current data
19 / 21 verified

Evidence                🔮 not available in current data
14 / 17 verified

AI Risk
82 / 100

IDA (Implementing Agency)
<from data>
```

This becomes the work's single operational view — real fields today, with clearly marked placeholders for the Phase 2 fields so the UI doesn't silently imply data that isn't there.

---

# 16. Graph Model

## Real-data version (MVP)

```text
MP
 │
Work
 │
State / Constituency
 │
Agency (IDA)
 │
Vendor
 │
Payment
```

MVP graph signals — all buildable now:

- Vendor concentration (already validated: one vendor, 119 payments, one MP — ~10x the 99th-percentile vendor)
- Agency concentration across a state/constituency
- Suspicious work-description clusters (via NLP similarity, not GIS)

## Phase 2 extension `🔮`

```text
... + Officer, Bank/Payment Entity, Invoice, Document, Evidence, Location (GPS)
```

- Same document across projects, same image across projects, officer-level action patterns — all require data we don't currently have.

---

# 17. Hybrid AI Philosophy

Use the correct technology for the correct task.

### Deterministic rules

When the answer is deterministic.

Example:

> expenditure > sanctioned amount

### ML / statistics

When the pattern is uncertain.

Example:

> This project is unusually expensive compared with similar projects.

### NLP / LLM

When language/document reasoning is involved.

Example:

> Compare a completion certificate with the sanctioned work.

### Computer Vision

When visual evidence matters.

Example:

> Does this image appear consistent with the claimed asset/stage?

### Graph analytics

When relationships matter.

Example:

> Does a vendor show unusual connections across projects?

---

# 18. Risk Engine

Do not use a single black-box model.

Example:

```text
Risk =

25% Financial Anomaly
20% Timeline Anomaly
20% Compliance Risk
15% Duplicate Similarity
20% Agency / Graph Risk
```

(Documentation/Evidence Risk removed from the live formula — deferred, no real evidence data yet. Re-introduce it once Document/Image Intelligence ships in Phase 2.)

Then expose the contribution, using only real signals:

```text
RISK = 79

Financial anomaly (payment structuring)     +24
Graph/vendor concentration (10x 99th pctile) +20
Compliance (below Rs.2.5L threshold)         +18
Timeline anomaly                              +9
Duplicate similarity                          +8
```

---

# 19. AI Risk Categories

### 🟢 Low

Normal variation.

### 🟡 Medium

One or more unusual signals.

### 🟠 High

Multiple independent anomalies.

### 🔴 Critical

Multiple strong signals and/or evidence inconsistency.

The system should say:

> **Potential irregularity — investigation recommended**

not:

> **Fraud confirmed.**

---

# 20. Real MPLADS Datasets Currently Available

The current uploaded datasets are (verified counts, after stripping the "Grand Total" footer row every raw file contains — don't recount from the raw files without stripping that row first, it'll throw off every downstream sum):

| Dataset | Real rows (LS + RS) | Main use |
|---|---:|---|
| Works Recommended | 7,000 + 4,000 = 11,000 | Recommendation stage |
| Works Sanctioned | 5,000 + 5,000 = 10,000 | Sanction + status |
| Works Completed | 3,000 + 6,000 = 9,000 | Completion |
| Expenditure | 8,000 + 7,000 = 15,000 | Expenditure + vendor/payment |
| Allocated Limit | 543 + 231 = 774 | MP allocation |
| Calamity Consent | 12 + 20 = 32 | Calamity allocation |

**Total real rows: 45,806** (corrects the earlier "~51,816" estimate, which wasn't computed from the actual cleaned data).

The files are real uploaded MPLADS datasets and should be treated as the baseline data source for the prototype.

---

# 21. Important Dataset Fields

## Recommended / Sanctioned

Common fields include:

- Sr. No.
- Work category
- Work
- State
- IDA
- MP
- Constituency / Elected-Nominated
- Work description
- Recommended date
- Sanction date
- Recommended amount
- Sanction amount
- Work status

## Completed

Common fields include:

- Work category
- Work
- State
- IDA
- Work description
- MP
- Constituency / Elected-Nominated
- Image
- Completion date
- Amount disbursed

## Expenditure

Important fields include:

- State
- Work
- Work ID
- IDA
- MP
- Constituency / Elected-Nominated
- Expenditure date
- Vendor name
- Payment status
- Fund disbursed amount

## Allocation

Includes:

- State
- MP
- Constituency / Elected-Nominated
- Allocated amount

---

# 22. Dataset Limitations

Current public datasets do not obviously expose every internal operational field needed for the complete proposed system.

Potential missing areas:

- Detailed milestone schedule
- BOQ
- Component-level budget
- Individual material quantities
- Full invoices
- Inspection reports
- Completion certificates
- Officer-level action logs
- GPS coordinates
- Stage-by-stage images
- Bank-level transaction details
- Confirmed fraud labels

Therefore use:

### Real data

For the baseline monitoring and analytical prototype.

### Clearly labelled synthetic data

For demonstrating additional transaction/evidence workflows not exposed publicly.

### Future integration

Explain how authorized eSAKSHI/internal systems could provide the missing fields in production.

---

# 23. Dataset Join Strategy

Conceptually:

```text
Recommended
     ↓
Sanctioned
     ↓
Expenditure
     ↓
Completed
```

The datasets contain work identifiers embedded in the `Work` strings and explicit `Work ID` values in expenditure records.

Important:

> The current files appear to represent different slices/subsets of the live ecosystem, so join coverage should be measured after normalization rather than assuming every row will match.

Use normalized work identifiers, dates and other fields.

---

# 24. Proposed Product

## MPLADS Sentinel

### Tagline

> **AI-powered early-warning & audit intelligence for public development works.**

Alternative names:

- MPLADS Rakshak
- MPLADS Insight
- eSAKSHI AI Trust Layer

### Core pitch

> **We built an explainable AI risk engine that continuously analyzes MPLADS works and tells authorities which projects, agencies and districts require attention — and exactly why.**

---

# 25. Strongest Demo

```text
11,000 Works (real, Works Recommended LS+RS)
      ↓
Risk Engine
      ↓
[N] anomalies flagged        ← compute this from your actual run, don't pre-invent it
      ↓
[N] high-risk
      ↓
[N] critical
```

Open a case — the real, already-validated one:

```text
VENDOR: "Ajay Kumar Singh"     RISK SCORE: 79

⚠️ 119 payments from a single MP — ~10x the 99th-percentile vendor concentration
⚠️ Payment amounts unusually uniform (~₹19,992 each, minimal variance)
⚠️ Well above the ₹2.5L minimum-work-amount norm being circumvented via many small payments
```

(Replace the placeholder counts above with real numbers from your pipeline before the pitch — don't present made-up funnel numbers as if they're measured.)

Then:

> **Why is this high risk?**

The system traces every reason back to evidence.

---

# 26. Strongest Differentiator

## Evidence-Linked Risk Intelligence

Every alert should be traceable:

```text
RISK
 ↓
REASON
 ↓
CLAIM
 ↓
EVIDENCE
 ↓
DOCUMENT / IMAGE / PAYMENT
 ↓
ORIGINAL PROJECT EVENT
```

The system does not say:

> “Trust the AI.”

It says:

> **“Here is the evidence that caused the alert.”**

---

# 27. SIH Scope

> **Corrected against the Scope Lock note at the top of this doc.** The previous version of this list had Document consistency and Image reuse detection under MUST HAVE — that's not achievable with the real data we verified (no image/document content exists in the export). Moved to FUTURE below, along with everything else that depends on them.

## MUST HAVE

- Real MPLADS dataset ingestion (45,806 real rows across 6 combined datasets)
- Data normalization
- Work lifecycle view (Recommended → Sanctioned → Completed → Expenditure)
- Compliance/rule engine (against MPLADS Guidelines 2023 numeric thresholds)
- Risk scoring (5-component weighted formula, real signals only)
- Cost anomaly detection
- Timeline anomaly detection (recommend→sanction, sanction→completion gaps)
- Duplicate work detection (text similarity + same constituency, no GPS)
- Financial-vs-status mismatch (disbursed % vs. work status, not visual progress)
- Vendor/agency concentration (graph + HHI) — **already validated on real data**
- Explainable alerts (plain-language, cites the real data field behind each flag)
- District / agency / work dashboards

## STRONG BONUS

- Full agency graph visualization
- AI Audit Copilot (queries structured data only — not documents)
- Predictive delay model

## FUTURE *(explicitly deferred — needs data that doesn't currently exist publicly)*

- Document consistency / Document Intelligence
- Image reuse detection / Image Verification (all 6 checks)
- GPS/location validation (real data only has State + Constituency, no coordinates)
- Visual progress estimation (needs image data)
- Document authenticity / manipulation signals
- Satellite verification
- Advanced deepfake detection
- Real bank integration
- Nationwide live integration
- Advanced multimodal models

---

# 28. Core Design Principle

> **Every rupee should be traceable to an approved project component, every component should be traceable to a milestone, every milestone should have evidence, and every important action should have an accountable actor and immutable history.**

Then AI asks:

> **“Does reality still match what the system says should be happening?”**

---

# 29. Key Resources

- Official MPLADS/eSAKSHI: https://mplads.gov.in/
- MPLADS dashboard: https://www.mplads.gov.in/mplads/Dashboard/DashBoard.aspx
- MPLADS Guidelines 2023: https://mplads.gov.in/MPLADS/UploadedFiles/MPLADSGuidelines2023_English_.pdf
- CAG MPLADS reports: https://cag.gov.in/
- Graph fraud research: https://arxiv.org/abs/2306.10857
- Procurement fraud ML research: https://arxiv.org/abs/2304.10105
- Explainable anomaly detection research: https://arxiv.org/abs/2607.13469
