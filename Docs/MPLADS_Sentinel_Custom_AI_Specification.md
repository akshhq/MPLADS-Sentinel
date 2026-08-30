# MPLADS Sentinel — Complete AI Module & Implementation Specification

> **Purpose:** Master technical documentation for the AI, analytics, cross-dataset intelligence, computer-vision, graph, prediction, risk-fusion, and explainability capabilities of MPLADS Sentinel.
>
> **Primary design principle:** Sentinel is an intelligence and investigation-prioritization layer over MPLADS/eSAKSHI data. It should identify unusual patterns, connect evidence across datasets, explain why a case is risky, and recommend what a human auditor should verify. It must not autonomously declare a person or project fraudulent.

---

## 1. System Objective

MPLADS Sentinel should answer four questions:

1. **What is unusual?** — anomaly detection
2. **Why is it unusual?** — evidence-backed explanation
3. **How serious is it?** — calibrated risk score
4. **What should be investigated first?** — investigation prioritization

The uploaded project specification explicitly recommends a hybrid approach rather than one model for everything:

- Rules for deterministic compliance
- ML/statistics for numerical patterns
- NLP/embeddings for descriptions and documents
- Computer Vision for images
- Graph intelligence for relationships
- Prediction for future risk
- Explanation AI for evidence-backed outputs

This architecture is already reflected in the project's Custom AI Specification.

---

# 2. Data Foundation

## 2.1 Uploaded datasets

The current project contains these major structured datasets:

### Lok Sabha
- Works Recommended
- Works Sanctioned
- Works Completed
- Expenditure on Completed and On-going Works
- Allocated Limit for Hon'ble MPs

### Rajya Sabha
- Works Recommended
- Works Sanctioned
- Works Completed
- Expenditure on Completed and On-going Works
- Allocated Limit for Hon'ble MPs

These datasets should be ingested into a normalized internal schema.

## 2.2 Canonical entity

The most important entity is the **Work ID**.

A Work ID should be treated as the primary lifecycle key wherever it is present and reliable.

Conceptually:

```text
RECOMMENDED
     |
     v
SANCTIONED
     |
     v
EXPENDITURE
     |
     v
COMPLETED
     |
     +---- DOCUMENTS
     |
     +---- IMAGES
     |
     +---- PAYMENTS
```

The same Work ID should therefore produce a single **Work Intelligence Profile**.

## 2.3 Entity resolution

Not every dataset will always match perfectly.

Build an entity-resolution layer that can match using:

### Exact keys
- Work ID
- Payment/reference ID
- Certificate/reference number

### Secondary keys
- MP
- constituency
- district
- state
- implementing agency / IDA
- vendor
- amount
- dates

### Semantic keys
- work description
- project category
- location text

### Matching confidence

Every non-exact match should carry:

```text
match_confidence
match_method
matched_fields
unmatched_fields
```

Never silently merge uncertain records.

---

# 3. AI Module Map

| # | Module | Main purpose | Core techniques | Priority |
|---|---|---|---|---|
| 1 | Data Quality AI | Validate and normalize input data | Rules, statistics | Critical |
| 2 | Cross-Dataset Entity Intelligence | Join the same real-world work/entity across datasets | Entity resolution, rules, fuzzy matching | Critical |
| 3 | Proposal Intelligence | Detect suspicious proposals | NLP + statistics | Critical |
| 4 | Compliance Intelligence | Check statutory rules | Deterministic rules + NLP | Critical |
| 5 | Cost Anomaly AI | Find unusual costs | Robust statistics, Isolation Forest, LOF | Critical |
| 6 | Timeline Intelligence | Detect/predict delays | Rules + ML | Critical |
| 7 | Financial Intelligence | Detect payment/fund anomalies | Statistics + rules + ML | Critical |
| 8 | Financial–Physical Intelligence | Compare money spent to actual progress | Ratios, anomaly scoring | Critical |
| 9 | Duplicate / Split-Work AI | Detect duplicate, overlapping and split works | Embeddings + GIS + amount/time | Critical |
| 10 | Vendor Intelligence | Detect vendor concentration and unusual patterns | Statistics + graph | Critical |
| 11 | Document Intelligence | Extract and verify document information | OCR + NLP/LLM | Critical |
| 12 | Document Similarity AI | Detect reused/duplicated documents | Fingerprints + embeddings | High |
| 13 | Image Evidence Verification AI | Verify project images | CV + metadata + embeddings | Critical |
| 14 | Geospatial Intelligence | Check spatial consistency | GIS + distance/proximity | High |
| 15 | Graph Intelligence | Detect relationship/network anomalies | NetworkX/graph ML | High |
| 16 | Predictive Risk AI | Forecast future problems | ML | High |
| 17 | Risk Fusion Engine | Combine signals into one investigation priority | Weighted aggregation | Critical |
| 18 | Explanation Engine | Explain every alert | Evidence retrieval + attribution | Critical |
| 19 | Investigation Dossier Generator | Create auditor-ready case briefs | Templates + LLM/RAG | Critical |
| 20 | Audit Copilot | Query the structured intelligence layer | LLM + SQL/function calling/RAG | High |
| 21 | Feedback & Learning | Learn from audit outcomes | Feedback data + recalibration | Future |

