# MPLADS Sentinel — What We Are Actually Building

> **This is the curated project definition.**  
> A new team member should be able to read this document and understand exactly what the project is, what is in scope, what is not, and how the system works.

---

# 1. 🎯 One-Line Definition

> **MPLADS Sentinel is an AI-powered evidence and risk-intelligence layer for MPLADS/eSAKSHI that continuously verifies project claims, financial activity, documents, images and progress, and prioritizes potentially irregular works for investigation.**

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

Examples:

- Project claims 90% completion but only 55% physical progress is visible.
- ₹90 lakh has been spent while only 50% of the work appears complete.
- Two projects have nearly identical descriptions and locations.
- The same photograph appears in multiple projects.
- A completion certificate contradicts the expenditure ledger.
- A vendor appears unusually frequently across high-risk projects.
- A project is repeatedly delayed or its budget repeatedly revised.

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

Every project is converted into a structured object.

## Identity

- Project ID
- MP
- State
- Constituency
- District
- Location
- GPS
- Work category
- Work description
- Implementing Agency

## Budget

- Total planned amount
- Sanctioned amount
- Component budgets
- Milestone budgets
- Commitments
- Payments
- Verified expenditure

## Timeline

- Planned start
- Planned completion
- Milestones
- Dependencies
- Actual dates

## Evidence

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

It checks:

- sanctioned vs paid
- planned vs sanctioned
- expenditure velocity
- unusual payment amounts
- payment timing
- vendor concentration
- repeated payments
- duplicate payments
- component overspending

---

# 9. ⏱️ Timeline Intelligence

Every project has:

### Planned timeline

```text
Foundation
Jan 1–10

Structure
Jan 11–30

Electrical
Feb 1–10
```

### Actual timeline

```text
Foundation
Jan 4–17

Structure
Jan 25–Feb 20

Electrical
Feb 25–...
```

The system calculates:

- delay
- milestone slippage
- dependency violations
- stalled work
- predicted completion risk

---

# 10. 📄 Document Intelligence

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

# 11. 📸 Image Intelligence

This is one of the main differentiators.

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

# 12. 🧠 Visual Progress Verification

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

Every claim links to its evidence.

```text
PROJECT
 ↓
MILESTONE
 ↓
CLAIM
 ↓
DOCUMENT
 ↓
IMAGE
 ↓
PAYMENT
 ↓
PERSON / AGENCY
 ↓
LOCATION
```

This allows an officer to go from:

> Risk score 87

to:

> exactly which evidence caused the risk.

---

# 14. 🕸️ Graph Intelligence

Entities:

```text
MP
PROJECT
DISTRICT
AGENCY
OFFICER
VENDOR
PAYMENT
DOCUMENT
IMAGE
LOCATION
```

Detect:

- vendor concentration
- repeated entities
- suspicious clusters
- unusual agency patterns
- reused evidence
- connected vendors/accounts where data permits

---

# 15. 🔥 Core Risk Signals

The first version should prioritize:

1. Cost anomaly
2. Timeline anomaly
3. Financial-physical mismatch
4. Duplicate project similarity
5. Duplicate image/evidence
6. Document inconsistency
7. Location mismatch
8. Compliance violation
9. Payment anomaly
10. Vendor/agency concentration
11. Repeated budget revisions
12. Missing evidence

---

# 16. 🧮 Risk Score

Example:

```text
Risk Score =
25% Financial
20% Timeline
20% Compliance
15% Duplicate Similarity
10% Graph / Agency
10% Evidence / Documentation
```

Example output:

```text
RISK SCORE: 84 / 100

Financial anomaly       +21
Timeline anomaly        +17
Image inconsistency     +19
Document inconsistency  +12
Duplicate evidence      +15
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

Current prototype datasets include:

- Works Recommended — Lok Sabha
- Works Recommended — Rajya Sabha
- Works Sanctioned — Lok Sabha
- Works Sanctioned — Rajya Sabha
- Works Completed — Lok Sabha
- Works Completed — Rajya Sabha
- Expenditure — Lok Sabha
- Expenditure — Rajya Sabha
- MP Allocated Limit — Lok Sabha
- MP Allocated Limit — Rajya Sabha
- Calamity Consent — Lok Sabha
- Calamity Consent — Rajya Sabha

Total uploaded rows are approximately **51.8k**.

---

# 19. Data Strategy

### Real data

Used for:

- actual project analysis
- historical patterns
- expenditure analysis
- recommendation/sanction/completion relationships
- vendor patterns

### Synthetic data

Used only where public data does not expose fields required for a complete demonstration.

Examples:

- detailed payment records
- milestone records
- stage-by-stage image metadata
- detailed invoices
- GPS
- inspection outcomes

Synthetic data must always be labelled as synthetic.

---

# 20. MVP

## Must work

### Dashboard

- national/state/district view
- risk distribution
- project list
- risk filtering

### Project page

- project information
- budget
- timeline
- evidence
- risk score
- explanations

### AI

- financial anomaly
- timeline anomaly
- duplicate project detection
- document consistency
- image reuse
- financial/physical mismatch

### Governance

- role-based workflow
- audit trail
- evidence linkage

---

# 21. ⭐ Differentiators

The project should stand out through:

### 1. Evidence-linked risk

Every AI alert has evidence.

### 2. Hybrid intelligence

Rules + ML + NLP + CV + Graph.

### 3. Lifecycle view

The system understands the project from recommendation to completion.

### 4. eSAKSHI augmentation

We strengthen the existing ecosystem rather than pretending it does not exist.

### 5. Human-in-the-loop design

AI prioritizes and explains; authorized officials make final determinations.

---

# 22. 🏆 Core Demo

```text
12,482 works analyzed
      ↓
843 anomalies
      ↓
127 high-risk
      ↓
18 critical
```

Select one:

```text
RISK = 87

31% cost deviation
146-day delay
Similar project nearby
Agency anomaly
Evidence gap
```

Then:

> **Why?**

Show:

```text
Risk
 ↓
Reason
 ↓
Document
 ↓
Image
 ↓
Payment
 ↓
Project event
```

Then:

> **Create Investigation Case**

---

# 23. Technical Architecture

```text
                  MPLADS / eSAKSHI
                         ↓
                   DATA INGESTION
                         ↓
                  DATA NORMALIZATION
                         ↓
                  PROJECT DATA MODEL
                         ↓
                 ┌───────┼────────┐
                 ↓       ↓        ↓
               RULES    ML       AI/CV
                 ↓       ↓        ↓
                 └───────┼────────┘
                         ↓
                    GRAPH LAYER
                         ↓
                    RISK ENGINE
                         ↓
                 EXPLANATION ENGINE
                         ↓
                 OFFICER DASHBOARD
                         ↓
                   CASE MANAGEMENT
```

---

# 24. What Success Looks Like

The product should answer:

> **“Which projects should I investigate first, why are they risky, and show me the evidence.”**

If it can answer that convincingly with real MPLADS data, the core project is successful.

---

# 25. One-Sentence Pitch

> **MPLADS Sentinel transforms MPLADS from a system that records project activity into an evidence-driven intelligence system that continuously verifies financial, documentary, visual and operational claims and prioritizes high-risk cases for investigation.**
