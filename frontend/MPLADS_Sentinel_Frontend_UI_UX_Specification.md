# 🛡️ MPLADS Sentinel — Frontend UI/UX & Multi-Page Website Specification

> **Document type:** Frontend product/design specification  
> **Project:** MPLADS Sentinel (रक्षक)  
> **SIH Problem Statement:** SIH26102  
> **Organization:** Ministry of Statistics and Programme Implementation (MoSPI), DIID  
> **Primary purpose:** Give any designer, frontend developer, backend developer, or coding AI enough context to understand exactly what the MPLADS Sentinel website should look like, how it should behave, what pages it should contain, how pages connect, and what data each page is expected to consume.

---

# 0. 🚨 Read This First

## What are we building?

**MPLADS Sentinel is not a generic dashboard and not a chatbot.**

It is an **AI-powered evidence verification and risk-intelligence platform for MPLADS/eSAKSHI**.

The frontend must communicate one core idea:

> **The existing system records what happened. Sentinel checks whether what happened makes sense, explains why something is unusual, connects the finding to evidence, and prioritizes cases for authorized investigation.**

The curated project definition explicitly positions Sentinel as an **intelligence, verification and risk layer** rather than a replacement for eSAKSHI. The intended flow is:

```text
MPLADS / eSAKSHI
       ↓
Project + Financial + Document + Image + Progress Data
       ↓
Sentinel Verification & AI Analysis
       ↓
Risk Signals
       ↓
Composite Risk
       ↓
Evidence-Linked Explanation
       ↓
Investigation Queue
       ↓
Authorized Review
```

The frontend must make this workflow obvious without requiring a judge or user to understand machine learning.

---

# 1. 🎯 Product Goal

The primary user question the website must answer is:

> **“Which projects should I investigate first, why are they risky, and show me the evidence.”**

Everything in the UI should support that question.

The interface should allow a user to:

1. Understand the national/state/district risk situation.
2. Find projects requiring attention.
3. Open an individual project.
4. Understand the project's lifecycle.
5. Inspect its financial status.
6. Inspect timeline and milestone status.
7. Inspect documents and certificates.
8. Inspect visual evidence.
9. Understand every AI-generated risk signal.
10. See the evidence behind each signal.
11. Ask the AI Copilot questions.
12. Create or manage an investigation case.
13. View historical/analytical patterns.

---

# 2. 🎨 Design Direction

## Visual reference

The supplied UI inspiration is a clean, modern financial dashboard with:

- spacious layout
- rounded cards
- neutral/light background
- large typography
- subtle borders
- restrained shadows
- compact navigation
- data-rich cards
- simple charts
- status pills
- table-based recent activity
- dark/light mode
- minimal visual noise

Use this **design language**, not its financial information architecture.

## Desired personality

The website should feel like:

> **A modern national-level audit intelligence product.**

It should NOT feel like:

- an old government portal
- a generic admin template
- a banking application
- a generic SaaS analytics dashboard
- a ChatGPT clone
- an AI-generated website full of glowing gradients

## Design keywords

```text
Modern
Institutional
Trustworthy
Calm
Precise
Evidence-driven
Data-dense but readable
Professional
Minimal
AI-native
Government-grade
```

---

# 3. 🧭 Core UX Philosophy

## Principle 1 — Attention before information

The first screen should answer:

> **What needs my attention?**

Not:

> “Here are all the things our system can do.”

---

## Principle 2 — Risk must always be explainable

Never display:

```text
Risk Score: 87
```

without a path to:

```text
Why?
↓
Which signal?
↓
Which data?
↓
Which evidence?
↓
Which rule/model?
↓
What should I investigate?
```

---

## Principle 3 — Evidence is more important than decoration

If space is limited, prioritize:

1. project identity
2. risk
3. reason
4. evidence
5. action

over decorative charts.

---

## Principle 4 — AI must never visually claim guilt

Do not use language such as:

- “Fraudster”
- “Fraud confirmed”
- “Guilty”
- “Corrupt agency”
- “Fake document”

unless an authorized human case outcome has formally established that fact.

Preferred language:

- “Potential irregularity”
- “High-risk case”
- “Possible duplicate”
- “Evidence inconsistency”
- “Requires verification”
- “Image integrity risk”
- “Potential financial anomaly”

The project's risk philosophy is:

> **Risk score is an investigation-prioritization signal, not a fraud verdict.**

---

## Principle 5 — The website should work without AI

If the LLM is unavailable, the core dashboard must still work.

The essential product is:

```text
Data
→ Rules / ML / NLP / CV / Graph
→ Risk
→ Evidence
→ Investigation
```

The AI Copilot is an additional interaction layer.

---

# 4. 👥 Primary Users

## 4.1 MoSPI / Central Monitoring

Needs:

- national overview
- state comparison
- district comparison
- high-value/high-risk cases
- agency patterns
- risk trends
- aggregate analytics

Primary UI:

**Command Center + Analytics + Risk Intelligence**

---

## 4.2 State Nodal Authorities

Needs:

- state-level risk
- constituency/project monitoring
- district comparison
- agency patterns
- unresolved investigations

Primary UI:

**State Dashboard + Projects + Risk Queue**

---

## 4.3 District Authorities

Needs:

- investigation queue
- project evidence
- financial anomalies
- timeline anomalies
- document verification
- image verification
- case management

Primary UI:

**Risk Queue + Project Detail + Evidence + Investigations**

---

## 4.4 Auditors / Authorized Reviewers

Needs:

- evidence traceability
- source records
- model/rule reasons
- case history
- investigation notes
- exportable investigation brief

Primary UI:

**Investigation Workspace**

---

## 4.5 MPs

Potential role:

- project status
- milestone progress
- risk notifications
- evidence submission status

This should be role-specific and should not expose sensitive investigation information unnecessarily.

---

## 4.6 Implementing Agencies

Potential role:

- assigned projects
- required milestones
- evidence submission
- document status
- correction requests

This is secondary to the SIH MVP.

---

# 5. 🗺️ Information Architecture

Recommended top-level navigation:

```text
MPLADS SENTINEL

├── Command Center
├── Projects
├── Risk Intelligence
├── Investigations
├── Evidence
├── Analytics
└── AI Copilot
```

Secondary utilities:

```text
Search
Notifications
Help
Profile
Theme
```

If the interface becomes too wide, use a collapsible sidebar.

---

# 6. 🌐 URL Architecture & SEO

The application must be a **real multi-page application**, not one giant page with hidden sections.

Recommended framework:

> **Next.js + TypeScript**

Use semantic, stable URLs.

## Public/marketing routes

```text
/
 /about
 /how-it-works
 /methodology
 /research
 /transparency
 /contact
```

These pages can be indexable.

---

## Application routes

```text
/app
/app/command-center
/app/projects
/app/projects/[projectId]
/app/risk
/app/risk/financial
/app/risk/timeline
/app/risk/duplicates
/app/risk/documents
/app/risk/visual
/app/investigations
/app/investigations/[caseId]
/app/evidence
/app/evidence/[evidenceId]
/app/analytics
/app/analytics/national
/app/analytics/states/[state]
/app/analytics/districts/[district]
/app/copilot
```

---

## Dataset routes

```text
/app/data
/app/data/works
/app/data/expenditure
/app/data/allocations
/app/data/recommendations
/app/data/sanctions
/app/data/completions
```

---

## Optional role-specific routes

```text
/app/mp
/app/state
/app/district
/app/auditor
/app/agency
```

These can use the same underlying components with different permissions.

---

# 7. 🔐 URL / Access Rules

URLs should be:

- human-readable
- stable
- bookmarkable
- deep-linkable
- permission-aware

Example:

```text
/app/projects/MPL-004821
```

is preferable to:

```text
/app?page=7&id=4821
```

For sensitive evidence:

- route may exist only for authorized users
- server-side authorization must happen before data is returned
- sensitive pages should use `noindex`
- do not expose private document URLs in page source

---

# 8. 🔎 SEO Strategy

SEO applies primarily to the public information layer, not sensitive application pages.

## Public page metadata

Every public page should have:

- unique `<title>`
- unique meta description
- canonical URL
- Open Graph metadata
- Twitter/X metadata
- structured headings
- semantic HTML
- sitemap
- robots configuration

Example:

```text
Title:
MPLADS Sentinel — AI Risk Intelligence for MPLADS

Description:
Explainable AI-powered evidence verification and risk intelligence for monitoring MPLADS project, financial, documentary and visual anomalies.
```

---

## Application metadata

For authenticated pages:

```text
robots: noindex, nofollow
```

Do not index:

- private project evidence
- investigation cases
- internal analytics
- user dashboards
- sensitive documents

---

# 9. 🧱 Global Layout

The overall application should follow the supplied design inspiration.

```text
┌───────────────────────────────────────────────────────────────┐
│ 🛡 MPLADS SENTINEL        Navigation           Search  🔔 👤 │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                         PAGE CONTENT                           │
│                                                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Desktop

Use:

- max-width container around 1400–1600px
- generous outer margins
- 12-column grid
- 16–24px card gaps
- 24–32px card padding

## Tablet

Collapse navigation and reduce card density.

## Mobile

Use:

- bottom navigation or compact drawer
- stacked cards
- horizontal scrolling for large tables
- sticky action controls
- simplified charts

The application should remain usable at 375px width.

---

# 10. 🧩 Global Components

Create reusable components instead of designing every page independently.

## Required components

```text
AppShell
TopNav
Sidebar
Breadcrumbs
PageHeader
MetricCard
RiskBadge
StatusBadge
RiskScore
RiskBreakdown
ChartCard
DataTable
FilterBar
SearchBar
EvidenceCard
EvidenceStatus
Timeline
MilestoneCard
ProjectHeader
ProjectSummary
AIInsight
AIExplanation
CopilotPanel
DocumentViewer
ImageComparison
MapPanel
CaseStatus
CaseTimeline
EmptyState
LoadingState
ErrorState
Toast
Modal
Drawer
CommandPalette
```

---

# 11. 🎨 Color Semantics

Use mostly neutral colors.

Risk colors have semantic meaning:

```text
🟢 LOW       = normal / low concern
🟡 MEDIUM    = unusual / monitor
🟠 HIGH      = multiple risk signals
🔴 CRITICAL  = strong multi-source inconsistency / investigate
```

Do not use red as a decorative accent.

Red should mean something.

The primary brand accent can be a restrained blue/indigo/teal family, but the final exact palette should be chosen during implementation.

---

# 12. 🔤 Typography

Use a modern sans-serif.

Recommended:

```text
Inter
Manrope
Plus Jakarta Sans
```

Use:

- large display heading
- medium section headings
- compact table text
- monospace for IDs / technical values where useful

Example:

```text
MPL-004821
```

can use a monospace style.

---

# 13. 🏠 PAGE 1 — COMMAND CENTER

## Route

```text
/app/command-center
```

## Purpose

This is the **main judge-demo screen**.

The user should immediately understand:

- how many works are monitored
- how many are risky
- what the risk trend looks like
- what requires investigation
- which risk categories dominate

---

## Header

```text
Good evening, Auditor
National MPLADS Risk Intelligence

[Date range ▼] [Region ▼] [Search]
```

Do not use overly personal greetings if the logged-in role is unknown.

Alternative:

```text
MPLADS Risk Intelligence
National Monitoring Overview
```

---

## Top KPI row

Four cards:

### Works Monitored

```text
18,432
Works screened
```

### High Risk

```text
127
Investigation priority
```

### Critical

```text
34
Requires immediate review
```

### Flagged Value

```text
₹ XX Cr
Across prioritized works
```

Only use real calculated values in the final demo.

---

## Main chart row

### Risk Trend

Line/area chart:

```text
Risk
100 ┤
 80 ┤          ╭────╮
 60 ┤     ╭────╯    ╰──
 40 ┤─────╯
    └────────────────────
       Jan Feb Mar Apr
```

Filters:

```text
7D | 30D | 3M | 1Y
```

---

### Risk Distribution

Donut chart:

```text
          ┌─────────┐
          │ 18,432  │
          │  WORKS  │
          └─────────┘

🟢 Low       17,884
🟡 Medium       421
🟠 High          93
🔴 Critical      34
```

---

## Priority Investigation Queue

This is the most important table.

Columns:

```text
Project
Work
District
Risk
Primary Signal
Updated
Action
```

Example:

```text
MPL-004821
Community Hall
District A
92
Cost anomaly
2h ago
View →
```

Rows should be clickable.

---

## Quick insight card

Example:

```text
✦ Sentinel Insight

Financial/physical mismatch is currently
the most frequent high-risk signal in
the selected region.

[Explore Risk Pattern →]
```

---

## Dashboard interactions

Clicking:

- High Risk → `/app/risk?severity=high`
- Critical → `/app/risk?severity=critical`
- project → `/app/projects/MPL-004821`
- financial signal → `/app/risk/financial`
- district → district analytics

---

# 14. 📋 PAGE 2 — PROJECTS

## Route

```text
/app/projects
```

## Purpose

Master searchable project database.

---

## Header

```text
Projects

Search projects, locations, agencies...
```

Buttons:

```text
[Filters]
[Export]
```

---

## Filters

```text
State
District
Constituency
Project Category
Status
Risk Level
Agency
Date Range
```

---

## Table

Columns:

```text
Project ID
Work Description
Location
Recommended
Sanctioned
Expenditure
Progress
Risk
Status
```

Example:

```text
MPL-004821
Construction of Community Hall
District A
₹35L
₹35L
₹30.8L
52%
87
High Risk
```

---

## Table behavior

Support:

- sorting
- filtering
- pagination
- column visibility
- search
- row click
- keyboard navigation

---

## URL query state

Filters should be encoded in URL:

```text
/app/projects?state=Delhi&risk=high&status=ongoing
```

This makes filtered views shareable.

---

# 15. 🔎 PAGE 3 — PROJECT DETAIL / DIGITAL PROJECT TWIN

## Route

```text
/app/projects/[projectId]
```

Example:

```text
/app/projects/MPL-004821
```

This is one of the most important pages in the entire application.

---

# Project Header

```text
← Projects

MPL-004821
Construction of Community Hall

District A • State X
Category: Community Infrastructure

[High Risk] [87 / 100]
```

Actions:

```text
[Review Evidence]
[Ask Sentinel]
[Create Investigation]
```

---

# Project summary cards

```text
Recommended       ₹35L
Sanctioned        ₹35L
Expenditure       ₹30.8L
Financial Progress 88%
Physical Progress  52%
Timeline Delay     38 days
```

---

# Project Lifecycle

Visual horizontal timeline:

```text
Proposal
   ✓
   │
Approval
   ✓
   │
Agency Assignment
   ✓
   │
Execution
   ✓
   │
Milestones
   ⚠
   │
Evidence
   ⚠
   │
Completion
   ?
```

---

# Financial section

Show:

```text
Recommended
₹35L

Sanctioned
₹35L

Committed
₹31L

Paid / Disbursed
₹30.8L

Verified Expenditure
₹29.2L
```

Important UI principle:

> **Money transferred, money spent and expenditure verified are not automatically treated as the same state.**

---

# Financial vs Physical Progress

This should be highly visual.

```text
FINANCIAL PROGRESS

██████████████████ 88%

PHYSICAL PROGRESS

███████████        52%