---

# 4. Module 1 — Data Quality AI

## Objective

Ensure that the data entering the AI engine is trustworthy enough to analyze.

## Responsibilities

### Schema validation
- Required columns
- Data types
- Date formats
- Numeric fields
- Identifier formats

### Missing-data analysis
Detect:
- missing Work ID
- missing vendor
- missing amount
- missing dates
- missing location
- missing completion information

### Duplicate record detection
Detect:
- exact duplicate rows
- repeated Work IDs
- duplicate payment references
- suspicious repeated records

### Normalization
Normalize:
- vendor names
- agency names
- district names
- state names
- constituency names
- dates
- currency/amount formats

Example:

```text
"M/S ABC Construction"
"ABC CONSTRUCTION"
"M/s. A.B.C Construction"
```

should be candidates for the same normalized vendor entity.

## Output

```json
{
  "data_quality_score": 91,
  "missing_fields": [],
  "duplicate_records": 12,
  "normalization_warnings": 4
}
```

---

# 5. Module 2 — Cross-Dataset Entity Intelligence

## Objective

Create a unified view of each project and its associated entities across all datasets.

This is a **core module** and should not be hidden inside Duplicate AI.

## Primary entities

```text
WORK
MP
CONSTITUENCY
DISTRICT
STATE
IDA / AGENCY
VENDOR
PAYMENT
DOCUMENT
IMAGE
LOCATION
```

## Core matching

### Work-level

```text
Recommended Work ID
       ↕
Sanctioned Work ID
       ↕
Expenditure Work ID
       ↕
Completed Work ID
```

### Entity-level

```text
Vendor
Agency
MP
Location
Document
Image
Payment
```

## Cross-dataset checks

### Recommendation vs sanction

```text
recommended_amount
vs
sanctioned_amount
```

### Sanction vs expenditure

```text
sanctioned_amount
vs
total_expenditure
```

### Expenditure vs completion

```text
financial_progress
vs
completion/physical_progress
```

### Vendor consistency

Check whether vendor information is consistent across related records.

### Timeline consistency

Compare dates across lifecycle stages.

## Important output

```text
Work Intelligence Profile
├── Lifecycle
├── Financial
├── Vendor
├── Agency
├── Timeline
├── Location
├── Documents
├── Images
└── Risk signals
```

---

# 6. Module 3 — Proposal Intelligence

## Objective

Evaluate a proposal before or around sanction.

## Inputs

- work description
- category
- state
- district
- location
- recommended amount
- historical comparable projects
- guidelines

## Detection

### Cost comparison

Compare proposed amount against similar historical works.

### Description similarity

Find semantically similar projects.

### Duplicate proposal

Compare:
- location
- description
- amount
- beneficiary
- category
- time period

## Techniques

- sentence embeddings
- cosine similarity
- statistical benchmarks
- GIS proximity

## Example

```text
Proposal Risk: 63/100

Reasons:
- 34% above comparable median
- Similar project nearby
- Description highly similar to historical project
```

---

# 7. Module 4 — Compliance Intelligence

## Objective

Convert MPLADS rules into machine-checkable controls.

## Layer A — deterministic rules

Use for rules that can be represented explicitly.

```text
IF prohibited_asset = true
THEN compliance_risk = HIGH
```

## Layer B — NLP

Use NLP for ambiguous descriptions.

Example:

```text
"Construction of facility for..."
```

The NLP layer determines whether the description appears consistent with allowed categories.

## Important

The AI should return:

```text
COMPLIANT
REVIEW
NON-COMPLIANT
UNKNOWN
```

