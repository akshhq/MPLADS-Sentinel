const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const Project = require("../models/Project");
const Evidence = require("../models/Evidence");
const Investigation = require("../models/Investigation");
const { StateMetric, DistrictMetric, GeographicRiskPoint, NationalAnalytics } = require("../models/Analytics");
const Dataset = require("../models/Dataset");

// Sample Indian project fixtures with complete anomaly attributes
const sampleProjects = [
  {
    id: "MPL-004821",
    title: "Construction of Multipurpose Community Hall at Village Khera",
    category: "Community Infrastructure",
    state: "Delhi",
    district: "New Delhi",
    constituency: "New Delhi PC-04",
    mpName: "Smt. Meenakshi Lekhi",
    mpHouse: "Lok Sabha",
    implementingAgency: "Delhi State Industrial and Infrastructure Development Corp (DSIIDC)",
    status: "in_progress",
    financials: {
      recommendedAmount: 3500000,
      sanctionedAmount: 3500000,
      committedAmount: 3500000,
      paidDisbursedAmount: 3080000,
      verifiedExpenditureAmount: 2920000,
      unreconciledGap: 160000,
      comparableMedianAmount: 2660000,
      costDeviationPercent: 31.4,
    },
    financialProgress: 88,
    physicalProgress: 52,
    dates: {
      recommendedDate: "2025-08-15",
      sanctionedDate: "2025-10-10",
      workOrderDate: "2025-10-28",
      expectedCompletionDate: "2026-06-30",
    },
    gpsCoordinates: { latitude: 28.5832, longitude: 77.1645 },
    risk: {
      score: 87,
      level: "critical",
      primarySignal: "Severe Financial / Physical Progress Divergence (36% Gap) & Reused Foundation Photo",
      confidence: 0.94,
      breakdown: {
        financialAnomalyScore: 28,
        timelineMilestoneDelayScore: 18,
        visualIntegrityScore: 24,
        documentExtractionScore: 12,
        graphRelationshipScore: 0,
        duplicateScopeScore: 5,
      },
      reasons: [
        {
          id: "RSN-01",
          title: "Premature Fund Disbursement vs Field Milestone Execution",
          category: "Financial Risk",
          severity: "critical",
          scoreContribution: 28,
          confidence: 0.96,
          explanation: "Executing agency disbursed 88% of sanctioned funds (₹30.80 L), but physical inspection verifies only 52% completion. Payout velocity is 36 percentage points ahead of verified milestone execution.",
          model: "Statistical Velocity Anomaly Detector v2.1",
          evidenceIds: ["EVD-PAY-001", "EVD-DOC-003"],
          deviations: [
            { label: "Financial Progress", expected: "≤ 55%", actual: "88%", delta: "+33% ahead" },
            { label: "Physical Progress", expected: "80%", actual: "52%", delta: "-28% lag" },
          ],
          recommendedAction: "Freeze further Running Account bill disbursements pending physical measurement verification by District Inspection Team.",
        },
        {
          id: "RSN-02",
          title: "Perceptual Image Hash Match (Reused Site Photograph)",
          category: "Visual Evidence (CV)",
          severity: "critical",
          scoreContribution: 24,
          confidence: 0.994,
          explanation: "Submitted milestone photograph for foundation casting matches an image uploaded in March 2024 for a separate project (MPL-002419 in North West Delhi) with a 99.4% perceptual hash similarity.",
          model: "ResNet-50 + Difference Hash Embeddings",
          evidenceIds: ["EVD-IMG-001"],
          deviations: [
            { label: "Image Similarity", expected: "< 25%", actual: "99.4%", delta: "+74.4% duplicate match" },
            { label: "Geotag Offset", expected: "< 50m", actual: "18.7 km", delta: "Different Constituency" },
          ],
          recommendedAction: "Depute an independent technical officer to capture fresh geo-tagged and timestamped photographs via the mobile app.",
        },
      ],
    },
    milestones: [
      { id: "M1", sequence: 1, name: "Site Clearance & Excavation", status: "completed", disbursedAmount: 700000, completionPercentage: 100 },
      { id: "M2", sequence: 2, name: "Foundation & Plinth Casting", status: "completed", disbursedAmount: 1050000, completionPercentage: 100 },
      { id: "M3", sequence: 3, name: "Superstructure Masonry & Columns", status: "delayed", disbursedAmount: 1330000, completionPercentage: 40 },
      { id: "M4", sequence: 4, name: "RCC Roof Slab Casting", status: "pending", disbursedAmount: 0, completionPercentage: 0 },
      { id: "M5", sequence: 5, name: "Finishing, Electrification & Handover", status: "pending", disbursedAmount: 0, completionPercentage: 0 },
    ],
    investigationCaseId: "CASE-2026-00128",
  },
  {
    id: "MPL-004822",
    title: "Construction of Community Centre at Village Khera Extension",
    category: "Community Infrastructure",
    state: "Delhi",
    district: "New Delhi",
    constituency: "New Delhi PC-04",
    mpName: "Smt. Meenakshi Lekhi",
    mpHouse: "Lok Sabha",
    implementingAgency: "Delhi State Industrial and Infrastructure Development Corp (DSIIDC)",
    status: "sanctioned",
    financials: {
      recommendedAmount: 3700000,
      sanctionedAmount: 3700000,
      committedAmount: 3700000,
      paidDisbursedAmount: 740000,
      verifiedExpenditureAmount: 740000,
      unreconciledGap: 0,
      comparableMedianAmount: 2660000,
      costDeviationPercent: 39.1,
    },
    financialProgress: 20,
    physicalProgress: 10,
    dates: {
      recommendedDate: "2025-09-01",
      sanctionedDate: "2025-10-20",
      workOrderDate: "2025-11-10",
      expectedCompletionDate: "2026-07-31",
    },
    gpsCoordinates: { latitude: 28.5845, longitude: 77.1681 },
    risk: {
      score: 82,
      level: "critical",
      primarySignal: "Potential Scope Duplication with MPL-004821 (SBERT: 92.4%, Distance: 438m)",
      confidence: 0.91,
      breakdown: {
        financialAnomalyScore: 12,
        timelineMilestoneDelayScore: 5,
        visualIntegrityScore: 0,
        documentExtractionScore: 5,
        graphRelationshipScore: 15,
        duplicateScopeScore: 45,
      },
      reasons: [
        {
          id: "RSN-DUP-01",
          title: "High Spatial & Semantic Proposal Duplication",
          category: "Duplicate Intelligence",
          severity: "critical",
          scoreContribution: 45,
          confidence: 0.924,
          explanation: "Scope text and location overlap with adjacent project MPL-004821 sanctioned in the same financial year by the same executing agency.",
          model: "Sentence-BERT + Haversine Radius",
          evidenceIds: ["EVD-DOC-001"],
          deviations: [
            { label: "Semantic Text Match", expected: "< 40%", actual: "92.4%", delta: "+52.4%" },
            { label: "Geographic Distance", expected: "> 1.5 km", actual: "438 meters", delta: "Immediate Adjacency" },
          ],
          recommendedAction: "Audit Revenue survey plot numbers to verify whether two distinct physical structures exist.",
        },
      ],
    },
    milestones: [
      { id: "M1", sequence: 1, name: "Site Clearance", status: "completed", disbursedAmount: 740000, completionPercentage: 100 },
      { id: "M2", sequence: 2, name: "Foundation Civil Works", status: "in_progress", disbursedAmount: 0, completionPercentage: 15 },
    ],
  },
  {
    id: "MPL-005104",
    title: "50 Solar High-Mast Lighting Systems in 12 GPs",
    category: "Renewable Energy & Power",
    state: "Uttar Pradesh",
    district: "Varanasi",
    constituency: "Varanasi PC-77",
    mpName: "Shri Narendra Modi",
    mpHouse: "Lok Sabha",
    implementingAgency: "UP New and Renewable Energy Development Agency (UPNEDA)",
    status: "delayed",
    financials: {
      recommendedAmount: 4500000,
      sanctionedAmount: 4500000,
      committedAmount: 4500000,
      paidDisbursedAmount: 4140000,
      verifiedExpenditureAmount: 1800000,
      unreconciledGap: 2340000,
      comparableMedianAmount: 4200000,
      costDeviationPercent: 7.1,
    },
    financialProgress: 92,
    physicalProgress: 40,
    dates: {
      recommendedDate: "2025-04-10",
      sanctionedDate: "2025-06-15",
      workOrderDate: "2025-07-01",
      expectedCompletionDate: "2026-02-28",
    },
    gpsCoordinates: { latitude: 25.3176, longitude: 82.9739 },
    risk: {
      score: 89,
      level: "critical",
      primarySignal: "Premature Advance Fund Retention (₹23.4 L Unreconciled Gap) & Milestone Overrun",
      confidence: 0.95,
      breakdown: {
        financialAnomalyScore: 35,
        timelineMilestoneDelayScore: 30,
        visualIntegrityScore: 10,
        documentExtractionScore: 14,
        graphRelationshipScore: 0,
        duplicateScopeScore: 0,
      },
      reasons: [
        {
          id: "RSN-03",
          title: "Advance Fund Retention Without Physical Installation Proof",
          category: "Financial Risk",
          severity: "critical",
          scoreContribution: 35,
          confidence: 0.95,
          explanation: "Vendor received 92% payment (₹41.40 L) but verified installation is confirmed for only 20 of 50 solar high-mast lighting units.",
          model: "Treasury Reconciliation Scanner",
          evidenceIds: ["EVD-PAY-003"],
          deviations: [{ label: "Unreconciled Gap", expected: "₹0", actual: "₹23.4 L", delta: "+₹23.4 L gap" }],
          recommendedAction: "Requisition site delivery receipts and field installation certificates for remaining 30 locations.",
        },
      ],
    },
    milestones: [
      { id: "M1", sequence: 1, name: "Component Procurement", status: "completed", disbursedAmount: 2250000, completionPercentage: 100 },
      { id: "M2", sequence: 2, name: "Civil Foundation Casting", status: "completed", disbursedAmount: 1125000, completionPercentage: 100 },
      { id: "M3", sequence: 3, name: "Pole Erection & Battery Installation", status: "delayed", disbursedAmount: 765000, completionPercentage: 35 },
    ],
    investigationCaseId: "CASE-2026-00130",
  },
  {
    id: "MPL-003921",
    title: "Paved CC Road from Main Market to Primary Health Centre",
    category: "Roads & Bridges",
    state: "Maharashtra",
    district: "Pune",
    constituency: "Pune PC-34",
    mpName: "Shri Murlidhar Mohol",
    mpHouse: "Lok Sabha",
    implementingAgency: "Public Works Department (PWD) Pune Division",
    status: "in_progress",
    financials: {
      recommendedAmount: 2450000,
      sanctionedAmount: 2450000,
      committedAmount: 2450000,
      paidDisbursedAmount: 2450000,
      verifiedExpenditureAmount: 2450000,
      unreconciledGap: 0,
      comparableMedianAmount: 2400000,
      costDeviationPercent: 2.1,
    },
    financialProgress: 100,
    physicalProgress: 75,
    dates: {
      recommendedDate: "2025-07-10",
      sanctionedDate: "2025-09-05",
      workOrderDate: "2025-09-20",
      expectedCompletionDate: "2026-04-30",
    },
    gpsCoordinates: { latitude: 18.5204, longitude: 73.8567 },
    risk: {
      score: 76,
      level: "high",
      primarySignal: "Split Procurement Invoicing Clustered Under ₹10L e-Tender Threshold",
      confidence: 0.88,
      breakdown: {
        financialAnomalyScore: 32,
        timelineMilestoneDelayScore: 14,
        visualIntegrityScore: 0,
        documentExtractionScore: 20,
        graphRelationshipScore: 10,
        duplicateScopeScore: 0,
      },
      reasons: [
        {
          id: "RSN-04",
          title: "Tender Threshold Bypass Anomaly",
          category: "Financial Risk",
          severity: "high",
          scoreContribution: 32,
          confidence: 0.88,
          explanation: "Three separate payment vouchers issued to the same contractor within 72 hours (₹9.8L, ₹9.75L, ₹4.95L), circumventing mandatory competitive e-tendering rules.",
          model: "Invoice Cluster Classifier",
          evidenceIds: ["EVD-PAY-004"],
          deviations: [{ label: "Voucher Batching", expected: "Single E-Tender", actual: "3 Split Bills", delta: "Bypassed GFR Rule 149" }],
          recommendedAction: "Review procurement files and confirm whether competitive bidding was legally required.",
        },
      ],
    },
    milestones: [
      { id: "M1", sequence: 1, name: "Sub-base Earthwork", status: "completed", disbursedAmount: 980000, completionPercentage: 100 },
      { id: "M2", sequence: 2, name: "Concrete Paving Section A", status: "completed", disbursedAmount: 975000, completionPercentage: 100 },
      { id: "M3", sequence: 3, name: "Concrete Paving Section B & Drainage", status: "in_progress", disbursedAmount: 495000, completionPercentage: 50 },
    ],
  },
  {
    id: "MPL-007812",
    title: "Model Anganwadi Infrastructure Modernization",
    category: "Education & Child Welfare",
    state: "Karnataka",
    district: "Bengaluru Urban",
    constituency: "Bengaluru South PC-26",
    mpName: "Shri Tejasvi Surya",
    mpHouse: "Lok Sabha",
    implementingAgency: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    status: "in_progress",
    financials: {
      recommendedAmount: 1800000,
      sanctionedAmount: 1800000,
      committedAmount: 1800000,
      paidDisbursedAmount: 1100000,
      verifiedExpenditureAmount: 1100000,
      unreconciledGap: 0,
      comparableMedianAmount: 1750000,
      costDeviationPercent: 2.8,
    },
    financialProgress: 61,
    physicalProgress: 60,
    dates: {
      recommendedDate: "2025-11-01",
      sanctionedDate: "2025-12-10",
      workOrderDate: "2026-01-05",
      expectedCompletionDate: "2026-05-31",
    },
    gpsCoordinates: { latitude: 12.9716, longitude: 77.5946 },
    risk: {
      score: 72,
      level: "high",
      primarySignal: "Utilization Certificate (UC) Claimed Amount Exceeds Treasury Ledger Debits",
      confidence: 0.86,
      breakdown: {
        financialAnomalyScore: 18,
        timelineMilestoneDelayScore: 12,
        visualIntegrityScore: 0,
        documentExtractionScore: 28,
        graphRelationshipScore: 14,
        duplicateScopeScore: 0,
      },
      reasons: [
        {
          id: "RSN-05",
          title: "Cross-Document Ledger Discrepancy",
          category: "Document Verification",
          severity: "high",
          scoreContribution: 28,
          confidence: 0.92,
          explanation: "Provisional Utilization Certificate filed for ₹14.40 L, whereas verified treasury passbook debits reflect ₹11.00 L.",
          model: "OCR Reconciliation Engine",
          evidenceIds: ["EVD-DOC-004"],
          deviations: [{ label: "UC Amount vs Treasury", expected: "₹11.00 L", actual: "₹14.40 L", delta: "+₹3.40 L unbooked claim" }],
          recommendedAction: "Request audited bank statement from executing agency before issuing final UC endorsement.",
        },
      ],
    },
    milestones: [
      { id: "M1", sequence: 1, name: "Civil Structural Renovation", status: "completed", disbursedAmount: 600000, completionPercentage: 100 },
      { id: "M2", sequence: 2, name: "Smart Classroom & Furniture", status: "completed", disbursedAmount: 500000, completionPercentage: 100 },
      { id: "M3", sequence: 3, name: "Solar Rooftop Commissioning", status: "delayed", disbursedAmount: 0, completionPercentage: 20 },
    ],
  },
];

