# 🚨 MPLADS Fraud & Anomaly Taxonomy: Empirical Signatures & Statutory Citations

> **Statutory Jurisdiction:** Ministry of Statistics and Programme Implementation (MoSPI) — Data Informatics & Innovation Division (DIID)  
> **Problem Statement:** SIH26102 — AI-Powered Multi-Source Surveillance, Risk-Intelligence, and Vigilance Governance Layer for MPLADS  
> **Source Grounding:** Comptroller & Auditor General (CAG) Performance Audits, Central Vigilance Commission (CVC) Circulars, MPLADS Guidelines 2023, and General Financial Rules (GFR 2017).

---

## 1. 📊 Detectable from the 12 Official Parliamentary CSV Datasets Alone

These anomaly signatures are continuously extracted, cross-reconciled, and flagged across the **45,806 official records** from Lok Sabha and Rajya Sabha:

### 1.1 Financial Structuring & Disbursement Irregularities
1. **Split Payments & Threshold Structuring**:
   - *Anomaly Signature:* A single Work ID paid in an unusually large number of small tranches (e.g. an empirical case of a single work paid across 52 separate installments).
   - *Statutory Violation:* GFR 2017 Rule 157 (Deliberate splitting of works/payments to evade financial sanction ceilings and mandatory competitive bidding).
2. **Exact Duplicate Ledger Transactions**:
   - *Anomaly Signature:* Identical composite keys (`Work ID + Vendor Name + Voucher Date + Claimed Amount`) appearing multiple times in the expenditure register (empirically confirmed: 172 Lok Sabha and 354 Rajya Sabha duplicate rows).
   - *Statutory Violation:* GFR 2017 Rule 211 & Accounting Standard Rule 48.
3. **Disbursement Exceeding Sanctioned Allocation**:
   - *Anomaly Signature:* Cumulative PFMS disbursements exceeding the legally sanctioned amount recorded in the Administrative Sanction (AS) letter.
   - *Statutory Violation:* MPLADS Guidelines 2023 §3.4 & GFR Rule 130.
4. **Fiscal Year-End Fund Dumping (March Rush)**:
   - *Anomaly Signature:* A statistically significant spike in recommendations, sanctions, and releases occurring in the final two weeks of March to prevent unspent quota lapse.
   - *Statutory Violation:* GFR 2017 Rule 56(3) & CVC Circular on prudent fiscal pacing.
5. **Cross-Year Work ID Obfuscation**:
   - *Anomaly Signature:* Work IDs assigned across multiple financial years without formal revalidation, obscuring the actual timeline of cash outflows.
   - *Statutory Violation:* MoSPI Financial Accounting Standards.

---

### 1.2 Statutory Scope, Quota & Guideline Violations
6. **Prohibited Category Funding (Banned Items)**:
   - *Anomaly Signature:* Works recommended for non-permissible items identified via regex and semantic NLP matching against Annexure-II:
     - Religious places, places of worship, or memorial structures.
     - Welcome gates, decorative statues, and arches.
     - Works within private residential premises or commercial real estate.
     - Land acquisition and recurring maintenance/salaries.
     - Pooling of MPLADS funds into private trust or corporate CSR initiatives.
   - *Statutory Violation:* MPLADS Guidelines 2023 Chapter 3 & Annexure-II (List of Ineligible Works).
7. **Cost-per-Unit & Rate Outliers (Schedule of Rates Drift)**:
   - *Anomaly Signature:* Works whose unit cost deviates significantly from the State Public Works Department (PWD) or Central PWD (CPWD) median Schedule of Rates (SOR). Catches cases like anomalous "6-week, ₹13 Lakh" minor installations.
   - *Statutory Violation:* GFR 2017 Rule 144(i) (Public procurement standards).
8. **Statutory SLA Breaches**:
   - *45-Day Sanction SLA:* Sanction turnaround exceeding 45 days (or conversely, suspicious same-day rubber-stamping without technical scrutiny).
   - *1-Year Completion SLA:* Projects stalled past the mandated 12-month completion window (empirically, >60% of stalled works remain frozen at "Physical Inspection").
   - *Statutory Violation:* MPLADS Guidelines 2023 §8.1.
9. **Outside-Constituency Recommendation Cap Breach**:
   - *Anomaly Signature:* Lok Sabha MPs recommending works outside their designated constituency exceeding the ₹25 Lakh annual limit.
   - *Statutory Violation:* MPLADS Guidelines 2023 §5.1.