GAP

36 percentage points
```

If a large unexplained gap exists:

```text
⚠ High-risk inconsistency
```

---

# Timeline

Show milestones:

```text
Site Preparation
████████████████████ ✓

Foundation
████████████████     ✓

Structure
██████████           ⚠

Electrical / Plumbing
██                   ⏳

Finishing
░░░░░░░░░░░░░░░░░░
```

Each milestone can show:

- planned start
- planned end
- actual start
- actual end
- responsible role
- budget
- evidence
- status

---

# Risk breakdown

```text
COMPOSITE RISK

87 / 100
HIGH

Financial          +21
Timeline           +17
Image              +19
Document           +12
Duplicate          +10
Graph               +8
```

The actual aggregation weights and scoring configuration must come from the AI/risk engine, not be invented by the frontend.

---

# Why flagged?

This section is mandatory.

```text
WHY WAS THIS PROJECT FLAGGED?

🔴 Cost anomaly
Project cost is 31% above comparable projects.

🔴 Progress mismatch
Financial progress is 88%; reported physical progress is 52%.

🟠 Image similarity
Submitted image is highly similar to evidence
associated with another project.

🟠 Document inconsistency
Completion-related amount differs from verified expenditure.
```

Every reason should be clickable.

---

# Evidence preview

```text
Evidence

📄 Sanction Document       ✓
📄 Work Order              ✓
📄 Progress Report         ⚠
📄 Completion Certificate  ⚠
📸 Site Image              ⚠
📍 Location Metadata       ✓
```

---

# AI explanation

```text
✦ Sentinel Assessment

This project is prioritized because several
independent signals are present...

[Show reasoning]
```

---

# 16. 🚨 PAGE 4 — RISK INTELLIGENCE

## Route

```text
/app/risk
```

Purpose:

Central risk-monitoring workspace.

---

## Header

```text
Risk Intelligence

Find unusual patterns before they become
investigation backlogs.
```

---

## Risk overview

Cards:

```text
All flagged
High
Critical
New this week
Escalated
```

---

## Risk categories

Display six/eight major categories:

```text
Financial
Timeline
Compliance
Duplicate
Document
Visual Evidence
Graph / Agency
Prediction
```

Each is clickable.

---

# 17. 💰 PAGE 5 — FINANCIAL RISK

## Route

```text
/app/risk/financial
```

Purpose:

Analyze financial anomalies.

---

## Candidate checks

- recommended vs sanctioned
- sanctioned vs expenditure
- planned vs actual spending
- expenditure velocity
- unusual payment amounts
- unusual payment timing
- payment concentration
- duplicate payment
- split-payment patterns
- vendor concentration
- component overspending
- unreconciled expenditure
- financial/physical mismatch

---

## UI

Top cards:

```text
Cost anomalies
Payment anomalies
Duplicate payment signals
High-risk expenditure
```

Charts:

- expenditure distribution
- anomaly scatter
- expenditure vs progress
- vendor concentration

Table:

```text
Project
Amount
Expected Range
Deviation
Signal
Risk
```

---

# 18. ⏱️ PAGE 6 — TIMELINE RISK

## Route

```text
/app/risk/timeline
```

Purpose:

Identify delayed, stalled or unrealistic projects.

---

## Visual

Timeline chart:

```text
Planned
|──────────────|

Actual
|──────────────────────|

Delay
        ← 38 days →
```

---

## Signals

- late start
- late milestone
- stalled work
- dependency violation
- unrealistic completion
- repeated extension
- predicted deadline miss

---

## Prediction card

```text
Deadline Risk

81%

Probability of missing planned completion
```

Only show prediction if the model actually calculates it.

---

# 19. 🔁 PAGE 7 — DUPLICATE INTELLIGENCE

## Route

```text
/app/risk/duplicates
```

Purpose:

Detect potentially duplicate or overlapping works.

---

## Search result design

Two project cards side by side:

```text
PROJECT A
Construction of community hall
Village X
₹35L

        VS

PROJECT B
Construction of community centre
Village X
₹37L
```

Then:

```text
Text similarity       92%
Location similarity   97%
Cost similarity       89%

Overall similarity    91%
```

---

## Visual explanation

```text
Description
    ↓
Embedding
    ↓
Similarity Search
    ↓
GIS Proximity
    ↓
Cost Similarity
    ↓
Time Overlap
    ↓
Potential Duplicate
```

Use:

> **Potential duplicate**

not:

> **Duplicate confirmed**

---

# 20. 📄 PAGE 8 — DOCUMENT INTELLIGENCE

## Route

```text
/app/risk/documents
```

Purpose:

Document verification.

---

## Supported document types

Potentially:

- Proposal
- Estimate
- Feasibility report
- Technical sanction
- Administrative sanction
- Work order
- Invoice
- Bill
- Progress report
- Inspection report
- Utilization certificate
- Completion certificate

---

## Document table

```text
Document
Project
Type
Uploaded
Status
AI Check
```

---

# Document detail

Display:

```text
Document Viewer
        +
Extracted Fields
        +
Cross-document Comparison
        +
AI Findings
```

---

## OCR result

Example:

```text
Project ID       MPL-004821
Amount           ₹35,00,000
Authority        ...
Agency           ...
Certificate No.  ...
Date             ...
```

---

## Cross-document comparison

```text
Sanction        ₹35L
Work Order      ₹37L
Final Bill      ₹41L
Certificate     ₹35L

⚠ Cross-document inconsistency
```

---

# 21. 📸 PAGE 9 — VISUAL EVIDENCE INTELLIGENCE

## Route

```text
/app/risk/visual
```

This should be one of the strongest visual pages.

---

# Image verification workflow

```text
Submitted Image
      ↓
Metadata
      ↓
GPS / Timestamp
      ↓
Project Context
      ↓
Image Similarity
      ↓
Visual Classification
      ↓
Previous Evidence
      ↓
Risk Signal
```

---

# Image verification card

```text
┌──────────────────────────┐
│                          │
│        SITE IMAGE        │
│                          │
└──────────────────────────┘

Status: ⚠ Requires Review

Checks

✓ Project context
✓ Asset category
⚠ Image similarity
⚠ Temporal consistency
? GPS unavailable
```

---

# Location check

If GPS exists:

```text
Project Location
28.61° N, 77.21° E

Image Location
28.44° N, 77.12° E

Distance
18.7 km

⚠ Location mismatch
```

If metadata does not exist:

```text
Location verification unavailable.

Do not infer or fabricate a location.
```

---

# Reuse detection

Show side-by-side:

```text
Project A              Project B

[IMAGE]                [IMAGE]

Similarity: 99.4%

⚠ Possible reused evidence
```

Methods can include:

- perceptual hash
- image embeddings
- vector similarity

---

# Wrong asset

```text
Expected asset:
Community Hall

Visual signal:
Potential inconsistency with declared asset type.

Confidence:
72%
```

Always show uncertainty.

---

# Progress stage

For supported project categories:

```text
Site
  ↓
Foundation
  ↓
Structure
  ↓
Roof
  ↓
Services
  ↓
Finishing
  ↓
Completion
```

Show:

```text
Reported stage: 6 / 7
Visual signal: 3 / 7

⚠ Major inconsistency
```

---

# Image integrity

Potential signals:

- metadata anomalies
- compression inconsistency
- editing traces
- duplicated regions

UI wording:

> **Image integrity risk detected**

not:

> **Image is fake**

Advanced forensic detection should be clearly treated as future scope unless actually implemented.

---

# 22. 📂 PAGE 10 — EVIDENCE REPOSITORY

## Route

```text
/app/evidence
```

Purpose:

Central evidence browser.

---

## Filters

```text
Project
Evidence type
Status
Date
Risk
Source
```

Evidence types:

```text
Document
Image
Payment
Certificate
Inspection
GPS
Milestone
Report
```

---

## Evidence card

```text
📸 Site Image

