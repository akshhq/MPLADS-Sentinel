const { supabase, isConfigured } = require("../config/supabase");
const supabaseService = require("../services/supabaseService");

const OFFICIAL_ROLES = [
  {
    role: "mospi_officer",
    title: "MoSPI Senior Audit Officer",
    department: "Data Informatics and Innovation Division (DIID)",
    permissions: ["view_all", "create_investigation", "escalate_case", "freeze_disbursement", "run_synthetic_simulations", "export_data"],
  },
  {
    role: "district_magistrate",
    title: "District Magistrate / Nodal Collector",
    department: "District Administration & Planning Cell",
    permissions: ["view_district", "review_estimates", "sanction_milestone", "dispatch_inspection_team"],
  },
  {
    role: "investigator",
    title: "Field Vigilance Investigator",
    department: "State Vigilance Bureau & Technical Audit Cell",
    permissions: ["view_assigned_cases", "upload_evidence", "annotate_findings", "generate_briefs"],
  },
  {
    role: "implementing_agency",
    title: "Executing Agency Resident Engineer",
    department: "Civil Works Execution Wing (e.g. DSIIDC / CPWD)",
    permissions: ["upload_bills", "submit_milestone_photos", "view_own_works"],
  },
  {
    role: "citizen_auditor",
    title: "Public Citizen / Social Auditor",
    department: "Civil Society & Open Transparency Wing",
    permissions: ["view_public_registry", "flag_work_anomaly", "download_public_reports"],
  },
];

const DEMO_PERSONAS = [
  {
    id: "demo-mospi",
    email: "r.verma.audit@gov.in",
    full_name: "Shri Rajesh Verma",
    role: "mospi_officer",
    designation: "Senior Audit Officer",
    department: "Ministry of Statistics & Programme Implementation",
    jurisdiction: "All India (National Surveillance)",
    avatar: "RV",
  },
  {
    id: "demo-dm",
    email: "dm.newdelhi@gov.in",
    full_name: "Ms. Aruna Sundaram, IAS",
    role: "district_magistrate",
    designation: "District Magistrate & Collector",
    department: "District Administration (New Delhi)",
    jurisdiction: "New Delhi PC-04",
    avatar: "AS",
  },
  {
    id: "demo-investigator",
    email: "vigilance.delhi@gov.in",
    full_name: "Insp. Vikramaditya Singh",
    role: "investigator",
    designation: "Vigilance Officer",
    department: "Technical Vigilance Wing",
    jurisdiction: "Northern Zone",
    avatar: "VS",
  },
  {
    id: "demo-citizen",
    email: "citizen.auditor@nic.in",
    full_name: "Dr. Ananya Sharma",
    role: "citizen_auditor",
    designation: "Independent Social Auditor",
    department: "Citizen Open Governance Initiative",
    jurisdiction: "Public",
    avatar: "AS",
  },
];

// GET /api/auth/me
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "No active session." });
    }

    res.json({
      success: true,
      data: {
        user: req.user,
        profile: req.profile,
        supabaseConfigured: isConfigured,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/roles
exports.getRoles = async (req, res) => {
  try {
    res.json({
      success: true,
      count: OFFICIAL_ROLES.length,
      data: OFFICIAL_ROLES,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/personas
exports.getDemoPersonas = async (req, res) => {
  try {
    res.json({
      success: true,
      count: DEMO_PERSONAS.length,
      data: DEMO_PERSONAS,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const { full_name, department, designation, phone } = req.body;
    const updates = { full_name, department, designation, phone, updated_at: new Date().toISOString() };

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", req.user.id)
        .select()
        .single();

      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    res.json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        ...updates,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
