import React from "react";
import Link from "next/link";
import { Cpu, ShieldCheck, Layers, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function MethodologyPage() {
  const models = [
    {
      name: "Deterministic Rules Engine",
      purpose: "Statutory GFR & MPLADS compliance validation",
      tech: "Declarative Rule Engine & Schema Validators",
      examples: "Sanction ceiling limits, non-permissible work categories, statutory quota allocations (SC/ST).",
    },
    {
      name: "Sentence-BERT (SBERT) NLP Matcher",
      purpose: "Deduplication & scope overlap detection",
      tech: "Fine-tuned all-mpnet-base-v2 + Cosine Similarity",
      examples: "Detects reworded project proposals in adjacent Gram Panchayats with >90% semantic match.",
    },
    {
      name: "Computer Vision (CV) Perceptual Matcher",
      purpose: "Site photo reuse & stage classification",
      tech: "ResNet-50 Feature Embeddings + Difference Hashing (dHash)",
      examples: "Catches 99.4% identical foundation photographs reused from past fiscal years.",
    },
    {
      name: "Financial Velocity Statistical Scanner",
      purpose: "Advance retention & split invoicing detection",
      tech: "Z-score Anomaly Detection & Benford's Law analysis",
      examples: "Flags payment vouchers clustered just below the ₹10.0 L competitive e-tender threshold.",
    },
    {
      name: "Explainable AI (XAI) & SHAP Aggregator",
      purpose: "Multi-model risk weighting & explanation",
      tech: "TreeSHAP + Feature Contribution Decomposition",
      examples: "Translates complex ML ensemble scores into plain-English reasons with exact point contributions.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
            Hybrid AI Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Methodology & Machine Learning Framework
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            Why Sentinel employs a hybrid architecture combining deterministic statutory rules with statistical ML, deep vision embeddings, and explainable AI.
          </p>
        </div>

        {/* Models Grid */}
        <div className="space-y-4">
          {models.map((mod, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {mod.name}
                </h3>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {mod.tech}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Primary Audit Purpose: {mod.purpose}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
                <strong>Real Audit Detection: </strong> {mod.examples}
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