const sampleEvidence = [
  {
    id: "EVD-IMG-001",
    projectId: "MPL-004821",
    projectTitle: "Multipurpose Community Hall at Village Khera",
    type: "image",
    title: "Foundation Excavation & RCC Column Casting Proof",
    status: "conflict",
    fileSize: "3.4 MB",
    mimeType: "image/jpeg",
    provenance: {
      sourceSystem: "eSAKSHI Mobile Inspection App v3.2",
      uploaderId: "ENG-DL-8821",
      uploaderRole: "Assistant Engineer, DSIIDC",
      uploadedAt: "2025-11-28T14:22:18Z",
      sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    metadata: {
      gpsLatitude: 28.5832,
      gpsLongitude: 77.1645,
      gpsAltitude: 218.4,
      captureTimestamp: "2025-11-28T14:20:02Z",
      cameraModel: "Samsung Galaxy A54 5G",
      exifPreserved: true,
      milestoneId: "M2",
    },
    findings: [
      {
        id: "FND-01",
        title: "Perceptual Image Hash Match Detected",
        description: "Visual embedding matches archived image EVD-IMG-002 from North West Delhi (MPL-002419, March 2024) with 99.4% similarity.",
        severity: "critical",
        confidence: 0.994,
        modelUsed: "ResNet-50 + dHash Feature Extractor",
      },
    ],
    comparisonEvidenceId: "EVD-IMG-002",
    comparisonSimilarityPercent: 99.4,
  },
  {
    id: "EVD-DOC-003",
    projectId: "MPL-004821",
    projectTitle: "Multipurpose Community Hall at Village Khera",
    type: "document",
    title: "Contractor Running Account Bill #3 (RCC Structure)",
    status: "conflict",
    fileSize: "1.8 MB",
    mimeType: "application/pdf",
    provenance: {
      sourceSystem: "eSAKSHI Document Repository",
      uploaderId: "CONTR-DSIIDC-09",
      uploaderRole: "Executing Contractor",
      uploadedAt: "2026-01-14T11:05:40Z",
      sha256Hash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    },
    extractedFields: [
      { fieldName: "Sanctioned Ceiling", extractedValue: 3500000, isConsistent: true },
      { fieldName: "Claimed Bill Amount", extractedValue: 4100000, isConsistent: false, mismatchNote: "Bill exceeds approved sanction by ₹6.0 L without Revised Technical Sanction" },
      { fieldName: "Total Disbursed to Date", extractedValue: 3080000, isConsistent: true },
    ],
    findings: [
      {
        id: "FND-02",
        title: "Bill Amount Exceeds Approved Administrative Sanction",
        description: "Cumulative billing of ₹41.0 L violates GFR Rule 130 without formal Revised Technical Sanctions.",
        severity: "high",
        confidence: 0.97,
        modelUsed: "Multilingual OCR & GFR Validation Rules",
      },
    ],
  },
  {
    id: "EVD-PAY-001",
    projectId: "MPL-004821",
    projectTitle: "Multipurpose Community Hall at Village Khera",
    type: "payment",
    title: "PFMS Treasury Voucher #02 (Installment 2)",
    status: "verified",
    fileSize: "420 KB",
    mimeType: "application/pdf",
    provenance: {
      sourceSystem: "PFMS Central Treasury Gateway",
      uploaderId: "TREASURY-ND-01",
      uploaderRole: "District Treasury Officer",
      uploadedAt: "2025-12-05T09:14:30Z",
      sha256Hash: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    },
    extractedFields: [
      { fieldName: "Voucher Amount", extractedValue: 1330000, isConsistent: true },
      { fieldName: "Beneficiary Vendor PAN", extractedValue: "AABCS1234K", isConsistent: true },
      { fieldName: "PFMS Transaction ID", extractedValue: "PFMS202512050098421", isConsistent: true },
    ],
  },
];

const sampleInvestigations = [
  {
    id: "CASE-2026-00128",
    projectId: "MPL-004821",
    projectTitle: "Multipurpose Community Hall at Village Khera",
    state: "Delhi",
    district: "New Delhi",
    category: "Community Infrastructure",
    riskScore: 87,
    primaryIssue: "Severe Progress Divergence (88% Payout vs 52% Field Work) & 99.4% Image Match",
    priority: "urgent",
    status: "under_review",
    summary: "Automated surveillance flagged severe premature disbursement velocity, photographic image reuse from an archived 2024 project in North West Delhi, and billing exceeding administrative sanction ceilings by ₹6.0 L.",
    assignedTo: {
      id: "OFFICER-001",
      name: "Shri Rajesh Verma",
      role: "Senior Audit Officer, MoSPI Performance Cell",
      email: "r.verma.audit@gov.in",
    },
    openedAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-15T14:30:00Z",
    notes: [
      {
        id: "N1",
        authorId: "OFFICER-001",
        authorName: "Shri Rajesh Verma",
        authorRole: "Senior Audit Officer",
        content: "Initiated preliminary case inquiry based on 99.4% perceptual match between EVD-IMG-001 and historical record EVD-IMG-002. Requested physical site verification from DSIIDC Chief Engineer.",
        createdAt: "2026-02-02T11:15:00Z",
        linkedEvidenceIds: ["EVD-IMG-001", "EVD-DOC-003"],
      },
      {
        id: "N2",
        authorId: "OFFICER-002",
        authorName: "Smt. Sunita Rao",
        authorRole: "Assistant Audit Officer",
        content: "Verified treasury ledger debits on PFMS. Voucher #02 for ₹13.30 L was cleared prior to completion of RCC column casting.",
        createdAt: "2026-02-08T16:45:00Z",
        linkedEvidenceIds: ["EVD-PAY-001"],
      },
    ],
    activityLogs: [
      {
        id: "LOG-1",
        timestamp: "2026-02-01T10:00:00Z",
        actor: "Sentinel Automated Surveillance Engine",
        action: "Case Triggered",
        details: "Composite Risk Index exceeded 85/100 threshold with multiple correlated anomaly flags.",
      },
      {
        id: "LOG-2",
        timestamp: "2026-02-01T10:30:00Z",
        actor: "Central Monitoring Cell",
        action: "Case Assigned",
        details: "Assigned to Shri Rajesh Verma (Senior Audit Officer) for formal review.",
      },
    ],
    evidenceChain: [
      {
        step: "risk",
        title: "Multi-Source Anomaly Trigger",
        subtitle: "Composite Risk: 87 / 100 (CRITICAL)",
        status: "flagged",
        details: "Cross-correlated flags across financial velocity, perceptual image hashing, and GFR bill ceilings.",
      },
      {
        step: "signal",
        title: "AI Detection Engines",
        subtitle: "5 Statistical & Deep Learning Findings",
        status: "flagged",
        details: "ResNet-50 + dHash similarity 99.4%, Z-score velocity deviation +36%, GFR 130 ceiling breach.",
      },
      {
        step: "claim",
        title: "Agency Progress Claim",
        subtitle: "Claimed 88% Financial Payout",
        status: "conflict",
        details: "RA Bill #3 submitted for ₹41.0 L claiming completed foundation and plinth.",
      },
      {
        step: "evidence",
        title: "Cryptographic Ground Evidence",
        subtitle: "EVD-IMG-001, EVD-DOC-003, EVD-PAY-001",
        status: "conflict",
        details: "Geotag coordinates belong to North West Delhi rather than Village Khera.",
      },
      {
        step: "source",
        title: "eSAKSHI & PFMS Treasury Logs",
        subtitle: "Official Treasury Passbook Verified",
        status: "verified",
        details: "Disbursement confirmed in PFMS Treasury Debits with immutable transaction logs.",
      },
    ],
  },
];

const sampleNationalAnalytics = {
  id: "national_summary",
  totalWorksMonitored: 18432,
  totalSanctionedCr: 4892.4,
  totalDisbursedCr: 3715.8,
  totalFlaggedRiskValueCr: 42.8,
  riskCounts: {
    critical: 34,
    high: 127,
    medium: 842,
    low: 17429,
  },
  riskTrend7D: [
    { date: "22 Feb", critical: 31, high: 120, medium: 830 },
    { date: "23 Feb", critical: 32, high: 122, medium: 835 },
    { date: "24 Feb", critical: 33, high: 124, medium: 838 },
    { date: "25 Feb", critical: 32, high: 125, medium: 840 },
    { date: "26 Feb", critical: 34, high: 126, medium: 841 },
    { date: "27 Feb", critical: 34, high: 127, medium: 842 },
    { date: "28 Feb", critical: 34, high: 127, medium: 842 },
  ],
  riskDistribution: [
    { category: "Community Infrastructure", count: 42, percentage: 26.1, totalFlaggedValueLakhs: 1470 },
    { category: "Roads, Pathways & Bridges", count: 38, percentage: 23.6, totalFlaggedValueLakhs: 950 },
    { category: "Drinking Water & Sanitation", count: 31, percentage: 19.3, totalFlaggedValueLakhs: 820 },
    { category: "Renewable Energy & Lighting", count: 28, percentage: 17.4, totalFlaggedValueLakhs: 640 },
    { category: "Education & Child Welfare", count: 22, percentage: 13.6, totalFlaggedValueLakhs: 400 },
  ],
};

const sampleStates = [
  { state: "Delhi", totalWorks: 1240, totalSanctionedCr: 320.5, totalExpenditureCr: 245.2, highRiskWorks: 14, criticalWorks: 5, averageRiskScore: 42.1, primaryRiskFactor: "Cost inflation & spatial duplication" },
  { state: "Uttar Pradesh", totalWorks: 3410, totalSanctionedCr: 980.2, totalExpenditureCr: 710.4, highRiskWorks: 32, criticalWorks: 9, averageRiskScore: 38.6, primaryRiskFactor: "Milestone delay & advance retention" },
  { state: "Maharashtra", totalWorks: 2890, totalSanctionedCr: 810.0, totalExpenditureCr: 640.8, highRiskWorks: 21, criticalWorks: 6, averageRiskScore: 35.4, primaryRiskFactor: "Split invoicing below tender threshold" },
  { state: "Karnataka", totalWorks: 1980, totalSanctionedCr: 540.2, totalExpenditureCr: 420.1, highRiskWorks: 16, criticalWorks: 4, averageRiskScore: 33.2, primaryRiskFactor: "Utilization Certificate discrepancies" },
  { state: "Bihar", totalWorks: 2450, totalSanctionedCr: 690.4, totalExpenditureCr: 480.9, highRiskWorks: 24, criticalWorks: 7, averageRiskScore: 39.8, primaryRiskFactor: "Milestone execution delays" },
];

const sampleGeoPoints = [
  { id: "GP-01", projectId: "MPL-004821", projectTitle: "Village Khera Community Hall", state: "Delhi", district: "New Delhi", latitude: 28.5832, longitude: 77.1645, riskScore: 87, riskLevel: "critical", primarySignal: "Severe Financial/Physical Gap (36% Gap)", sanctionedAmount: 3500000, category: "Community Infrastructure" },
  { id: "GP-02", projectId: "MPL-005104", projectTitle: "50 Solar High-Mast Lighting", state: "Uttar Pradesh", district: "Varanasi", latitude: 25.3176, longitude: 82.9739, riskScore: 89, riskLevel: "critical", primarySignal: "Premature Advance Retention", sanctionedAmount: 4500000, category: "Renewable Energy & Power" },
  { id: "GP-03", projectId: "MPL-003921", projectTitle: "Paved CC Road to PHC", state: "Maharashtra", district: "Pune", latitude: 18.5204, longitude: 73.8567, riskScore: 76, riskLevel: "high", primarySignal: "Split Invoicing Below Threshold", sanctionedAmount: 2450000, category: "Roads & Bridges" },
  { id: "GP-04", projectId: "MPL-007812", projectTitle: "Model Anganwadi Upgradation", state: "Karnataka", district: "Bengaluru Urban", latitude: 12.9716, longitude: 77.5946, riskScore: 72, riskLevel: "high", primarySignal: "UC Amount vs Treasury Gap", sanctionedAmount: 1800000, category: "Education & Child Welfare" },
  { id: "GP-05", projectId: "MPL-006219", projectTitle: "Tribal Drinking Water Pipeline", state: "Kerala", district: "Wayanad", latitude: 11.6854, longitude: 76.132, riskScore: 42, riskLevel: "medium", primarySignal: "Normal Execution Velocity", sanctionedAmount: 2800000, category: "Drinking Water & Sanitation" },
];

const sampleDatasets = [
  {
    id: "DS-REC-01",
    name: "MP Recommendations Ledger",
    sourceOfficialName: "eSAKSHI Portal - Ministry of Statistics & Programme Implementation",
    description: "Official log of developmental work recommendations submitted by Hon'ble Members of Parliament under MPLADS guidelines.",
    totalRows: 18432,
    lastSyncedAt: "2026-02-28T06:00:00Z",
    columns: [
      { key: "workCode", label: "Work Code", dataType: "string" },
      { key: "mpName", label: "Hon'ble MP", dataType: "string" },
      { key: "state", label: "State", dataType: "string" },
      { key: "district", label: "District", dataType: "string" },
      { key: "recommendedCost", label: "Recommended (₹)", dataType: "currency" },
    ],
    sampleRows: [
      { workCode: "MPL-004821", mpName: "Smt. Meenakshi Lekhi", state: "Delhi", district: "New Delhi", recommendedCost: 3500000 },
      { workCode: "MPL-004822", mpName: "Smt. Meenakshi Lekhi", state: "Delhi", district: "New Delhi", recommendedCost: 3700000 },
      { workCode: "MPL-005104", mpName: "Shri Narendra Modi", state: "Uttar Pradesh", district: "Varanasi", recommendedCost: 4500000 },
      { workCode: "MPL-003921", mpName: "Shri Murlidhar Mohol", state: "Maharashtra", district: "Pune", recommendedCost: 2450000 },
      { workCode: "MPL-007812", mpName: "Shri Tejasvi Surya", state: "Karnataka", district: "Bengaluru Urban", recommendedCost: 1800000 },
    ],
  },
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log("[Seeder] Clearing old collections...");

    await Promise.all([
      Project.deleteMany({}),
      Evidence.deleteMany({}),
      Investigation.deleteMany({}),
      StateMetric.deleteMany({}),
      GeographicRiskPoint.deleteMany({}),
      NationalAnalytics.deleteMany({}),
      Dataset.deleteMany({}),
    ]);

    console.log("[Seeder] Inserting Projects...");
    await Project.insertMany(sampleProjects);

    console.log("[Seeder] Inserting Evidence Items...");
    await Evidence.insertMany(sampleEvidence);

    console.log("[Seeder] Inserting Investigation Cases...");
    await Investigation.insertMany(sampleInvestigations);

    console.log("[Seeder] Inserting Analytics & Geo Points...");
    await StateMetric.insertMany(sampleStates);
    await GeographicRiskPoint.insertMany(sampleGeoPoints);
    await NationalAnalytics.create(sampleNationalAnalytics);

    console.log("[Seeder] Inserting Datasets...");
    await Dataset.insertMany(sampleDatasets);

    console.log("=================================================");
    console.log("✓ MongoDB Seeding Completed Successfully for MPLADS Sentinel!");
    console.log("=================================================");
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
}

seedDatabase();
