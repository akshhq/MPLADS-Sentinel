import React from "react";
import { Lock, UserCheck, FlaskConical, AlertCircle } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
export default function TransparencyPage() {
    return (<div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            Trust & Ethics Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Transparency, Ethics & Human-in-the-Loop Safeguards
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            How MPLADS Sentinel upholds procedural fairness, explains machine learning uncertainty, and ensures authorized human officers retain complete decision-making authority.
          </p>
        </div>

        {/* Major Ethical Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 w-fit">
              <UserCheck className="w-5 h-5"/>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. Risk Score is Prioritization, Not Guilt
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The AI never outputs statements such as &quot;Fraud confirmed&quot; or &quot;Guilty agency.&quot; Risk scores simply indicate statistical and documentary inconsistency requiring authorized auditor review.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 w-fit">
              <FlaskConical className="w-5 h-5"/>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              2. Synthetic Data Transparency Policy
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Whenever synthetic test records or simulated stress cases are generated for benchmarking, they are prominently labelled with <strong className="text-purple-600">SYNTHETIC BENCHMARK DATA</strong> and never mixed into real ground audit registries.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 w-fit">
              <AlertCircle className="w-5 h-5"/>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              3. Explicit Handling of Missing Data
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If GPS coordinates, photographs, or invoice breakdowns are absent, the system displays &quot;Verification Unavailable&quot; rather than fabricating a confident 0 or default score.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 w-fit">
              <Lock className="w-5 h-5"/>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              4. Audit Trail & Cryptographic Provenance
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every document uploaded, model applied, and decision recorded is immutably timestamped with SHA-256 fingerprints to ensure total accountability across central and district levels.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>);
}
