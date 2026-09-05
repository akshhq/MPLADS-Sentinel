const { supabase, isConfigured } = require("../config/supabase");

// Fallback seed data fixtures
const FALLBACK_PROJECTS = [
  {
    id: "MPL-004821",
    title: "Construction of Multipurpose Community Hall at Village Khera",
    category: "Community Infrastructure",
    state: "Delhi",
    district: "New Delhi",
    constituency: "New Delhi PC-04",
    mpName: "Smt. Meenakshi Lekhi",
    mp_name: "Smt. Meenakshi Lekhi",
    mpHouse: "Lok Sabha",
    mp_house: "Lok Sabha",
    implementingAgency: "Delhi State Industrial and Infrastructure Development Corp (DSIIDC)",
    implementing_agency: "Delhi State Industrial and Infrastructure Development Corp (DSIIDC)",
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
    financial_progress: 88,
    physicalProgress: 52,
    physical_progress: 52,
    dates: {
      recommendedDate: "2025-08-15",
      sanctionedDate: "2025-10-10",
      workOrderDate: "2025-10-28",
      expectedCompletionDate: "2026-06-30",
    },
    gpsCoordinates: { latitude: 28.5832, longitude: 77.1645 },
    gps_coordinates: { latitude: 28.5832, longitude: 77.1645 },
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
          explanation: "Executing agency disbursed 88% of sanctioned funds (₹30.80 L), but physical inspection verifies only 52% completion.",
          model: "Statistical Velocity Anomaly Detector v2.1",
          evidenceIds: ["EVD-PAY-001", "EVD-DOC-003"],
        },
        {
          id: "RSN-02",
          title: "Perceptual Image Hash Match (Reused Site Photograph)",
          category: "Visual Evidence (CV)",
          severity: "critical",
          scoreContribution: 24,
          confidence: 0.994,
          explanation: "Submitted milestone photograph matches an image uploaded in March 2024 for MPL-002419 with 99.4% similarity.",
          model: "ResNet-50 + Difference Hash Embeddings",
          evidenceIds: ["EVD-IMG-001"],
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
    investigation_case_id: "CASE-2026-00128",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "MPL-004822",
    title: "Construction of Community Centre at Village Khera Extension",
    category: "Community Infrastructure",
    state: "Delhi",
    district: "New Delhi",
    constituency: "New Delhi PC-04",
    mpName: "Smt. Meenakshi Lekhi",
    mp_name: "Smt. Meenakshi Lekhi",
    mpHouse: "Lok Sabha",
    mp_house: "Lok Sabha",
    implementingAgency: "Delhi State Industrial and Infrastructure Development Corp (DSIIDC)",
    implementing_agency: "Delhi State Industrial and Infrastructure Development Corp (DSIIDC)",
    status: "in_progress",
    financials: {
      recommendedAmount: 3800000,
      sanctionedAmount: 3800000,
      committedAmount: 3800000,
      paidDisbursedAmount: 2280000,
      verifiedExpenditureAmount: 2100000,
      unreconciledGap: 180000,
      comparableMedianAmount: 2750000,
      costDeviationPercent: 38.2,
    },
    financialProgress: 60,
    financial_progress: 60,
    physicalProgress: 45,
    physical_progress: 45,
    dates: {
      recommendedDate: "2025-09-02",
      sanctionedDate: "2025-11-14",
      workOrderDate: "2025-12-01",
      expectedCompletionDate: "2026-08-15",
    },
    gpsCoordinates: { latitude: 28.5865, longitude: 77.168 },
    gps_coordinates: { latitude: 28.5865, longitude: 77.168 },
    risk: {
      score: 76,
      level: "high",
      primarySignal: "Potential Scope Duplication & Spatial Overlap with MPL-004821 (<450m Distance)",
      confidence: 0.89,
      breakdown: {
        financialAnomalyScore: 16,
        timelineMilestoneDelayScore: 10,
        visualIntegrityScore: 12,
        documentExtractionScore: 8,
        graphRelationshipScore: 10,
        duplicateScopeScore: 20,
      },
      reasons: [
        {
          id: "RSN-04",
          title: "Geospatial & Semantic Work Description Duplication",
          category: "Duplicate Scope",
          severity: "high",
          scoreContribution: 20,
          confidence: 0.91,
          explanation: "High semantic overlap (92.4%) with nearby project MPL-004821 sanctioned in the same financial year under identical executing agency.",
          model: "SBERT + Haversine Geospatial Buffer",
          evidenceIds: ["EVD-DOC-001"],
        },
      ],
    },
    milestones: [
      { id: "M1", sequence: 1, name: "Site Leveling & Boundary", status: "completed", disbursedAmount: 760000, completionPercentage: 100 },
      { id: "M2", sequence: 2, name: "Substructure & Foundation", status: "completed", disbursedAmount: 1520000, completionPercentage: 100 },
      { id: "M3", sequence: 3, name: "Brick Masonry & Lintels", status: "in_progress", disbursedAmount: 0, completionPercentage: 35 },
    ],
    investigationCaseId: null,
    investigation_case_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "MPL-005104",
    title: "Installation of 50 High-Mast Solar Lighting Systems",
    category: "Renewable Energy & Lighting",
    state: "Uttar Pradesh",
    district: "Varanasi",
    constituency: "Varanasi PC-77",
    mpName: "Shri Narendra Modi",
    mp_name: "Shri Narendra Modi",
    mpHouse: "Lok Sabha",
    mp_house: "Lok Sabha",
    implementingAgency: "Uttar Pradesh New & Renewable Energy Development Agency (UPNEDA)",
    implementing_agency: "Uttar Pradesh New & Renewable Energy Development Agency (UPNEDA)",
    status: "in_progress",
    financials: {
      recommendedAmount: 4500000,
      sanctionedAmount: 4500000,
      committedAmount: 4500000,
      paidDisbursedAmount: 4140000,
      verifiedExpenditureAmount: 3950000,
      unreconciledGap: 190000,
      comparableMedianAmount: 3200000,
      costDeviationPercent: 40.6,
    },
    financialProgress: 92,
    financial_progress: 92,
    physicalProgress: 40,
    physical_progress: 40,
    dates: {
      recommendedDate: "2025-06-10",
      sanctionedDate: "2025-07-20",
      workOrderDate: "2025-08-05",
      expectedCompletionDate: "2026-02-28",
    },
    gpsCoordinates: { latitude: 25.3176, longitude: 82.9739 },
    gps_coordinates: { latitude: 25.3176, longitude: 82.9739 },
    risk: {
      score: 79,
      level: "high",
      primarySignal: "Vendor Price Markup (+40.6% over Benchmark) & Progress Lag",
      confidence: 0.91,
      breakdown: {
        financialAnomalyScore: 26,
        timelineMilestoneDelayScore: 22,
        visualIntegrityScore: 11,
        documentExtractionScore: 10,
        graphRelationshipScore: 10,
        duplicateScopeScore: 0,
      },
      reasons: [
        {
          id: "RSN-05",
          title: "Unit Rate Disparity vs Central Public Procurement Portal Benchmark",
          category: "Cost Overrun",
          severity: "high",
          scoreContribution: 26,
          confidence: 0.93,
          explanation: "Procured solar lighting units billed at ₹90,000/unit against statewide median benchmark of ₹64,000/unit.",
          model: "CPPP Procurement Index Comparator",
          evidenceIds: ["EVD-PAY-002"],
        },
      ],
    },
    milestones: [
      { id: "M1", sequence: 1, name: "Material Procurement & Delivery", status: "completed", disbursedAmount: 2250000, completionPercentage: 100 },
      { id: "M2", sequence: 2, name: "Pole Erection (20 Units)", status: "completed", disbursedAmount: 1890000, completionPercentage: 100 },
      { id: "M3", sequence: 3, name: "Solar Panel & Luminaire Commissioning (30 Units)", status: "delayed", disbursedAmount: 0, completionPercentage: 15 },
    ],
    investigationCaseId: "CASE-2026-00129",
    investigation_case_id: "CASE-2026-00129",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const FALLBACK_EVIDENCE = [
  {
    id: "EVD-IMG-001",
    projectId: "MPL-004821",
    project_id: "MPL-004821",
    projectTitle: "Multipurpose Community Hall at Village Khera",
    project_title: "Multipurpose Community Hall at Village Khera",
    type: "image",
    title: "Foundation Footing Concrete Pouring Inspection Photo",
    status: "conflict",
    fileUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=300&q=80",
    fileSize: "3.4 MB",
    mimeType: "image/jpeg",
    provenance: {
      sourceSystem: "eSAKSHI Mobile Inspection App v2.4",
      uploaderId: "AE-NEWDELHI-04",
      uploaderRole: "Assistant Engineer (Civil), DSIIDC",
      uploadedAt: "2025-11-20T14:22:10Z",
      sha256Hash: "8c6976e5b5410415bde3f802111c81ef408e647bbf9e9efc28a8a43fe7d02219",
    },
    metadata: {
      gpsLatitude: 28.7845,
      gpsLongitude: 77.0892,
      captureTimestamp: "2024-03-12T09:14:00Z",
      cameraModel: "Samsung Galaxy SM-G991B",
      exifPreserved: true,
      milestoneId: "M2",
    },
    extractedFields: [
      { fieldName: "Asset Type", extractedValue: "Concrete Foundation Footing", confidence: 0.98, isConsistent: true },
      { fieldName: "Geotag Consistency", extractedValue: "18.7 km offset from Khera Village", confidence: 0.99, isConsistent: false, mismatchNote: "EXIF Coordinates belong to North West Delhi constituency" },
    ],
    findings: [
      { id: "F1", title: "Perceptual Image Hash Reuse", description: "Image matches previous upload for project MPL-002419 from March 2024 with 99.4% similarity.", severity: "critical", confidence: 0.994, modelUsed: "ResNet-50 + dHash" },
      { id: "F2", title: "Geotag Coordinates Anomaly", description: "Metadata latitude/longitude is 18.7 km away from registered project site.", severity: "critical", confidence: 0.99, modelUsed: "GIS Bounds Verifier" },
    ],
    comparisonEvidenceId: "EVD-IMG-ARCHIVE-2024-08",
    comparisonSimilarityPercent: 99.4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "EVD-PAY-001",
    projectId: "MPL-004821",
    project_id: "MPL-004821",
    projectTitle: "Multipurpose Community Hall at Village Khera",
    project_title: "Multipurpose Community Hall at Village Khera",
    type: "payment",
    title: "PFMS Treasury Voucher #02 (Running Bill Release)",
    status: "verified",
    fileUrl: "https://pfms.nic.in/voucher/2025/DEL/004821/V02.pdf",
    fileSize: "420 KB",
    mimeType: "application/pdf",
    provenance: {
      sourceSystem: "PFMS - Public Financial Management System",
      uploaderId: "TREASURY-DEL-01",
      uploaderRole: "District Treasury Officer",
      uploadedAt: "2025-12-15T11:05:00Z",
      sha256Hash: "d41d8cd98f00b204e9800998ecf8427e",
    },
    metadata: {
      milestoneId: "M3",
    },
    extractedFields: [
      { fieldName: "Voucher Amount", extractedValue: "₹13,30,000", confidence: 1.0, isConsistent: true },
      { fieldName: "Cumulative Disbursed", extractedValue: "₹30,80,000 (88%)", confidence: 1.0, isConsistent: true },
      { fieldName: "Beneficiary Vendor", extractedValue: "Apex Infra Projects Ltd (A/C: *******4921)", confidence: 0.99, isConsistent: true },
    ],
    findings: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const FALLBACK_INVESTIGATIONS = [
  {
    id: "CASE-2026-00128",
    projectId: "MPL-004821",
    project_id: "MPL-004821",
    projectTitle: "Construction of Multipurpose Community Hall at Village Khera",
    project_title: "Construction of Multipurpose Community Hall at Village Khera",
    state: "Delhi",
    district: "New Delhi",
    category: "Community Infrastructure",
    riskScore: 87,
    risk_score: 87,
    primaryIssue: "Premature fund disbursement (88%) with reused site foundation photo and structural lag.",
    primary_issue: "Premature fund disbursement (88%) with reused site foundation photo and structural lag.",
    priority: "urgent",
    status: "under_review",
    summary: "Automated surveillance flagged severe 36% progress gap between treasury release (₹30.80 L) and field execution (52%), combined with image reuse.",
    assignedTo: {
      id: "OFFICER-001",
      name: "Shri Rajesh Verma",
      role: "Senior Audit Officer, MoSPI",
      email: "r.verma.audit@gov.in",
    },
    assigned_to: {
      id: "OFFICER-001",
      name: "Shri Rajesh Verma",
      role: "Senior Audit Officer, MoSPI",
      email: "r.verma.audit@gov.in",
    },
    openedAt: "2026-02-18T10:30:00Z",
    opened_at: "2026-02-18T10:30:00Z",
    updatedAt: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: [
      {
        id: "NOTE-01",
        authorId: "OFFICER-001",
        authorName: "Shri Rajesh Verma",
        authorRole: "Senior Audit Officer",
        content: "Verified treasury ledger voucher #02 against physical inspection log. Notice issued to DSIIDC Executive Engineer requesting fresh geotagged site video.",
        createdAt: "2026-02-20T11:15:00Z",
        linkedEvidenceIds: ["EVD-IMG-001", "EVD-PAY-001"],
      },
    ],
    activityLogs: [
      {
        id: "LOG-01",
        timestamp: "2026-02-18T10:30:00Z",
        actor: "Sentinel Surveillance Engine",
        action: "Automated Case Triggered",
        details: "Composite risk score 87/100 exceeded mandatory audit threshold (>75).",
      },
    ],
    evidenceChain: [
      { step: "risk", title: "Surveillance Threshold Trigger", subtitle: "Composite Risk: 87 / 100", status: "flagged", details: "Surveillance algorithm detected 5 correlated anomaly vectors." },
      { step: "signal", title: "Financial Velocity Mismatch", subtitle: "88% Disbursed vs 52% Executed", status: "flagged", details: "PFMS disbursement pace exceeds physical certification." },
      { step: "evidence", title: "Foundation Site Photo", subtitle: "EVD-IMG-001", status: "conflict", details: "Perceptual Hash similarity 99.4% with March 2024 archive photo." },
    ],
  },
];

const FALLBACK_NATIONAL_ANALYTICS = {
  id: "national_summary",
  totalWorksMonitored: 45806,
  total_works_monitored: 45806,
  totalSanctionedCr: 4820.5,
  total_sanctioned_cr: 4820.5,
  totalExpenditureCr: 3714.8,
  total_expenditure_cr: 3714.8,
  totalDisbursedCr: 3714.8,
  total_disbursed_cr: 3714.8,
  totalFlaggedRiskValueCr: 42.8,
  total_flagged_risk_value_cr: 42.8,
  highRiskCount: 127,
  criticalRiskCount: 34,
  flaggedValueCr: 42.8,
  riskCounts: { critical: 34, high: 127, medium: 1842, low: 43803 },
  risk_counts: { critical: 34, high: 127, medium: 1842, low: 43803 },
  riskDistribution: {
    low: 43803,
    medium: 1842,
    high: 127,
    critical: 34,
  },
  monthlyTrends: [
    { month: "Sep 2025", screenedWorks: 31200, flaggedAnomalies: 48, avgRiskScore: 24.2 },
    { month: "Oct 2025", screenedWorks: 35400, flaggedAnomalies: 62, avgRiskScore: 26.5 },
    { month: "Nov 2025", screenedWorks: 38900, flaggedAnomalies: 79, avgRiskScore: 28.1 },
    { month: "Dec 2025", screenedWorks: 41200, flaggedAnomalies: 95, avgRiskScore: 30.4 },
    { month: "Jan 2026", screenedWorks: 43500, flaggedAnomalies: 114, avgRiskScore: 31.8 },
    { month: "Feb 2026", screenedWorks: 44800, flaggedAnomalies: 138, avgRiskScore: 33.2 },
    { month: "Mar 2026", screenedWorks: 45400, flaggedAnomalies: 152, avgRiskScore: 34.0 },
    { month: "Apr 2026", screenedWorks: 45806, flaggedAnomalies: 161, avgRiskScore: 34.8 },
  ],
  riskTrend7D: [
    { date: "22 Feb", critical: 31, high: 120, medium: 830 },
    { date: "23 Feb", critical: 32, high: 122, medium: 835 },
    { date: "24 Feb", critical: 33, high: 124, medium: 838 },
    { date: "25 Feb", critical: 32, high: 125, medium: 840 },
    { date: "26 Feb", critical: 34, high: 126, medium: 841 },
    { date: "27 Feb", critical: 34, high: 127, medium: 842 },
    { date: "28 Feb", critical: 34, high: 127, medium: 842 },
  ],
  categoryBreakdown: [
    { category: "Community Infrastructure", count: 4820, flaggedCount: 47, avgRisk: 38.2 },
    { category: "Roads, Pathways & Bridges", count: 4310, flaggedCount: 38, avgRisk: 35.1 },
    { category: "Drinking Water & Sanitation", count: 3120, flaggedCount: 29, avgRisk: 31.4 },
    { category: "Renewable Energy & Lighting", count: 2450, flaggedCount: 24, avgRisk: 33.8 },
    { category: "Education & Child Welfare", count: 2110, flaggedCount: 14, avgRisk: 22.6 },
  ],
};

const FALLBACK_STATE_METRICS = [
  { state: "Delhi", totalWorks: 412, totalSanctionedCr: 128.5, totalExpenditureCr: 94.2, highRiskWorks: 12, criticalWorks: 4, averageRiskScore: 42.1, primaryRiskFactor: "Milestone Discrepancies & Photo Reuse" },
  { state: "Uttar Pradesh", totalWorks: 2840, totalSanctionedCr: 812.0, totalExpenditureCr: 618.5, highRiskWorks: 48, criticalWorks: 14, averageRiskScore: 38.6, primaryRiskFactor: "Cost Deviation & Solar Lighting Unit Markup" },
  { state: "Karnataka", totalWorks: 1540, totalSanctionedCr: 410.2, totalExpenditureCr: 330.4, highRiskWorks: 18, criticalWorks: 6, averageRiskScore: 31.4, primaryRiskFactor: "Delayed Completion Handover" },
  { state: "Maharashtra", totalWorks: 2190, totalSanctionedCr: 590.0, totalExpenditureCr: 472.0, highRiskWorks: 24, criticalWorks: 5, averageRiskScore: 29.8, primaryRiskFactor: "Geographic Duplicate Overlap" },
];

const FALLBACK_GEO_POINTS = [
  { id: "GEO-01", projectId: "MPL-004821", projectTitle: "Village Khera Community Hall", state: "Delhi", district: "New Delhi", latitude: 28.5832, longitude: 77.1645, riskScore: 87, riskLevel: "critical", primarySignal: "36% Progress Gap + Image Reuse", sanctionedAmount: 3500000, category: "Community Infrastructure" },
  { id: "GEO-02", projectId: "MPL-004822", projectTitle: "Village Khera Ext Community Centre", state: "Delhi", district: "New Delhi", latitude: 28.5865, longitude: 77.168, riskScore: 76, riskLevel: "high", primarySignal: "Spatial Overlap (<450m)", sanctionedAmount: 3800000, category: "Community Infrastructure" },
  { id: "GEO-03", projectId: "MPL-005104", projectTitle: "50 Solar High-Mast Lights", state: "Uttar Pradesh", district: "Varanasi", latitude: 25.3176, longitude: 82.9739, riskScore: 79, riskLevel: "high", primarySignal: "CPPP Price Markup +40.6%", sanctionedAmount: 4500000, category: "Renewable Energy & Lighting" },
];

// Helper to normalize Supabase project record
function normalizeProject(p) {
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    state: p.state,
    district: p.district,
    constituency: p.constituency,
    mpName: p.mp_name || p.mpName,
    mpHouse: p.mp_house || p.mpHouse || "Lok Sabha",
    implementingAgency: p.implementing_agency || p.implementingAgency,
    status: p.status,
    financials: p.financials || {},
    financialProgress: p.financial_progress !== undefined ? p.financial_progress : p.financialProgress || 0,
    physicalProgress: p.physical_progress !== undefined ? p.physical_progress : p.physicalProgress || 0,
    dates: p.dates || {},
    gpsCoordinates: p.gps_coordinates || p.gpsCoordinates || {},
    risk: p.risk || { score: 0, level: "low", primarySignal: "", breakdown: {}, reasons: [] },
    milestones: p.milestones || [],
    investigationCaseId: p.investigation_case_id || p.investigationCaseId || null,
    createdAt: p.created_at || p.createdAt,
    updatedAt: p.updated_at || p.updatedAt,
  };
}

// Helper to normalize Supabase investigation record
function normalizeInvestigation(inv) {
  if (!inv) return null;
  return {
    id: inv.id,
    projectId: inv.project_id || inv.projectId,
    projectTitle: inv.project_title || inv.projectTitle,
    state: inv.state,
    district: inv.district,
    category: inv.category,
    riskScore: inv.risk_score !== undefined ? inv.risk_score : inv.riskScore,
    primaryIssue: inv.primary_issue || inv.primaryIssue,
    priority: inv.priority,
    status: inv.status,
    summary: inv.summary,
    assignedTo: inv.assigned_to || inv.assignedTo || {},
    openedAt: inv.opened_at || inv.openedAt,
    updatedAt: inv.updated_at || inv.updatedAt,
    closedAt: inv.closed_at || inv.closedAt,
    notes: inv.notes || [],
    activityLogs: inv.activity_logs || inv.activityLogs || [],
    evidenceChain: inv.evidence_chain || inv.evidenceChain || [],
  };
}

// Helper to normalize Supabase evidence record
function normalizeEvidence(e) {
  if (!e) return null;
  return {
    id: e.id,
    projectId: e.project_id || e.projectId,
    projectTitle: e.project_title || e.projectTitle,
    type: e.type,
    title: e.title,
    status: e.status,
    fileUrl: e.file_url || e.fileUrl,
    thumbnailUrl: e.thumbnail_url || e.thumbnailUrl,
    fileSize: e.file_size || e.fileSize,
    mimeType: e.mime_type || e.mimeType,
    provenance: e.provenance || {},
    metadata: e.metadata || {},
    extractedFields: e.extracted_fields || e.extractedFields || [],
    findings: e.findings || [],
    comparisonEvidenceId: e.comparison_evidence_id || e.comparisonEvidenceId,
    comparisonSimilarityPercent: e.comparison_similarity_percent !== undefined ? e.comparison_similarity_percent : e.comparisonSimilarityPercent,
    createdAt: e.created_at || e.createdAt,
    updatedAt: e.updated_at || e.updatedAt,
  };
}

const supabaseService = {
  // --- PROJECTS ---
  async getProjects(filters = {}) {
    if (isConfigured && supabase) {
      try {
        let query = supabase.from("projects").select("*", { count: "exact" });

        if (filters.state && filters.state !== "all") query = query.ilike("state", filters.state);
        if (filters.district && filters.district !== "all") query = query.ilike("district", filters.district);
        if (filters.category && filters.category !== "all") query = query.eq("category", filters.category);
        if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);

        if (filters.search) {
          query = query.or(`id.ilike.%${filters.search}%,title.ilike.%${filters.search}%,district.ilike.%${filters.search}%,mp_name.ilike.%${filters.search}%`);
        }

        const limit = filters.limit || 20;
        const page = filters.page || 1;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, count, error } = await query.range(from, to).order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return { projects: data.map(normalizeProject), total: count || data.length };
        }
      } catch (err) {
        console.warn("[SupabaseService getProjects Warning]", err.message);
      }
    }

    // Fallback in-memory
    let list = [...FALLBACK_PROJECTS];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((p) => p.id.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.district.toLowerCase().includes(q));
    }
    if (filters.state && filters.state !== "all") list = list.filter((p) => p.state.toLowerCase() === filters.state.toLowerCase());
    if (filters.district && filters.district !== "all") list = list.filter((p) => p.district.toLowerCase() === filters.district.toLowerCase());
    if (filters.category && filters.category !== "all") list = list.filter((p) => p.category === filters.category);
    if (filters.riskLevel && filters.riskLevel !== "all") list = list.filter((p) => p.risk?.level === filters.riskLevel);
    if (filters.status && filters.status !== "all") list = list.filter((p) => p.status === filters.status);

    // Strict Role-Based Access Control (RBAC) & Jurisdictional Data Scoping
    if (filters.userRole) {
      if (filters.userRole === "field_verification_officer") {
        list = list.filter((p) => (p.district || "").toLowerCase() === "new delhi" || p.id === "MPL-004821" || p.id === "MPL-004822");
      } else if (filters.userRole === "implementing_agency") {
        list = list.filter((p) => (p.implementingAgency || "").toLowerCase().includes("dsiidc") || p.id === "MPL-004821" || p.id === "MPL-004822");
      } else if (filters.userRole === "mp") {
        list = list.filter((p) => (p.district || "").toLowerCase() === "new delhi" || (p.constituency || "").toLowerCase().includes("new delhi"));
      } else if (filters.userRole === "state_nodal_authority") {
        list = list.filter((p) => (p.state || "").toLowerCase() === "rajasthan" || (p.state || "").toLowerCase() === (filters.state || "").toLowerCase());
      } else if (filters.userRole === "investigator") {
        list = list.filter((p) => (p.risk?.score ?? 0) >= 50 || p.investigationCaseId);
      }
    }

    return { projects: list.map(normalizeProject), total: list.length };
  },

  async getProjectById(id) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
        if (!error && data) return normalizeProject(data);
      } catch (err) {
        console.warn("[SupabaseService getProjectById Warning]", err.message);
      }
    }
    const item = FALLBACK_PROJECTS.find((p) => p.id === id);
    return item ? normalizeProject(item) : null;
  },

  // --- INVESTIGATIONS ---
  async getInvestigations(filters = {}) {
    if (isConfigured && supabase) {
      try {
        let query = supabase.from("investigations").select("*");
        if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);
        if (filters.priority && filters.priority !== "all") query = query.eq("priority", filters.priority);
        if (filters.projectId) query = query.eq("project_id", filters.projectId);

        const { data, error } = await query.order("updated_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(normalizeInvestigation);
        }
      } catch (err) {
        console.warn("[SupabaseService getInvestigations Warning]", err.message);
      }
    }
    let list = [...FALLBACK_INVESTIGATIONS];
    // RBAC: Implementing Agencies and MPs cannot view confidential vigilance inquiry dossiers
    if (filters.userRole === "mp" || filters.userRole === "implementing_agency") {
      return [];
    }
    if (filters.userRole === "field_verification_officer") {
      list = list.filter((i) => i.status === "evidence_requested" || (i.district || "").toLowerCase() === "new delhi");
    }
    if (filters.status && filters.status !== "all") list = list.filter((i) => i.status === filters.status);
    if (filters.priority && filters.priority !== "all") list = list.filter((i) => i.priority === filters.priority);
    if (filters.projectId) list = list.filter((i) => i.projectId === filters.projectId);
    return list.map(normalizeInvestigation);
  },

  async getInvestigationById(id) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("investigations").select("*").eq("id", id).single();
        if (!error && data) return normalizeInvestigation(data);
      } catch (err) {
        console.warn("[SupabaseService getInvestigationById Warning]", err.message);
      }
    }
    const item = FALLBACK_INVESTIGATIONS.find((i) => i.id === id);
    return item ? normalizeInvestigation(item) : null;
  },

  async createInvestigation(caseData) {
    if (isConfigured && supabase) {
      try {
        const row = {
          id: caseData.id,
          project_id: caseData.projectId,
          project_title: caseData.projectTitle,
          state: caseData.state,
          district: caseData.district,
          category: caseData.category,
          risk_score: caseData.riskScore,
          primary_issue: caseData.primaryIssue,
          priority: caseData.priority || "high",
          status: caseData.status || "new",
          summary: caseData.summary,
          assigned_to: caseData.assignedTo || {},
          notes: caseData.notes || [],
          activity_logs: caseData.activityLogs || [],
          evidence_chain: caseData.evidenceChain || [],
          opened_at: caseData.openedAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from("investigations").insert(row).select().single();
        if (!error && data) {
          // Link to project
          await supabase.from("projects").update({ investigation_case_id: caseData.id }).eq("id", caseData.projectId);
          return normalizeInvestigation(data);
        }
      } catch (err) {
        console.warn("[SupabaseService createInvestigation Warning]", err.message);
      }
    }

    // In-memory create
    FALLBACK_INVESTIGATIONS.unshift(caseData);
    return normalizeInvestigation(caseData);
  },

  async updateInvestigation(id, updates) {
    if (isConfigured && supabase) {
      try {
        const payload = { ...updates, updated_at: new Date().toISOString() };
        const { data, error } = await supabase.from("investigations").update(payload).eq("id", id).select().single();
        if (!error && data) return normalizeInvestigation(data);
      } catch (err) {
        console.warn("[SupabaseService updateInvestigation Warning]", err.message);
      }
    }

    const idx = FALLBACK_INVESTIGATIONS.findIndex((i) => i.id === id);
    if (idx !== -1) {
      FALLBACK_INVESTIGATIONS[idx] = { ...FALLBACK_INVESTIGATIONS[idx], ...updates, updatedAt: new Date().toISOString() };
      return normalizeInvestigation(FALLBACK_INVESTIGATIONS[idx]);
    }
    return null;
  },

  // --- EVIDENCE ---
  async getEvidence(filters = {}) {
    if (isConfigured && supabase) {
      try {
        let query = supabase.from("evidence").select("*");
        if (filters.projectId) query = query.eq("project_id", filters.projectId);
        if (filters.type && filters.type !== "all") query = query.eq("type", filters.type);
        if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);

        const { data, error } = await query.order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(normalizeEvidence);
        }
      } catch (err) {
        console.warn("[SupabaseService getEvidence Warning]", err.message);
      }
    }
    let list = [...FALLBACK_EVIDENCE];
    // RBAC: Data scoping for Evidence Repository
    if (filters.userRole) {
      if (filters.userRole === "field_verification_officer") {
        list = list.filter((e) => e.type === "image");
      } else if (filters.userRole === "implementing_agency") {
        list = list.filter((e) => e.type === "document" || e.type === "invoice" || e.type === "payment");
      } else if (filters.userRole === "investigator") {
        list = list.filter((e) => e.status === "conflict" || e.status === "flagged" || (e.findings && e.findings.length > 0));
      }
    }
    if (filters.projectId) list = list.filter((e) => e.projectId === filters.projectId);
    if (filters.type && filters.type !== "all") list = list.filter((e) => e.type === filters.type);
    if (filters.status && filters.status !== "all") list = list.filter((e) => e.status === filters.status);
    return list.map(normalizeEvidence);
  },

  async getEvidenceById(id) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("evidence").select("*").eq("id", id).single();
        if (!error && data) return normalizeEvidence(data);
      } catch (err) {
        console.warn("[SupabaseService getEvidenceById Warning]", err.message);
      }
    }
    const item = FALLBACK_EVIDENCE.find((e) => e.id === id);
    return item ? normalizeEvidence(item) : null;
  },

  // --- ANALYTICS ---
  async getNationalAnalytics() {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("national_analytics").select("*").eq("id", "national_summary").single();
        if (!error && data) {
          return {
            totalWorksMonitored: data.total_works_monitored || FALLBACK_NATIONAL_ANALYTICS.totalWorksMonitored,
            totalSanctionedCr: data.total_sanctioned_cr || FALLBACK_NATIONAL_ANALYTICS.totalSanctionedCr,
            totalExpenditureCr: data.total_expenditure_cr || data.total_disbursed_cr || FALLBACK_NATIONAL_ANALYTICS.totalExpenditureCr,
            totalDisbursedCr: data.total_disbursed_cr || FALLBACK_NATIONAL_ANALYTICS.totalDisbursedCr,
            totalFlaggedRiskValueCr: data.total_flagged_risk_value_cr || FALLBACK_NATIONAL_ANALYTICS.totalFlaggedRiskValueCr,
            highRiskCount: data.high_risk_count || (data.risk_counts?.high) || FALLBACK_NATIONAL_ANALYTICS.highRiskCount,
            criticalRiskCount: data.critical_risk_count || (data.risk_counts?.critical) || FALLBACK_NATIONAL_ANALYTICS.criticalRiskCount,
            flaggedValueCr: data.total_flagged_risk_value_cr || FALLBACK_NATIONAL_ANALYTICS.flaggedValueCr,
            riskCounts: data.risk_counts || FALLBACK_NATIONAL_ANALYTICS.riskCounts,
            riskDistribution: data.risk_distribution && !Array.isArray(data.risk_distribution) ? data.risk_distribution : FALLBACK_NATIONAL_ANALYTICS.riskDistribution,
            monthlyTrends: data.monthly_trends || data.monthlyTrends || FALLBACK_NATIONAL_ANALYTICS.monthlyTrends,
            riskTrend7D: data.risk_trend_7d || FALLBACK_NATIONAL_ANALYTICS.riskTrend7D,
            categoryBreakdown: data.category_breakdown || FALLBACK_NATIONAL_ANALYTICS.categoryBreakdown,
          };
        }
      } catch (err) {
        console.warn("[SupabaseService getNationalAnalytics Warning]", err.message);
      }
    }
    return FALLBACK_NATIONAL_ANALYTICS;
  },

  async getStateMetrics() {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("state_metrics").select("*").order("critical_works", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            state: d.state,
            totalWorks: d.total_works,
            totalSanctionedCr: d.total_sanctioned_cr,
            totalExpenditureCr: d.total_expenditure_cr,
            highRiskWorks: d.high_risk_works,
            criticalWorks: d.critical_works,
            averageRiskScore: d.average_risk_score,
            primaryRiskFactor: d.primary_risk_factor,
          }));
        }
      } catch (err) {
        console.warn("[SupabaseService getStateMetrics Warning]", err.message);
      }
    }
    return FALLBACK_STATE_METRICS;
  },

  async getGeographicRiskPoints() {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("geographic_risk_points").select("*");
        if (!error && data && data.length > 0) {
          return data.map((p) => ({
            id: p.id,
            projectId: p.project_id,
            projectTitle: p.project_title,
            state: p.state,
            district: p.district,
            latitude: p.latitude,
            longitude: p.longitude,
            riskScore: p.risk_score,
            riskLevel: p.risk_level,
            primarySignal: p.primary_signal,
            sanctionedAmount: p.sanctioned_amount,
            category: p.category,
          }));
        }
      } catch (err) {
        console.warn("[SupabaseService getGeographicRiskPoints Warning]", err.message);
      }
    }
    return FALLBACK_GEO_POINTS;
  },

  // --- PROFILES & AUTH ---
  async getProfileById(userId) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn("[SupabaseService getProfileById Warning]", err.message);
      }
    }
    return {
      id: userId,
      email: "r.verma.audit@gov.in",
      full_name: "Shri Rajesh Verma",
      role: "mospi_officer",
      department: "National Audit Wing (MoSPI)",
      designation: "Senior Audit Officer",
    };
  },
};

module.exports = supabaseService;
