# MPLADS Sentinel — Custom AI Specification

> **Purpose:** Complete specification of what the custom AI system should do, which AI technique should be used, what inputs it needs, what outputs it produces, and what is realistically achievable for SIH.

---

# 1. AI Philosophy

The project should not use one AI model for everything.

Use:

> **Rules for certainty + ML for patterns + NLP/LLMs for language + Computer Vision for images + Graph AI for relationships + Prediction for future risk.**

Architecture:

```text
                 MPLADS AI
                     │
      ┌──────────────┼──────────────┐
      ↓              ↓              ↓
 Financial AI     Document AI     Vision AI
      │              │              │
      └──────────────┼──────────────┘
                     ↓
                  Graph AI
                     ↓
              Predictive AI
                     ↓
                Risk Engine
                     ↓
             Explanation AI
```

---

# 2. AI Module Map

| Module | Purpose | Technique | Priority |
|---|---|---|---|
| Proposal AI | Evaluate proposal anomalies | NLP + statistics | 🔥 |
| Compliance AI | Check rules/guidelines | Rules + NLP | 🔥 |
| Cost AI | Detect unusual estimates | ML/statistics | 🔥 |
| Timeline AI | Detect/predict delays | rules + ML | 🔥 |
| Duplicate AI | Find similar projects | NLP + embeddings + GIS | 🔥 |
| Document AI | Understand documents | OCR + NLP/LLM | 🔥 |
| Image AI | Verify visual evidence | CV | 🔥 |
| Financial AI | Detect payment anomalies | statistics/ML | 🔥 |
| Evidence AI | Cross-check claims | multimodal reasoning | 🔥 |
| Graph AI | Detect network anomalies | graph algorithms/ML | ⭐ |
| Prediction AI | Forecast risk | ML | ⭐ |
| Audit Copilot | Explain/query cases | LLM + structured retrieval | ⭐ |

---

# 3. AI Module 1 — Proposal Intelligence

## Objective

Evaluate a proposal before or around sanction.

## Inputs

- Work description
- Work category
- State
- District
- Location
- Recommended amount
- Historical comparable projects
- Relevant guidelines

## AI tasks

### Cost comparison

Compare proposed amount against similar projects.

### Description similarity

Find previously recommended/sanctioned projects with similar descriptions.

### Eligibility/compliance

Identify potential prohibited or questionable patterns.

### Duplicate proposal

Detect:

- same location
- similar description
- similar amount
- similar beneficiary
- similar project category

## Output

```text
Proposal Risk: 63/100

Reasons:
⚠️ 34% above comparable median
⚠️ Similar project within 1.2 km
⚠️ Description highly similar to Project X
```

---

# 4. AI Module 2 — Compliance Intelligence

## Objective

Convert MPLADS rules/guidelines into machine-checkable controls.

## Use two layers

### Deterministic rules

Example:

```text
IF work_type = prohibited
→ Compliance Risk = HIGH
```

### NLP

For unstructured descriptions:

> Does the work description appear consistent with permitted categories?

## Output

```text
Compliance:
✓ Location valid
✓ Required fields present
⚠️ Work description requires review
```

---

# 5. AI Module 3 — Cost Anomaly Detection

## Objective

Detect unusually high/low estimates or expenditure.

## Features

- sanctioned amount
- recommended amount
- project category
- state
- district
- work description embedding
- size/quantity where available
- historical comparable projects
- implementing agency
- vendor

## Models

Start simple:

- Robust Z-score
- Isolation Forest
- Local Outlier Factor

Optional:

- XGBoost for supervised outcomes later

## Output

```text
Cost anomaly: HIGH

Submitted:
₹42L

Comparable median:
₹30L

Deviation:
+40%
```

---

# 6. AI Module 4 — Timeline Intelligence

## Objective

Detect current delays and predict future delays.

## Inputs

- planned dates
- actual dates
- milestone dates
- dependencies
- work status
- expenditure progression

## Detect

- late start
- late milestone
- stalled work
- dependency violation
- unrealistic completion
- repeated extensions

## Prediction

> Probability of missing deadline = 81%

## Output

```text
Timeline Risk: 76

Current delay:
38 days

Predicted delay:
61 days
```

---

# 7. AI Module 5 — Duplicate Project Detection

## Objective

Detect multiple projects that may represent the same or substantially overlapping work.

## Inputs

- work description
- project category
- location
- coordinates
- MP
- agency
- amount
- date

## Pipeline

```text
Description
    ↓
Embedding
    ↓
Similarity search
    ↓
GIS proximity
    ↓
Cost similarity
    ↓
Time overlap
    ↓
Duplicate probability
```

## Output

```text
Possible duplicate

NLP similarity: 92%
Location similarity: 97%
Cost similarity: 89%

Overall:
91%
```

---

