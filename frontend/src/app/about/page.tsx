import React from "react";
import Link from "next/link";
import { ShieldCheck, Building2, Target, Users, Award, ArrowRight } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { APP_NAME, APP_HINDI_NAME, SIH_PROBLEM_ID, MINISTRY_NAME } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
            About the Platform
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Transforming MPLADS Monitoring through Institutional AI Intelligence
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            MPLADS Sentinel (रक्षक) is an AI-powered surveillance and risk intelligence platform engineered for the {MINISTRY_NAME} under Smart India Hackathon problem statement {SIH_PROBLEM_ID}.
          </p>
        </div>

        {/* Core Rationale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 w-fit">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">eSAKSHI Integration</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Seamlessly integrates with the existing eSAKSHI national workflow without displacing established sanction protocols.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 w-fit">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Evidence-Linked Risk</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every flagged anomaly is directly grounded in cryptographic ground records, OCR extractions, and perceptual image hashing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 w-fit">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Human-In-The-Loop</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              AI prioritizes anomalies and presents explainable reasons; authorized statutory officers make all final decisions.
            </p>
          </div>
        </div>

        {/* Stakeholder Target Groups */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Designed for Multi-Tiered Governance Roles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">1. MoSPI Central Monitoring Cell</span>
              <p className="text-slate-500 dark:text-slate-400">National risk indices, state comparative analysis, and high-value expenditure surveillance.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">2. State Nodal Authorities</span>
              <p className="text-slate-500 dark:text-slate-400">Inter-district risk ranking, agency execution speed, and unresolved investigation monitoring.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">3. District Collectors & Deputy Commissioners</span>
              <p className="text-slate-500 dark:text-slate-400">Local investigation queue, milestone delay alerts, and contractor bill validation.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">4. Performance Audit Reviewers</span>
              <p className="text-slate-500 dark:text-slate-400">Traceable ground evidence chains, investigator note logging, and exportable audit briefs.</p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
