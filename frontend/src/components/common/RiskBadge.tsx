import React from "react";
import { RiskLevel } from "@/types/risk";
import { getRiskBadgeStyles } from "@/lib/formatters";
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon } from "lucide-react";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showIcon = true,
  size = "md",
  className = "",
}) => {
  const styles = getRiskBadgeStyles(level);

  const getIcon = () => {
    switch (level) {
      case "critical":
        return <AlertOctagon className="w-3.5 h-3.5" />;
      case "high":
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case "medium":
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case "low":
      default:
        return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1 font-medium",
    md: "px-2.5 py-1 text-xs gap-1.5 font-semibold",
    lg: "px-3.5 py-1.5 text-sm gap-2 font-bold",
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses} ${className}`}
    >
      {showIcon && <span className="shrink-0">{getIcon()}</span>}
      <span>{styles.label}</span>
      {score !== undefined && (
        <span className="opacity-80 font-mono tracking-tight text-[0.9em] border-l border-current/20 pl-1.5">
          {score}/100
        </span>
      )}
    </span>
  );
};