rather than pretending uncertain cases are certain.

---

# 8. Module 5 — Cost Anomaly AI

## Objective

Detect unusually high or low project costs.

## Features

- recommended amount
- sanctioned amount
- expenditure
- project category
- state
- district
- description embedding
- quantity/size where available
- historical comparable projects
- agency
- vendor

## Techniques

### Robust Z-score

Useful when distributions contain outliers.

### Isolation Forest

Unsupervised anomaly detection.

### Local Outlier Factor

Useful for local-density anomalies.

## Benchmarking hierarchy

Prefer:

```text
Same work category
+
Same state
+
Same district
+
Similar description
+
Similar scale
```

over simply comparing all projects nationally.

## Output

```text
Submitted: ₹42L
Comparable median: ₹30L
Deviation: +40%
Cost anomaly: HIGH
```

---

# 9. Module 6 — Timeline Intelligence

## Objective

Detect current delays and predict future delays.

## Inputs

- recommendation date
- sanction date
- planned dates
- actual dates
- milestone dates
- completion date
- work status
- expenditure progression

## Detect

- late start
- late milestone
- stalled work
- repeated extensions
- unrealistic completion
- prolonged inactivity

## Prediction

```text
Probability of missing deadline: 81%
```

## MVP

Start with rules and simple models.

Do not overbuild deep temporal models without sufficient historical labels.

---

# 10. Module 7 — Financial Intelligence

## Objective

Find unusual payment and expenditure behavior.

## Detection categories

### Amount anomalies
Unusually large/small payments.

### Timing anomalies
Payments unusually close to deadlines or milestones.

### Frequency anomalies
Many payments within a short interval.

### Duplicate payments
Same/similar:
- reference
- amount
- vendor
- Work ID

### Split-payment patterns
Repeated payments around a threshold.

### Vendor concentration
One vendor receives unusually high share.

### Budget mismatch
Component-level budget versus spending.

## Output

```text
Financial Risk: HIGH

Signals:
- 5 payments in 9 days
- 3 payments with near-identical amounts
- vendor receives unusually high district share
```

---

# 11. Module 8 — Financial–Physical Intelligence

## Objective

Detect divergence between money spent and physical progress.

## Core calculation

```text
Financial Progress = expenditure / sanctioned_amount

Physical Progress = reported/computed project progress
```

Then:

```text
Divergence = financial_progress - physical_progress
```

Example:

```text
Financial: 88%
Physical: 52%

Gap: 36 percentage points
```

## Risk

A large unexplained gap should increase investigation priority.

Do not automatically classify it as fraud because legitimate payment structures can create temporary differences.

---

# 12. Module 9 — Duplicate / Split-Work Intelligence

## Objective

Find works that may represent the same, overlapping, or artificially separated activity.

## Detection levels

### Level 1 — exact duplicate

Same Work ID appearing multiple times unexpectedly.

### Level 2 — semantic duplicate

Different Work IDs with highly similar descriptions.

### Level 3 — geographic overlap

Similar works at nearby locations.

### Level 4 — financial similarity

Similar descriptions + similar amounts.

### Level 5 — temporal recurrence

Similar project repeated across years.

### Level 6 — possible split work

Multiple related works that individually sit around a threshold.

## Pipeline

```text
Description
   ↓
Embedding
   ↓
Similarity search
   ↓
Location proximity
   ↓
Amount similarity
   ↓
Time overlap
   ↓
Vendor/Agency overlap
   ↓
Duplicate/Split probability
```

---

# 13. Module 10 — Vendor Intelligence

## Objective

Understand vendor behavior across projects, districts and MPs.

## Vendor features

For every normalized vendor calculate:

- number of works
- total sanctioned value
- total expenditure
- number of districts
- number of constituencies
- number of MPs
- number of agencies
- percentage of district spend
- percentage of high-risk projects
- repeated project categories

## Detect

### Vendor concentration

```text
Vendor A → 71%
Vendor B → 12%
Others → 17%
```

### Cross-district patterns

Same vendor appearing unusually across distant districts.

### Cross-MP patterns

Same vendor repeatedly associated with multiple MPs.

### Work-type concentration

Vendor dominates a particular project category.

### Risk correlation

Vendor repeatedly associated with high-risk works.

Important: these are **investigation signals**, not evidence of wrongdoing by themselves.

---

# 14. Module 11 — Document Intelligence

## Objective

Extract structured information from PDFs, scans, certificates and supporting documents.

