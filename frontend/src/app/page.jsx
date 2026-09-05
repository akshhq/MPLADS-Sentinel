"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Building2,
  FileCheck,
  SearchCode,
  Cpu,
  Database,
  Layers,
  Scale,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Landmark,
  ExternalLink,
  Lock,
  FileText
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { MINISTRY_NAME } from "@/lib/constants";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  const flowSteps = [
    {
      stepNum: "01",
      badge: "STEP 1: THE CORE PROBLEM",
      title: "e-SAKSHI Records What Happened — But Doesn't Check If It Makes Sense",
      desc: "e-SAKSHI functions as a digital transaction ledger. MPs recommend works, tenders are approved, bills are submitted, and funds are disbursed. However, no automated engine checks whether the contractor is real, whether the price is inflated, or whether the building actually exists on the ground.",
      icon: ShieldAlert,
      color: "rose",
      points: [
        "Vendor Monopolies: Single contractors cornering up to 119 payments in a district without detection.",
        "Split Invoicing: Large projects chopped into 52 small payments to bypass open tendering rules (GFR 157).",
        "Ghost / Reused Proofs: ~40% of completed works lack photo evidence or reuse past photos across works."
      ],
      previewContent: (
        <div className="space-y-3 font-mono text-xs text-left bg-slate-900/90 text-slate-200 p-4 rounded-xl border border-rose-900/40">
          <div className="text-[11px] font-bold text-rose-400 uppercase">Current Administrative Vulnerability</div>
          <div className="space-y-1.5 text-slate-300">
            <div>1. MP Proposal Submitted ──► <span className="text-emerald-400">Recorded in eSAKSHI</span></div>
            <div>2. Sanction Order Issued ────► <span className="text-emerald-400">Recorded in eSAKSHI</span></div>
            <div>3. ₹30.8 Lakh Disbursed (88%) ► <span className="text-emerald-400">Paid via Treasury</span></div>
            <div>4. Physical Progress (30%) ──► <span className="text-rose-400 font-bold">⚠️ Unchecked on Ground!</span></div>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-2">
            e-SAKSHI assumes every claim is true; Sentinel actively audits consistency across 12 datasets.
          </p>
        </div>
      )
    },
    {
      stepNum: "02",
      badge: "STEP 2: CLOUD DATA INGESTION",
      title: "Continuous Cloud Streaming Over 45,806 Real Parliamentary Records",
      desc: "Sentinel connects directly to Supabase Cloud Storage to stream 12 official CSV datasets covering Lok Sabha and Rajya Sabha (recommendations, administrative sanctions, completion dates, and vendor expenditure ledgers) with in-memory LRU caching.",
      icon: Database,
      color: "blue",
      points: [
        "Zero Local Storage Bottlenecks: Streamed on-demand via global CDN with <4ms in-memory query latency.",
        "Canonical Work Profile: Links scattered records across 12 files using 3-tier key matching and SBERT embeddings.",
        "100% Real Empirical Baseline: Audits ₹23,353.58 Crore in parliamentary allocations across 774 MPs."
      ],
      previewContent: (
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-blue-900/40">
            <span className="text-[11px] font-bold text-blue-400">Lok Sabha (544 MPs)</span>
            <p className="text-xs text-slate-300 mt-1">11,000 Recommendations<br />15,000 Vendor Payments</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-blue-900/40">
            <span className="text-[11px] font-bold text-cyan-400">Rajya Sabha (232 MPs)</span>
            <p className="text-xs text-slate-300 mt-1">10,000 Sanctions<br />9,000 Completions</p>
          </div>
          <div className="col-span-2 text-center text-[11px] text-emerald-400 font-mono">
            ⚡ 45,806 Cleaned Rows • In-Memory LRU Cache Active
          </div>
        </div>
      )
    },
    {
      stepNum: "03",
      badge: "STEP 3: 21-MODULE AI GRID",
      title: "21 Specialized AI Modules Screen Every Work Across 5 Analytical Domains",
      desc: "Sentinel runs every project through 21 targeted AI modules combining deterministic statutory rules, robust statistics (Isolation Forest), natural language matching (SBERT), and relationship networks (NetworkX).",
      icon: Cpu,
      color: "indigo",
      points: [
        "Statutory Rules AI: Enforces Guidelines 2023, ₹25L outside-constituency caps, and 15% SC / 7.5% ST quotas.",
        "Cost Anomaly AI: Isolation Forest & LOF detecting unit-rate inflations vs district historical medians.",
        "SBERT Duplicate AI: Cosine similarity search finding cloned scopes and sub-₹10L work-splitting.",
        "NetworkX Graph AI: Bipartite graph modeling detecting contractor cartels and IDA=Vendor self-dealing."
      ],
      previewContent: (
        <div className="space-y-2 text-left text-xs">
          <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-200">
            📋 <strong>Module 4 (Rules):</strong> Guidelines 2023 SLA & Statutory Caps
          </div>
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-200">
            💰 <strong>Module 5 (Cost AI):</strong> Isolation Forest vs District Medians
          </div>
          <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-200">
            ⏳ <strong>Module 6 (Timeline):</strong> 45-Day Sanction & 1-Year Completion SLA
          </div>
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-200">
            🕸️ <strong>Module 9 (NLP AI):</strong> SBERT Semantic Duplicate Work Search
          </div>
        </div>
      )
    },
    {
      stepNum: "04",
      badge: "STEP 4: MULTI-SIGNAL RISK FUSION",
      title: "Calibrated 0–100 Composite Risk Score with False-Positive Mitigation",
      desc: "To eliminate false alarms, Sentinel enforces the 2-Signal Confirmation Rule: A project CANNOT reach Critical Risk from a single minor delay; it strictly requires at least 2 independent confirmatory signals (which triggers a +15 multiplier).",
      icon: Scale,
      color: "amber",
      points: [
        "Physical-Financial Divergence (δ): Flags when (% Disbursed) - (% Physical Progress) exceeds 35%.",
        "False-Positive Defense: Single minor timeline delays receive only soft desk-audit advisory flags.",
        "Explainable AI (XAI): Every risk score lists exact dollar disparities, contractor names, and rule clauses."
      ],
      previewContent: (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40 text-center space-y-2">
          <div className="text-[11px] font-bold text-amber-400 uppercase">Risk Fusion Output</div>
          <div className="text-4xl font-black font-mono text-rose-500">88 / 100</div>
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            CRITICAL AUDIT PRIORITY
          </span>
          <p className="text-[11px] text-slate-300 font-sans">
            2 Confirmatory Signals: Severe Divergence (δ = +36%) + Vendor Structuring (119 payments).
          </p>
        </div>
      )
    },
    {
      stepNum: "05",
      badge: "STEP 5: 7-ROLE GOVERNANCE & FIELD ACTION",
      title: "Institutional RBAC & Dispatched On-Site GPS Field Verification",
      desc: "Strict access control enforced across 7 roles (System Admin, MoSPI Officer, State Nodal, MP, Implementing Agency, Investigator, and Field Officer). Critical alerts freeze milestone funds and dispatch on-site inspection warrants.",
      icon: MapPin,
      color: "emerald",
      points: [
        "Zero Public Self-Registration: Institutional accounts governed exclusively by Admins.",
        "On-Site GPS Capture: Field officers capture camera-only photos validated via Haversine distance (>250m check).",
        "Separation of Duties: MPs cannot approve their own works; Agencies cannot alter budgets."
      ],
      previewContent: (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-left space-y-1.5 text-xs">
          <div className="text-emerald-400 font-bold">📍 Field Verification Order #INSP-2026-089</div>
          <div className="text-slate-300">Target: Village Khera Community Hall (28.6139° N, 77.2090° E)</div>
          <div className="text-amber-400">Action: Verify plinth completion & upload geotagged proof.</div>
          <div className="text-rose-400 font-bold">Status: Milestone Disbursal FROZEN 🔒</div>
        </div>
      )
    },
    {
      stepNum: "06",
      badge: "STEP 6: AUTOMATED AUDIT DOSSIER",
      title: "1-Click Tamper-Evident Legal Audit Dossier with SHA-256 Stamp",
      desc: "Sentinel compiles machine findings, contractor bills, historical district benchmarks, and field inspection photos into a standardized, auditor-ready PDF Investigation Brief with an unalterable SHA-256 cryptographic hash.",
      icon: FileCheck,
      color: "purple",
      points: [
        "Statutory Citations: Direct citations to MPLADS Guidelines 2023 and GFR 2017 Rules 130, 157, and 238.",
        "Closed-Loop Case Lifecycle: TRIGGERED ──► TRIAGED ──► FIELD_INSPECT ──► ACTION_RECOMMENDED ──► RESOLVED.",
        "Natural Language Copilot: Auditors query in plain English: 'Show all works assigned to this vendor above ₹25 Lakh'."
      ],
      previewContent: (
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 text-center space-y-2">
          <FileText className="w-8 h-8 text-purple-400 mx-auto" />
          <div className="font-mono text-[10px] text-slate-300 truncate">
            SHA-256: e3b0c44298fc1c149afbf4c8...
          </div>
          <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-purple-600 text-white shadow-sm">
            Statutory Dossier Ready
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      <PublicHeader />

      <main className="flex-1 space-y-20 pb-20">
        {/* Hero Section */}
        <section className="relative pt-16 md:pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Smart India Hackathon 2026 • SIH26102 • {MINISTRY_NAME}</span>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              How MPLADS Sentinel{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400">
                Protects Public Funds
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              <em>&ldquo;e-SAKSHI records what happened; MPLADS Sentinel checks whether what happened makes sense.&rdquo;</em>
              <br />
              Continuous multi-source surveillance, 21-module AI risk fusion, and tamper-evident audit dossiers across 45,806 real parliamentary records.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/app/command-center"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/app/projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all"
            >
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Master Projects Directory</span>
            </Link>

            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Full System Methodology</span>
            </Link>
          </div>

          {/* Live Surveillance Stats Bar */}
          <div className="pt-6 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-left">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-indigo-500" /> Total Monitored
              </span>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">₹23,353 Cr</p>
              <span className="text-[11px] text-slate-500">774 MPs (LS &amp; RS)</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-500" /> Real Cloud Records
              </span>
              <p className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">45,806 Rows</p>
              <span className="text-[11px] text-slate-500">12 MoSPI Cloud Datasets</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-500" /> AI Engine Grid
              </span>
              <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">21 Modules</p>
              <span className="text-[11px] text-slate-500">5 Analytical Domains</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Governance Roles
              </span>
              <p className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">7 Roles</p>
              <span className="text-[11px] text-slate-500">Zero Self-Registration</span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE 6-STEP SYSTEM FLOW SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive System Journey</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              The 6-Step End-to-End Operational Lifecycle
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Click on any step below to see how raw parliamentary transactions turn into actionable, evidence-backed fraud investigations in real time.
            </p>
          </div>

          {/* Stepper Navigation Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {flowSteps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={s.stepNum}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3.5 rounded-2xl text-left transition-all border ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30 scale-[1.02]"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold ${isActive ? "text-blue-100" : "text-blue-600 dark:text-blue-400"}`}>
                      STEP {s.stepNum}
                    </span>
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  </div>
                  <div className="text-xs font-bold mt-1.5 line-clamp-1">{s.title.split("—")[0]}</div>
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {flowSteps[activeStep].badge}
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {flowSteps[activeStep].title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {flowSteps[activeStep].desc}
              </p>

              <div className="space-y-2.5 pt-2">
                {flowSteps[activeStep].points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                {activeStep > 0 && (
                  <button
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    ← Previous Step
                  </button>
                )}
                {activeStep < flowSteps.length - 1 && (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
                  >
                    Next Step →
                  </button>
                )}
                <Link
                  href="/app/command-center"
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1.5"
                >
                  <span>Test in Command Center</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 shadow-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-800/80 dark:bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 tracking-wider">LIVE AUDIT ENGINE</span>
                </div>
                <div className="p-5 text-white">
                  {flowSteps[activeStep].previewContent}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EMPIRICAL FRAUD DISCOVERIES SHOWCASE */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Real Data Discoveries
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Empirically Validated Fraud & Anomaly Signatures
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Discovered from direct algorithmic cross-examination of 45,806 official eSAKSHI records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 border-l-4 border-l-rose-500">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-600 dark:text-rose-400">
                Vendor Concentration
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ajay Kumar Singh (119 Payments)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Vendor received 119 payments from a single MP with uniform ~₹19,992 amounts (10x 99th percentile across Lok Sabha).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 border-l-4 border-l-amber-500">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-600 dark:text-amber-400">
                Payment Structuring
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">52 Installments / Single Work</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Large works deliberately sliced into 52 micro-vouchers under ₹20,000 to evade open tender mandates (GFR 157).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 border-l-4 border-l-cyan-500">
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-600 dark:text-cyan-400">
                Duplicate Ledgers
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">172 LS / 354 RS Exact Duplicates</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Identical Work ID, vendor name, voucher date, and amount repeated verbatim across expenditure records.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 border-l-4 border-l-indigo-500">
              <span className="text-[10px] font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400">
                Divergence Gap (δ)
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">88% Disbursed vs 35% Built</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Severe fiscal advances drawn without matching ground structural progress, parking public funds in contractor accounts.
              </p>
            </div>
          </div>
        </section>

        {/* Non-Negotiable Core Principle Banner */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4 text-center border border-slate-800">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-100">
              MPLADS Sentinel does not replace eSAKSHI and does not declare fraud.
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
              It adds an evidence-linked intelligence layer that continuously screens project, financial, documentary, visual, and relationship data, explains unusual patterns, and prioritizes potentially irregular works for authorized human investigation.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-bold text-blue-400">
              <Link href="/how-it-works" className="hover:underline flex items-center gap-1">
                <span>View System How-It-Works</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link href="/transparency" className="hover:underline flex items-center gap-1">
                <span>Read Transparency Policy</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
