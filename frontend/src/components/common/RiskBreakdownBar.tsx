import React from "react";
import { RiskBreakdown } from "@/types/risk";
import { BadgeIndianRupee, Clock, CopyCheck, FileText, Camera, GitFork } from "lucide-react";

interface RiskBreakdownBarProps {
  breakdown: RiskBreakdown;
  className?: string;
}

export const RiskBreakdownBar: React.FC<RiskBreakdownBarProps> = ({
  breakdown,
  className = "",
}) => {
  const items = [
    { label: "Financial Anomaly", value: breakdown.financial, max: 30, icon: BadgeIndianRupee, color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
    { label: "Visual Image Reuse (CV)", value: breakdown.visual, max: 25, icon: Camera, color: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" },
    { label: "Timeline & Milestone Delay", value: breakdown.timeline, max: 25, icon: Clock, color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
    { label: "Duplicate Scope (NLP/GIS)", value: breakdown.duplicate, max: 20, icon: CopyCheck, color: "bg-purple-500", text: "text-purple-600 dark:text-purple-400" },
    { label: "Document Inconsistency (OCR)", value: breakdown.document, max: 20, icon: FileText, color: "bg-sky-500", text: "text-sky-600 dark:text-sky-400" },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;
        const percent = Math.min(100, Math.round((item.value / item.max) * 100));
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Icon className={`w-3.5 h-3.5 ${item.text}`} />
                {item.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`font-mono font-bold ${item.text}`}>
                  +{item.value}
                </span>
                <span className="text-[10px] text-slate-400">/ {item.max} pts</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${item.color}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
