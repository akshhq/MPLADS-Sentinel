# MPLADS Sentinel — User Types & Role-Based Access Control (RBAC)

## Document Purpose

This document defines the user types, responsibilities, data visibility, permissions, restrictions, and access-control model for **MPLADS Sentinel**.

MPLADS Sentinel is an AI-powered monitoring, risk-intelligence, evidence-verification, and investigation platform for MPLADS implementation.

The system should follow:

> **Role + Jurisdiction + Assignment + Permission**

rather than giving every user access to the complete system.

---

# 1. Core User Types

MPLADS Sentinel should initially support **six operational user types**:

1. **MoSPI / Ministry Officer**
2. **State Nodal Authority**
3. **Member of Parliament (MP)**
4. **Implementing Agency**
5. **Investigator / Audit Officer**
6. **Field Verification Officer**

A separate technical **System Administrator** may exist internally for platform administration, but it should not be presented as a primary MPLADS stakeholder in the SIH demo.

> **Citizen/Public Auditor is intentionally excluded from this version of the system.**

---

# 2. Role Hierarchy

```text
                         MPLADS SENTINEL
                                |
                +---------------+---------------+
                |                               |
           OVERSIGHT                       EXECUTION
                |                               |
       +--------+--------+              +-------+-------+
       |                 |              |               |
     MoSPI          State Nodal         MP        Implementing
     Officer        Authority                     Agency
       |
       +--------------------+
                            |
                    Investigation
                            |
                    Investigator
                            |
                    Field Verification
                            |
                    Field Officer
```

The roles should not be treated as a simple hierarchy where a higher role automatically owns every action.

Instead, access should be determined by:

- Role
- Geographic jurisdiction
- Organisation
- Constituency
- Assigned projects
- Assigned investigations
- Explicit permissions
- Workflow state

---

# 3. Universal Access-Control Principles

## 3.1 Least Privilege

Every user should receive only the access required to perform their responsibilities.

Examples:

- A field officer does not need national financial analytics.
- An implementing agency should not be able to change its sanctioned budget.
- An MP should not be able to close an investigation into their own project.
- An investigator should not be able to modify original financial records.

---

## 3.2 Separation of Duties

No single stakeholder should control the entire lifecycle of a project.

Recommended conceptual flow:

```text
MP
 |
 | Project Recommendation
 v
Administrative / Nodal Authority
 |
 | Processing
 v
Approval Authority
 |
 | Approval
 v
Implementing Agency
 |
 | Execution + Evidence
 v
Field Verification
 |
 | Physical Verification
 v
Risk / Investigation Layer
 |
 | Investigation
 v
Authorized Authority
 |
 | Closure / Corrective Action
 v
Final Record
```

The exact government workflow should be mapped to verified official MPLADS process documentation before production claims are made.

---

## 3.3 Immutable Historical Records

Users should not be able to silently alter historical:

- Financial transactions
- Submitted evidence
- Investigation findings
- Risk results
- Approval records
- Audit logs

Corrections should create a new version or correction event.

```text
Original Record
      |
      v
Correction Request
      |
      v
Authorized Review
      |
      v
New Version
      |
      v
Audit Log
```

---

# 4. User Type 1 — MoSPI / Ministry Officer

## Purpose

The MoSPI / Ministry Officer is the primary **national-level monitoring and oversight user**.

This role provides a national view of MPLADS implementation and monitors trends, risks, anomalies, compliance, and investigations across the authorized scope.

## Data Visibility

Can view:

- National project data
- State-level data
- District-level data
- Project information
- Financial information
- Project timelines
- Milestones
- Evidence
- Documents
- Risk signals
- AI-generated findings
- Investigation cases
- Analytics
- Compliance information
- Aggregated performance indicators

## Dashboard Access

- National Command Center
- National project statistics
- State comparisons
- District comparisons
- Risk heatmaps
- Financial anomaly analytics
- Timeline analytics
- Duplicate detection
- Document intelligence
- Visual evidence intelligence
- Investigation queue
- AI Copilot
- Data Explorer
- Reports and exports

