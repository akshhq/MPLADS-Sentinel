"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, ShieldAlert, Sparkles, Building } from "lucide-react";
import { GeographicRiskPoint } from "@/types/analytics";
import { RiskBadge } from "../common/RiskBadge";
import { formatIndianCurrency } from "@/lib/formatters";

interface RiskMapPanelProps {
  points: GeographicRiskPoint[];
  className?: string;
}

export const RiskMapPanel: React.FC<RiskMapPanelProps> = ({ points, className = "" }) => {
  const [selectedPoint, setSelectedPoint] = useState<GeographicRiskPoint | null>(points[0] || null);

  // SVG Geographic normalization for India bounds: Lat 8 to 35, Lon 68 to 96
  const getCoordinates = (lat: number, lon: number) => {
    const minLat = 8;
    const maxLat = 35;
    const minLon = 68;
    const maxLon = 95;

    const x = ((lon - minLon) / (maxLon - minLon)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;

    return { x: `${Math.min(92, Math.max(8, x))}%`, y: `${Math.min(92, Math.max(8, y))}%` };
  };

  return (
    <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            National Geospatial Project Risk Map
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic anomaly concentration across monitored constituencies
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Critical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Normal
          </span>
        </div>
      </div>

      {/* Interactive Map Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Map Area */}
        <div className="lg:col-span-8 relative aspect-[4/3] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
          {/* Subtle Grid Map Canvas Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30 pointer-events-none" />

          {/* India Boundary Outline Graphic */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Interactive Markers */}
            {points.map((pt) => {
              const coords = getCoordinates(pt.latitude, pt.longitude);
              const isSelected = selectedPoint?.id === pt.id;

              const markerColor = {
                critical: "bg-rose-600 text-rose-100 ring-rose-400",
                high: "bg-orange-500 text-orange-100 ring-orange-400",
                medium: "bg-amber-500 text-amber-100 ring-amber-400",
                low: "bg-emerald-500 text-emerald-100 ring-emerald-400",
              }[pt.riskLevel];

              return (
                <button
                  key={pt.id}
                  onClick={() => setSelectedPoint(pt)}
                  style={{ left: coords.x, top: coords.y }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full ${markerColor} transition-all duration-200 ${
                    isSelected
                      ? "ring-4 scale-125 z-20 shadow-lg shadow-rose-900/50"
                      : "ring-2 hover:scale-110 z-10 opacity-90"
                  }`}
                  title={`${pt.projectTitle} (${pt.district})`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-3 left-3 text-[10px] text-slate-500 font-mono">
            Projection: WGS84 Geodetic • Click pins to inspect project anomaly twin
          </div>
        </div>

        {/* Selected Point Inspector Card */}
        <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-4">
          {selectedPoint ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                    {selectedPoint.projectId}
                  </span>
                  <RiskBadge level={selectedPoint.riskLevel} score={selectedPoint.riskScore} size="sm" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedPoint.projectTitle}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedPoint.district}, {selectedPoint.state}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-sans font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPoint.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sanctioned:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatIndianCurrency(selectedPoint.sanctionedAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">
                    {selectedPoint.latitude}° N, {selectedPoint.longitude}° E
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 space-y-1 text-xs">
                <span className="font-bold text-rose-700 dark:text-rose-300 block">
                  Primary Anomaly Signal:
                </span>
                <p className="text-[11px] text-rose-600 dark:text-rose-400">
                  {selectedPoint.primarySignal}
                </p>
              </div>

              <Link
                href={`/app/projects/${selectedPoint.projectId}`}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm transition-all"
              >
                <span>Inspect Digital Project Twin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Select a marker on the map to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
};
