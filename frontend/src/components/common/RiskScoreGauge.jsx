import React from "react";
import { getRiskBadgeStyles } from "@/lib/formatters";
export const RiskScoreGauge = ({ score, level, size = "md", className = "", }) => {
    const styles = getRiskBadgeStyles(level);
    // SVG Gauge calculations
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const strokeColor = {
        critical: "#e11d48", // rose-600
        high: "#f97316", // orange-500
        medium: "#f59e0b", // amber-500
        low: "#10b981", // emerald-500
    }[level];
    const dimensions = {
        sm: { box: 80, stroke: 6, fontScore: "text-lg", fontSub: "text-[10px]" },
        md: { box: 110, stroke: 8, fontScore: "text-2xl", fontSub: "text-xs" },
        lg: { box: 140, stroke: 10, fontScore: "text-3xl", fontSub: "text-sm" },
    }[size];
    return (<div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg width={dimensions.box} height={dimensions.box} viewBox="0 0 100 100" className="transform -rotate-90">
          {/* Background Circle */}
          <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth={dimensions.stroke} fill="transparent" className="text-slate-100 dark:text-slate-800"/>
          {/* Progress Arc */}
          <circle cx="50" cy="50" r={radius} stroke={strokeColor} strokeWidth={dimensions.stroke} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" className="transition-all duration-1000 ease-out"/>
        </svg>

        {/* Center Score Readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-black tracking-tight text-slate-900 dark:text-white ${dimensions.fontScore}`}>
            {score}
          </span>
          <span className={`font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 ${dimensions.fontSub}`}>
            / 100
          </span>
        </div>
      </div>

      <div className="mt-2">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${styles.bg} ${styles.text} ${styles.border}`}>
          {styles.label} Priority
        </span>
      </div>
    </div>);
};