Project: MPL-004821
Milestone: Structure
Submitted: 12 Aug 2026

Status:
⚠ Requires Review

Signals:
Image similarity
Temporal inconsistency

[View Evidence]
```

---

# 23. 🔎 PAGE 11 — EVIDENCE DETAIL

## Route

```text
/app/evidence/[evidenceId]
```

This page must provide full traceability.

---

## Layout

Left:

```text
Evidence
```

Right:

```text
AI analysis
```

Bottom:

```text
Source
Project
Timeline
Related evidence
```

---

## Evidence provenance

Show:

```text
Source
Uploaded by
Uploaded at
Project
Milestone
Document version
Model checked
Rule checked
```

---

# 24. 🕵️ PAGE 12 — INVESTIGATIONS

## Route

```text
/app/investigations
```

Purpose:

Convert risk signals into structured review cases.

---

## Case states

From the curated project definition:

```text
New
Under Review
Evidence Requested
Escalated
Cleared
Confirmed Irregularity
Closed
```

Use official terminology if the actual target workflow later confirms different labels.

---

## Investigation table

```text
Case
Project
Risk
Primary Issue
Assigned To
Status
Updated
```

---

# 25. 📁 PAGE 13 — INVESTIGATION WORKSPACE

## Route

```text
/app/investigations/[caseId]
```

This is the **auditor workspace**.

---

## Header

```text
Investigation Case

CASE-2026-00128

Project:
MPL-004821

Risk:
87 / 100

Status:
Under Review
```

---

## Investigation summary

```text
Primary concern
Financial / physical mismatch

Supporting signals
Cost anomaly
Timeline delay
Image reuse
Document inconsistency
```

---

## Evidence chain

```text
Risk
 ↓
Reason
 ↓
Claim
 ↓
Evidence
 ↓
Document / Image / Payment
 ↓
Original Project Event
```

This is a central product concept.

---

## Investigator notes

Allow:

```text
Add note
Mention evidence
Assign reviewer
Request evidence
Change status
```

---

## Action buttons

```text
[Request Evidence]
[Assign]
[Escalate]
[Mark Reviewed]
[Close Case]
```

Final authority remains human.

---

# 26. 📊 PAGE 14 — ANALYTICS

## Route

```text
/app/analytics
```

Purpose:

Understand aggregate patterns.

---

## Tabs

```text
National
States
Districts
Agencies
Categories
Financial
Timeline
Evidence
```

---

# National analytics

Show:

- works by state
- risk by state
- expenditure by state
- high-risk concentration
- completion trends
- anomaly trends

---

# State analytics

Route:

```text
/app/analytics/states/[state]
```

Example:

```text
/app/analytics/states/delhi
```

Show:

```text
State Risk Score
High-risk works
District comparison
Agency distribution
Category distribution
Risk trend
```

---

# District analytics

Route:

```text
/app/analytics/districts/[district]
```

Show:

- project count
- total sanctioned
- expenditure
- risk distribution
- delayed works
- top signals
- agencies
- high-risk projects

---

# 27. 🗺️ MAP VIEW

Optional but highly recommended.

Use:

**Leaflet / MapLibre**

Display:

```text
Project location
Risk level
Project category
Status
```

Cluster markers at national scale.

Clicking marker:

```text
Project
Risk
Primary signal
View →
```

Do not expose precise sensitive information to unauthorized users.

---

# 28. 🤖 PAGE 15 — AI COPILOT

## Route

```text
/app/copilot
```

The Copilot is a structured interface over the intelligence system.

It is NOT the main product.

---

# Copilot layout

```text
┌───────────────────────────────────────────────────────────┐
│ ✦ Sentinel Copilot                                       │
│                                                           │
│ Ask about projects, risks, evidence and guidelines.       │
│                                                           │
│ Suggested questions                                       │
│                                                           │
│ • Why is MPL-004821 high risk?                            │
│ • Show projects with spending >80% and progress <50%.     │
│ • Which vendors appear across high-risk projects?         │
│ • What evidence should I verify?                          │
│                                                           │
│ [ Ask Sentinel...                                  ] [→]  │
└───────────────────────────────────────────────────────────┘
```

---

# Copilot response structure

```text
Answer

The project is high risk because...

Risk signals
• Cost anomaly
• Timeline delay
• Evidence similarity

Evidence
• Project record
• Progress report
• Image

Guideline / source
• Relevant official reference

Recommended verification
• Check physical progress
• Compare submitted image
• Review expenditure record
```

---

# Critical Copilot requirement

The LLM should query:

- structured project data
- risk engine output
- evidence records
- retrieved official documents

It should not invent project facts.

---

# 29. ✦ CONTEXTUAL “ASK SENTINEL”

Instead of forcing users to leave a page, show:

```text
✦ Ask Sentinel
```

on:

- project detail
- evidence detail
- risk pages
- investigation workspace

Context should automatically include the relevant project/case.

Example:

On `/app/projects/MPL-004821`:

> “Why is this project high risk?”

should automatically refer to MPL-004821.

---

# 30. 📈 PAGE 16 — DATA EXPLORER

## Route

```text
/app/data
```

Purpose:

Allow the team/judge to demonstrate that the prototype is grounded in real MPLADS data.

---

## Dataset categories

```text
Works Recommended
Works Sanctioned
Works Completed
Expenditure
MP Allocations
Calamity Consent
```

Both Lok Sabha and Rajya Sabha datasets may be represented where available.

---

# Data explorer

Show:

```text
Dataset
Rows
Columns
Last processed
Source
```

Allow:

- search
- filter
- sort
- pagination
- column selection

---

# 31. 📜 PAGE 17 — METHODOLOGY

## Route

```text
/methodology
```

This can be public.

Explain:

```text
Rules
+
Statistical ML
+
NLP
+
Computer Vision
+
Graph Analytics
+
Prediction
+
XAI
+
RAG
```

Explain why a hybrid approach is used.

---

# 32. 🧠 PAGE 18 — HOW IT WORKS

## Route

```text
/how-it-works
```

Public explainer.

Show:

```text
MPLADS / eSAKSHI
        ↓
Data
        ↓
Normalization
        ↓
AI Verification
        ↓
Risk Engine
        ↓
Evidence
        ↓
Investigation
```

This page is useful for judges and external visitors.

---

# 33. 📚 PAGE 19 — RESEARCH

## Route

```text
/research
```

Show research foundations used by the project:

- MPLADS Guidelines
- CAG audit material
- Sentence-BERT
- SHAP
- anomaly detection research
- graph-based fraud/anomaly research
- relevant procurement/fraud research

Each reference should have:

```text
Title
Authors / Organization
Year
Why relevant
Feature influenced
```

Only cite sources the team has actually reviewed.

---

# 34. 🛡️ PAGE 20 — TRANSPARENCY

## Route

```text
/transparency
```

Explain:

- what Sentinel does
- what it does not do
- risk vs guilt
- AI limitations
- evidence requirements
- human oversight
- synthetic data policy
- privacy/security principles

This page can become a strong trust differentiator.

---

# 35. 📱 RESPONSIVE DESIGN

## Desktop

Primary target:

```text
1440 × 900
1920 × 1080
```

The judge demo should be optimized for desktop.

---

## Tablet

```text
768–1199px
```

Collapse navigation.

---

## Mobile

```text
375–767px
```

Prioritize:

```text
Risk
Project
Evidence
Investigation
```

Complex charts should become horizontally scrollable or simplified.

---

# 36. ⚡ PERFORMANCE

Use:

- server-side rendering where useful
- lazy loading
- code splitting
- image optimization
- virtualized large tables
- cached API responses
- skeleton loading
- debounced search
- pagination

Do not load every project/evidence record into the browser.

---

# 37. 🔄 Loading States

Every data-driven component needs a loading state.

Example:

```text
Risk Score
████████████
██████
```

Avoid blank screens.

---

# 38. ❌ Error States

Example:

```text
Unable to load project risk

