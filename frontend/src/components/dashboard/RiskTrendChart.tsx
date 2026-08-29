"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface RiskTrendChartProps {
  data?: {
    month: string;
    screenedWorks: number;
    flaggedAnomalies: number;
    avgRiskScore: number;
  }[];
}

const DEFAULT_TREND_DATA = [
  { month: "Sep 2025", screenedWorks: 12400, flaggedAnomalies: 48, avgRiskScore: 24.2 },
  { month: "Oct 2025", screenedWorks: 14100, flaggedAnomalies: 62, avgRiskScore: 26.5 },
  { month: "Nov 2025", screenedWorks: 15300, flaggedAnomalies: 79, avgRiskScore: 28.1 },
  { month: "Dec 2025", screenedWorks: 16200, flaggedAnomalies: 95, avgRiskScore: 30.4 },
  { month: "Jan 2026", screenedWorks: 17100, flaggedAnomalies: 114, avgRiskScore: 31.8 },
  { month: "Feb 2026", screenedWorks: 17800, flaggedAnomalies: 138, avgRiskScore: 33.2 },
  { month: "Mar 2026", screenedWorks: 18200, flaggedAnomalies: 152, avgRiskScore: 34.0 },
  { month: "Apr 2026", screenedWorks: 18432, flaggedAnomalies: 161, avgRiskScore: 34.8 },
];

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "3M" | "1Y">("1Y");

  const safeData = data && Array.isArray(data) && data.length > 0 ? data : DEFAULT_TREND_DATA;
  const displayData =
    timeRange === "7D"
      ? safeData.slice(-3)
      : timeRange === "30D"
      ? safeData.slice(-4)
      : timeRange === "3M"
      ? safeData.slice(-6)
      : safeData;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full">
      {/* Header with Range Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Risk Screening & Anomaly Velocity
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800">
              161 Flagged Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous automated screening velocity across sanctioned works
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
          {(["7D", "30D", "3M", "1Y"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeRange === range
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="flaggedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-15" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0", className: "dark:stroke-slate-800" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-800 space-y-1">
                      <p className="font-bold text-slate-300">{label}</p>
                      <p className="text-rose-400 font-mono font-semibold">
                        Flagged Anomalies: {payload[0]?.value}
                      </p>
                      <p className="text-blue-400 font-mono font-semibold">
                        Average Risk Score: {payload[1]?.value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="flaggedAnomalies"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#flaggedGradient)"
              name="Flagged Anomalies"
            />
            <Area
              type="monotone"
              dataKey="avgRiskScore"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#scoreGradient)"
              name="Avg Risk Score"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Flagged Works Trend
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            Composite Risk Index
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Source: Sentinel AI Screening Stream
        </span>
      </div>
    </div>
  );
};
