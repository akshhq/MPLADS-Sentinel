const { supabase, isConfigured } = require("../config/supabase");
const supabaseService = require("../services/supabaseService");

/**
 * Middleware to authenticate requests via Supabase JWT
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Demo / Mock header support for testing environments
      const demoRole = req.headers["x-demo-role"] || req.headers["x-user-role"];
      if (demoRole) {
        req.user = {
          id: `demo-${demoRole}`,
          email: `${demoRole}@mplads-sentinel.gov.in`,
          role: demoRole,
          isDemo: true,
        };
        req.profile = {
          id: req.user.id,
          email: req.user.email,
          full_name: demoRole === "mospi_officer" ? "Shri Rajesh Verma" : demoRole === "district_magistrate" ? "District Collector (New Delhi)" : "Auditor User",
          role: demoRole,
          department: "MoSPI Surveillance DIID",
        };
        return next();
      }

      return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid. Please provide 'Authorization: Bearer <token>' header.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired Supabase authentication session.",
          error: error?.message,
        });
      }

      req.user = data.user;
      const profile = await supabaseService.getProfileById(data.user.id);
      req.profile = profile || {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || "citizen_auditor",
        full_name: data.user.user_metadata?.full_name || data.user.email,
      };
      return next();
    }

    // If Supabase not configured in .env, accept valid-looking JWT for local demo development
    req.user = {
      id: "demo-user-authenticated",
      email: "r.verma.audit@gov.in",
      role: "mospi_officer",
    };
    req.profile = {
      id: "demo-user-authenticated",
      email: "r.verma.audit@gov.in",
      full_name: "Shri Rajesh Verma (Senior Audit Officer)",
      role: "mospi_officer",
      department: "National Audit Wing (MoSPI)",
    };
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Authentication validation error: " + error.message });
  }
};

/**
 * Optional Auth middleware - attaches user if token is present, but doesn't block if absent
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (isConfigured && supabase) {
        const { data } = await supabase.auth.getUser(token);
        if (data?.user) {
          req.user = data.user;
          req.profile = await supabaseService.getProfileById(data.user.id);
        }
      }
    }
  } catch {
    // Ignore errors for optional auth
  }
  next();
};

/**
 * Role-based access control guard
 */
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }
    const userRole = req.profile?.role || req.user.role || "citizen_auditor";
    if (!allowedRoles.includes(userRole) && !allowedRoles.includes("*")) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${userRole}' does not have required permissions [${allowedRoles.join(", ")}].`,
      });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole,
};