## Permissions

### Project
- `PROJECT_VIEW` — Yes
- `PROJECT_CREATE` — According to official workflow
- `PROJECT_UPDATE` — Controlled
- `PROJECT_APPROVE` — Only if the official workflow grants this authority

### Financial
- `FINANCIAL_VIEW` — Yes
- `FINANCIAL_UPDATE` — Restricted / workflow-controlled
- `FINANCIAL_APPROVE` — According to authority

### Evidence
- `EVIDENCE_VIEW` — Yes
- `EVIDENCE_UPLOAD` — Administrative evidence only
- `EVIDENCE_VERIFY` — Yes where authorized

### Documents
- `DOCUMENT_VIEW` — Yes
- `DOCUMENT_UPLOAD` — Yes
- `DOCUMENT_VERIFY` — Yes where authorized

### Risk
- `RISK_VIEW` — Yes
- `RISK_REVIEW` — Yes
- `RISK_SCORE_EDIT` — No

### Investigations
- `INVESTIGATION_VIEW` — Yes
- `INVESTIGATION_CREATE` — Yes
- `INVESTIGATION_ASSIGN` — Yes
- `INVESTIGATION_UPDATE` — Yes
- `INVESTIGATION_CLOSE` — According to authority

### Analytics
- `ANALYTICS_VIEW` — Yes
- `REPORT_EXPORT` — Yes

### AI
- `AI_COPILOT_USE` — Yes
- `AI_FINDING_REVIEW` — Yes

## Restrictions

The Ministry Officer should not be able to:

- Directly rewrite historical transactions
- Delete evidence
- Delete risk signals
- Manipulate AI scores
- Remove investigation history
- Bypass required separation-of-duties workflows

---

# 5. User Type 2 — State Nodal Authority

## Purpose

The State Nodal Authority monitors MPLADS implementation within a particular state or assigned state jurisdiction.

## Jurisdiction

A State Nodal Authority should have an explicit state scope.

Example:

```json
{
  "role": "STATE_NODAL_AUTHORITY",
  "state": "Rajasthan"
}
```

The backend should automatically restrict data access to the assigned state.

## Data Visibility

Can view:

- All relevant projects in assigned state
- District-level project data
- Financial information
- Project progress
- Evidence
- Documents
- Risk signals
- Investigations within jurisdiction
- State analytics
- District comparisons
- Compliance information

Cannot automatically view restricted operational data belonging to unrelated states.

## Actions

Can:

- Review project status
- Review risk alerts
- Review submitted evidence
- Review documentation
- Request clarification
- Request field verification
- Coordinate verification where permitted
- Escalate high-risk cases
- Monitor district performance
- Generate state reports
- Respond to Ministry requests

## Restrictions

Cannot:

- Modify AI risk scores
- Delete evidence
- Modify original financial records outside an approved correction workflow
- Close investigations outside their authority
- Access unrelated states' restricted data

---

# 6. User Type 3 — Member of Parliament (MP)

## Purpose

The MP role is constituency-centric and focuses on recommended works and their implementation status.

The MP should not receive unrestricted national operational access.

## Jurisdiction

An MP account should contain a scope such as:

```json
{
  "role": "MP",
  "state": "Delhi",
  "constituency": "New Delhi"
}
```

The system should restrict project visibility to the MP's authorized constituency / recommended works according to the official workflow.

## Dashboard

The MP dashboard should prioritize:

- My Recommended Works
- Project Status
- Approved Amount
- Expenditure
- Physical Progress
- Milestones
- Timeline
- Evidence
- Documents
- Pending Actions
- Relevant Risk Indicators
- Clarification Requests

## Actions

Can:

- Submit / recommend projects through the supported workflow
- Provide required project information
- View project status
- View approved information
- Review progress
- Review submitted evidence where permitted
- Respond to clarification requests
- Request status updates
- View relevant risk indicators

## Restrictions

The MP should not be able to:

- Approve their own recommendation
- Modify sanctioned amounts
- Modify financial transactions
- Modify AI risk scores
- Delete evidence
- Approve their own evidence
- Close an investigation involving their project
- View restricted data belonging to unrelated projects

