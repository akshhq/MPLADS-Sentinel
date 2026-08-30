import React from "react";
import Link from "next/link";
import { FileCheck, CheckCircle2 } from "lucide-react";
import { RiskBadge } from "../common/RiskBadge";
export const ExplainableReasons = ({ reasons, className = "", }) => {
    return (<div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Why was this project flagged?
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              Explainable AI (XAI) Finding
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Every risk reason is grounded in verifiable evidence, statistical thresholds, and official guidelines
          </p>
        </div>
      </div>

      {/* Reasons List */}
      <div className="space-y-3">
        {reasons.map((reason, idx) => (<div key={reason.id || idx} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            {/* Title & Score Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <RiskBadge level={reason.severity} showIcon={true} size="sm"/>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {reason.title}
                </h4>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400 font-mono">
                  Impact: <strong className="text-rose-600 dark:text-rose-400 font-bold">+{reason.scoreContribution} pts</strong>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-400 font-mono">
                  Confidence: <strong>{Math.round(reason.confidence * 100)}%</strong>
                </span>
              </div>
            </div>

            {/* Explanation Body */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {reason.explanation}
            </p>

            {/* Deviations Table / Tag */}
            {reason.deviations && reason.deviations.length > 0 && (<div className="flex flex-wrap gap-2 pt-1">
                {reason.deviations.map((dev, dIdx) => (<div key={dIdx} className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                    <span className="text-slate-500">{dev.label}:</span>
                    <span className="text-slate-400">Exp: {dev.expected}</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">Act: {dev.actual}</span>
                    <span className="px-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">
                      {dev.delta}
                    </span>
                  </div>))}
              </div>)}

            {/* Evidence Links & Recommended Action */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="font-semibold text-slate-400">Supporting Evidence:</span>
                <div className="flex flex-wrap gap-1.5">
                  {reason.evidenceIds.map((eId) => (<Link key={eId} href={`/app/evidence/${eId}`} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 hover:underline font-mono font-bold flex items-center gap-1 border border-blue-200 dark:border-blue-800">
                      <FileCheck className="w-3 h-3"/>
                      <span>{eId}</span>
                    </Link>))}
                </div>
              </div>

              <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="font-semibold text-slate-400">Model:</span>
                <span className="font-mono">{reason.model}</span>
              </div>
            </div>

            {/* Recommended Verification Action */}
            {reason.recommendedAction && (<div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-[11px] flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5"/>
                <div className="text-blue-900 dark:text-blue-200">
                  <strong>Recommended Action: </strong>
                  {reason.recommendedAction}
                </div>
              </div>)}
          </div>))}
      </div>
    </div>);
};
