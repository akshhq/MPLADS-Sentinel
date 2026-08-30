# MPLADS Sentinel — What We Are Actually Building

> **This is the curated project definition.**  
> A new team member should be able to read this document and understand exactly what the project is, what is in scope, what is not, and how the system works.

> **⚠️ Scope Lock:** We verified the real MPLADS export (12 CSVs, 45,806 rows after cleaning) contains no images and no document content — the "Image" field in Works Completed is a text placeholder, not actual image data. Every section below involving Document or Image Intelligence is marked `[DEFERRED — Phase 2]` and is *not* part of the SIH MVP. This keeps this doc consistent with `MPLADS_Sentinel_Custom_AI_Specification.md`, `SIH26102_Complete_Knowledge_Base.md`, and the PPT content bank.

---

# 1. 🎯 One-Line Definition

> **MPLADS Sentinel is an AI-powered evidence and risk-intelligence layer for MPLADS/eSAKSHI that continuously verifies project claims, financial activity, and progress against real MPLADS data, and prioritizes potentially irregular works for investigation.**

*(Document/image verification dropped from the MVP definition — no real document or image data exists in the current export. See §10–11 for the Phase 2 version of this claim.)*

---

# 2. The Problem We Are Solving

MPLADS projects generate large amounts of:

- project data
- financial data
- progress reports
- documents
- certificates
- images
- approval records

The existing digital ecosystem records these activities, but there is a major intelligence problem:

> **How do we automatically determine whether the information being reported is internally consistent and supported by evidence?**

Examples — ✅ = detectable with real data now, 🔮 = needs data we don't have:

- ✅ ₹90 lakh has been spent while status still shows "In Progress," never "Completed."
- ✅ Two works have nearly identical descriptions in the same MP's constituency.
- ✅ A vendor appears unusually frequently, receiving many small, uniform payments across a single MP's works — this pattern is already confirmed in our real data (see §18).
- ✅ A work is repeatedly delayed against the guideline's 45-day sanction SLA or 1-year completion norm.
- 🔮 Project claims 90% completion but only 55% physical progress is visible. *(needs image data)*
- 🔮 The same photograph appears in multiple projects. *(needs image data)*
- 🔮 A completion certificate contradicts the expenditure ledger. *(needs document data)*

---

# 3. What We Are NOT Building

We are **not** building:

- A replacement for eSAKSHI
- A generic government dashboard
- A chatbot with no underlying intelligence
- A system that declares someone guilty of fraud
- A model claiming unrealistic fraud-detection accuracy
- A blockchain project merely for the sake of blockchain

Our preferred architecture is:

```text
eSAKSHI / MPLADS DATA
        ↓
MPLADS SENTINEL
        ↓
AI + RULES + EVIDENCE VERIFICATION
        ↓
RISK + EXPLANATION
```

---

# 4. Product Philosophy

### Existing system

> **Records what happened.**

### Our system

> **Checks whether what happened makes sense.**

More precisely:

> **eSAKSHI is the source/workflow layer; MPLADS Sentinel is the intelligence, verification and risk layer.**

---

# 5. 👥 Primary Users

## Primary

### MoSPI / Central monitoring

Needs:

- national risk overview
- district comparison
- agency risk
- high-value risk cases

### State Nodal Authorities

Needs:

- state-level risk
- constituency/project monitoring
- agency patterns

### District Authorities

Needs:

- investigation queue
- project evidence
- financial/timeline anomalies
- document verification

## Secondary

- MPs
- Implementing Agencies
- Auditors
- Authorized reviewers

## Public layer

A future citizen transparency layer can expose safe project-status information without exposing sensitive investigation data.

---

# 6. 🔄 Actual Product Flow

```text
1. PROJECT PROPOSAL
       ↓
2. ELIGIBILITY / COMPLIANCE
       ↓
3. PROJECT BLUEPRINT
       ↓
4. APPROVAL
       ↓
5. IMPLEMENTING AGENCY
       ↓
6. EXECUTION
       ↓
7. MILESTONE UPDATE
       ↓
8. DOCUMENT + IMAGE + FINANCIAL EVIDENCE
       ↓
9. AI VERIFICATION
       ↓
10. RISK ENGINE
       ↓
11. EXPLAINABLE ALERT
       ↓
12. AUTHORIZED REVIEW / INVESTIGATION
       ↓
13. OUTCOME + FEEDBACK
```

---

# 7. 📝 Project Blueprint