---

# 7. User Type 4 — Implementing Agency

## Purpose

The Implementing Agency is the primary execution-side user.

Its interface should answer:

> **What work has been assigned, what needs to be completed, and what evidence must be submitted?**

## Dashboard

Show:

- Assigned projects
- Active milestones
- Pending tasks
- Deadlines
- Required documents
- Required evidence
- Submitted evidence
- Rejected / correction-required submissions
- Expenditure submission status
- Clarification requests

## Actions

Can:

- View assigned projects
- View approved project scope
- View approved budget
- View milestones
- Update permitted progress information
- Upload evidence
- Upload documents
- Submit expenditure information
- Submit completion documentation
- Respond to clarification requests
- Submit correction requests
- View submission history

## Evidence Rules

Once evidence is submitted, the original evidence should be immutable.

Use versioning:

```text
Evidence V1
     |
     v
Correction Required
     |
     v
Evidence V2
     |
     v
Audit History
```

Preserve:

- Timestamp
- Uploader identity
- Version
- Submission history
- File hash where applicable

## Restrictions

The Implementing Agency cannot:

- Change sanctioned budget
- Change approved project scope
- Modify historical transactions
- Delete submitted evidence
- Modify AI risk scores
- Approve its own submissions
- Close investigations
- Alter verification results

---

# 8. User Type 5 — Investigator / Audit Officer

## Purpose

The Investigator reviews projects flagged by Sentinel's risk and anomaly-detection system.

This is one of the most important operational roles.

## Investigation Workflow

```text
AI / Analytics
      |
      v
Potential Anomaly
      |
      v
Investigation Queue
      |
      v
Investigator
      |
      +---- Financial Review
      |
      +---- Timeline Review
      |
      +---- Document Review
      |
      +---- Image Review
      |
      +---- Evidence Review
      |
      v
Investigation Finding
      |
      v
Escalation / Closure
```

## Dashboard

Show:

- Open cases
- High-priority cases
- Recently flagged projects
- Evidence pending
- Clarifications pending
- Cases assigned to them
- Overdue investigations
- Investigation history

## Investigation Access

Can:

- View flagged projects
- View risk explanations
- View evidence chain
- Review documents
- Compare documents
- Compare images
- Review financial patterns
- Review timeline anomalies
- Review duplicate-project signals
- Request clarification
- Request field verification
- Add investigation notes
- Upload findings
- Assign verification tasks where permitted
- Escalate cases
- Record outcomes
- Close cases where authorized

## Critical Restrictions

The Investigator should not be able to:

- Modify original project financial records
- Delete evidence
- Rewrite AI outputs
- Manually reduce a risk score
- Remove a risk signal
- Erase investigation history

The investigator records an independent finding while preserving the original AI result.

Example:

```text
AI Risk Score:
87 / 100

AI Signals:
- High financial/physical divergence
- Potential image reuse
- Timeline delay

Investigator Finding:
"Field verification required"

The original AI result remains unchanged.
```

---

# 9. User Type 6 — Field Verification Officer

## Purpose

The Field Verification Officer verifies whether physical implementation matches submitted records.

This role is focused on **ground-level verification** rather than national analytics.

## Verification Workflow

```text
Investigator / Authority
          |
          v
Verification Request
          |
          v
Field Officer
          |
          v
Physical Site Visit
          |
          +---- GPS
          +---- Timestamp
          +---- Photograph
          +---- Video if supported
          +---- Observation
          +---- Milestone Status
          |
          v
Verification Report
```

## Information Required

The field officer should receive:

- Project location
- Project description
- Approved project scope
- Expected milestone
- Required verification checklist
- Relevant previous evidence
- Expected physical characteristics

Avoid exposing unnecessary confidential financial or investigation intelligence.

## Actions

Can:

- View assigned verification requests
- View project location
- View project scope
- Capture/upload evidence
- Record GPS coordinates
- Record timestamps
- Record observations
- Mark observed milestone status
- Record discrepancies
- Submit verification report
- Respond to correction requests