## Pipeline

```text
PDF/Image
   ↓
OCR
   ↓
Document classification
   ↓
Field extraction
   ↓
Entity normalization
   ↓
Cross-document comparison
```

## Extract

- Work ID
- description
- amount
- date
- authority
- agency
- vendor
- milestone
- certificate number
- reference numbers

## Cross-check chain

```text
Sanction
   ↕
Work Order
   ↕
Invoice
   ↕
Payment
   ↕
Completion Certificate
```

## Example

```text
Completion certificate amount:
₹24.5L

Verified expenditure:
₹19.8L

Signal:
Document/data inconsistency
```

---

# 15. Module 12 — Document Similarity AI

## Objective

Detect reused or suspiciously similar documents.

## Detect

- reused certificates
- duplicated reports
- repeated wording
- near-identical documents
- template manipulation
- repeated signatures/fields where technically detectable

## Techniques

- text fingerprints
- embeddings
- similarity search
- structured field comparison
- OCR text comparison

## Example

```text
Potentially reused certificate
Similarity: 96%
Seen across: 7 projects
```

---

# 16. Module 13 — Image Evidence Verification AI

> **One of the most important modules.**

## Objective

Determine whether submitted visual evidence is consistent with:

- project
- asset type
- location
- milestone
- expected progress
- previous evidence
- image history

## Critical distinction

The current structured CSV datasets may indicate that images exist, but the CSV itself does not necessarily contain the underlying image pixels.

Therefore:

```text
CSV image reference
      ↓
Evidence repository / eSAKSHI
      ↓
Actual image
      ↓
Vision AI
```

Do not claim image analysis is being performed from a text-only image indicator.

---

## 16.1 Image Check A — Asset/Description Match

Compare:

```text
Declared:
"Construction of Community Hall"

Image:
visual evidence
```

Use:

- image embeddings
- vision-language models
- controlled asset classifiers

Output:

```text
Asset match: 82%
Status: REVIEW
```

---

## 16.2 Image Check B — AI-Generated Image Risk

Possible signals:

- AI-image detector
- metadata
- provenance information where available
- compression anomalies
- forensic indicators

Output:

```text
AI-generation risk: 73%
Image integrity: REVIEW
```

### Important rule

Never state:

> "This image is definitely AI-generated."

Use:

> "AI-generation risk detected."

AI-image detection is probabilistic and should be treated as a risk signal.

---

## 16.3 Image Check C — Reused Image Detection

This is a major feature.

### Perceptual hashing

Good for near-identical images.

### Image embeddings

Good for visually similar images even after transformations.

### Vector search

Search across:

```text
same Work ID
same vendor
same district
same constituency
same state
ENTIRE PROJECT DATABASE
```

Example:

```text
Similarity: 97.8%

Possible reused evidence.

Previous association:
Work ID: X
District: Y
Date: Z
```

---

## 16.4 Image Check D — Location Verification

If EXIF GPS is available:

```text
Project GPS
    ↓
Image GPS
    ↓
Distance
```

Example:

```text
Project location: registered coordinates
Image location: captured coordinates

Distance: 18.7 km

Signal: location inconsistency
```

If GPS is absent:

```text
Location verification: UNAVAILABLE
```

Never fabricate location certainty.

---

## 16.5 Image Check E — Temporal Consistency

Compare:

- image capture timestamp
- upload timestamp
- milestone date
- completion date
- previous image timestamps

Detect:

- image older than claimed milestone
- repeated image over long periods
- impossible sequence
- completion evidence submitted before expected work stage

---

## 16.6 Image Check F — Physical Progress

For supported categories, define a controlled visual taxonomy.

Example:

```text
1. Site preparation
2. Foundation
3. Structure
4. Roofing
5. Services
6. Finishing
7. Completion
```

Compare:

```text
Reported stage: 6/7
Visual stage: 3/7

Major inconsistency
```

This should initially be limited to categories where visual progression can be reasonably defined.

---

## 16.7 Image Check G — Image Integrity

Potential signals:

- metadata anomalies
- editing traces
- compression inconsistency
- duplicated regions
- inconsistent image regions

Output:

```text
Image integrity risk: HIGH
```

Do not present this as definitive deepfake detection.

---

# 17. Module 14 — Geospatial Intelligence

## Objective

Use location as an independent evidence dimension.

## Inputs

- project coordinates
- image GPS
- district
- constituency
- location description
- nearby projects

