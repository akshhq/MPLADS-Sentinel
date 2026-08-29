const { supabase, isConfigured } = require("../config/supabase");
const supabaseService = require("../services/supabaseService");

/**
 * 6 Core Operational User Types (per MPLADS_Sentinel_User_Types_RBAC.md)
 */
const OFFICIAL_ROLES = [
  {
    role: "mospi_officer",
    title: "MoSPI / Ministry Officer",
    department: "Data Informatics and Innovation Division (DIID), MoSPI",
    scope: "National (All India)",
    permissions: [
      "PROJECT_VIEW",
      "PROJECT_UPDATE",
      "FINANCIAL_VIEW",
      "EVIDENCE_VIEW",
      "EVIDENCE_UPLOAD",
      "EVIDENCE_VERIFY",
      "DOCUMENT_VIEW",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_VERIFY",
      "RISK_VIEW",
      "RISK_REVIEW",
      "INVESTIGATION_VIEW",
      "INVESTIGATION_CREATE",
      "INVESTIGATION_ASSIGN",
      "INVESTIGATION_UPDATE",
      "INVESTIGATION_CLOSE",
      "ANALYTICS_VIEW",
      "NATIONAL_ANALYTICS_VIEW",
      "STATE_ANALYTICS_VIEW",
      "REPORT_EXPORT",
      "AI_COPILOT_USE",
    ],
  },
  {
    role: "state_nodal_authority",
    title: "State Nodal Authority",
    department: "Department of Planning & Programme Implementation",
    scope: "State Level",
    permissions: [
      "PROJECT_VIEW",
      "PROJECT_UPDATE",
      "FINANCIAL_VIEW",
      "EVIDENCE_VIEW",
      "EVIDENCE_UPLOAD",
      "EVIDENCE_VERIFY",
      "DOCUMENT_VIEW",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_VERIFY",
      "RISK_VIEW",
      "RISK_REVIEW",
      "INVESTIGATION_VIEW",
      "INVESTIGATION_CREATE",
      "INVESTIGATION_ASSIGN",
      "INVESTIGATION_UPDATE",
      "INVESTIGATION_CLOSE",
      "ANALYTICS_VIEW",
      "STATE_ANALYTICS_VIEW",
      "REPORT_EXPORT",
      "AI_COPILOT_USE",
    ],
  },
  {
    role: "mp",
    title: "Member of Parliament (MP)",
    department: "Parliamentary Constituency Cell",
    scope: "Constituency Level",
    permissions: [
      "PROJECT_VIEW",
      "PROJECT_CREATE",
      "FINANCIAL_VIEW",
      "EVIDENCE_VIEW",
      "DOCUMENT_VIEW",
      "RISK_VIEW",
      "ANALYTICS_VIEW",
      "REPORT_EXPORT",
    ],
  },
  {
    role: "implementing_agency",
    title: "Implementing Agency",
    department: "Civil Infrastructure & Works Execution Division",
    scope: "Assigned Projects & Circle",
    permissions: [
      "PROJECT_VIEW",
      "PROJECT_UPDATE",
      "FINANCIAL_VIEW",
      "FINANCIAL_SUBMIT",
      "EVIDENCE_VIEW",
      "EVIDENCE_UPLOAD",
      "DOCUMENT_VIEW",
      "DOCUMENT_UPLOAD",
      "REPORT_EXPORT",
    ],
  },
  {
    role: "investigator",
    title: "Investigator / Audit Officer",
    department: "Technical Audit & Anti-Corruption Bureau",
    scope: "Assigned Cases & Zone",
    permissions: [
      "PROJECT_VIEW",
      "FINANCIAL_VIEW",
      "EVIDENCE_VIEW",
      "EVIDENCE_UPLOAD",
      "EVIDENCE_VERIFY",
      "DOCUMENT_VIEW",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_VERIFY",
      "RISK_VIEW",
      "RISK_REVIEW",
      "INVESTIGATION_VIEW",
      "INVESTIGATION_CREATE",
      "INVESTIGATION_UPDATE",
      "INVESTIGATION_CLOSE",
      "ANALYTICS_VIEW",
      "REPORT_EXPORT",
      "AI_COPILOT_USE",
    ],
  },
  {
    role: "field_verification_officer",
    title: "Field Verification Officer",
    department: "District Technical Inspection Wing",
    scope: "Assigned District & Site Verifications",
    permissions: [
      "PROJECT_VIEW",
      "EVIDENCE_VIEW",
      "EVIDENCE_UPLOAD",
      "EVIDENCE_VERIFY",
      "DOCUMENT_VIEW",
      "DOCUMENT_UPLOAD",
      "INVESTIGATION_VIEW",
      "INVESTIGATION_UPDATE",
      "REPORT_EXPORT",
    ],
  },
];

/**
 * 6 Official Synthetic Demo Personas (per Section 15 of RBAC Specification)
 */
const DEMO_PERSONAS = [
  {
    id: "demo-mospi-01",
    email: "ministry@mpladssentinel.demo",
    full_name: "Dr. Ananya Sharma",
    role: "mospi_officer",
    designation: "Senior Audit & Surveillance Officer",
    department: "Data Informatics & Innovation Division (DIID), MoSPI",
    jurisdiction: "All India (National Surveillance)",
    avatar: "AS",
  },
  {
    id: "demo-state-01",
    email: "state@mpladssentinel.demo",
    full_name: "Rajiv Mehta",
    role: "state_nodal_authority",
    designation: "State Nodal & Monitoring Authority",
    department: "Department of Planning & Programme Implementation",
    state: "Rajasthan",
    jurisdiction: "State of Rajasthan",
    avatar: "RM",
  },
  {
    id: "demo-mp-01",
    email: "mp@mpladssentinel.demo",
    full_name: "Hon'ble Demo MP",
    role: "mp",
    designation: "Member of Parliament (Lok Sabha)",
    department: "Parliamentary Constituency Cell",
    state: "Delhi",
    constituency: "New Delhi",
    jurisdiction: "New Delhi Parliamentary Constituency (PC-04)",
    avatar: "MP",
  },
  {
    id: "demo-agency-01",
    email: "agency@mpladssentinel.demo",
    full_name: "Er. Rajesh K. Sinha",
    role: "implementing_agency",
    designation: "Executive Resident Engineer",
    department: "Civil Infrastructure & Works Division",
    agency: "Demo Infrastructure Agency",
    state: "Rajasthan",
    district: "Jaipur",
    jurisdiction: "Jaipur Civil Circle",
    avatar: "RS",
  },
  {
    id: "demo-investigator-01",
    email: "investigator@mpladssentinel.demo",
    full_name: "Priya Verma",
    role: "investigator",
    designation: "Senior Vigilance & Audit Officer",
    department: "Technical Audit & Anti-Corruption Bureau",
    jurisdiction: "Northern Zone Vigilance Cell",
    avatar: "PV",
  },
  {
    id: "demo-field-01",
    email: "field@mpladssentinel.demo",
    full_name: "Amit Singh",
    role: "field_verification_officer",
    designation: "Field Physical Verification Officer",
    department: "District Technical Inspection Wing",
    state: "Rajasthan",
    district: "Jaipur",
    jurisdiction: "Jaipur District Field Units",
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

    const { full_name, department, designation, phone, state, district } = req.body;
    const updates = {
      full_name,
      department,
      designation,
      phone,
      jurisdiction_state: state,
      jurisdiction_district: district,
      updated_at: new Date().toISOString(),
    };

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
