"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export type SentinelRole =
  | "mospi_officer"
  | "district_magistrate"
  | "investigator"
  | "implementing_agency"
  | "citizen_auditor";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: SentinelRole;
  department: string;
  designation: string;
  avatar_url?: string;
  jurisdiction?: string;
  avatar_initials?: string;
}

export const DEMO_PERSONAS: Record<SentinelRole, UserProfile> = {
  mospi_officer: {
    id: "demo-mospi-01",
    email: "r.verma.audit@gov.in",
    full_name: "Shri Rajesh Verma",
    role: "mospi_officer",
    designation: "Senior Audit Officer",
    department: "Data Informatics and Innovation Division, MoSPI",
    jurisdiction: "All India (National Surveillance)",
    avatar_initials: "RV",
  },
  district_magistrate: {
    id: "demo-dm-01",
    email: "dm.newdelhi@gov.in",
    full_name: "Ms. Aruna Sundaram, IAS",
    role: "district_magistrate",
    designation: "District Magistrate & Collector",
    department: "District Administration & Planning Cell",
    jurisdiction: "New Delhi PC-04",
    avatar_initials: "AS",
  },
  investigator: {
    id: "demo-vigilance-01",
    email: "vigilance.delhi@gov.in",
    full_name: "Insp. Vikramaditya Singh",
    role: "investigator",
    designation: "Vigilance Officer",
    department: "State Vigilance Bureau",
    jurisdiction: "Northern Zone",
    avatar_initials: "VS",
  },
  implementing_agency: {
    id: "demo-agency-01",
    email: "apex.dsiidc@infra.in",
    full_name: "Er. Alok Ranjan",
    role: "implementing_agency",
    designation: "Executive Resident Engineer",
    department: "DSIIDC Civil Works Division",
    jurisdiction: "Delhi Division",
    avatar_initials: "AR",
  },
  citizen_auditor: {
    id: "demo-citizen-01",
    email: "citizen.auditor@nic.in",
    full_name: "Dr. Ananya Sharma",
    role: "citizen_auditor",
    designation: "Independent Social Auditor",
    department: "Citizen Open Governance Initiative",
    jurisdiction: "Public",
    avatar_initials: "AS",
  },
};

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  token: string | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithPassword: (
    email: string,
    password: string,
    metadata?: { full_name?: string; role?: SentinelRole; department?: string; designation?: string }
  ) => Promise<{ error: Error | null }>;
  signInDemo: (role: SentinelRole) => void;
  signOut: () => Promise<void>;
  switchPersona: (role: SentinelRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(DEMO_PERSONAS.mospi_officer); // Default demo officer
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
            // Check local storage for demo persona
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
        // Fallback demo mode
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
          role: (data.role as SentinelRole) || "citizen_auditor",
          department: data.department || "Surveillance",
          designation: data.designation || "Auditor",
          avatar_url: data.avatar_url,
          avatar_initials: initials,
        });
      } else {
        // Fallback from auth metadata
        const meta = authUser.user_metadata || {};
        const role = (meta.role as SentinelRole) || "citizen_auditor";
        const fullName = meta.full_name || authUser.email || "Auditor";
        setProfile({
          id: authUser.id,
          email: authUser.email || "",
          full_name: fullName,
          role,
          department: meta.department || "MoSPI National Audit",
          designation: meta.designation || "Officer",
          avatar_initials: fullName.substring(0, 2).toUpperCase(),
        });
      }
    } catch (err) {
      console.warn("[Profile Fetch Warning]", err);
    }
  }

  const signInWithPassword = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      // Demo login
      const persona = Object.values(DEMO_PERSONAS).find((p) => p.email.toLowerCase() === email.toLowerCase()) || DEMO_PERSONAS.mospi_officer;
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
    metadata?: { full_name?: string; role?: SentinelRole; department?: string; designation?: string }
  ) => {
    if (!isSupabaseConfigured || !supabase) {
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        full_name: metadata?.full_name || email.split("@")[0],
        role: metadata?.role || "citizen_auditor",
        department: metadata?.department || "Public Governance",
        designation: metadata?.designation || "Citizen Auditor",
        avatar_initials: (metadata?.full_name || email).substring(0, 2).toUpperCase(),
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
    setProfile(DEMO_PERSONAS.citizen_auditor);
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
