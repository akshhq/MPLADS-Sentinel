"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

/**
 * Core Operational Roles per MPLADS_Sentinel_User_Types_RBAC.md
 * (Note: Citizen/Public Auditor is intentionally excluded)
 */
export type SentinelRole =
  | "mospi_officer"
  | "state_nodal_authority"
  | "mp"
  | "implementing_agency"
  | "investigator"
  | "field_verification_officer"
  | "system_admin";

export type SentinelPermission =
  | "PROJECT_VIEW"
  | "PROJECT_CREATE"
  | "PROJECT_UPDATE"
  | "PROJECT_APPROVE"
  | "FINANCIAL_VIEW"
  | "FINANCIAL_SUBMIT"
  | "FINANCIAL_UPDATE"
  | "EVIDENCE_VIEW"
  | "EVIDENCE_UPLOAD"
  | "EVIDENCE_VERIFY"
  | "DOCUMENT_VIEW"
  | "DOCUMENT_UPLOAD"
  | "DOCUMENT_VERIFY"
  | "RISK_VIEW"
  | "RISK_REVIEW"
  | "INVESTIGATION_VIEW"
  | "INVESTIGATION_CREATE"
  | "INVESTIGATION_ASSIGN"
  | "INVESTIGATION_UPDATE"
  | "INVESTIGATION_CLOSE"
  | "ANALYTICS_VIEW"
  | "NATIONAL_ANALYTICS_VIEW"
  | "STATE_ANALYTICS_VIEW"
  | "REPORT_EXPORT"
  | "AI_COPILOT_USE";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: SentinelRole;
  department: string;
  designation: string;
  state?: string;
  district?: string;
  constituency?: string;
  agency?: string;
  jurisdiction?: string;
  avatar_url?: string;
  avatar_initials?: string;
  permissions: SentinelPermission[];
}

/**
 * Standard Role-to-Permissions Matrix (per Section 11 & 12 of RBAC Specification)
 */