The risk service is temporarily unavailable.

[Retry]
```

Never show fake values when the backend is unavailable.

---

# 39. 🟡 Missing Data States

This is particularly important for this project.

If GPS isn't available:

```text
GPS verification unavailable
No GPS metadata was supplied with this evidence.
```

If images are unavailable:

```text
Visual verification unavailable
No visual evidence is currently linked to this project.
```

If fraud labels are unavailable:

The frontend should not imply supervised accuracy.

---

# 40. 🧪 Synthetic Data UI

Synthetic evidence is allowed for controlled demonstrations where public data lacks detailed fields.

The UI must clearly label it:

```text
⚠ SYNTHETIC DEMONSTRATION DATA
```

Never make synthetic records visually indistinguishable from real records.

---

# 41. 🧬 AI MODEL TRACEABILITY

Every AI finding should be capable of displaying:

```text
Model
Version
Timestamp
Input snapshot
Score
Reason
Confidence / uncertainty
```

Example:

```text
NLP Duplicate Detector
Model: SBERT
Version: 1.0
Run: 28 Aug 2026, 19:42
Similarity: 92%
```

---

# 42. 🔍 RISK SCORE UI

Use a consistent component.

Example:

```text
┌───────────────────────┐
│       RISK SCORE      │
│                       │
│         87            │
│        /100           │
│                       │
│        HIGH           │
└───────────────────────┘
```

Clicking the score opens the breakdown.

---

# 43. 📊 Risk Breakdown Visualization

Use horizontal bars:

```text
Financial       ███████████████ 21
Timeline        ███████████     17
Image           █████████████   19
Document        ████████        12
Graph           █████           8
Duplicate       ██████          10
```

Do not make the chart imply mathematical certainty beyond the actual scoring model.

---

# 44. 🧠 AI Explanation UI

Every AI result should follow:

```text
Finding
↓
Reason
↓
Evidence
↓
Confidence
↓
Recommended verification
```

Example:

```text
⚠ Potential duplicate project

Why:
Work description is highly similar to another
project within the same locality.

Signals:
Text similarity: 92%
Location similarity: 97%
Cost similarity: 89%

Recommended:
Compare project scope and physical location.
```

---

# 45. 🧾 Evidence Chain UI

A reusable visual component:

```text
RISK
  │
  ▼
AI SIGNAL
  │
  ▼
CLAIM
  │
  ▼
EVIDENCE
  │
  ├── Document
  ├── Image
  ├── Payment
  ├── Location
  └── Project event
  │
  ▼
SOURCE RECORD
```

This should appear on both Project Detail and Investigation pages.

---

# 46. 🧑‍⚖️ Human-in-the-loop UI

The system must visually reinforce that humans make final decisions.

Use:

```text
AI Recommendation
        ↓
Human Review
        ↓
Official Outcome
```

Not:

```text
AI
↓
Fraud Confirmed
```

---

# 47. 🛠️ Backend/API Contract Expected by Frontend

The frontend should be API-driven.

Suggested REST endpoints:

```text
GET  /api/projects
GET  /api/projects/{projectId}
GET  /api/projects/{projectId}/risk
GET  /api/projects/{projectId}/timeline
GET  /api/projects/{projectId}/evidence
GET  /api/projects/{projectId}/financials

GET  /api/risk
GET  /api/risk/financial
GET  /api/risk/timeline
GET  /api/risk/duplicates
GET  /api/risk/documents
GET  /api/risk/visual

GET  /api/evidence
GET  /api/evidence/{evidenceId}

GET  /api/investigations
GET  /api/investigations/{caseId}
POST /api/investigations

POST /api/copilot/query

GET  /api/analytics/national
GET  /api/analytics/states/{state}
GET  /api/analytics/districts/{district}

GET  /api/data/{dataset}
```

These are proposed interface contracts, not claims about an existing government API.

---

# 48. 📦 Suggested Frontend Data Models

## Project

```ts
type Project = {
  id: string
  title: string
  description: string
  state: string
  district: string
  constituency?: string
  category: string

  recommendedAmount?: number
  sanctionedAmount?: number
  expenditure?: number

  financialProgress?: number
  physicalProgress?: number

  plannedStart?: string
  plannedCompletion?: string
  actualStart?: string
  actualCompletion?: string

  status: string
  risk?: RiskSummary
}
```

---

## Risk

```ts
type RiskSummary = {
  score: number
  level: "low" | "medium" | "high" | "critical"

  financial?: number
  timeline?: number
  compliance?: number
  duplicate?: number
  document?: number
  image?: number
  graph?: number
  prediction?: number

  reasons: RiskReason[]
}
```

---

## Risk Reason

```ts
type RiskReason = {
  id: string
  category: string
  title: string
  explanation: string
  scoreContribution?: number
  confidence?: number
  evidenceIds: string[]
  model?: string
  modelVersion?: string
}
```

---

## Evidence

```ts
type Evidence = {
  id: string
  projectId: string
  type: "document" | "image" | "payment" | "certificate" | "inspection" | "gps" | "report"
  status: "verified" | "review" | "conflict" | "missing"
  source?: string
  uploadedAt?: string
  metadata?: Record<string, unknown>
  findings?: EvidenceFinding[]
}
```

---

## Investigation

```ts
type InvestigationCase = {
  id: string
  projectId: string
  riskScore: number
  status:
    | "new"
    | "under_review"
    | "evidence_requested"
    | "escalated"
    | "cleared"
    | "confirmed_irregularity"
    | "closed"

  assignedTo?: string
  notes?: string[]
  evidenceIds: string[]
  createdAt: string
  updatedAt: string
}
```

---

# 49. 🧭 Breadcrumb System

Use breadcrumbs on deep pages.

Example:

```text
Command Center
/
Projects
/
MPL-004821
/
Evidence
/
IMG-19283
```

Breadcrumbs should be clickable.

---

# 50. 🔗 Deep-Linking

Every important state should be URL-addressable.

Examples:

```text
/app/projects/MPL-004821
/app/risk?severity=critical
/app/risk/duplicates?district=Delhi
/app/analytics/states/delhi
/app/investigations/CASE-2026-00128
```

This is important for:

- judge demos
- sharing
- debugging
- bookmarking
- browser refresh
- navigation

---

# 51. 🔍 Global Search

The top navigation should contain a global search.

Search across:

```text
Project ID
Project description
District
State
Agency
Vendor
Investigation ID
Evidence ID
```

Example:

```text
Search MPL-004821
```

Results:

```text
Projects
MPL-004821

Investigations
CASE-2026-00128