## Evidence Integrity

Where technically available, field evidence should capture:

- Timestamp
- GPS coordinates
- Device information
- Upload identity
- File hash
- Evidence version
- Project association

A cryptographic hash establishes content integrity; it does not independently prove that an image truthfully represents the claimed site or event.

## Restrictions

Field Officers cannot:

- Modify sanctioned budgets
- Modify project scope
- Change AI risk scores
- Delete submitted evidence
- Close investigations
- Approve their own verification where separation is required

---

# 10. Optional Technical Role — System Administrator

A technical System Administrator may exist separately from operational MPLADS roles.

## Purpose

Manages the software platform rather than government project decisions.

## Possible Permissions

- User management
- Role assignment
- Account activation/deactivation
- System configuration
- Integration configuration
- Dataset management
- Monitoring
- Audit-log administration
- Technical diagnostics

## Important Restrictions

The System Administrator should not automatically have authority to:

- Approve MPLADS projects
- Modify official financial records
- Change investigation findings
- Alter AI risk results
- Delete official evidence

Technical administration and operational authority should remain separate.

---

# 11. Permission Catalogue

Permissions should be defined independently from roles.

## Project Permissions

```text
PROJECT_VIEW
PROJECT_CREATE
PROJECT_UPDATE
PROJECT_SUBMIT
PROJECT_REVIEW
PROJECT_APPROVE
PROJECT_ARCHIVE
```

## Financial Permissions

```text
FINANCIAL_VIEW
FINANCIAL_SUBMIT
FINANCIAL_UPDATE
FINANCIAL_REVIEW
FINANCIAL_APPROVE
```

## Evidence Permissions

```text
EVIDENCE_VIEW
EVIDENCE_UPLOAD
EVIDENCE_REVIEW
EVIDENCE_VERIFY
EVIDENCE_REQUEST_CORRECTION
```

## Document Permissions

```text
DOCUMENT_VIEW
DOCUMENT_UPLOAD
DOCUMENT_REVIEW
DOCUMENT_VERIFY
DOCUMENT_REQUEST_CORRECTION
```

## Risk Permissions

```text
RISK_VIEW
RISK_REVIEW
RISK_ACKNOWLEDGE
RISK_ESCALATE
```

Do not provide a general `RISK_SCORE_EDIT` permission to operational users.

## Investigation Permissions

```text
INVESTIGATION_VIEW
INVESTIGATION_CREATE
INVESTIGATION_ASSIGN
INVESTIGATION_UPDATE
INVESTIGATION_ESCALATE
INVESTIGATION_CLOSE
```

## Analytics Permissions

```text
ANALYTICS_VIEW
NATIONAL_ANALYTICS_VIEW
STATE_ANALYTICS_VIEW
DISTRICT_ANALYTICS_VIEW
REPORT_EXPORT
```

## AI Permissions

```text
AI_COPILOT_USE
AI_FINDING_VIEW
AI_FINDING_REVIEW
AI_ANALYSIS_REQUEST
```

---

# 12. Recommended Role-Permission Matrix

