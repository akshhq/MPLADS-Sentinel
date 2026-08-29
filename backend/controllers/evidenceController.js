const supabaseService = require("../services/supabaseService");

// GET /api/evidence
exports.getEvidence = async (req, res) => {
  try {
    const { projectId, type, status, search } = req.query;
    const items = await supabaseService.getEvidence({ projectId, type, status, search });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/evidence/:id
exports.getEvidenceById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await supabaseService.getEvidenceById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: `Evidence ${id} not found.` });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
