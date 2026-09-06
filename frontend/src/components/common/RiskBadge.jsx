import React from "react";
import { getRiskBadgeStyles } from "@/lib/formatters";
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon, CopyCheck } from "lucide-react";

export const RiskBadge = ({
  level,
  score,
  showIcon = true,
  size = "md",
  className = "",
}) => {
  const norm = (level || "").toLowerCase();
  const isDuplicate = norm === "duplicate";
  const styles = getRiskBadgeStyles(isDuplicate ? "duplicate" : level);

  const getIcon = () => {
    switch (norm) {
      case "duplicate":
        return <CopyCheck className="w-3.5 h-3.5" />;
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
  }[size] || "px-2.5 py-1 text-xs gap-1.5 font-semibold";

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses} ${className}`}
    >
      {showIcon && <span className="shrink-0">{getIcon()}</span>}
      <span>{styles.label || "Duplicate"}</span>
      {!isDuplicate && score !== undefined && score !== null && score !== "" && (
        <span className="opacity-80 font-mono tracking-tight text-[0.9em] border-l border-current/20 pl-1.5">
          {score}/100
        </span>
      )}
    </span>
  );
};