| Capability | MoSPI | State Nodal | MP | Agency | Investigator | Field Officer |
|---|---:|---:|---:|---:|---:|---:|
| National Dashboard | ✅ | ❌ | ❌ | ❌ | Limited | ❌ |
| State Dashboard | ✅ | ✅ | Limited | ❌ | Relevant scope | ❌ |
| District Analytics | ✅ | ✅ | Limited | ❌ | Relevant scope | ❌ |
| Own/Assigned Projects | ✅ | ✅ | ✅ | ✅ | Assigned | Assigned |
| Financial View | ✅ | ✅ | Own/Relevant | Assigned | ✅ | Limited |
| Financial Update | Controlled | Controlled | ❌ | Submit | ❌ | ❌ |
| Risk Intelligence | ✅ | ✅ | Relevant | Limited | ✅ | ❌ |
| Evidence View | ✅ | ✅ | Relevant | Own submissions | ✅ | Assigned |
| Evidence Upload | Controlled | Controlled | Limited | ✅ | ✅ | ✅ |
| Evidence Verification | ✅ | ✅ | ❌ | ❌ | ✅ | Assigned |
| Document View | ✅ | ✅ | Relevant | Own | ✅ | Required docs |
| Document Upload | ✅ | ✅ | Relevant | ✅ | ✅ | Assigned |
| Project Recommendation | According to workflow | According to workflow | ✅ | ❌ | ❌ | ❌ |
| Project Approval | According to authority | According to authority | ❌ | ❌ | ❌ | ❌ |
| Create Investigation | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Assign Investigation | ✅ | ✅ | According to workflow | ❌ | According to authority | ❌ |
| Update Investigation | ✅ | Relevant | ❌ | ❌ | ✅ | Verification only |
| Close Investigation | According to authority | According to authority | ❌ | ❌ | According to authority | ❌ |
| AI Copilot | ✅ | ✅ | Limited | Limited | ✅ | ❌ |
| Export Reports | ✅ | ✅ | Relevant | Relevant | ✅ | Limited |
| User Management | Admin | ❌ | ❌ | ❌ | ❌ | ❌ |

> **Note:** "According to workflow" means the final permission must be mapped to verified official MPLADS process documentation rather than assumed from this product specification.

---

# 13. Jurisdiction-Based Access

Roles should be combined with geographic and organisational scope.

Example MP:

```json
{
  "user_id": "USR-001",
  "role": "MP",
  "state": "Delhi",
  "district": null,
  "constituency": "New Delhi",
  "organisation": null
}
```

State Nodal:

```json
{
  "user_id": "USR-002",
  "role": "STATE_NODAL_AUTHORITY",
  "state": "Rajasthan",
  "district": null,
  "constituency": null,
  "organisation": "State Nodal Authority"
}
```

Implementing Agency:

```json
{
  "user_id": "USR-003",
  "role": "IMPLEMENTING_AGENCY",
  "state": "Rajasthan",
  "district": "Jaipur",
  "organisation": "Demo Infrastructure Agency"
}
```

The backend should enforce these scopes.

The frontend should only hide unauthorized UI elements as a convenience; **actual authorization must happen on the backend/database layer**.

---

# 14. Assignment-Based Access

Some information should be accessible only when a user is assigned to a project or investigation.

Example:

```text
Investigator
    |
    +-- Case INV-001
    |      |
    |      +-- Project MPL-004821
    |
    +-- Case INV-002
           |
           +-- Project MPL-007234
```

The investigator should not automatically receive every investigation merely because they have the Investigator role.

Similarly:

```text
Field Officer
     |
     +-- Verification V-001
             |
             +-- Project MPL-004821
```

---

# 15. SIH Demo Accounts

Create separate synthetic demo accounts rather than allowing arbitrary role switching inside one account.

## Ministry

```text
Name: Dr. Ananya Sharma
Role: MoSPI Officer
Email: ministry@mpladssentinel.demo
```

## State Nodal

```text
Name: Rajiv Mehta
Role: State Nodal Authority
State: Rajasthan
Email: state@mpladssentinel.demo
```

## MP

```text
Name: Demo MP
Role: Member of Parliament
Constituency: New Delhi
Email: mp@mpladssentinel.demo
```

## Implementing Agency

```text
Name: Demo Agency Officer
Role: Implementing Agency
Agency: Demo Infrastructure Agency
Email: agency@mpladssentinel.demo
```

## Investigator

```text
Name: Priya Verma
Role: Investigator
Email: investigator@mpladssentinel.demo
```

## Field Officer

```text
Name: Amit Singh
Role: Field Verification Officer
District: Jaipur
Email: field@mpladssentinel.demo
```

Use clearly synthetic/anonymized identities and project records for the public SIH demonstration unless verified real data is intentionally being used.

---

# 16. Recommended SIH Demonstration Flow

Do not demonstrate all six roles independently.

Use three primary personas to tell one continuous story.

## Persona 1 — Ministry Officer

