"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle, KeyRound, Eye, EyeOff, Landmark, HardHat, SearchCode, ClipboardCheck, } from "lucide-react";
import { useAuth, DEMO_PERSONAS } from "@/lib/authContext";
import { APP_NAME, APP_HINDI_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
export default function LoginPage() {
    const router = useRouter();
    const { signInWithPassword, signUpWithPassword, signInDemo, isConfigured } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("mospi_officer");
    const [department, setDepartment] = useState("MoSPI DIID");
    const [state, setState] = useState("Rajasthan");
    const [district, setDistrict] = useState("Jaipur");
    const [constituency, setConstituency] = useState("New Delhi");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);
        setLoading(true);
        try {
            if (isRegister) {
                const res = await signUpWithPassword(email, password, {
                    full_name: fullName,
                    role,
                    department,
                    designation: role === "mospi_officer"
                        ? "Senior Audit Officer"
                        : role === "state_nodal_authority"
                            ? "State Nodal Officer"
                            : role === "mp"
                                ? "Member of Parliament"
                                : role === "implementing_agency"
                                    ? "Executive Resident Engineer"
                                    : role === "investigator"
                                        ? "Vigilance Investigator"
                                        : "Field Verification Officer",
                    state,
                    district,
                    constituency,
                });
                if (res.error) {
                    setErrorMsg(res.error.message);
                }
                else {
                    setSuccessMsg("Account registered successfully! Redirecting to Command Center...");
                    setTimeout(() => router.push("/app/command-center"), 1000);
                }
            }
            else {
                const res = await signInWithPassword(email, password);
                if (res.error) {
                    setErrorMsg(res.error.message);
                }
                else {
                    setSuccessMsg("Authenticated successfully! Redirecting...");
                    setTimeout(() => router.push("/app/command-center"), 600);
                }
            }
        }
        catch (err) {
            setErrorMsg(err.message || "Authentication failed.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleDemoLogin = (targetRole) => {
        signInDemo(targetRole);
        setSuccessMsg(`Logged in as ${DEMO_PERSONAS[targetRole].full_name} (${DEMO_PERSONAS[targetRole].designation})`);
        setTimeout(() => router.push("/app/command-center"), 400);
    };
    const roleIcons = {
        mospi_officer: ShieldCheck,
        state_nodal_authority: Landmark,
        mp: Landmark,
        implementing_agency: HardHat,
        investigator: SearchCode,
        field_verification_officer: ClipboardCheck,
        system_admin: ShieldCheck,
    };
    return (<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-5 h-5 text-blue-300 dark:text-white"/>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                {APP_NAME}
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1 py-0.2 rounded border border-blue-200 dark:border-blue-800">
                {APP_HINDI_NAME}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              MoSPI DIID • SIH26102
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/" className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Back to Portal
          </Link>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Info & 6 Official Quick Demo Personas */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"/>
              <span>Role-Based Access Control (RBAC) System</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Institutional MPLADS Surveillance Access
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Access is governed by <strong>Role + Jurisdiction + Assignment + Permission</strong>. Select any of the 6 official synthetic stakeholder accounts to test role-separated workflows, evidence chains, and AI audit capabilities.
            </p>
          </div>

          {/* Quick Demo Personas Grid */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400"/>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  6 Core Stakeholder Demo Personas (1-Click Switch)
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                RBAC Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
            "mospi_officer",
            "state_nodal_authority",
            "mp",
            "implementing_agency",
            "investigator",
            "field_verification_officer",
        ].map((key) => {
            const p = DEMO_PERSONAS[key];
            const Icon = roleIcons[key] || ShieldCheck;
            return (<button key={key} onClick={() => handleDemoLogin(key)} className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all group active:scale-[0.98]">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                        <Icon className="w-4 h-4"/>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {p.full_name}
                          </p>
                        </div>
                        <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 truncate">
                          {p.designation}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          📍 {p.jurisdiction || p.department}
                        </p>
                      </div>
                    </div>
                  </button>);
        })}
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            {/* Tab switch */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button type="button" onClick={() => {
            setIsRegister(false);
            setErrorMsg(null);
            setSuccessMsg(null);
        }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isRegister
            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
            : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}>
                Sign In
              </button>
              <button type="button" onClick={() => {
            setIsRegister(true);
            setErrorMsg(null);
            setSuccessMsg(null);
        }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isRegister
            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
            : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}>
                Register Stakeholder
              </button>
            </div>

            {/* Alerts */}
            {errorMsg && (<div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0"/>
                <span>{errorMsg}</span>
              </div>)}
            {successMsg && (<div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0"/>
                <span>{successMsg}</span>
              </div>)}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isRegister && (<>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name & Title
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                      <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Dr. Ananya Sharma" className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Operational User Type (RBAC)
                    </label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                      <option value="mospi_officer">1. MoSPI / Ministry Officer (National Oversight)</option>
                      <option value="state_nodal_authority">2. State Nodal Authority (State Scope)</option>
                      <option value="mp">3. Member of Parliament (Constituency)</option>
                      <option value="implementing_agency">4. Implementing Agency (Execution & Bills)</option>
                      <option value="investigator">5. Investigator / Audit Officer (Flagged Cases)</option>
                      <option value="field_verification_officer">6. Field Verification Officer (Site Inspection)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        State / UT
                      </label>
                      <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. Rajasthan" className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        District / Scope
                      </label>
                      <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Jaipur" className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                  </div>
                </>)}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email / NIC ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ministry@mpladssentinel.demo" className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full pl-10 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60">
                <span>
                  {loading
            ? "Processing..."
            : isRegister
                ? "Register Official Account"
                : "Sign In to Sentinel"}
                </span>
                <ArrowRight className="w-4 h-4"/>
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Live Backend: <span className="font-mono text-blue-600 dark:text-blue-400">Render API</span> • Database: <span className="font-mono text-emerald-600 dark:text-emerald-400">Supabase Auth</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        © 2026 MPLADS Sentinel • Ministry of Statistics and Programme Implementation • SIH26102
      </footer>
    </div>);
}
