import React from "react";
import Link from "next/link";
import { Database, Cpu, ShieldAlert, FileCheck, SearchCode, ArrowRight } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "eSAKSHI & Treasury Ingestion",
      icon: Database,
      desc: "Continuous automated ingestion of project recommendations, administrative sanctions, contractor Running Account bills, and PFMS treasury debits.",
    },
    {
      num: "02",
      title: "Multi-Model AI Surveillance",
      icon: Cpu,
      desc: "Simultaneous screening across 5 specialized verification engines: Financial Velocity, Sentence-BERT NLP, Computer Vision Image Matcher, OCR Inconsistency Scanner, and Milestone Delay Predictor.",
    },
    {
      num: "03",
      title: "Composite Risk Prioritization",
      icon: ShieldAlert,
      desc: "Aggregation into a normalized 0–100 Composite Risk Index. Critical priority triggers for multi-source inconsistencies rather than isolated single signals.",
    },
    {
      num: "04",
      title: "Evidence Provenance Linking",
      icon: FileCheck,
      desc: "Every flagged risk point links directly to underlying cryptographic ground evidence, side-by-side comparison images, or OCR bill deltas.",
    },
    {
      num: "05",
      title: "Authorized Auditor Investigation",
      icon: SearchCode,
      desc: "District and Central reviewing officers investigate prioritized cases, post remarks, issue evidence requisitions, and record formal audit determinations.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
            Process Explainer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How MPLADS Sentinel Operates
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            A step-by-step walkthrough of how raw administrative records are transformed into actionable, evidence-linked risk intelligence.
          </p>
        </div>

        {/* Steps Linear Flow */}
        <div className="space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-2xl font-mono font-black text-blue-600 dark:text-blue-400 w-10">
                    {step.num}
                  </span>
                  <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-1 flex-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/app/command-center"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800"
          >
            <span>Explore Live Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
