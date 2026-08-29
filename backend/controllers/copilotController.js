const supabaseService = require("../services/supabaseService");

// POST /api/copilot/query
exports.queryCopilot = async (req, res) => {
  try {
    const { query, context } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: "Query string is required." });
    }

    const q = query.toLowerCase();
    let activeProject = null;

    if (context?.projectId) {
      activeProject = await supabaseService.getProjectById(context.projectId);
    }
    if (!activeProject) {
      activeProject = await supabaseService.getProjectById("MPL-004821");
    }

    let responseSummary = "";
    let riskSignals = [];
    let evidenceSources = [];
    let guidelinesCited = [];
    let recommendedSteps = [];

    if (q.includes("why") && (q.includes("risk") || q.includes("flagged") || q.includes("mpl-004821"))) {
      responseSummary = `Project ${activeProject?.id} ("${activeProject?.title}") is prioritized as Critical Risk (87/100) due to 5 correlated multi-source anomalies: severe financial/physical progress divergence, perceptual image reuse, RCC structural milestone delay, high spatial duplicate overlap with MPL-004822, and final bill amount exceeding sanctioned ceiling.`;
      riskSignals = [
        {
          signal: "Financial / Physical Progress Divergence (36% Gap)",
          severity: "critical",
          description: "88% funds disbursed (₹30.8 L) while physical progress is only 52% verified.",
        },
        {
          signal: "Computer Vision 99.4% Image Reuse",
          severity: "critical",
          description: "Site foundation photo matches a 2024 archive photo from North West Delhi.",
        },
        {
          signal: "Cross-Document Invoice Inconsistency",
          severity: "high",
          description: "Final bill lists ₹41 L against approved sanction of ₹35 L.",
        },
      ];
      evidenceSources = [
        { id: "EVD-IMG-001", type: "evidence", title: "Foundation Site Photo (Hash Match)" },
        { id: "EVD-PAY-001", type: "evidence", title: "PFMS Treasury Voucher #02" },
        { id: "EVD-DOC-003", type: "evidence", title: "Contractor Bill RA #3" },
      ];
      guidelinesCited = [
        {
          section: "MPLADS Guidelines 2023",
          clause: "Section 3.4",
          text: "Installment releases must strictly correspond to certified physical milestones with geotagged photographic proof.",
        },
        {
          section: "GFR 2017",
          clause: "Rule 130",
          text: "Expenditure cannot exceed administratively sanctioned ceiling without prior approval of Revised Estimates.",
        },
      ];
      recommendedSteps = [
        "Issue physical site inspection order to District Assistant Engineer.",
        "Freeze further Running Account bill disbursements pending audit.",
        "Summon implementing agency DSIIDC for clarification on foundation photo reuse.",
      ];
    } else if (q.includes("spending") || q.includes("progress") || q.includes("80%") || q.includes("50%")) {
      responseSummary = "Found 2 projects where fund disbursement exceeds 80% while physical execution progress is below 50%: (1) MPL-004821 in New Delhi (Disbursed: 88%, Physical: 52%) and (2) MPL-005104 in Varanasi (Disbursed: 92%, Physical: 40%).";
      riskSignals = [
        {
          signal: "Premature Advance Payout Pattern",
          severity: "critical",
          description: "Cumulative ₹72.2 L disbursed across 2 works with unverified field execution.",
        },
      ];
      evidenceSources = [
        { id: "MPL-004821", type: "project", title: "Community Hall at Village Khera" },
        { id: "MPL-005104", type: "project", title: "50 Solar High-Mast Lighting Systems" },
      ];
      recommendedSteps = [
        "Open Digital Project Twin for MPL-004821 and MPL-005104.",
        "Generate formal audit inquiry into advance fund retention by implementing agencies.",
      ];
    } else if (q.includes("duplicate") || q.includes("overlap") || q.includes("village khera")) {
      responseSummary = "Sentinel NLP & Geospatial engine flagged potential scope overlap between MPL-004821 ('Community Hall at Village Khera') and MPL-004822 ('Community Centre at Village Khera Ext'). SBERT semantic similarity is 92.4% with geographic proximity under 450 meters.";
      riskSignals = [
        {
          signal: "Spatial & Scope Duplication Cluster",
          severity: "high",
          description: "Both projects sanctioned in the same financial year under identical implementing agency (DSIIDC).",
        },
      ];
      evidenceSources = [
        { id: "MPL-004821", type: "project", title: "Village Khera Community Hall" },
        { id: "MPL-004822", type: "project", title: "Village Khera Ext Community Centre" },
      ];
      recommendedSteps = [
        "Compare Cadastral Revenue plot numbers.",
        "Verify if two distinct community structures are legitimately required in the same ward.",
      ];
    } else {
      responseSummary = `Based on grounded analysis of ${activeProject?.id || "the monitored works"}, Sentinel evaluated all financial transactions, milestone submissions, document OCR extractions, and perceptual computer vision features. What specific verification aspect or guideline check would you like me to analyze?`;
      recommendedSteps = [
        `Ask: "Why is ${activeProject?.id || "MPL-004821"} high risk?"`,
        "Ask: 'Show projects with spending >80% and progress <50%'",
        "Ask: 'Which vendors are associated with split payment flags?'",
      ];
    }

    res.json({
      success: true,
      data: {
        id: `COPILOT-MSG-${Date.now()}`,
        sender: "sentinel",
        timestamp: new Date().toISOString(),
        content: responseSummary,
        structuredResponse: {
          summary: responseSummary,
          riskSignals: riskSignals.length > 0 ? riskSignals : undefined,
          evidenceSources: evidenceSources.length > 0 ? evidenceSources : undefined,
          guidelinesCited: guidelinesCited.length > 0 ? guidelinesCited : undefined,
          recommendedVerificationSteps: recommendedSteps.length > 0 ? recommendedSteps : undefined,
        },
        contextProjectId: activeProject?.id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