## Detect

- project/image distance mismatch
- unusually dense project clusters
- repeated works at same location
- nearby potentially duplicate works
- same vendor/project clusters geographically

## Core calculation

```text
distance(project_location, image_location)
```

Use geospatial thresholds appropriate to the project category.

---

# 18. Module 15 — Graph Intelligence

## Objective

Detect relationships that are difficult to see in tabular data.

## Graph nodes

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

## Graph edges

```text
MP → recommends → Project
Project → assigned_to → Agency
Agency → uses → Vendor
Vendor → receives → Payment
Project → has → Document
Project → has → Image
Project → located_at → Location
Officer → uploads → Evidence
```

## Detect

- highly central vendors
- repeated entities
- project clusters
- shared evidence
- cross-district relationships
- unusual vendor/agency networks

## MVP

Use NetworkX.

A graph database such as Neo4j can be added later if needed.

---

# 19. Module 16 — Predictive Risk AI

## Objective

Predict future project risk rather than only identifying existing anomalies.

## Predictions

### Completion risk

```text
Probability of missing deadline
```

### Cost overrun risk

```text
Probability of exceeding sanctioned amount
```

### Stalling risk

```text
Probability of becoming inactive
```

### Evidence risk

```text
Probability of future evidence inconsistency
```

## Model strategy

Start with interpretable models.

Do not build complex predictive systems until enough historical training/validation data exists.

---

# 20. Module 17 — Risk Fusion Engine

## Objective

Combine independent signals into one investigation priority.

## Inputs

```text
Proposal Risk
Compliance Risk
Cost Risk
Financial Risk
Timeline Risk
Physical Progress Risk
Duplicate Risk
Vendor Risk
Document Risk
Image Risk
Geospatial Risk
Graph Risk
Predictive Risk
```

## Example

```text
Project Risk = 84/100

Financial       21
Timeline        17
Image           19
Document        12
Graph           15
```

## Recommended principles

### Multi-signal confirmation

Avoid making a project critical from a single weak signal.

Example:

```text
Critical alert:
at least 2 independent strong signals
```

This is consistent with the project's existing false-positive mitigation strategy.

### Evidence weighting

Strong direct evidence should receive more weight than weak statistical correlation.

### Uncertainty

Every module should expose:

```text
score
confidence
reason
evidence
```

---

# 21. Module 18 — Explanation Engine

## Objective

Answer:

> **Why is this project risky?**

The explanation engine should never invent reasons.

## Evidence chain

```text
Risk signal
   ↓
Underlying feature
   ↓
Source record
   ↓
Dataset/document/image
```

## Example

```text
Project Risk: 84/100

Reasons:
1. Expenditure is 31% above comparable projects.
2. Physical progress is significantly below financial progress.
3. Two submitted images are highly similar to evidence from another project.
4. Vendor concentration is unusually high.
```

Every reason should link back to structured evidence.

---

# 22. Module 19 — Investigation Dossier Generator

## Objective

Convert machine findings into an auditor-ready investigation brief.

## Structure

```text
CASE SUMMARY
PROJECT PROFILE
RISK SCORE
TOP RISK SIGNALS
FINANCIAL ANALYSIS
TIMELINE ANALYSIS
CROSS-DATA INCONSISTENCIES
VENDOR ANALYSIS
DUPLICATE ANALYSIS
DOCUMENT ANALYSIS
IMAGE ANALYSIS
GEOSPATIAL ANALYSIS
RELATED PROJECTS
EVIDENCE
RECOMMENDED VERIFICATION STEPS
MODEL/RULE METADATA
```

## Important

Use language such as:

> "Requires verification"

rather than:

> "Fraud confirmed."

---

# 23. Module 20 — Audit Copilot

## Objective

Provide natural-language access to the structured intelligence system.

## Example queries

```text
Show projects where spending exceeds 80%
but physical progress is below 50%.

Which vendors are associated with the
most high-risk projects?

Show projects with reused images.

Why is Work X high risk?

Find similar projects near Work X.

Show all projects where recommended and
sanctioned amounts differ significantly.

What evidence should I verify for this case?
```

## Architecture

```text
User question
     ↓
Intent detection
     ↓
SQL / structured retrieval
     ↓
Evidence retrieval
     ↓
LLM explanation
     ↓
Answer + citations/evidence
```

The LLM should query structured data instead of inventing database facts.

---

# 24. AI/ML Techniques Required