```text
Login
  ↓
National Command Center
  ↓
High-Risk Project
  ↓
Risk Score
  ↓
Why Flagged?
  ↓
Evidence Chain
```

## Persona 2 — Implementing Agency

```text
Login
  ↓
Assigned Project
  ↓
Milestone
  ↓
Upload Evidence
  ↓
Submit
```

Then Sentinel analyzes the new submission.

## Persona 3 — Investigator

```text
Login
  ↓
Investigation Queue
  ↓
Same Project
  ↓
AI Signals
  ↓
Evidence
  ↓
Document/Image Comparison
  ↓
Investigation Finding
  ↓
Field Verification Request
```

Then show the Field Officer completing the verification if time permits.

This demonstrates the complete loop:

```text
EXECUTION
    ↓
EVIDENCE
    ↓
AI ANALYSIS
    ↓
RISK
    ↓
INVESTIGATION
    ↓
VERIFICATION
    ↓
ACTION
```

---

# 17. Security Rules — Non-Negotiable

1. Never trust frontend role checks alone.
2. Enforce authorization in the backend/database.
3. Keep server-only credentials out of frontend code.
4. Never expose service-role database keys to browsers.
5. Preserve immutable audit history.
6. Do not allow users to modify AI-generated risk scores.
7. Do not allow agencies to approve their own submissions.
8. Do not allow MPs to approve their own recommendations.
9. Restrict users by jurisdiction and assignment.
10. Log important state-changing actions.
11. Preserve evidence versions.
12. Distinguish demo/synthetic data from real data.
13. Avoid displaying unnecessary personal information.
14. Apply least-privilege access to investigation information.

---

# 18. Recommended Database User Model

A user record should contain at least:

```text
user_id
name
email
role
status
state
district
constituency
organisation
department
assigned_projects
assigned_investigations
permissions
created_at
last_login
```

Conceptually:

```json
{
  "user_id": "USR-001",
  "name": "Demo Investigator",
  "email": "investigator@mpladssentinel.demo",
  "role": "INVESTIGATOR",
  "status": "ACTIVE",
  "state": null,
  "district": null,
  "constituency": null,
  "organisation": "MPLADS Sentinel Investigation Unit",
  "permissions": [
    "PROJECT_VIEW",
    "RISK_VIEW",
    "EVIDENCE_VIEW",
    "INVESTIGATION_VIEW",
    "INVESTIGATION_CREATE",
    "INVESTIGATION_UPDATE",
    "AI_COPILOT_USE"
  ]
}
```

---

# 19. Recommended Access-Control Architecture

```text
                         USER
                           |
             +-------------+-------------+
             |             |             |
            ROLE       JURISDICTION   ASSIGNMENT
             |             |             |
             +-------------+-------------+
                           |
                           v
                   PERMISSION ENGINE
                           |
             +-------------+-------------+
             |             |             |
          Project       Evidence      Investigation
           Access         Access          Access
             |             |                |
             +-------------+----------------+
                           |
                           v
                     BACKEND / API
                           |
                           v
                  DATABASE / RLS LAYER
```

The frontend should reflect permissions, but the backend/database must enforce them.

---

# 20. Final Recommended Role Set

For the current SIH implementation, lock the operational roles to:

```text
1. MOSPI_OFFICER
2. STATE_NODAL_AUTHORITY
3. MP
4. IMPLEMENTING_AGENCY
5. INVESTIGATOR
6. FIELD_VERIFICATION_OFFICER
```

Optional internal technical role:

```text
7. SYSTEM_ADMIN
```

Excluded:

```text
❌ CITIZEN / PUBLIC AUDITOR
```

The six operational roles are sufficient to demonstrate the full MPLADS monitoring lifecycle without making the authentication system unnecessarily complicated.

---

# 21. Core Product Principle

> **Every user sees what they are responsible for, can perform only the actions appropriate to their role, and cannot silently alter the evidence or decisions produced by another stage of the process.**

This principle should guide the frontend UI, backend authorization, Supabase RLS policies, audit logging, and investigation workflow.