Every project is converted into a structured object. Fields marked `🔮` are not in the real data — this is the full target model, not the MVP.

## Identity

- Project ID (Work ID)
- MP
- State
- Constituency
- Work category
- Work description
- Implementing Agency
- 🔮 District, Location, GPS — real data only has State + Constituency

## Budget

- Recommended amount
- Sanctioned amount
- Disbursed amount (from Expenditure records)
- 🔮 Component budgets, milestone budgets, commitments — not in real data

## Timeline

- Recommended date
- Sanction date
- Completion date (where status = "Completed")
- 🔮 Milestones, dependencies — not in real data; timeline intelligence in the MVP runs on these three dates only

## Evidence `[DEFERRED — Phase 2, see Scope Lock]`

Each milestone specifies:

- required documents
- required images
- measurements
- inspection evidence
- responsible role

---

# 8. 💰 Financial Intelligence

The system maintains:

```text
PLANNED
   ↓
SANCTIONED
   ↓
COMMITTED
   ↓
PAID
   ↓
VERIFIED
```

It checks — ✅ real-data MVP, 🔮 deferred:

- ✅ sanctioned vs disbursed
- ✅ recommended vs sanctioned
- ✅ expenditure velocity
- ✅ unusual payment amounts (statistical outliers)
- ✅ payment timing (clustering, uniformity)
- ✅ vendor concentration — already validated on real data (§18)
- 🔮 duplicate payments (needs invoice-level detail beyond what's exported)
- 🔮 component overspending (needs component-level budget, not in real data)

---

# 9. ⏱️ Timeline Intelligence *(MVP — using the three real dates only)*

Real data gives us three dates per work: Recommended date, Sanction date, Completion date. No milestone-level schedule exists, so the MVP works at the whole-work level, not sub-task level.

### What we can actually calculate

```text
Recommend → Sanction gap     (flag if > 45 days, guideline SLA)
Sanction → Completion gap    (flag if > 1 year, guideline norm)
Status = "In Progress" for far longer than the norm, with high disbursement
```

### 🔮 Deferred — needs milestone-level data we don't have

```text
Foundation: Jan 1–10 planned vs. Jan 4–17 actual
Structure: Jan 11–30 planned vs. Jan 25–Feb 20 actual
```

The system calculates, on real data:

- recommend→sanction delay
- sanction→completion delay
- stalled work (high disbursement, non-"Completed" status)
- 🔮 milestone slippage, dependency violations — need milestone data

---

# 10. 📄 Document Intelligence `[DEFERRED — Phase 2, no real document data]`

Kept here as the designed target for when document data becomes available. Not part of the SIH MVP — see Scope Lock at top.

Documents are not merely stored.

AI checks:

### Document structure

- type
- required fields
- project ID
- authority
- dates
- amounts

### Cross-document consistency

Example:

```text
Sanction: ₹35L
Work order: ₹37L
Final bill: ₹41L
```

→ Financial inconsistency.

### Document similarity

Detect:

- duplicate certificates
- reused templates
- repeated text
- suspiciously similar documents

### Document integrity signals

Potentially identify:

- inconsistent fonts
- altered fields
- date inconsistencies
- suspicious formatting

Output:

> **Document consistency risk**

not:

> **Fake document confirmed**

---

# 11. 📸 Image Intelligence `[DEFERRED — Phase 2, no real image data]`

Kept here as the designed target for when image data becomes available. Not part of the SIH MVP — see Scope Lock at top. (This section was previously pitched as "one of the main differentiators" — that claim now belongs to §18/Graph Intelligence instead, which *is* real and already validated.)

## Problems we want to detect

- Wrong image
- Old image
- Reused image
- Wrong location
- Wrong project
- Incomplete work
- Inconsistent progress
- Potentially manipulated image

## Verification signals

- GPS
- Timestamp
- Project ID
- Milestone
- Image embedding
- Perceptual hash
- Visual classification
- Previous images

---

# 12. 🧠 Visual Progress Verification `[DEFERRED — Phase 2, no real image data]`

Kept as designed target only. Not part of the SIH MVP.

For suitable project categories:

```text
Expected:
Foundation → Structure → Roof → Services → Finishing

Reported:
Finishing

AI visual signal:
Structure / early roof stage
```

→ Progress inconsistency.

The system should say:

> **“Visual evidence is inconsistent with reported progress.”**

Not:

> “The project is definitely fraudulent.”

---

# 13. 🔗 Evidence Graph

Every claim links to its evidence. `🔮` = Phase 2, not in real data.

```text
WORK
 ↓
CLAIM (financial/timeline, from real fields)
 ↓
🔮 DOCUMENT
 ↓
🔮 IMAGE
 ↓
PAYMENT
 ↓
VENDOR / AGENCY
 ↓
🔮 LOCATION (GPS) — real data only gives State/Constituency
```

For the SIH MVP, this graph is: **Work → Claim (cost/timeline/compliance) → Payment → Vendor/Agency**. The Document/Image/GPS layers are the Phase 2 extension.

This allows an officer to go from:

> Risk score 87

to:

> exactly which evidence caused the risk.

---

# 14. 🕸️ Graph Intelligence

Entities — real-data MVP:

```text
MP
WORK
STATE / CONSTITUENCY
AGENCY (IDA)
VENDOR
PAYMENT
```

`🔮 Deferred`: OFFICER, DOCUMENT, IMAGE, precise LOCATION/GPS — none exist in real data.

Detect — already validated on real data:

- **Vendor concentration**: "Ajay Kumar Singh" — 119 payments from a single MP, ~10x the 99th-percentile vendor across the entire Lok Sabha expenditure dataset, with unusually uniform payment amounts. This is your strongest, fully-real demo case.
- Agency concentration by state/constituency
- Suspicious work-description clusters (text similarity)
- 🔮 reused evidence, connected accounts — needs document/image data

---

# 15. 🔥 Core Risk Signals

The first version should prioritize — ✅ = real-data MVP, 🔮 = deferred:

1. ✅ Cost anomaly
2. ✅ Timeline anomaly (recommend→sanction, sanction→completion)
3. ✅ Financial-vs-status mismatch (disbursed % vs. status proxy)
4. ✅ Duplicate work similarity (text-based, same constituency)
5. ✅ Compliance violation (guideline thresholds)
6. ✅ Payment anomaly (amount, timing, uniformity)
7. ✅ Vendor/agency concentration — already validated on real data
8. 🔮 Duplicate image/evidence
9. 🔮 Document inconsistency
10. 🔮 Location mismatch (needs GPS)
11. 🔮 Repeated budget revisions (needs version history)
12. 🔮 Missing evidence (needs document/image data)

---

# 16. 🧮 Risk Score

```text
Risk Score =
25% Financial
20% Timeline
20% Compliance
15% Duplicate Similarity
20% Graph / Agency
```

(Evidence/Documentation component removed from the live formula — deferred, no real evidence data yet. Re-add once Document/Image Intelligence ships in Phase 2.)

Example output, using the real vendor-concentration case:

```text
RISK SCORE: 79 / 100

Financial anomaly (payment structuring)        +24
Graph/vendor concentration (10x 99th pctile)   +20
Compliance (works below Rs.2.5L threshold)     +18
Timeline anomaly                                +9
Duplicate similarity                            +8
```

---

# 17. 🚨 Alert Philosophy

### 🟢 Low

Normal.

### 🟡 Medium

Unusual.

### 🟠 High

Multiple signals.

### 🔴 Critical

Strong multi-source evidence of irregularity.

The system recommends:

> **Investigate**

It never claims:

> **Person is guilty.**

---

# 18. 📊 Real Data We Are Using

Current prototype datasets (verified counts, after stripping the "Grand Total" footer row every raw file contains):

| Dataset | Real rows (LS + RS) |
|---|---:|
| Works Recommended | 7,000 + 4,000 = 11,000 |
| Works Sanctioned | 5,000 + 5,000 = 10,000 |
| Works Completed | 3,000 + 6,000 = 9,000 |
| Expenditure | 8,000 + 7,000 = 15,000 |
| Allocated Limit | 543 + 231 = 774 |
| Calamity Consent | 12 + 20 = 32 |

**Total real rows: 45,806** (corrects the earlier "~51.8k" estimate — that number wasn't computed from the actual cleaned data).

---

# 19. Data Strategy

### Real data

Used for:

- actual work analysis
- historical patterns
- expenditure analysis
- recommendation/sanction/completion relationships
- vendor concentration patterns — already validated (§14, §18)

### Synthetic data — used sparingly, and never for the MVP's core claims

The SIH MVP is built **entirely on real data**. We do not use synthetic data to fill Document/Image/GPS gaps for the core demo — those modules are deferred to Phase 2 instead (see Scope Lock). If a synthetic attack-generator demo is built as a bonus (see the technical build guide's "Synthetic Attack Generator"), it must:

- run only on structured fields we actually have (cost, dates, amounts, vendor payments)
- be labelled "synthetic" on every screen where it appears
- never be presented alongside real findings without a clear visual distinction

Fields we explicitly do NOT attempt to synthesize for demo purposes: images, documents, GPS, inspection outcomes. These are Phase 2, full stop — not "Phase 2, but faked for now."

---

# 20. MVP

## Must work

### Dashboard

- national/state/constituency view
- risk distribution
- work list
- risk filtering

### Work page

- work information (from real fields)
- budget (recommended/sanctioned/disbursed)
- timeline (recommend/sanction/completion dates)
- risk score
- explanations
- 🔮 evidence panel — placeholder only, Phase 2

### AI

- financial anomaly
- timeline anomaly
- duplicate work detection (text + constituency, no GPS)
- financial-vs-status mismatch
- vendor/agency concentration — already validated on real data
- 🔮 document consistency — deferred
- 🔮 image reuse — deferred

### Governance

- role-based workflow (conceptual for demo)
- audit trail
- evidence linkage (structured evidence only — payment/timeline records, not documents/images)

---

# 21. ⭐ Differentiators

The project should stand out through:

### 1. Evidence-linked risk

Every AI alert has evidence.

### 2. Hybrid intelligence

Rules + ML + NLP + Graph. (CV dropped from the current differentiator claim — deferred to Phase 2, see Scope Lock.)

### 3. Lifecycle view

The system understands the project from recommendation to completion.

### 4. eSAKSHI augmentation

We strengthen the existing ecosystem rather than pretending it does not exist.

### 5. Human-in-the-loop design

AI prioritizes and explains; authorized officials make final determinations.

---

# 22. 🏆 Core Demo

```text
11,000 real works (Works Recommended, LS+RS)
      ↓
Risk Engine
      ↓
[N] anomalies flagged        ← use your actual pipeline output here, not a placeholder
      ↓
[N] high-risk
      ↓
[N] critical
```

Select the real, already-validated case:

```text
VENDOR: "Ajay Kumar Singh"        RISK = 79

119 payments from a single MP — ~10x the 99th-percentile vendor
Payment amounts unusually uniform (~₹19,992 each, minimal variance)
Multiple works near the ₹2.5L minimum-sanction threshold
```

Then:

> **Why?**

Show:

```text
Risk
 ↓
Reason
 ↓
Payment record (real data)
 ↓
Work / Vendor / Agency
 ↓
Original expenditure row
```

`[Phase 2]`: extend this drill-down to Document/Image evidence once that data exists — not part of the MVP demo.

Then:

> **Create Investigation Case**

---

# 23. Technical Architecture

```text
                  MPLADS / eSAKSHI (structured CSVs, real)
                         ↓
                   DATA INGESTION
                         ↓
                  DATA NORMALIZATION
                         ↓
                  WORK DATA MODEL
                         ↓
                 ┌───────┼────────┐
                 ↓       ↓        ↓
               RULES    ML      NLP
              (Compliance)  (Financial/  (Duplicate
                          Timeline)    detection)
                 └───────┼────────┘
                         ↓
                    GRAPH LAYER
                    (Vendor/Agency HHI)
                         ↓
                    RISK ENGINE
                         ↓
                 EXPLANATION ENGINE
                         ↓
                 OFFICER DASHBOARD
                         ↓
                   CASE MANAGEMENT

   ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
   🔮 Phase 2 (not wired in — no real data yet):
   DOCUMENTS → OCR/NLP  ─┐
   IMAGES    → CV        ┴→ would feed into RISK ENGINE above
   ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
```

---

# 24. What Success Looks Like

The product should answer:

> **“Which projects should I investigate first, why are they risky, and show me the evidence.”**

If it can answer that convincingly with real MPLADS data, the core project is successful.

---

# 25. One-Sentence Pitch

> **MPLADS Sentinel transforms MPLADS from a system that records work activity into an evidence-driven intelligence system that continuously verifies financial and operational claims against real data, and prioritizes high-risk cases for investigation — with document and visual verification on the Phase 2 roadmap once that data becomes publicly available.**

*(Trimmed from the original, which claimed "documentary, visual" verification as already built — that's the Phase 2 vision, not the SIH MVP. See Scope Lock at the top of this file.)*
