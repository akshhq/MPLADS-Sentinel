const supabaseService = require("../services/supabaseService");

// GET /api/analytics/national
exports.getNationalAnalytics = async (req, res) => {
  try {
    const data = await supabaseService.getNationalAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/states
exports.getStateMetrics = async (req, res) => {
  try {
    const data = await supabaseService.getStateMetrics();
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/states/:state
exports.getStateBySlug = async (req, res) => {
  try {
    const { state } = req.params;
    const formatted = state.replace(/-/g, " ");
    const states = await supabaseService.getStateMetrics();
    const st = states.find((s) => s.state.toLowerCase() === formatted.toLowerCase());

    if (!st) {
      return res.status(404).json({ success: false, message: `State ${state} not found.` });
    }

    res.json({ success: true, data: st });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/districts
exports.getDistrictMetrics = async (req, res) => {
  try {
    const { state } = req.query;
    // Default district analytics
    const districts = [
      { district: "New Delhi", state: "Delhi", totalWorks: 142, totalSanctionedLakhs: 4850, highRiskWorks: 4, criticalWorks: 2, averageRiskScore: 48.2, delayedWorksPercent: 24.1 },
      { district: "Varanasi", state: "Uttar Pradesh", totalWorks: 310, totalSanctionedLakhs: 8920, highRiskWorks: 8, criticalWorks: 3, averageRiskScore: 44.5, delayedWorksPercent: 31.0 },
      { district: "Bengaluru Urban", state: "Karnataka", totalWorks: 198, totalSanctionedLakhs: 6420, highRiskWorks: 3, criticalWorks: 1, averageRiskScore: 32.1, delayedWorksPercent: 18.5 },
      { district: "Pune", state: "Maharashtra", totalWorks: 245, totalSanctionedLakhs: 7310, highRiskWorks: 4, criticalWorks: 1, averageRiskScore: 29.4, delayedWorksPercent: 15.2 },
    ];
    let filtered = districts;
    if (state && state !== "all") {
      filtered = filtered.filter((d) => d.state.toLowerCase() === state.toLowerCase());
    }
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/geopoints
exports.getGeographicRiskPoints = async (req, res) => {
  try {
    const data = await supabaseService.getGeographicRiskPoints();
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