10. **Repair & Renovation Ceiling Breach**:
    - *Anomaly Signature:* Cumulative expenditure on repair/renovation works exceeding ₹50 Lakh per MP per financial year.
    - *Statutory Violation:* MPLADS Guidelines 2023 §3.7.
11. **Successor-MP Post-Sanction Record Tampering**:
    - *Anomaly Signature:* A work's recorded MP attribution changing post-sanction without statutory mid-term vacancy protocols.
    - *Statutory Violation:* MPLADS Scheme Guidelines §5.4.
12. **Calamity Relief Ceiling Clustering**:
    - *Anomaly Signature:* Calamity consent allocations clustering suspiciously at the ₹1 Crore national ceiling, accompanied by coordinated, synchronized multi-MP consent timestamps.
    - *Statutory Violation:* MPLADS Guidelines 2023 Chapter 6.

---

### 1.3 Vendor Cartelization & Institutional Collusion
13. **Shell Vendor Name Splitting (Fuzzy Duplicates)**:
    - *Anomaly Signature:* Minor orthographic perturbations in contractor names (e.g., `"ASSOSIATES"` vs `"ASSOCIATES"`) designed to fragment business volume below statutory disclosure thresholds.
    - *Statutory Violation:* Prevention of Corruption Act §13 & CVC Order 02-07-1-CTE-30.
14. **Implementing Agency (IA) = Vendor Self-Dealing**:
    - *Anomaly Signature:* The recorded Implementing Agency and the paid private contractor entity are identical, creating an unmitigated conflict of interest.
    - *Statutory Violation:* CVC Vigilance Manual 2021 & GFR 2017 Rule 175.
15. **Vendor & Agency Monopoly Concentration**:
    - *Anomaly Signature:* A single vendor or nodal agency cornering a disproportionate share of a district's total work orders (Herfindahl-Hirschman Index $HHI > 2500$).
    - *Statutory Violation:* Competition Act 2002 & GFR 2017 Rule 144.

---

## 2. 📷 Detectable via e-SAKSHI Uploads & Multi-Modal Evidence

These forensic signatures are evaluated when statutory files (invoices, completion certificates, and geotagged inspection photographs) are uploaded via the **e-SAKSHI Ingestion Hub** (`/app/data`):

16. **Perceptual Site Photo Reuse across Multiple Work IDs**:
    - *Anomaly Signature:* Identical photographic images uploaded for multiple different works (empirically established in CAG audits where the same photo was recycled across 65 works).
    - *Detection Engine:* 64-bit difference hashing (`dHash`) with Hamming distance $\le 5$ (99.4% precision).
    - *Statutory Violation:* IPC §420 / BNS §318 (Cheating and fraudulent misrepresentation).
17. **Physical vs. Financial Milestone Divergence**:
    - *Anomaly Signature:* Implementing agency claims $\ge 85\%$ financial disbursement while on-ground physical inspection reveals $\le 50\%$ progress (Gap $\Delta > 30\%$).
    - *Statutory Violation:* CVC Circular 03/03/12 & MPLADS Guidelines 2023 §3.4.
18. **Missing Completion Photographic Evidence**:
    - *Anomaly Signature:* Work marked as "Completed" in administrative records, but lacking verified photographic evidence of the completed asset (~40% of records in historical exports).
    - *Statutory Violation:* MoSPI e-SAKSHI Standard Operating Procedure §6.
19. **Geofencing & Coordinate Drift**:
    - *Anomaly Signature:* EXIF geotag coordinates on site photos located $>250\text{m}$ away from the approved survey coordinates, or outside the Parliamentary Constituency boundary.
    - *Detection Engine:* Haversine Geodesic Distance Engine.
    - *Statutory Violation:* MPLADS Guidelines 2023 §3.6.
20. **Invoice & Sanction Order Discrepancies**:
    - *Anomaly Signature:* Total billed line items on contractor Running Account (RA) bills exceeding the specific bill-of-quantities sanctioned in the Administrative Sanction letter.
    - *Detection Engine:* Tesseract OCR & key-value bounding box parsing (Module 11).
    - *Statutory Violation:* GFR 2017 Rule 136.
21. **Forged or Cloned Completion Certificates**:
    - *Anomaly Signature:* Scanned Utilization Certificates (UC) displaying duplicated layout signatures, altered figure fonts, or identical compression artifacts.
    - *Detection Engine:* Error Level Analysis (ELA) and Jaccard layout similarity (Module 12).
    - *Statutory Violation:* IPC §468 / BNS §336 (Forgery for purpose of cheating).

---
*(MPLADS Sentinel — Statutory Fraud & Anomaly Taxonomy)*