export const ROLE_PERMISSIONS: Record<SentinelRole, SentinelPermission[]> = {
  mospi_officer: [
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
  state_nodal_authority: [
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
  mp: [
    "PROJECT_VIEW",
    "PROJECT_CREATE",
    "FINANCIAL_VIEW",
    "EVIDENCE_VIEW",
    "DOCUMENT_VIEW",
    "RISK_VIEW",
    "ANALYTICS_VIEW",
    "REPORT_EXPORT",
  ],
  implementing_agency: [
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
  investigator: [
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
  field_verification_officer: [
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
  system_admin: [
    "PROJECT_VIEW",
    "FINANCIAL_VIEW",
    "EVIDENCE_VIEW",
    "DOCUMENT_VIEW",
    "RISK_VIEW",
    "INVESTIGATION_VIEW",
    "ANALYTICS_VIEW",
    "NATIONAL_ANALYTICS_VIEW",
    "STATE_ANALYTICS_VIEW",
    "REPORT_EXPORT",
    "AI_COPILOT_USE",
  ],
};

/**
 * 6 Official Synthetic Demo Personas (per Section 15 of RBAC Specification)
 */
export const DEMO_PERSONAS: Record<SentinelRole, UserProfile> = {
  mospi_officer: {
    id: "demo-mospi-01",
    email: "ministry@mpladssentinel.demo",
    full_name: "Dr. Ananya Sharma",
    role: "mospi_officer",
    designation: "Senior Audit & Surveillance Officer",
    department: "Data Informatics & Innovation Division (DIID), MoSPI",
    jurisdiction: "All India (National Surveillance)",
    avatar_initials: "AS",
    permissions: ROLE_PERMISSIONS.mospi_officer,
  },
  state_nodal_authority: {
    id: "demo-state-01",
    email: "state@mpladssentinel.demo",
    full_name: "Rajiv Mehta",
    role: "state_nodal_authority",
    designation: "State Nodal & Monitoring Authority",
    department: "Department of Planning & Programme Implementation",
    state: "Rajasthan",
    jurisdiction: "State of Rajasthan",
    avatar_initials: "RM",
    permissions: ROLE_PERMISSIONS.state_nodal_authority,
  },
  mp: {
    id: "demo-mp-01",
    email: "mp@mpladssentinel.demo",
    full_name: "Hon'ble Demo MP",
    role: "mp",
    designation: "Member of Parliament (Lok Sabha)",
    department: "Parliamentary Constituency Cell",
    state: "Delhi",
    constituency: "New Delhi",
    jurisdiction: "New Delhi Parliamentary Constituency (PC-04)",
    avatar_initials: "MP",
    permissions: ROLE_PERMISSIONS.mp,
  },
  implementing_agency: {
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
    avatar_initials: "RS",
    permissions: ROLE_PERMISSIONS.implementing_agency,
  },
  investigator: {
    id: "demo-investigator-01",
    email: "investigator@mpladssentinel.demo",
    full_name: "Priya Verma",
    role: "investigator",
    designation: "Senior Vigilance & Audit Officer",
    department: "Technical Audit & Anti-Corruption Bureau",
    jurisdiction: "Northern Zone Vigilance Cell",
    avatar_initials: "PV",
    permissions: ROLE_PERMISSIONS.investigator,
  },
  field_verification_officer: {
    id: "demo-field-01",
    email: "field@mpladssentinel.demo",
    full_name: "Amit Singh",
    role: "field_verification_officer",
    designation: "Field Physical Verification Officer",
    department: "District Technical Inspection Wing",
    state: "Rajasthan",
    district: "Jaipur",
    jurisdiction: "Jaipur District Field Units",
    avatar_initials: "AS",
    permissions: ROLE_PERMISSIONS.field_verification_officer,
  },
  system_admin: {
    id: "demo-admin-01",
    email: "admin@mpladssentinel.demo",
    full_name: "System Administrator",
    role: "system_admin",
    designation: "Platform Administrator",
    department: "NIC / MoSPI Technical Team",
    jurisdiction: "Technical Administration",
    avatar_initials: "SA",
    permissions: ROLE_PERMISSIONS.system_admin,
  },
};

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  token: string | null;
  loading: boolean;
  isConfigured: boolean;
  hasPermission: (permission: SentinelPermission) => boolean;
  canAccessState: (stateName?: string) => boolean;
  canAccessDistrict: (districtName?: string) => boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithPassword: (
    email: string,
    password: string,
    metadata?: {
      full_name?: string;
      role?: SentinelRole;
      department?: string;
      designation?: string;
      state?: string;
      district?: string;
      constituency?: string;
    }
  ) => Promise<{ error: Error | null }>;
  signInDemo: (role: SentinelRole) => void;
  signOut: () => Promise<void>;
  switchPersona: (role: SentinelRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(DEMO_PERSONAS.mospi_officer); // Default MoSPI Officer
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      // 1. Check if live Supabase client exists
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            if (isMounted) {
              setSession(sessionData.session);
              setUser(sessionData.session.user);
              setToken(sessionData.session.access_token);
              fetchUserProfile(sessionData.session.user);
            }
          } else {
            loadStoredDemoPersona();
          }

          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
              if (!isMounted) return;
              setSession(newSession);
              setUser(newSession?.user || null);
              setToken(newSession?.access_token || null);
              if (newSession?.user) {
                fetchUserProfile(newSession.user);
              }
            }
          );

          return () => {
            authListener.subscription.unsubscribe();
          };
        } catch (err) {
          console.warn("[Auth Init Error]", err);
          loadStoredDemoPersona();
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        loadStoredDemoPersona();
        if (isMounted) setLoading(false);
      }
    }

    function loadStoredDemoPersona() {
      if (typeof window !== "undefined") {
        const savedRole = localStorage.getItem("mplads_demo_role") as SentinelRole | null;
        if (savedRole && DEMO_PERSONAS[savedRole]) {
          setProfile(DEMO_PERSONAS[savedRole]);
        } else {
          setProfile(DEMO_PERSONAS.mospi_officer);
        }
      }
    }

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  async function fetchUserProfile(authUser: User) {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (!error && data) {
        const role = (data.role as SentinelRole) || "mospi_officer";
        const initials = data.full_name
          ? data.full_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
          : "U";

        setProfile({
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          role,
          department: data.department || "Audit Division",
          designation: data.designation || "Officer",
          state: data.jurisdiction_state,
          district: data.jurisdiction_district,
          jurisdiction: data.jurisdiction_state
            ? `${data.jurisdiction_state}${data.jurisdiction_district ? ` - ${data.jurisdiction_district}` : ""}`
            : "National Scope",
          avatar_url: data.avatar_url,
          avatar_initials: initials,
          permissions: ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.mospi_officer,
        });
      } else {
        const meta = authUser.user_metadata || {};
        const role = (meta.role as SentinelRole) || "mospi_officer";
        const fullName = meta.full_name || authUser.email || "Officer";
        setProfile({
          id: authUser.id,
          email: authUser.email || "",
          full_name: fullName,
          role,
          department: meta.department || "MoSPI National Audit",
          designation: meta.designation || "Officer",
          state: meta.state,
          district: meta.district,
          constituency: meta.constituency,
          avatar_initials: fullName.substring(0, 2).toUpperCase(),
          permissions: ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.mospi_officer,
        });
      }
    } catch (err) {
      console.warn("[Profile Fetch Warning]", err);
    }
  }

  const hasPermission = (permission: SentinelPermission): boolean => {
    if (!profile) return false;
    return profile.permissions?.includes(permission) || false;
  };

  const canAccessState = (stateName?: string): boolean => {
    if (!profile) return false;
    if (profile.role === "mospi_officer" || profile.role === "system_admin" || profile.role === "investigator") {
      return true;
    }
    if (profile.state && stateName) {
      return profile.state.toLowerCase() === stateName.toLowerCase();
    }
    return true;
  };

  const canAccessDistrict = (districtName?: string): boolean => {
    if (!profile) return false;
    if (profile.role === "mospi_officer" || profile.role === "system_admin" || profile.role === "state_nodal_authority" || profile.role === "investigator") {
      return true;
    }
    if (profile.district && districtName) {
      return profile.district.toLowerCase() === districtName.toLowerCase();
    }
    return true;
  };

  const signInWithPassword = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      const persona =
        Object.values(DEMO_PERSONAS).find((p) => p.email.toLowerCase() === email.toLowerCase()) ||
        DEMO_PERSONAS.mospi_officer;
      setProfile(persona);
      if (typeof window !== "undefined") {
        localStorage.setItem("mplads_demo_role", persona.role);
      }
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signUpWithPassword = async (
    email: string,
    password: string,
    metadata?: {
      full_name?: string;
      role?: SentinelRole;
      department?: string;
      designation?: string;
      state?: string;
      district?: string;
      constituency?: string;
    }
  ) => {
    const assignedRole = metadata?.role || "mospi_officer";
    if (!isSupabaseConfigured || !supabase) {
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        full_name: metadata?.full_name || email.split("@")[0],
        role: assignedRole,
        department: metadata?.department || "Surveillance",
        designation: metadata?.designation || "Officer",
        state: metadata?.state,
        district: metadata?.district,
        constituency: metadata?.constituency,
        avatar_initials: (metadata?.full_name || email).substring(0, 2).toUpperCase(),
        permissions: ROLE_PERMISSIONS[assignedRole],
      };
      setProfile(newProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("mplads_demo_role", newProfile.role);
      }
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signInDemo = (role: SentinelRole) => {
    const targetPersona = DEMO_PERSONAS[role] || DEMO_PERSONAS.mospi_officer;
    setProfile(targetPersona);
    if (typeof window !== "undefined") {
      localStorage.setItem("mplads_demo_role", role);
    }
  };

  const switchPersona = (role: SentinelRole) => {
    signInDemo(role);
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setToken(null);
    setProfile(DEMO_PERSONAS.mospi_officer);
    if (typeof window !== "undefined") {
      localStorage.removeItem("mplads_demo_role");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        token,
        loading,
        isConfigured: isSupabaseConfigured,
        hasPermission,
        canAccessState,
        canAccessDistrict,
        signInWithPassword,
        signUpWithPassword,
        signInDemo,
        signOut,
        switchPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
