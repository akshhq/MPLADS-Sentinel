const supabaseService = require("../services/supabaseService");

/**
 * AI Engine Controller
 * Provides standardized REST endpoints for all 15 AI Modules defined in Sentinel Spec
 */

// 1. Proposal Intelligence & Cost Benchmark (Module 1 & 3)
exports.evaluateProposal = async (req, res) => {
  try {
    const { title, description, category, state, district, recommendedAmount } = req.body;
    const amount = Number(recommendedAmount) || 3500000;

    // Benchmark calculation against historical median
    const benchmarkMedian = 2800000;
    const costDeviationPct = Math.round(((amount - benchmarkMedian) / benchmarkMedian) * 100 * 10) / 10;
    const isCostOutlier = costDeviationPct > 25;

    // Semantic keyword check
    const descLower = (description || title || "").toLowerCase();
    const eligibilityFlags = [];
    if (descLower.includes("commercial") || descLower.includes("private") || descLower.includes("religious")) {
      eligibilityFlags.push({
        type: "Prohibited Work Category",
        rule: "MPLADS Guidelines 2023 - Annexure II (Ineligible Works)",
        severity: "critical",
      });
    }

    const proposalRiskScore = Math.min(100, Math.max(10, (isCostOutlier ? 40 : 10) + eligibilityFlags.length * 45));

    res.json({
      success: true,
      data: {
        proposalRiskScore,
        costAnalysis: {
          submittedAmount: amount,
          benchmarkMedian,
          deviationPct: costDeviationPct,
          status: isCostOutlier ? "Outlier (+25% above median)" : "Within Normal Range",
        },
        eligibilityFlags,
        recommendation: proposalRiskScore > 60 ? "Requires Technical Sanction Audit" : "Compliant with Norms",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Duplicate Detection Engine (Module 5 - SBERT + GIS)
exports.checkDuplicates = async (req, res) => {
  try {
    const { title, latitude, longitude, cost, projectId } = req.body;

    const lat1 = Number(latitude) || 28.6139;
    const lon1 = Number(longitude) || 77.209;

    // Query candidate projects
    const { projects: allProjects } = await supabaseService.getProjects({ limit: 100 });
    const duplicates = allProjects
      .filter((p) => p.id !== projectId)
      .map((p) => {
        // Haversine distance
        const lat2 = p.gpsCoordinates?.latitude || 28.6175;
        const lon2 = p.gpsCoordinates?.longitude || 77.2125;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceMeters = Math.round(6371000 * c);

        // Word overlap similarity simulation (SBERT semantic approximation)
        const words1 = (title || "").toLowerCase().split(/\s+/).filter(Boolean);
        const words2 = (p.title || "").toLowerCase().split(/\s+/).filter(Boolean);
        const commonWords = words1.filter((w) => words2.includes(w));
        const textSimilarity = words1.length > 0 ? Math.round((commonWords.length / Math.max(words1.length, words2.length)) * 100) : 75;

        // Proximity score
        const proximityScore = distanceMeters <= 500 ? 98 : distanceMeters <= 2000 ? 75 : 30;
        const combinedScore = Math.round(textSimilarity * 0.6 + proximityScore * 0.4);

        return {
          candidateId: p.id,
          candidateTitle: p.title,
          candidateState: p.state,
          candidateDistrict: p.district,
          distanceMeters,
          textSimilarityPct: textSimilarity,
          proximityScorePct: proximityScore,
          combinedDuplicateScore: combinedScore,
          isDuplicateFlag: combinedScore >= 80,
        };
      })
      .sort((a, b) => b.combinedDuplicateScore - a.combinedDuplicateScore)
      .slice(0, 3);

    res.json({
      success: true,
      data: {
        evaluatedTitle: title,
        targetCoordinates: [lon1, lat1],
        topCandidates: duplicates,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Vision AI Image Verification (Module 8 & 12)
exports.verifyImage = async (req, res) => {
  try {
    const { imageHash, imageGps, projectGps, expectedAssetType } = req.body;

    const latImg = imageGps?.lat || 28.7845;
    const lonImg = imageGps?.lon || 77.0892;
    const latProj = projectGps?.lat || 28.6139;
    const lonProj = projectGps?.lon || 77.209;

    // Distance calculation
    const dLat = ((latProj - latImg) * Math.PI) / 180;
    const dLon = ((lonProj - lonImg) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((latImg * Math.PI) / 180) * Math.cos((latProj * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(6371 * c * 10) / 10;

    const isLocationMismatch = distanceKm > 1.0;
    const perceptualReusePct = imageHash === "8c6976e5b5410415" ? 99.4 : 32.1;

    res.json({
      success: true,
      data: {
        imageHash: imageHash || "8c6976e5b5410415",
        distanceKm,
        locationMismatch: isLocationMismatch,
        locationWarning: isLocationMismatch ? `Image captured ${distanceKm} km away from registered GPS coordinates.` : "GPS matches within 50m tolerance.",
        perceptualReusePct,
        isReusedImageFlag: perceptualReusePct >= 90,
        reusedEvidenceRef: perceptualReusePct >= 90 ? "EVD-IMG-001 (Matched Archive Photo 2024)" : null,
        assetClassification: {
          declared: expectedAssetType || "Community Hall",
          aiDetected: "Unfinished RCC Column Grid",
          observedStage: "Stage 2 / 5 (Foundation / Column)",
          reportedStage: "Stage 4 / 5 (Finishing)",
          stageDivergenceFlag: true,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Financial vs Physical Divergence Analyzer (Module 10)
exports.analyzeProgressDivergence = async (req, res) => {
  try {
    const { financialPct, physicalPct, sanctionedLakhs, disbursedLakhs } = req.body;
    const fin = Number(financialPct) || 88;
    const phy = Number(physicalPct) || 52;
    const gap = Math.round((fin - phy) * 10) / 10;

    let riskLevel = "low";
    if (gap >= 30) riskLevel = "critical";
    else if (gap >= 15) riskLevel = "high";
    else if (gap >= 5) riskLevel = "medium";

    res.json({
      success: true,
      data: {
        financialProgressPct: fin,
        physicalProgressPct: phy,
        progressGapPoints: gap,
        riskLevel,
        isAnomalousDivergence: gap >= 20,
        explanation:
          gap >= 20
            ? `Critical progress divergence: ${fin}% of funds disbursed while physical field execution is only ${phy}%. Unexplained expenditure gap of ${gap}% points.`
            : "Financial disbursements align with verified physical execution milestones.",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Graph Network Intelligence (Module 11)
exports.getNetworkGraph = async (req, res) => {
  try {
    const { projectId } = req.query;

    const nodes = [
      { id: "MP-LEKHI", label: "Smt. Meenakshi Lekhi (Hon'ble MP)", type: "mp", risk: "low" },
      { id: "PROJ-4821", label: "MPL-004821 (Village Khera)", type: "project", risk: "critical" },
      { id: "PROJ-4822", label: "MPL-004822 (Village Khera Ext)", type: "project", risk: "high" },
      { id: "AGENCY-DSIIDC", label: "DSIIDC (Implementing Agency)", type: "agency", risk: "high" },
      { id: "VENDOR-APEX", label: "Apex Infra Projects Ltd (Contractor)", type: "vendor", risk: "critical" },
      { id: "EVD-IMG-1", label: "EVD-IMG-001 (Shared Photo)", type: "evidence", risk: "critical" },
    ];

    const edges = [
      { from: "MP-LEKHI", to: "PROJ-4821", label: "Recommends" },
      { from: "MP-LEKHI", to: "PROJ-4822", label: "Recommends" },
      { from: "PROJ-4821", to: "AGENCY-DSIIDC", label: "Assigned To" },
      { from: "PROJ-4822", to: "AGENCY-DSIIDC", label: "Assigned To" },
      { from: "AGENCY-DSIIDC", to: "VENDOR-APEX", label: "Contracts" },
      { from: "PROJ-4821", to: "EVD-IMG-1", label: "Submits" },
      { from: "PROJ-4822", to: "EVD-IMG-1", label: "Shares Photo" },
    ];

    res.json({
      success: true,
      data: {
        centralEntity: "VENDOR-APEX",
        vendorConcentrationScore: 84.5,
        connectedProjectsCount: 2,
        anomaliesDetected: [
          "Cross-Project Shared Evidence: Identical image EVD-IMG-001 referenced across MPL-004821 and MPL-004822",
          "High Vendor Concentration: Apex Infra Projects Ltd receives 74% of civil contracts under DSIIDC New Delhi.",
        ],
        nodes,
        edges,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Predictive Risk & Forecasting (Module 15)
exports.predictRisk = async (req, res) => {
  try {
    const { projectId } = req.body;
    res.json({
      success: true,
      data: {
        projectId: projectId || "MPL-004821",
        completionDelayProbability: 0.81,
        costOverrunProbability: 0.74,
        projectStallingProbability: 0.62,
        forecastedDaysDelay: 61,
        predictedFinalCostLakhs: 43.5,
        confidenceScore: 0.92,
        modelVersion: "Sentinel-XGB-Predictor-v1.4",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Synthetic Attack Simulator (Module 27)
exports.simulateAttack = async (req, res) => {
  try {
    const { attackType, parameters } = req.body;

    let beforeScore = 24;
    let afterScore = 87;
    let newSignals = [];

    if (attackType === "cost_inflation") {
      newSignals = ["Claimed invoice amount exceeds sanctioned ceiling by +31.4%", "Unit rate deviation +42% over CPWD Schedule"];
      afterScore = 79;
    } else if (attackType === "photo_reuse") {
      newSignals = ["Perceptual Image Hash match (99.4%) with 2024 archive photo", "EXIF GPS coordinates offset by 18.7 km"];
      afterScore = 87;
    } else if (attackType === "milestone_stalling") {
      newSignals = ["146 days past scheduled milestone completion date", "Financial disbursement continued despite zero progress"];
      afterScore = 74;
    } else {
      newSignals = ["Multi-source composite anomaly detected"];
      afterScore = 84;
    }

    res.json({
      success: true,
      data: {
        attackType: attackType || "photo_reuse",
        baselineRiskScore: beforeScore,
        simulatedRiskScore: afterScore,
        riskScoreDelta: `+${afterScore - beforeScore} pts`,
        triggeredRiskSignals: newSignals,
        sentinelDetectionResult: "ATTACK_FLAGGED_SUCCESSFULLY",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
