import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldAlert, Cpu } from "lucide-react";

export const LiveInsightCard: React.FC = () => {
  return (
    <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md border border-blue-800/60">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> Sentinel Pattern Intelligence
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                Active Anomaly Cluster
              </span>
            </div>
            <p className="text-sm font-semibold text-white leading-snug">
              Financial/Physical Progress Divergence (Gap &gt;30%) is currently the highest-frequency critical signal across 18,432 monitored works.
            </p>
            <p className="text-xs text-blue-200/80">
              38 delayed structural works currently have active fund disbursements without verified milestone site evidence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <Link
            href="/app/risk/financial"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-blue-50 transition-all shadow-sm"
          >
            <span>Explore Risk Pattern</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/app/projects/MPL-004821"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-800/60 hover:bg-blue-800 text-white border border-blue-700/60 transition-all"
          >
            <span>Inspect Flagged Case</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
