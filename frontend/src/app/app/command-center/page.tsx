"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  BadgeIndianRupee,
  Calendar,
  Filter,
  ArrowRight,
  Sparkles,
  Camera,
  CopyCheck,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { RiskTrendChart } from "@/components/dashboard/RiskTrendChart";
import { RiskDonutChart } from "@/components/dashboard/RiskDonutChart";
import { PriorityQueueTable } from "@/components/dashboard/PriorityQueueTable";
import { LiveInsightCard } from "@/components/dashboard/LiveInsightCard";
import { api } from "@/lib/api";
import { Project } from "@/types/project";
import { NationalAnalytics } from "@/types/analytics";
import { formatLakhCrore } from "@/lib/formatters";

export default function CommandCenterPage() {
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
        // Sort priority projects by risk score descending
        const sorted = [...projData.projects].sort((a, b) => b.risk.score - a.risk.score);
        setPriorityProjects(sorted);
      } catch (err) {
        console.error("Failed to load command center data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <AppShell breadcrumbs={[{ label: "Command Center" }]}>
      <div className="space-y-6">
        {/* Page Header with Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                MoSPI National Risk Intelligence
              </span>
              <span className="text-xs text-slate-400">
                Live Ingestion Active
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              National Monitoring Command Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evidence-linked screening across 18,432 MPLADS projects, financial ledgers, and site photographs
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
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

        {/* Live Anomaly Insight Banner */}
        <LiveInsightCard />

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            {analytics ? (
              <RiskTrendChart data={analytics.monthlyTrends} />
            ) : (
              <div className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-shimmer" />
            )}
          </div>
          <div className="lg:col-span-4">
            {analytics ? (
              <RiskDonutChart distribution={analytics.riskDistribution} />
            ) : (
              <div className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-shimmer" />
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
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
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
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 shadow-xs transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${mod.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {mod.count}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {mod.label}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
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