## 24.1 Classical statistics

Use for:

- medians
- percentiles
- ratios
- deviations
- robust Z-scores
- concentration metrics
- time gaps

Libraries:

```text
numpy
pandas
scipy
```

---

## 24.2 Unsupervised anomaly detection

Use:

```text
Isolation Forest
Local Outlier Factor
Robust Z-score
```

Good for the current project because confirmed fraud labels are limited.

---

## 24.3 NLP / Embeddings

Use for:

- project similarity
- duplicate detection
- document similarity
- semantic search
- description normalization

Candidate approach:

```text
sentence-transformers
```

The existing project specification proposes:

```text
all-MiniLM-L6-v2
```

for lightweight embeddings.

---

## 24.4 Vector database

Required for:

- project similarity
- image similarity
- document similarity
- RAG

Possible choices:

```text
FAISS
Chroma
Qdrant
```

For the free/local MVP, FAISS is a strong starting point.

---

# 25. Computer Vision Stack

## Required

### Image hashing

```text
pHash
dHash
aHash
```

### Image embeddings

Use a pretrained image encoder.

### Vision-language model

Use for:

- image ↔ description consistency
- asset classification
- visual reasoning

### OCR

Use for:

- image-based documents
- certificates
- scanned evidence

Possible open-source tools:

```text
Tesseract
PaddleOCR
EasyOCR
```

---

# 26. Image Similarity Architecture

```text
                IMAGE
                  |
        ┌─────────┴─────────┐
        ↓                   ↓
   Perceptual Hash      Image Embedding
        ↓                   ↓
 Exact/near duplicate    Vector search
        ↓                   ↓
        └─────────┬─────────┘
                  ↓
          Similarity Engine
                  ↓
       Cross-project database
                  ↓
          Evidence reuse risk
```

---

# 27. AI-Generated Image Detection Architecture

```text
Image
  ↓
Metadata/provenance
  ↓
Forensic signals
  ↓
AI-image detector
  ↓
Combined integrity assessment
  ↓
AI-generation risk
```

Output:

```text
AI-generation risk: 73%
Confidence: 0.71
Status: REVIEW
```

Never equate this with confirmed fraud.

---

# 28. Cross-Dataset + Image Intelligence

This is the strongest combined capability.

For an image:

```text
Image
 ↓
Work ID
 ↓
Project
 ↓
Vendor
 ↓
District
 ↓
Other projects
 ↓
Historical images
```

Search:

```text
Same Work ID
        +
Same vendor
        +
Same district
        +
Same constituency
        +
Same state
        +
Entire database
```

Then combine:

```text
Image similarity
+
Description similarity
+
Location proximity
+
Vendor relationship
+
Timeline relationship
```

Example:

```text
Image similarity: 96%
Description similarity: 91%
Same vendor: YES
Same district: YES
Time gap: 11 months

Evidence reuse risk: HIGH
```

---

# 29. Model Training Strategy

## Important

Do **not** claim that Sentinel requires training a new LLM from scratch.

A custom AI system can be built from:

```text
Domain rules
+
Custom features
+
Pretrained ML models
+
NLP models
+
Vision models
+
Graph algorithms
+
Risk aggregation
+
Domain-specific explanation
```

The value is the domain-specific intelligence layer.

---

# 30. Training Data Strategy

The project currently lacks reliable fraud labels.

Therefore use:

## Unsupervised learning

For naturally occurring anomalies.

## Synthetic attack generation

Generate controlled examples:

```text
Inflated cost
Duplicate payment
Reused image
Changed date
Delayed milestone
Altered amount
Duplicate document
Payment anomaly
```

Then test whether the system detects them.

## Historical audit cases

Where available, reproduce known irregularity patterns from audit findings.

## Human feedback

Eventually record:

```text
Flagged
↓
Reviewed
↓
Confirmed concern / legitimate
↓
Final outcome
```

This becomes future training/evaluation data.

---

# 31. Model Validation

Do not claim:

> "98% fraud detection accuracy."

Instead measure:

## Rule correctness

Does the rule identify known violations correctly?

## Synthetic attack detection

Can the system detect injected anomalies?

## Ranking quality

Do known/high-risk cases appear near the top?

## Retrieval quality

Are similar projects/documents/images correctly retrieved?

## Image similarity precision

How often are actual reused images among top matches?

## False-positive rate

How many alerts are legitimate cases?

---

# 32. Explainability Requirements