# 8. AI Module 6 — Document Intelligence

## Objective

Understand and cross-check project documents.

## Pipeline

```text
PDF/Image
   ↓
OCR
   ↓
Document Classification
   ↓
Field Extraction
   ↓
Entity Normalization
   ↓
Cross-document Comparison
```

## Extract

- Project ID
- Work description
- Amount
- Date
- Authority
- Agency
- Milestone
- Certificate number
- Vendor
- Reference numbers

## Cross-check

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

## Output

> ⚠️ Completion certificate amount differs from verified expenditure.

---

# 9. AI Module 7 — Document Similarity

Detect:

- reused certificates
- duplicated reports
- repeated wording
- template manipulation
- near-identical documents

Methods:

- text embeddings
- document fingerprints
- similarity search
- structured field comparison

Output:

> **Potentially reused certificate detected across 7 projects.**

---

# 10. AI Module 8 — Image Verification

This is one of the most important modules.

## Objective

Determine whether submitted evidence is consistent with:

- project
- location
- milestone
- expected asset
- previous evidence

## Inputs

- Image
- Project ID
- Expected asset
- GPS
- Timestamp
- Milestone
- Previous images

---

# 11. Image Check A — Location

Compare:

```text
Project GPS
      ↓
Image GPS
      ↓
Distance
```

Output:

> ⚠️ Image captured 18.7 km from registered project location.

If metadata is unavailable:

> Location verification unavailable.

Do not fabricate certainty.

---

# 12. Image Check B — Reuse

Methods:

### Perceptual hashing

Good for near-identical images.

### Image embeddings

Good for visually similar images.

### Vector search

Find nearest images across the project database.

Output:

```text
Similarity:
99.4%

Possible reused evidence.
```

---

# 13. Image Check C — Wrong Asset

Compare expected:

> Community Hall

against visual classification.

Potential output:

> ⚠️ Image appears inconsistent with declared asset type.

This is a risk signal, not a final verdict.

---

# 14. Image Check D — Progress

Build project-specific visual stages.

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

AI estimates an observed stage.

Example:

```text
Reported stage:
6 / 7

Visual signal:
3 / 7

→ Major inconsistency
```

This is feasible for selected project categories in an MVP if the visual taxonomy is controlled.

---

# 15. Image Check E — Temporal Consistency

Compare:

- capture time
- upload time
- previous evidence
- milestone dates

Detect:

- image older than milestone
- repeated image over long intervals
- inconsistent sequence

---

# 16. Image Check F — Manipulation Signals

Potential signals:

- metadata anomalies
- compression inconsistency
- editing traces
- inconsistent regions
- duplicated regions

Important:

> This should be presented as **image integrity risk**, not definitive deepfake detection.

Advanced forensic detection is a future scope item.

---

# 17. AI Module 9 — Financial Intelligence

## Objective

Find unusual financial patterns.

## Detect

### Amount anomalies

Payment unusually large/small.

### Timing anomalies

Payment unusually close to deadline.

### Frequency anomalies

Many payments in a short time.

### Duplicate payment

Same reference/amount/vendor.

### Split-payment patterns

Many payments just below a threshold.

### Vendor concentration

One vendor receives unusually large share.

### Budget-component mismatch

Component budget ≠ component spending.

---

# 18. AI Module 10 — Financial vs Physical Intelligence

This should be a core feature.

Calculate:

```text
Financial Progress
vs
Physical Progress
```

Example:

```text
Financial: 88%
Physical: 52%

Gap: 36 percentage points
```

Large unexplained gaps increase risk.

---

# 19. AI Module 11 — Graph Intelligence

## Graph entities

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

## Edges

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

- unusually central vendors
- repeated entities
- project clusters
- shared evidence
- unusual cross-district relationships
- possible related entities

---

# 20. AI Module 12 — Risk Aggregation

All modules feed a common risk engine.

```text
Proposal Risk
      +
Compliance Risk
      +
Financial Risk
      +
Timeline Risk
      +
Document Risk
      +
Image Risk
      +
Duplicate Risk
      +
Graph Risk
      ↓
TOTAL RISK
```

Example:

```text
PROJECT RISK = 84/100

Financial        21
Timeline         17
Image            19
Document         12
Graph            15
```

---

# 21. AI Module 13 — Explanation Engine

The AI must answer:

> **Why is this project risky?**

It should retrieve the actual structured evidence.

Example:

> “The project has a risk score of 84 because expenditure is 31% above comparable projects, reported completion is 146 days late, and two submitted images are highly similar to evidence from another project.”

Every statement should link back to evidence.

---

# 22. AI Module 14 — AI Audit Copilot

This is an interface over the structured system.

Examples:

### Query

> Show high-risk projects where spending is above 80% but physical progress is below 50%.

### Query

> Why is Project X high risk?

