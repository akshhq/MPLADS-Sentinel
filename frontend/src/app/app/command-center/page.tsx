"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  BadgeIndianRupee,
  Calendar,
  Sparkles,
  Camera,
  CopyCheck,
  FileText,
  Clock,
  MapPin,
  Landmark,
  HardHat,
  SearchCode,
  ClipboardCheck,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { RiskTrendChart } from "@/components/dashboard/RiskTrendChart";
import { RiskDonutChart } from "@/components/dashboard/RiskDonutChart";
import { PriorityQueueTable } from "@/components/dashboard/PriorityQueueTable";
import { LiveInsightCard } from "@/components/dashboard/LiveInsightCard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/authContext";
import { Project } from "@/types/project";
import { NationalAnalytics } from "@/types/analytics";

export default function CommandCenterPage() {
  const { profile } = useAuth();
  const [analytics, setAnalytics] = useState<NationalAnalytics | null>(null);
  const [priorityProjects, setPriorityProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("all");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [anData, projData] = await Promise.all([
          api.getNationalAnalytics(),
          api.getProjects({ limit: 6 }),
        ]);
        setAnalytics(anData);
        const list = projData?.projects || [];
        const sorted = [...list].sort(
          (a, b) => (b.risk?.score ?? 0) - (a.risk?.score ?? 0)
        );
        setPriorityProjects(sorted);
      } catch (err) {
        console.error("Failed to load command center data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getRoleIcon = () => {
    switch (profile?.role) {
      case "state_nodal_authority":
        return Landmark;
      case "mp":
        return Landmark;
      case "implementing_agency":
        return HardHat;
      case "investigator":
        return SearchCode;
      case "field_verification_officer":
        return ClipboardCheck;
      default:
        return ShieldCheck;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <AppShell breadcrumbs={[{ label: "Command Center" }]}>
      <div className="space-y-6">
        {/* Role Jurisdiction Greeting Banner */}
        {profile && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                <RoleIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    {profile.full_name}
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {profile.designation}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Authorized Scope: <strong>{profile.jurisdiction || profile.department}</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
          </div>
        )}

        {/* Page Header with Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                MoSPI National Risk Intelligence
              </span>
              <span className="text-xs text-slate-400">
                Continuous AI Surveillance
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              National Monitoring Command Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-source screening across 18,432 MPLADS projects, financial ledgers, and ground evidence
            </p>
          </div>

          {/* Region & Period Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>FY 2025–26 (YTD)</span>
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              aria-label="Select State / UT Region"
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-xs focus:outline-none"
            >
              <option value="all">All States & UTs (National)</option>
              <option value="delhi">Delhi (NCT)</option>
              <option value="up">Uttar Pradesh</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="karnataka">Karnataka</option>
              <option value="bihar">Bihar</option>
              <option value="rajasthan">Rajasthan</option>
              <option value="kerala">Kerala</option>
            </select>

            <Link
              href="/app/risk/documents/compare"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Layout Similarity Studio</span>
            </Link>
          </div>
        </div>

        {/* Top 4 KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Works Monitored"
            value="18,432"
            subtitle="100% of sanctioned works screened"
            trend={{ value: "+14.2% YoY", isPositive: true, isPositiveGood: true }}
            icon={Building2}
            variant="default"
          />
          <MetricCard
            title="High Risk Cases"
            value="127"
            subtitle="Prioritized for nodal inquiry"
            trend={{ value: "+8 this month", isPositive: true, isPositiveGood: false }}
            icon={ShieldAlert}
            variant="warning"
          />
          <MetricCard
            title="Critical Risk Cases"
            value="34"
            subtitle="Multi-source inconsistency verified"
            trend={{ value: "Urgent Review", isPositive: false, isPositiveGood: false }}
            icon={ShieldAlert}
            variant="critical"
          />
          <MetricCard
            title="Flagged Sanction Value"
            value="₹42.8 Cr"
            subtitle="Across prioritized anomalous works"
            trend={{ value: "0.87% of total funds", isPositive: false, isPositiveGood: true }}
            icon={BadgeIndianRupee}
            variant="default"
          />
        </div>

        {/* Live Anomaly Insight Card */}
        <LiveInsightCard />

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            {analytics ? (
              <RiskTrendChart data={analytics.monthlyTrends} />
            ) : (
              <div className="h-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-shimmer" />
            )}
          </div>
          <div className="lg:col-span-4">
            {analytics ? (
              <RiskDonutChart distribution={analytics.riskDistribution} />
            ) : (
              <div className="h-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-shimmer" />
            )}
          </div>
        </div>

        {/* Priority Investigation Queue */}
        <PriorityQueueTable projects={priorityProjects} />

        {/* Risk Suite Quick Launch Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sentinel Specialized Intelligence Modules
            </h3>
            <Link
              href="/app/risk"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:underline"
            >
              Explore Full Risk Suite →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: "Financial Velocity", count: "47 Flags", href: "/app/risk/financial", icon: BadgeIndianRupee, desc: "Cost inflation & split payments", color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60" },
              { label: "Computer Vision (CV)", count: "31 Flags", href: "/app/risk/visual", icon: Camera, desc: "Image reuse & stage mismatch", color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60" },
              { label: "Duplicate Scopes", count: "19 Clusters", href: "/app/risk/duplicates", icon: CopyCheck, desc: "SBERT text & GIS proximity", color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60" },
              { label: "Document OCR", count: "26 Flags", href: "/app/risk/documents", icon: FileText, desc: "Cross-document discrepancy", color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60" },
              { label: "Timeline & Delays", count: "38 Flags", href: "/app/risk/timeline", icon: Clock, desc: "Milestone delay & deadline risk", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60" },
            ].map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.label}
                  href={mod.href}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${mod.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {mod.count}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white">
                    {mod.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {mod.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