Every AI finding must contain:

```text
Model version
Timestamp
Input snapshot
Risk score
Triggering signals
Evidence references
Confidence
Uncertainty
```

Example:

```json
{
  "risk_score": 84,
  "model_version": "sentinel-risk-v1.2",
  "timestamp": "...",
  "signals": [
    "financial_physical_gap",
    "image_similarity",
    "vendor_concentration"
  ],
  "confidence": 0.87
}
```

---

# 33. AI Governance

The system must:

- avoid accusing individuals
- show evidence
- show uncertainty
- record model version
- record rule/model triggering the alert
- allow human override
- maintain an audit history

The human auditor remains the final decision-maker.

---

# 34. Risk Taxonomy

Use a common vocabulary across modules.

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Each module should additionally return:

```text
raw_score
normalized_score
confidence
severity
reason
evidence
```

---

# 35. Recommended Data Architecture

```text
                   RAW DATA
                      |
                INGESTION LAYER
                      |
                DATA QUALITY AI
                      |
              NORMALIZATION LAYER
                      |
            ENTITY RESOLUTION LAYER
                      |
        ┌─────────────┼──────────────┐
        ↓             ↓              ↓
 Structured       Documents        Images
        ↓             ↓              ↓
 Financial AI     Document AI      Vision AI
 Timeline AI      OCR/NLP          Image Reuse
 Cost AI          Similarity       Asset Match
 Duplicate AI                     Location
        ↓             ↓              ↓
        └─────────────┼──────────────┘
                      ↓
                 GRAPH AI
                      ↓
               PREDICTIVE AI
                      ↓
                 RISK FUSION
                      ↓
              EXPLANATION ENGINE
                      ↓
            INVESTIGATION DOSSIER
                      ↓
                 AUDITOR UI
                      ↓
                 FEEDBACK
```

---

# 36. Recommended Database Schema

At minimum:

```text
works
work_lifecycle
recommendations
sanctions
expenditures
payments
vendors
agencies
mps
locations
documents
document_embeddings
images
image_embeddings
image_hashes
risk_signals
risk_scores
audit_cases
model_runs
feedback
```

## Relationships

```text
works
 ├── recommendations
 ├── sanctions
 ├── expenditures
 ├── payments
 ├── documents
 ├── images
 ├── risk_signals
 └── audit_cases
```

---

# 37. Recommended AI Services

A modular backend is preferable.

```text
/api/ingestion
/api/entity-resolution
/api/proposals
/api/compliance
/api/cost
/api/timeline
/api/financial
/api/duplicates
/api/vendors
/api/documents
/api/images
/api/geospatial
/api/graph
/api/prediction
/api/risk
/api/explanations
/api/dossiers
/api/copilot
```

---

# 38. MVP Priority

## Phase 1 — Must work

1. Data ingestion
2. Data normalization
3. Work ID entity resolution
4. Cross-dataset joining
5. Cost anomaly
6. Financial anomaly
7. Financial vs physical divergence
8. Duplicate/split-work detection
9. Vendor intelligence
10. Basic image reuse detection
11. Risk fusion
12. Evidence cards

## Phase 2

13. Document OCR
14. Document similarity
15. Image description matching
16. Image location verification
17. Geospatial intelligence
18. Graph intelligence

## Phase 3

19. Image progress estimation
20. AI-generated image risk
21. Predictive risk
22. Audit Copilot
23. Feedback learning

---

# 39. Recommended Technology Stack

## Data

```text
Python
Pandas
NumPy
SQLite/PostgreSQL
```

## ML

```text
scikit-learn
SciPy
```

## NLP

```text
sentence-transformers
FAISS
```

## Vision

```text
OpenCV
Pillow
pretrained vision/image encoders
```

## OCR

```text
Tesseract / PaddleOCR
```

## Graph

```text
NetworkX
```

## Backend

```text
FastAPI
Pydantic
Uvicorn
```

## LLM

For a free/local MVP:

```text
Ollama
local open-source model
```

## Frontend

```text
React / Next.js
Recharts
Leaflet / Mapbox
```

---

# 40. Complete Risk Signal Catalogue

## Financial

- sanctioned vs recommended difference
- sanctioned vs expenditure difference
- unusual payment amount
- duplicate payment
- payment frequency
- split payment
- threshold proximity
- financial/physical divergence

## Project

- duplicate description
- duplicate location
- repeated project
- unusual cost
- unusual duration
- stalled project
- repeated extensions