### Query

> Show projects with repeated completion certificates.

### Query

> Which vendors are associated with the most high-risk projects?

### Query

> What evidence should I verify for this case?

The LLM should query structured data rather than hallucinate.

---

# 23. AI Module 15 — Predictive Risk

Future risk predictions:

### Completion prediction

> Probability of missing deadline.

### Cost overrun prediction

> Probability of exceeding sanctioned amount.

### Stalling prediction

> Probability that a project becomes inactive.

### Evidence risk

> Probability that upcoming milestone submission will be inconsistent.

---

# 24. Custom AI Does NOT Need to Mean “Train an LLM From Scratch”

A legitimate custom AI system can be:

```text
Domain Rules
+
Custom Features
+
ML Models
+
NLP Models
+
Vision Models
+
Graph Algorithms
+
Risk Aggregation
+
Domain-Specific Explanation
```

The value is in the **domain-specific system**, not in training a foundation model from zero.

---

# 25. AI 20/80 Split

## AI can accelerate ~20%

AI-assisted development can rapidly generate:

- APIs
- database models
- UI
- preprocessing
- ML pipelines
- embedding search
- OCR pipelines
- image similarity
- charts
- synthetic data

## The team still owns ~80%

Humans must decide:

- what constitutes risk
- thresholds
- domain rules
- evidence requirements
- acceptable false positives
- model validation
- data strategy
- system architecture
- governance
- deployment

---

# 26. Model Validation Strategy

Because real fraud labels are limited:

## Do not claim:

> 98% fraud detection accuracy.

Instead validate:

### Rule correctness

Does the rule correctly identify known violations?

### Synthetic attack tests

Create controlled examples:

- duplicate payment
- reused image
- inflated amount
- false progress

### Historical audit cases

Where possible, reproduce patterns from CAG findings.

### Ranking quality

Measure:

> Are known/high-risk cases appearing near the top?

This is more meaningful for an investigation-prioritization system.

---

# 27. Synthetic Attack Generator

A powerful development tool:

```text
REAL PROJECT
     ↓
ATTACK GENERATOR
     ├── Inflate cost
     ├── Duplicate image
     ├── Change date
     ├── Delay milestone
     ├── Alter amount
     ├── Duplicate document
     └── Create payment anomaly
     ↓
AI
     ↓
Can it detect the attack?
```

This can become a strong SIH demo.

---

# 28. Recommended MVP AI Stack

## Must build

### Financial

- Robust statistics
- Isolation Forest

### NLP

- Sentence embeddings
- Similarity search

### Documents

- OCR
- Structured extraction
- Cross-document rules

### Vision

- Image embeddings
- Perceptual hashing
- Controlled asset classification
- Metadata/GPS validation

### Timeline

- Rule-based delay
- Simple prediction model

### Risk

- Weighted aggregation
- Explainable reason generator

---

# 29. Strong Bonus

### Graph

- NetworkX
- Neo4j if useful

### AI Copilot

- LLM + retrieval
- SQL/function calling

### Advanced CV

- stage classification
- image consistency

---

# 30. AI Safety / Governance

The AI must:

- avoid accusing individuals
- show evidence
- show uncertainty
- record model version
- record rule/model that triggered alert
- allow human override
- maintain audit history

Every prediction should have:

```text
Model version
Timestamp
Input snapshot
Risk score
Reasons
Confidence / uncertainty
```

---

# 31. Final AI Architecture

```text
                    MPLADS DATA
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
       STRUCTURED DATA          DOCUMENTS
              │                     │
              ↓                     ↓
       FEATURE ENGINE           OCR / NLP
              │                     │
              └──────────┬──────────┘
                         ↓
               ┌──────────────────┐
               │   AI ENGINES     │
               │                  │
               │ Financial        │
               │ Timeline         │
               │ Duplicate        │
               │ Document         │
               │ Vision           │
               │ Graph            │
               │ Prediction       │
               └────────┬─────────┘
                        ↓
                  RISK ENGINE
                        ↓
              EXPLANATION ENGINE
                        ↓
                  AI COPILOT
                        ↓
                 OFFICER UI
                        ↓
                  CASE OUTCOME
                        ↓
                    FEEDBACK
```

---

# 32. Ultimate AI Objective

The custom AI should answer four questions:

### 1. **What is unusual?**

> Anomaly detection.

### 2. **Why is it unusual?**

> Explainability.

### 3. **How serious is it?**

> Risk scoring.

### 4. **What should be investigated first?**

> Prioritization.

That is the real purpose of the AI system.

---

# 33. Final Principle

> **The AI should never replace evidence. It should connect evidence.**

The winning system is not:

> **“AI says fraud.”**

It is:

> **“AI found an inconsistency, here are the independent signals, here is the underlying evidence, and here is why this case should be investigated first.”**
