import React from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, ArrowRight, Sparkles, Building2, FileCheck, SearchCode, Cpu, Database, } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { MINISTRY_NAME } from "@/lib/constants";
export default function LandingPage() {
    return (<div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      <PublicHeader />

      <main className="flex-1 space-y-20 pb-20">
        {/* Hero Section */}
        <section className="relative pt-16 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"/>
            <span>Official Surveillance Layer • {MINISTRY_NAME}</span>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              From Project Monitoring to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600">
                Evidence-Linked Risk Intelligence
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              MPLADS Sentinel adds an explainable AI intelligence layer over eSAKSHI—screening financial ledgers, milestone timelines, document OCR, and site photographs to prioritize works for authorized investigation.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link href="/app/command-center" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 shadow-lg shadow-blue-950/20 transition-all active:scale-[0.98]">
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4"/>
            </Link>

            <Link href="/app/projects" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400"/>
              <span>Master Projects Directory</span>
            </Link>

            <Link href="/app/risk/documents/compare" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 transition-all">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400"/>
              <span>Layout Similarity Studio</span>
            </Link>
          </div>

          {/* Live Surveillance Stats Bar */}
          <div className="pt-8 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Works Screened</span>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-0.5">18,432</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">High Risk</span>
              <p className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-0.5">127</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">Critical Cases</span>
              <p className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-0.5">34</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Flagged Value</span>
              <p className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-0.5">₹42.8 Cr</p>
            </div>
          </div>
        </section>

        {/* The 5-Step Continuous Workflow Visualizer */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              The End-to-End Investigation Loop
            </h2>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Data → AI Verification → Risk Scoring → Ground Evidence → Authorized Review
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
            { step: "01", title: "Data Ingestion", desc: "Raw project streams from eSAKSHI & PFMS Treasury disbursements.", icon: Database },
            { step: "02", title: "AI Verification", desc: "Continuous screening across rules, ML, NLP, OCR, and Computer Vision.", icon: Cpu },
            { step: "03", title: "Risk Scoring", desc: "Composite 0-100 risk prioritization index computed per project.", icon: ShieldAlert },
            { step: "04", title: "Evidence Linking", desc: "Every flagged risk point directly grounded in cryptographic artifacts.", icon: FileCheck },
            { step: "05", title: "Investigation", desc: "Authorized officers review briefs, requisition evidence, and record outcomes.", icon: SearchCode },
        ].map((st) => {
            const Icon = st.icon;
            return (<div key={st.step} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 relative">
                  <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">
                    STEP {st.step}
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit text-slate-800 dark:text-slate-200">
                    <Icon className="w-5 h-5"/>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>);
        })}
          </div>
        </section>

        {/* Non-Negotiable Core Principle Banner */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4 text-center border border-slate-800">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto"/>
            <h3 className="text-xl font-bold text-slate-100">
              MPLADS Sentinel does not replace eSAKSHI and does not declare fraud.
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
              It adds an evidence-linked intelligence layer that continuously screens project, financial, documentary, visual and relationship data, explains unusual patterns, and prioritizes potentially irregular works for authorized human investigation.
            </p>
            <div className="pt-2">
              <Link href="/transparency" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:underline">
                <span>Read our Full Transparency & Human-in-the-Loop Policy</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>);
}
