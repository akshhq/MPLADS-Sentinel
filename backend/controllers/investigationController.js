const supabaseService = require("../services/supabaseService");

// GET /api/investigations
exports.getInvestigations = async (req, res) => {
  try {
    const { status, priority, projectId, search } = req.query;
    const userRole = req.user?.role || req.profile?.role || req.headers["x-demo-role"] || req.headers["x-user-role"];
    const cases = await supabaseService.getInvestigations({ status, priority, projectId, search, userRole });
    res.json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/investigations/:id
exports.getInvestigationById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await supabaseService.getInvestigationById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: `Investigation case ${id} not found.` });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/investigations
exports.createInvestigation = async (req, res) => {
  try {
    const { projectId, primaryIssue, priority = "high", notes } = req.body;

    const project = await supabaseService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: `Cannot create investigation: Project ${projectId} not found.` });
    }

    const caseId = `CASE-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const actorName = req.profile?.full_name || req.user?.email || "Shri Rajesh Verma";
    const actorRole = req.profile?.designation || "Senior Audit Officer, MoSPI";

    const newCase = {
      id: caseId,
      projectId: project.id,
      projectTitle: project.title,
      state: project.state,
      district: project.district,
      category: project.category,
      riskScore: project.risk?.score || 80,
      primaryIssue: primaryIssue || project.risk?.primarySignal || "Multi-source surveillance anomaly",
      priority,
      status: "new",
      summary: `Automated investigation case opened for ${project.id}. Primary flagged reason: ${primaryIssue || project.risk?.primarySignal}`,
      assignedTo: {
        id: req.user?.id || "OFFICER-001",
        name: actorName,
        role: actorRole,
        email: req.user?.email || "r.verma.audit@gov.in",
      },
      openedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: notes
        ? [
            {
              id: `NOTE-${Date.now()}`,
              authorId: req.user?.id || "OFFICER-001",
              authorName: actorName,
              authorRole: actorRole,
              content: notes,
              createdAt: new Date().toISOString(),
              linkedEvidenceIds: (project.risk?.reasons || []).flatMap((r) => r.evidenceIds || []),
            },
          ]
        : [],
      activityLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: actorName,
          action: "Case Created",
          details: `Manual investigation initiated with priority ${priority.toUpperCase()}.`,
        },
      ],
      evidenceChain: [
        {
          step: "risk",
          title: "Multi-Source Anomaly Trigger",
          subtitle: `Composite Risk: ${project.risk?.score || 80} / 100`,
          status: "flagged",
          details: "Automated surveillance threshold exceeded.",
        },
        {
          step: "signal",
          title: "AI Detection Engine",
          subtitle: primaryIssue || project.risk?.primarySignal || "Anomaly Cluster",
          status: "flagged",
          details: "Correlated risk reasons detected across financial and execution data.",
        },
      ],
    };

    const saved = await supabaseService.createInvestigation(newCase);
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/investigations/:id/status
exports.updateInvestigationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const item = await supabaseService.getInvestigationById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: `Investigation case ${id} not found.` });
    }

    const actorName = req.profile?.full_name || req.user?.email || "Reviewing Officer";
    const activityLogs = [...(item.activityLogs || [])];
    activityLogs.push({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      action: `Status Updated to ${status.toUpperCase()}`,
      details: note || `Status transitioned to ${status}.`,
    });

    const notes = [...(item.notes || [])];
    if (note) {
      notes.push({
        id: `NOTE-${Date.now()}`,
        authorId: req.user?.id || "OFFICER-001",
        authorName: actorName,
        authorRole: req.profile?.designation || "Auditor",
        content: note,
        createdAt: new Date().toISOString(),
      });
    }

    const updated = await supabaseService.updateInvestigation(id, {
      status,
      activityLogs,
      notes,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/investigations/:id/notes
exports.addInvestigationNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, linkedEvidenceIds } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: "Note content is required." });
    }

    const item = await supabaseService.getInvestigationById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: `Investigation case ${id} not found.` });
    }

    const actorName = req.profile?.full_name || req.user?.email || "Shri Rajesh Verma";
    const actorRole = req.profile?.designation || "Senior Audit Officer";

    const newNote = {
      id: `NOTE-${Date.now()}`,
      authorId: req.user?.id || "OFFICER-001",
      authorName: actorName,
      authorRole: actorRole,
      content,
      createdAt: new Date().toISOString(),
      linkedEvidenceIds: linkedEvidenceIds || [],
    };

    const notes = [...(item.notes || []), newNote];
    const updated = await supabaseService.updateInvestigation(id, { notes });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