Evidence
IMG-19283
```

---

# 52. ⌘ Command Palette

Optional but highly recommended.

Shortcut:

```text
Ctrl/Cmd + K
```

Actions:

```text
Go to Command Center
Search project
Open risk queue
Open investigations
Ask Sentinel
View analytics
```

This makes the interface feel polished.

---

# 53. 🔔 Notifications

Notification types:

```text
New high-risk project
Investigation assigned
Evidence requested
Evidence submitted
Risk score changed
Deadline approaching
AI verification completed
```

Notifications should link to the relevant route.

---

# 54. 🌙 Dark Mode

The inspiration uses a light interface with dark-mode support.

Implement both:

```text
Light
Dark
System
```

Risk semantics must remain readable in both modes.

---

# 55. 🎬 SIH Judge Demo Mode

Create a special route:

```text
/demo
```

or:

```text
/app/demo
```

This should not replace the real product.

It is a controlled presentation path.

---

## Demo flow

### Step 1

Open:

```text
/app/command-center
```

Show national risk overview.

### Step 2

Click:

```text
Critical → 
```

### Step 3

Open a high-risk project.

```text
/app/projects/MPL-004821
```

### Step 4

Show:

```text
87 / 100
```

### Step 5

Reveal:

```text
Cost anomaly
Timeline anomaly
Image inconsistency
Document inconsistency
```

### Step 6

Open evidence.

### Step 7

Ask Sentinel:

> Why is this project high risk?

### Step 8

Create:

```text
Investigation Case
```

### Step 9

Show the case workspace.

This demonstrates:

> **Screen → Explain → Evidence → Investigate**

---

# 56. 🧪 Live AI Demo Route

Optional:

```text
/demo/ai
```

Show a live duplicate detector.

Input:

```text
Project A:
Construction of community hall at Village X

Project B:
Construction of community centre at Village X
```

Output:

```text
Text similarity: 92%
Location similarity: 97%
Cost similarity: 89%

Potential duplicate
```

This proves the AI is actually functioning.

---

# 57. 🧪 Synthetic Attack Demo

Optional:

```text
/demo/attacks
```

A controlled test interface.

Choose:

```text
Inflate cost
Duplicate image
Change date
Delay milestone
Alter amount
Duplicate document
Payment anomaly
```

Then:

```text
Before
↓
Attack applied
↓
AI screening
↓
Risk score
↓
Detected signal
```

Clearly label the data:

> **Synthetic demonstration only**

This is a potentially powerful SIH demo because real fraud labels may be limited.

---

# 58. 🧱 Component Hierarchy

Recommended:

```text
AppShell
│
├── TopNav
│
├── MainContainer
│   │
│   ├── PageHeader
│   ├── FilterBar
│   ├── MetricsGrid
│   ├── ContentGrid
│   │
│   └── DataTable
│
└── GlobalCopilot
```

Project:

```text
ProjectPage
│
├── ProjectHeader
├── ProjectMetrics
├── LifecycleTimeline
├── FinancialPanel
├── ProgressComparison
├── RiskBreakdown
├── RiskReasons
├── EvidenceGrid
└── CopilotPanel
```

Investigation:

```text
InvestigationPage
│
├── CaseHeader
├── CaseSummary
├── RiskBreakdown
├── EvidenceChain
├── EvidenceViewer
├── AIExplanation
├── ActivityTimeline
├── InvestigatorNotes
└── CaseActions
```

---

# 59. 🧩 Recommended Folder Structure

For Next.js App Router:

```text
src/
├── app/
│   ├── page.tsx
│   ├── about/
│   ├── how-it-works/
│   ├── methodology/
│   ├── research/
│   ├── transparency/
│   │
│   └── app/
│       ├── command-center/
│       ├── projects/
│       │   └── [projectId]/
│       ├── risk/
│       │   ├── financial/
│       │   ├── timeline/
│       │   ├── duplicates/
│       │   ├── documents/
│       │   └── visual/
│       ├── investigations/
│       │   └── [caseId]/
│       ├── evidence/
│       │   └── [evidenceId]/
│       ├── analytics/
│       ├── copilot/
│       └── data/
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── project/
│   ├── risk/
│   ├── evidence/
│   ├── investigation/
│   ├── charts/
│   └── ai/
│
├── lib/
│   ├── api.ts
│   ├── formatters.ts
│   ├── permissions.ts
│   └── constants.ts
│
├── types/
│   ├── project.ts
│   ├── risk.ts
│   ├── evidence.ts
│   └── investigation.ts
│
└── styles/
```

---

# 60. 🛠️ Recommended Frontend Stack

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Recharts
Leaflet / MapLibre
Lucide Icons
TanStack Table
TanStack Query
Zod
```

Optional:

```text
Framer Motion
```

Use animation sparingly.

---

# 61. 🔌 API State Management

Use a clear separation:

```text
Server data
    ↓
TanStack Query
    ↓
Components
```

Local UI state:

```text
Filters
Modals
Tabs
Drawers
```

Do not put all server data into one giant global state object.

---

# 62. 🧪 Frontend Testing

Test:

### Unit

- risk formatting
- number formatting
- status mapping
- filters

### Component

- project card
- risk badge
- evidence card
- table
- timeline

### End-to-end

Critical flow:

```text
Command Center
→ Risk Queue
→ Project
→ Evidence
→ Investigation
```

---

# 63. ♿ Accessibility

Must support:

- keyboard navigation
- visible focus states
- semantic buttons
- accessible charts/alternative summaries
- color not being the only status indicator
- readable contrast
- screen-reader labels

Do not communicate:

> “Red = critical”

without also writing:

> “Critical”.

---

# 64. 🔒 Security UX

Frontend should never assume authorization.

Sensitive actions:

```text
Create Investigation
Assign Case
Request Evidence
Change Case Status
View Restricted Evidence
```

must be permission-controlled.

Do not hide sensitive controls only with CSS.

The backend must enforce authorization.

---

# 65. 🧾 Audit Trail UI

Show an activity timeline:

```text
28 Aug 18:32
AI risk analysis completed

28 Aug 18:33
Image evidence flagged

28 Aug 18:40
Case created

28 Aug 18:45
Assigned to District Reviewer
```

Each entry can show:

- actor
- timestamp
- action
- source
- model/rule if applicable

---

# 66. 🧠 AI Status Language

Use a standardized vocabulary.

### AI completed

```text
✓ Analysis complete
```

### AI found anomaly

```text
⚠ Potential anomaly
```

### AI uncertain

```text
? Low confidence
```

### AI cannot assess

```text
— Verification unavailable
```

Never fabricate a confident answer.

---

# 67. 📊 Data Visualization Rules

Use charts only when they answer a question.

Good:

```text
Risk trend over time
```

Good:

```text
Financial vs physical progress
```

Good:

```text
Risk by district
```

Bad:

```text
3D pie chart because it looks impressive
```

Bad:

```text
Decorative graph with no interpretation
```

---

# 68. 🧮 Financial Display Rules

Use Indian formatting:

```text
₹35,00,000
₹3.5 Cr
```

Be consistent.

Show units.

Do not mix:

```text
35L
₹3.5m
₹0.035Cr
```

on the same screen.

---

# 69. 🗺️ Geographic Display Rules

Show:

```text
State
District
Constituency
Location
```

Coordinates should only be shown when appropriate.

If GPS is missing:

```text
Location metadata unavailable
```

---

# 70. 📄 Document Viewer UX

The viewer should support:

- PDF preview
- page navigation
- zoom
- search
- extracted field panel
- AI findings
- source metadata

Layout:

```text
┌──────────────────────┬─────────────────────┐
│                      │ Extracted Fields    │
│      DOCUMENT        │                     │
│                      │ Project ID          │
│                      │ Amount              │
│                      │ Date                │
│                      │ Agency              │
│                      │                     │
│                      │ AI Findings         │
└──────────────────────┴─────────────────────┘
```

---

# 71. 🖼️ Image Comparison UX

Use side-by-side comparison.

```text
Submitted Evidence       Similar Evidence

[ IMAGE A ]               [ IMAGE B ]

Project A                 Project B

Similarity: 99.4%
```

Allow:

```text
Zoom
Pan
Overlay
Metadata
```

---

# 72. 📱 Mobile Project Detail

On mobile, reorder:

```text
Project identity
↓
Risk
↓
Why flagged
↓
Financial/physical
↓
Timeline
↓
Evidence
↓
AI
```

Do not force desktop-style two-column layouts onto mobile.

---

# 73. 🧭 Navigation Rules

The user should always know:

```text
Where am I?
What am I looking at?
Why is it relevant?
What can I do next?
```

Every deep page should have:

- page title
- breadcrumb
- clear primary action

---

# 74. 🎯 Primary Actions by Page

| Page | Primary Action |
|---|---|
| Command Center | Open high-risk case |
| Projects | Open project |
| Project | Review evidence / create case |
| Risk | Investigate |
| Financial | Inspect anomaly |
| Timeline | Review delayed project |
| Duplicates | Compare projects |
| Documents | Review document |
| Visual | Compare evidence |
| Evidence | View provenance |
| Investigations | Review / update case |
| Analytics | Drill down |
| Copilot | Ask question |
| Data | Explore dataset |

---

# 75. 🏆 What the Judge Should Understand in 60 Seconds

When the site opens, a judge should understand:

```text
This system monitors MPLADS works.
        ↓
It detects unusual patterns.
        ↓
It ranks them by risk.
        ↓
It explains why.
        ↓
It connects the risk to evidence.
        ↓
It helps an authorized officer investigate.
```

If the judge has to read documentation to understand this, the UI is failing.

---

# 76. 🏆 What the Judge Should See in 3 Minutes

### 0:00–0:30

Command Center.

### 0:30–1:00

Open high-risk project.

### 1:00–1:45

Show risk breakdown + evidence.

### 1:45–2:15

Show image/document/duplicate verification.

### 2:15–2:40

Ask AI Copilot.

### 2:40–3:00

Create investigation case.

Final message:

> **“Sentinel does not replace the existing system. It adds intelligence that tells an authorized reviewer where to look, why to look there, and what evidence supports the alert.”**

---

# 77. 🚫 Things the Frontend Must NOT Do

Do not:

- build only a dashboard
- make the Copilot the homepage
- claim guaranteed fraud prevention
- display fake production integration
- present synthetic cases as real fraud
- expose private evidence publicly
- show unexplained AI scores
- overload the UI with charts
- make every card colorful
- use blockchain just for appearance
- make unsupported claims about model accuracy

---

# 78. ⭐ Optional High-Value Features

These are useful after the core UI works.

## A. Digital Project Twin

One page containing:

```text
Budget
Timeline
Milestones
Evidence
Financials
Risk
AI findings
```

---

## B. Risk Change Timeline

Show:

```text
Risk 34
   ↓
Risk 51
   ↓
Risk 72
   ↓
Risk 87
```

Explain what caused each increase.

---

## C. Evidence Dependency Graph

```text
Project
 ├── Payment
 ├── Document
 ├── Image
 ├── Milestone
 └── Certificate
```

---

## D. District Heatmap

Visual national/district risk distribution.

---

## E. Risk Simulation

Allow users to modify:

```text
Cost deviation
Progress gap
Delay
Duplicate similarity
Evidence gap
```

and see:

```text
Composite risk
```

This is excellent for demonstrations.

---

# 79. 🧪 MVP vs Future Scope

## MUST HAVE

```text
✓ Command Center
✓ Projects
✓ Project Detail
✓ Risk Score
✓ Risk Breakdown
✓ Financial anomaly UI
✓ Timeline anomaly UI
✓ Duplicate detection UI
✓ Evidence repository
✓ Image verification UI
✓ Document verification UI
✓ Investigation workspace
✓ AI Copilot
✓ REST API integration
✓ Responsive design
✓ URL routing
```

## SHOULD HAVE

```text
✓ Analytics
✓ Map
✓ Global Search
✓ Command Palette
✓ Dark Mode
✓ Synthetic Attack Demo
✓ Audit Trail
```

## BONUS

```text
○ Advanced graph visualization
○ Predictive risk
○ Advanced visual stage classification
○ Role-specific portals
○ Public transparency portal
○ Offline evidence workflow
```

---

# 80. 🧠 Frontend Development Priority

Build in this exact order:

```text
PHASE 1
App Shell
Navigation
Typography
Cards
Buttons
Risk badges
Tables

        ↓

PHASE 2
Command Center

        ↓

PHASE 3
Projects

        ↓

PHASE 4
Project Detail / Digital Twin

        ↓

PHASE 5
Risk Intelligence

        ↓

PHASE 6
Evidence

        ↓

PHASE 7
Investigation Workspace

        ↓

PHASE 8
AI Copilot

        ↓

PHASE 9
Analytics / Map

        ↓

PHASE 10
Demo Mode

        ↓

PHASE 11
Responsive / Accessibility / Performance

        ↓

PHASE 12
Backend integration
```

---

# 81. 🔄 Frontend-to-AI Flow

The frontend should never implement AI logic directly.

Correct:

```text
Frontend
    ↓
REST API
    ↓
AI Service
    ↓
Model
    ↓
Risk Engine
    ↓
Response
    ↓
Frontend
```

Incorrect:

```text
React component
↓
Run Python/ML logic
↓
Calculate fraud
```

---

# 82. 🧠 What the Frontend Must Display From AI

For each AI module:

| AI | Frontend Output |
|---|---|
| Proposal AI | proposal risk + reasons |
| Compliance AI | rule status |
| Cost AI | deviation + comparison |
| Timeline AI | delay + prediction |
| Duplicate AI | similarity comparison |
| Document AI | extracted fields + conflicts |
| Image AI | reuse/location/stage signals |
| Financial AI | payment/expenditure anomalies |
| Evidence AI | cross-source conflicts |
| Graph AI | relationship/concentration signals |
| Prediction AI | future risk probability |
| Explanation AI | evidence-backed reasoning |
| Copilot | natural-language investigation assistance |

---

# 83. 🧠 Risk Aggregation Display

The AI specification proposes a broad aggregation:

```text
Proposal
+
Compliance
+
Financial
+
Timeline
+
Document
+
Image
+
Duplicate
+
Graph
↓
Total Risk
```

The frontend should not assume that all signals are always available.

If a module has no data:

```text
Visual Risk
—
Unavailable
```

not:

```text
Visual Risk
0
```

This distinction is critical.

---

# 84. 📊 Risk Weight Configuration

The risk engine may use configurable weights.

The frontend can expose this only to authorized admin users.

Example:

```text
Financial      25%
Timeline       20%
Compliance     20%
Duplicate      15%
Graph          10%
Evidence       10%
```

Do not expose weight editing to ordinary auditors.

---

# 85. 🔐 Role-Based UI

Example permissions:

### Central Monitor

```text
National
State
District
Project
Analytics
```

### District Reviewer

```text
District
Project
Evidence
Investigations
```

### Auditor

```text
Risk
Evidence
Investigation
Audit Trail
```

### Agency

```text
Assigned Projects
Evidence Submission
Correction Requests
```

### MP

```text
Recommended Projects
Project Status
Milestones
```

---

# 86. 🧾 Investigation Brief Export

Add:

```text
[Generate Investigation Brief]
```

Output can contain:

```text
Project summary
Risk score
Risk reasons
Evidence
Timeline
Financial analysis
Relevant guideline
AI explanation
Investigation recommendations
Audit trail
```

This can eventually generate a PDF.

---

# 87. 🧠 AI Copilot Grounding UI

When the Copilot answers, show small source chips:

```text
Sources

[Project Data]
[MPLADS Guidelines]
[CAG Reference]
[Evidence IMG-19283]
```

This visually reinforces grounded reasoning.

---

# 88. 🛡️ Trust Center

Optional route:

```text
/transparency
```

Sections:

```text
AI is not a judge
Data provenance
Evidence policy
Synthetic data policy
Model limitations
Human review
Security
Auditability
```

This can be particularly useful when judges ask:

> “What happens if your AI is wrong?”

---

# 89. 🧪 Judge Stress-Test Requirements

The frontend should make it possible to answer these questions visually:

### “Why this project?”

