import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { formatPercentage } from "@/lib/formatters";
export const FinancialProgressMismatch = ({ financialProgress, physicalProgress, disbursedAmount, sanctionedAmount, className = "", }) => {
    const gap = Math.abs(financialProgress - physicalProgress);
    const isSevereGap = gap >= 20;
    return (<div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border ${isSevereGap
            ? "border-rose-200/80 dark:border-rose-900/60"
            : "border-slate-200/80 dark:border-slate-800"} shadow-sm space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Financial vs Physical Progress Alignment
            </h3>
            {isSevereGap && (<span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3"/>
                Critical Inconsistency
              </span>)}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compares contractor disbursement velocity against verified on-site milestone execution
          </p>
        </div>

        <div className="text-right self-start sm:self-auto">
          <span className="text-xs text-slate-400">Divergence Gap:</span>
          <span className={`ml-1.5 font-mono font-extrabold text-sm ${isSevereGap ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-300"}`}>
            {gap} Percentage Points
          </span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3 pt-1">
        {/* Financial Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"/>
              Financial Disbursed Progress
            </span>
            <span className="font-mono text-slate-900 dark:text-white">
              {formatPercentage(financialProgress)}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out" style={{ width: `${financialProgress}%` }}/>
          </div>
        </div>

        {/* Physical Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"/>
              Verified Physical Progress
            </span>
            <span className="font-mono text-slate-900 dark:text-white">
              {formatPercentage(physicalProgress)}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out" style={{ width: `${physicalProgress}%` }}/>
          </div>
        </div>
      </div>

      {/* Warning Box */}
      {isSevereGap && (<div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/80 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-600"/>
            <span>Premature Disbursement Risk Detected</span>
          </div>
          <p className="text-rose-700/90 dark:text-rose-300/80 leading-relaxed text-[11px]">
            Contractor has been paid <strong>{financialProgress}%</strong> of the sanctioned budget, while only <strong>{physicalProgress}%</strong> of the structural work is completed on site. This <strong>{gap}%</strong> unjustified advance payout violates standard milestone-linked disbursement protocols.
          </p>
        </div>)}
    </div>);
};
