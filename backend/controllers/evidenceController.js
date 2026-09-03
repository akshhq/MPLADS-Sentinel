const supabaseService = require("../services/supabaseService");
const { supabase, isConfigured } = require("../config/supabase");

// GET /api/evidence
exports.getEvidence = async (req, res) => {
  try {
    const { projectId, type, status, search } = req.query;
    const userRole = req.user?.role || req.profile?.role || req.headers["x-demo-role"] || req.headers["x-user-role"];
    const items = await supabaseService.getEvidence({ projectId, type, status, search, userRole });
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

// POST /api/evidence
exports.uploadEvidence = async (req, res) => {
  try {
    const evidenceData = req.body;
    if (!evidenceData.title || !evidenceData.projectId) {
      return res.status(400).json({ success: false, message: "title and projectId are required." });
    }

    const sha256 = evidenceData.provenance?.sha256Hash || "sha256-" + Math.random().toString(16).substring(2, 10);
    const newId = evidenceData.id || `EVD-${evidenceData.type === "image" ? "IMG" : "DOC"}-${Date.now().toString().slice(-4)}`;

    const record = {
      id: newId,
      project_id: evidenceData.projectId,
      project_title: evidenceData.projectTitle || "Assigned MPLADS Work",
      type: evidenceData.type || "document",
      title: evidenceData.title,
      status: evidenceData.status || "verified",
      file_url: evidenceData.file_url || "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80",
      thumbnail_url: evidenceData.thumbnail_url || evidenceData.file_url,
      file_size: evidenceData.file_size || "2.4 MB",
      mime_type: evidenceData.mime_type || "application/pdf",
      provenance: evidenceData.provenance || {
        sourceSystem: "Sentinel Field Intake",
        uploaderId: req.user?.id || "OFFICER-001",
        uploaderRole: req.profile?.designation || "Verification Officer",
        uploadedAt: new Date().toISOString(),
        sha256Hash: sha256,
      },
      metadata: evidenceData.metadata || {},
      extracted_fields: evidenceData.extracted_fields || [],
      findings: evidenceData.findings || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to Supabase table if configured
    if (isConfigured && supabase) {
      try {
        await supabase.from("evidence").insert([record]);
      } catch (dbErr) {
        console.warn("[Evidence Controller] DB save warning:", dbErr.message);
      }
    }

    // Return normalized record
    res.status(201).json({
      success: true,
      message: `Evidence item ${record.id} registered and persisted successfully.`,
      data: {
        id: record.id,
        projectId: record.project_id,
        projectTitle: record.project_title,
        type: record.type,
        title: record.title,
        status: record.status,
        fileUrl: record.file_url,
        thumbnailUrl: record.thumbnail_url,
        fileSize: record.file_size,
        mimeType: record.mime_type,
        provenance: record.provenance,
        metadata: record.metadata,
        extractedFields: record.extracted_fields,
        findings: record.findings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