→ Risk breakdown.

### “Where did this information come from?”

→ Evidence provenance.

### “What if the AI is wrong?”

→ Confidence + human review.

### “What happens if data is missing?”

→ Explicit unavailable state.

### “Is this actually AI?”

→ Live model/demo page.

### “Is this scalable?”

→ Architecture + aggregate dashboard.

---

# 90. 🧩 Final Page Map

```text
PUBLIC
│
├── /
├── /about
├── /how-it-works
├── /methodology
├── /research
└── /transparency

APPLICATION
│
├── /app/command-center
│
├── /app/projects
│   └── /[projectId]
│
├── /app/risk
│   ├── /financial
│   ├── /timeline
│   ├── /duplicates
│   ├── /documents
│   └── /visual
│
├── /app/evidence
│   └── /[evidenceId]
│
├── /app/investigations
│   └── /[caseId]
│
├── /app/analytics
│   ├── /national
│   ├── /states/[state]
│   └── /districts/[district]
│
├── /app/copilot
│
└── /app/data

DEMO
│
├── /demo
├── /demo/ai
└── /demo/attacks
```

---

# 91. 🏗️ Final Product Architecture

```text
                         USER
                          │
                          ▼
                 ┌─────────────────┐
                 │ MPLADS SENTINEL │
                 │   FRONTEND      │
                 └────────┬────────┘
                          │
                     REST / JSON
                          │
                          ▼
                 ┌─────────────────┐
                 │   FASTAPI       │
                 │   BACKEND       │
                 └────────┬────────┘
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
       DATABASE        AI ENGINE       DOCUMENT STORE
          │               │                │
          │        ┌──────┼──────┐         │
          │        ▼      ▼      ▼         │
          │      ML/NLP   CV    GRAPH      │
          │        │      │      │         │
          └────────┴──────┼──────┘─────────┘
                          ▼
                    RISK ENGINE
                          │
                          ▼
                 EXPLANATION ENGINE
                          │
                          ▼
                     AI COPILOT
                          │
                          ▼
                     FRONTEND
```

---

# 92. 🏆 Final UX Principle

The entire website should feel like one continuous investigation journey:

```text
SEE
↓
UNDERSTAND
↓
DRILL DOWN
↓
VERIFY
↓
EXPLAIN
↓
INVESTIGATE
```

Not:

```text
Dashboard
↓
Random charts
↓
Chatbot
↓
More charts
```

---

# 93. ✅ Definition of Done

The frontend can be considered ready for the SIH prototype when:

### Navigation

- [ ] All primary routes work.
- [ ] URLs are meaningful and bookmarkable.
- [ ] Browser back/forward works.
- [ ] Deep links work.

### Dashboard

- [ ] Command Center communicates risk immediately.
- [ ] Risk queue is interactive.
- [ ] Charts are data-driven.

### Projects

- [ ] Search works.
- [ ] Filters work.
- [ ] Project detail works.
- [ ] Risk breakdown works.

### Evidence

- [ ] Documents can be viewed.
- [ ] Images can be compared.
- [ ] Evidence provenance is visible.
- [ ] Missing evidence is explicitly shown.

### AI

- [ ] AI findings have explanations.
- [ ] AI outputs link to evidence.
- [ ] Copilot uses structured context.
- [ ] Uncertainty is visible.

### Investigations

- [ ] Cases can be created.
- [ ] Case status can be changed according to permissions.
- [ ] Audit trail is visible.

### Demo

- [ ] Judge can understand the product within 60 seconds.
- [ ] One complete investigation can be demonstrated.
- [ ] At least one AI capability can be demonstrated live.
- [ ] Synthetic data is clearly labelled.
- [ ] No unsupported fraud claims are made.

### Quality

- [ ] Responsive
- [ ] Accessible
- [ ] Fast
- [ ] Error states
- [ ] Loading states
- [ ] Empty states
- [ ] Dark mode
- [ ] Secure route handling

---

# 94. 🥇 The Ideal Final Experience

A judge opens the website.

They see:

> **MPLADS Sentinel**  
> *AI-powered evidence verification and risk intelligence.*

Then:

```text
18,432 works monitored
127 high-risk
34 critical
```

They click a critical project.

They see:

```text
RISK 87 / 100

Cost anomaly
Timeline delay
Financial/physical mismatch
Image similarity
Document inconsistency
```

They click the image.

They see:

```text
Submitted image
vs
similar image

99.4% similarity

⚠ Possible reused evidence
```

They return to the project.

They ask:

> **Why is this project high risk?**

Sentinel answers with:

```text
Risk reason
↓
Evidence
↓
Source
↓
Recommended verification
```

They click:

> **Create Investigation**

And the system creates:

```text
CASE-2026-00128
Status: New
```

At that point, the judge has seen the complete product loop:

> **Data → AI → Risk → Evidence → Explanation → Investigation**

That is the experience this frontend must be designed to deliver.

---

# 95. 📌 Non-Negotiable Product Statement

The frontend should consistently reinforce this statement:

> ## **MPLADS Sentinel does not replace eSAKSHI and does not declare fraud.**
>
> **It adds an evidence-linked intelligence layer that continuously screens project, financial, documentary, visual and relationship data, explains unusual patterns, and prioritizes potentially irregular works for authorized investigation.**

---

# 96. 📚 Source Alignment

This specification is derived from the project's finalized internal documents:

- `MPLADS_Sentinel_Curated_Project_Definition.md`
- `MPLADS_Sentinel_Custom_AI_Specification.md`
- `SIH26102_PPT_Content_Bank_Complete.md`
- `README.md`

The curated project definition establishes the core product definition, users, lifecycle, risk philosophy, MVP, differentiators and success criterion. fileciteturn9file3L332-L410 fileciteturn10file0L123-L182

The AI specification establishes the hybrid AI architecture, including financial, timeline, NLP, document, image, graph, prediction, explanation and Copilot modules. fileciteturn9file0L17-L62 fileciteturn10file1L497-L620

The project documents specifically define the evidence chain, risk aggregation, image verification, document verification, financial/physical mismatch, investigation workflow and explainability requirements that the UI above is designed to expose. fileciteturn10file2L1277-L1450 fileciteturn10file2L1501-L1617

---

# 🚀 Instruction to Any AI/Developer Implementing This Specification

If you are implementing this project from this document:

1. **Do not build a generic admin dashboard.**
2. **Do not make the chatbot the centerpiece.**
3. Start with the **Command Center**.
4. Build the **Project Detail / Digital Project Twin** next.
5. Build the **Risk → Evidence → Investigation** flow.
6. Keep AI logic behind REST APIs.
7. Use mock/fixture data initially, but design all components around the final API contracts.
8. Keep synthetic data clearly labelled.
9. Never invent evidence or claim that an anomaly proves fraud.
10. Make every major risk signal explainable.
11. Make every deep page directly reachable through a clean URL.
12. Make the entire system usable without the Copilot.
13. Optimize the final experience for the SIH judge demo:
   **Screen → Explain → Evidence → Investigate.**

> **If a feature does not help the user understand what requires attention, why it requires attention, what evidence supports that conclusion, or what action should happen next, it is lower priority than the core investigation workflow.**

---

## FINAL DESIGN NORTH STAR

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    MPLADS SENTINEL                           │
│                                                             │
│        FROM PROJECT MONITORING TO RISK INTELLIGENCE         │
│                                                             │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐ │
│   │  DATA   │ →  │   AI    │ →  │  RISK   │ →  │ EVIDENCE│ │
│   └─────────┘    └─────────┘    └─────────┘    └─────────┘ │
│                                                     │       │
│                                                     ▼       │
│                                               INVESTIGATE   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**The product is not the dashboard.  
The product is the investigation intelligence behind the dashboard.**