## Vendor

- high concentration
- repeated high-risk projects
- cross-district concentration
- cross-MP concentration
- unusual network centrality

## Document

- amount mismatch
- date mismatch
- Work ID mismatch
- vendor mismatch
- reused document
- duplicate certificate
- inconsistent fields

## Image

- wrong asset
- image reuse
- high visual similarity
- GPS mismatch
- timestamp mismatch
- progress mismatch
- AI-generation risk
- manipulation/integrity risk

## Graph

- unusual centrality
- dense clusters
- shared vendors
- shared images
- shared documents
- cross-district relationships

---

# 41. Example End-to-End Case

```text
WORK ID
  ↓
Join all lifecycle datasets
  ↓
Recommended = ₹18L
Sanctioned = ₹20L
Expenditure = ₹18.5L
  ↓
Financial progress = 92.5%
  ↓
Reported physical progress = 48%
  ↓
Financial-physical gap = 44.5 pp
  ↓
Vendor analysis finds unusually high district concentration
  ↓
NLP finds similar work nearby
  ↓
Image uploaded
  ↓
Image embedding search finds 96% similar image
  ↓
Previous image belongs to another project
  ↓
Timeline metadata is inconsistent
  ↓
Risk Fusion
  ↓
91/100 — HIGH INVESTIGATION PRIORITY
  ↓
Evidence Card
  ↓
Recommended verification actions
```

---

# 42. Evidence Card Standard

Every high-risk project should have a structured evidence card:

```text
PROJECT
Work ID
Description
MP
District
Agency
Vendor

RISK
Overall Risk
Severity
Confidence

SIGNALS
Financial
Timeline
Duplicate
Vendor
Document
Image
Geospatial
Graph

EVIDENCE
Source dataset
Source row/record
Document
Image
Related project

WHY FLAGGED
Human-readable explanation

WHAT TO VERIFY
Specific auditor actions

MODEL INFORMATION
Model version
Rule version
Timestamp
```

---

# 43. What Sentinel Must NOT Do

Never:

- declare a person guilty
- call an anomaly proof of corruption
- claim AI-image detection is perfect
- fabricate GPS
- fabricate missing data
- treat semantic similarity as proof of duplication
- treat vendor concentration as proof of cartel activity
- treat cost outliers as proof of overpricing
- generate unsupported explanations
- hide uncertainty

Correct wording:

> "Potential anomaly requiring verification."

Not:

> "Fraud detected."

---

# 44. Final Architecture

```text
                         MPLADS DATA
                              |
             ┌────────────────┴────────────────┐
             ↓                                 ↓
      STRUCTURED DATA                      EVIDENCE
             |                           /          \
             ↓                          /            \
      DATA QUALITY AI             DOCUMENTS         IMAGES
             |                         |               |
             ↓                         ↓               ↓
   ENTITY RESOLUTION              DOCUMENT AI      VISION AI
             |                         |               |
             └─────────────┬───────────┴───────────────┘
                           ↓
                  CROSS-DATA INTELLIGENCE
                           |
          ┌────────────────┼─────────────────┐
          ↓                ↓                 ↓
     Financial AI      Duplicate AI      Vendor AI
          ↓                ↓                 ↓
     Timeline AI       Geo AI            Graph AI
          └────────────────┼─────────────────┘
                           ↓
                    PREDICTIVE AI
                           ↓
                    RISK FUSION
                           ↓
                 EXPLANATION ENGINE
                           ↓
              INVESTIGATION DOSSIER
                           ↓
                     AUDITOR UI
                           ↓
                      FEEDBACK
```

---

# 45. Final Implementation Principle

The most important architectural principle is:

> **Do not build "an AI model." Build a domain-specific evidence intelligence system.**

The strongest Sentinel implementation combines:

```text
Cross-dataset joins
+
Entity resolution
+
Statistical anomaly detection
+
NLP similarity
+
Vendor intelligence
+
Graph relationships
+
Document verification
+
Image verification
+
Geospatial verification
+
Predictive risk
+
Evidence-backed explanations
```

The final output is not simply:

```text
"AI says this is suspicious."
```

It is:

```text
"Project X has a HIGH investigation priority because
these independent signals were observed across these
datasets and evidence sources. Here is the underlying
evidence, confidence, uncertainty, related projects,
and the exact checks an auditor should perform."
```

That is the intended role of MPLADS Sentinel.
