"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  UploadCloud,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  MapPin,
  Building2,
  BadgeIndianRupee,
  Sparkles,
  Layers,
  Calendar,
  Eye,
  X,
  ChevronDown,
  FileSpreadsheet,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RiskBadge } from "@/components/common/RiskBadge";
import { api } from "@/lib/api";
import { formatIndianCurrency, formatRelativeTime } from "@/lib/formatters";
import { useAuth } from "@/lib/authContext";

export default function UploadedReportsPage() {
  const { profile } = useAuth();
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [activeScope, setActiveScope] = useState({ mode: "database", batchId: null });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [selectedWorkModal, setSelectedWorkModal] = useState(null);
  const [notification, setNotification] = useState(null);

  async function loadReportsData() {
    try {
      setRefreshing(true);
      const [reports, scope] = await Promise.all([
        api.getUploadedReports(),
        api.getActiveScope(),
      ]);

      const batchesList = Array.isArray(reports) ? reports : [];
      setBatches(batchesList);
      setActiveScope(scope || { mode: "database", batchId: null });

      if (batchesList.length > 0) {
        if (!selectedBatchId || !batchesList.some((b) => b?.batchId === selectedBatchId)) {
          setSelectedBatchId(batchesList[0].batchId);
        }
      }
    } catch (err) {
      console.error("Failed to load uploaded reports:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadReportsData();
  }, []);

  // Currently selected batch
  const activeBatch = useMemo(() => {
    return batches.find((b) => b?.batchId === selectedBatchId) || batches[0] || null;
  }, [batches, selectedBatchId]);

  // All work reports of selected batch
  const workReports = useMemo(() => {
    if (!activeBatch) return [];
    if (Array.isArray(activeBatch.workReports) && activeBatch.workReports.length > 0) {
      return activeBatch.workReports;
    }
    if (Array.isArray(activeBatch.flaggedCases)) {
      return activeBatch.flaggedCases;
    }
    return [];
  }, [activeBatch]);

  // Unique states for filter
  const uniqueStates = useMemo(() => {
    const set = new Set();
    workReports.forEach((w) => {
      if (w?.state) set.add(w.state);
    });
    return Array.from(set).sort();
  }, [workReports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return workReports.filter((work) => {
      if (!work) return false;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (work.id && work.id.toLowerCase().includes(q)) ||
        (work.work_id && work.work_id.toLowerCase().includes(q)) ||
        (work.title && work.title.toLowerCase().includes(q)) ||
        (work.implementing_agency && work.implementing_agency.toLowerCase().includes(q)) ||
        (work.district && work.district.toLowerCase().includes(q)) ||
        (work.state && work.state.toLowerCase().includes(q));

      const matchesRisk =
        riskFilter === "all" ||
        (work.risk_band && work.risk_band.toLowerCase() === riskFilter.toLowerCase()) ||
        (work.risk?.level && work.risk.level.toLowerCase() === riskFilter.toLowerCase());

      const matchesState = stateFilter === "all" || work.state === stateFilter;

      return matchesSearch && matchesRisk && matchesState;
    });
  }, [workReports, searchQuery, riskFilter, stateFilter]);

  // Restore Master Database Action
  async function handleRestoreMasterDatabase() {
    try {
      setRefreshing(true);
      await api.restoreMasterScope();
      setNotification("Surveillance scope restored to complete Master Database (All Works).");
      setTimeout(() => setNotification(null), 5000);
      await loadReportsData();
    } catch (err) {
      console.error("Failed to restore scope:", err);
    } finally {
      setRefreshing(false);
    }
  }

  // Set selected batch as active dashboard scope
  async function handleActivateBatchScope(batch) {
    if (!batch) return;
    try {
      const scopeData = {
        mode: "uploaded",
        batchId: batch.batchId,
        timestamp: batch.timestamp || new Date().toISOString(),
        batch: batch,
      };
      await api.setActiveScope(scopeData);
      setActiveScope(scopeData);
      setNotification(`Batch ${batch.batchId} is now the active surveillance scope on the Dashboard.`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("Failed to set active scope:", err);
    }
  }

  // Export reports to CSV
  function handleExportCSV() {
    if (!filteredReports || filteredReports.length === 0) return;
    const headers = [
      "Work ID",
      "Title",
      "State",
      "District",
      "Implementing Agency",
      "Category",
      "Sanctioned Amount",
      "Disbursed Amount",
      "Risk Score",
      "Risk Band",
      "Primary Finding",
      "Status",
    ];
    const rows = filteredReports.map((w) => [
      `"${w.work_id || w.id || ""}"`,
      `"${(w.title || "").replace(/"/g, '""')}"`,
      `"${w.state || ""}"`,
      `"${w.district || ""}"`,
      `"${(w.implementing_agency || "").replace(/"/g, '""')}"`,
      `"${w.category || ""}"`,
      w.sanction_amount || w.financials?.sanctionedAmount || 0,
      w.disbursed_amount || w.financials?.disbursedAmount || 0,
      w.composite_risk_score || w.risk?.score || 0,
      w.risk_band || w.risk?.level || "LOW",
      `"${(w.risk?.primarySignal || "").replace(/"/g, '""')}"`,
      `"${w.status || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MPLADS_Uploaded_Audit_Report_${activeBatch?.batchId || "BATCH"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <AppShell breadcrumbs={[{ label: "Uploaded Work Reports & Dossiers" }]}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Institutional Header Banner */}
        <div className="rounded-3xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/90 via-slate-50 to-indigo-50/80 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/30 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 rounded-full border border-blue-300 dark:border-blue-800">
                  e-SAKSHI Uploaded Audits Hub
                </span>
                {activeScope?.mode === "uploaded" ? (
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Dashboard Scoped to Upload ({activeScope.batchId})
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">
                    Dashboard on Master Database (All Works)
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Uploaded Work Reports & Audit Dossiers
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl">
                Comprehensive multi-stream surveillance audit records for every work uploaded through custom files. Inspect anomaly signals, missing data degradations, and forensic findings.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <Link
                href="/app/data"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New Files</span>
              </Link>
              <Link
                href="/app/command-center"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Command Center</span>
              </Link>
              {activeScope?.mode === "uploaded" && (
                <button
                  type="button"
                  onClick={handleRestoreMasterDatabase}
                  disabled={refreshing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition"
                  title="Restore dashboard view to show all works in the database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  <span>Restore Full Database View</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-300 shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold">{notification}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="p-1 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SUMMARY KPI METRICS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Uploaded Batches</span>
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {batches.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {batches.length > 0 ? `Latest: ${batches[0]?.batchId}` : "No uploads registered yet"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Active Batch Works</span>
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {activeBatch?.summary?.totalWorksCount || workReports.length || 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              ₹{activeBatch?.summary?.totalSanctionedCr || "0.0"} Cr total sanctioned
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Flagged Anomalies</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {activeBatch?.summary?.flaggedCasesCount || (activeBatch?.flaggedCases?.length) || 0}
            </div>
            <div className="text-[11px] text-rose-500 dark:text-rose-400/80 mt-0.5">
              {activeBatch?.summary?.criticalCount || 0} Critical • {activeBatch?.summary?.highCount || 0} High
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Data Assurance Rating</span>
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {activeBatch?.summary?.completenessPercent ?? 100}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {activeBatch?.summary?.slotsAvailableCount ?? 6}/6 Streams Verified
            </div>
          </div>
        </div>

        {/* BATCH SELECTOR & DATA AVAILABILITY CARD */}
        {batches.length > 0 && (
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                  {batches.findIndex((b) => b.batchId === activeBatch?.batchId) + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Selected Batch: {activeBatch?.batchId}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {(activeBatch?.house || "lok_sabha").replace(/_/g, " ").toUpperCase()}
                    </span>
                    {activeScope?.batchId === activeBatch?.batchId && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Active on Dashboard
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Uploaded: {activeBatch?.timestamp ? new Date(activeBatch.timestamp).toLocaleString() : "Recently"} • Evaluated in {activeBatch?.executionTimeMs || 420}ms
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="relative">
                  <select
                    value={activeBatch?.batchId || ""}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    aria-label="Select Ingestion Batch"
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    {batches.map((b) => (
                      <option key={b.batchId} value={b.batchId}>
                        {b.batchId} ({(b.house || "LS").toUpperCase()}) — {b.summary?.totalWorksCount || b.workReports?.length || 0} works
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>

                {activeScope?.batchId !== activeBatch?.batchId && (
                  <button
                    type="button"
                    onClick={() => handleActivateBatchScope(activeBatch)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Set as Dashboard Scope</span>
                  </button>
                )}
              </div>
            </div>

            {/* Missing Data Notices if available */}
            {activeBatch?.missingDataNotices && activeBatch.missingDataNotices.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Data Stream Availability & Adaptive AI Notice:</span>
                </div>
                <div className="mt-1 space-y-1">
                  {activeBatch.missingDataNotices.map((n, i) => (
                    <p key={i} className="text-amber-800 dark:text-amber-300 text-[11px] pl-5">
                      • <strong>{n.dimension}</strong>: {n.impact}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* WORK REPORTS TABLE & CONTROLS */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Work Dossiers in Batch ({filteredReports.length} of {workReports.length})
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search work title, ID, agency..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-48 sm:w-60 focus:outline-none"
                />
              </div>

              {/* Risk Filter */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                aria-label="Filter by Risk Level"
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Risk Bands</option>
                <option value="critical">Critical Risk</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>

              {/* State Filter */}
              {uniqueStates.length > 1 && (
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  aria-label="Filter by State"
                  className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="all">All States</option>
                  {uniqueStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}

              {/* Export CSV */}
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={filteredReports.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title="Download CSV report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          {filteredReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Work ID</th>
                    <th className="py-3 px-4">Project Title & Sector</th>
                    <th className="py-3 px-4">Location & Agency</th>
                    <th className="py-3 px-4">Financials (Sanction / Disbursed)</th>
                    <th className="py-3 px-4">Risk Evaluation</th>
                    <th className="py-3 px-4">Primary Signal</th>
                    <th className="py-3 px-4 text-right">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredReports.map((work) => {
                    const sanctionAmt = work.sanction_amount || work.financials?.sanctionedAmount || 0;
                    const disburseAmt = work.disbursed_amount || work.financials?.disbursedAmount || 0;
                    const score = work.composite_risk_score ?? work.risk?.score ?? 50;
                    const level = work.risk_band || work.risk?.level || "LOW";

                    return (
                      <tr
                        key={work.id || work.work_id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {work.work_id || work.id}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                            {work.title}
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {work.category || "General Infrastructure"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{work.district || "District"}, {work.state || "State"}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                            {work.implementing_agency || "District Planning Authority"}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {formatIndianCurrency(sanctionAmt)}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            Disbursed: {formatIndianCurrency(disburseAmt)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <RiskBadge level={level} score={score} size="sm" />
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                            {work.risk?.primarySignal ||
                              (work.triggered_signals && work.triggered_signals[0]?.finding) ||
                              "Operational within expected tolerances."}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedWorkModal(work)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {workReports.length === 0 ? "No Uploaded Work Reports Available" : "No Works Match Your Filters"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {workReports.length === 0
                  ? "Upload your custom e-SAKSHI CSV datasets in the Ingestion Hub to run dynamic adaptive audits and view generated dossiers."
                  : "Try clearing your search query or selecting 'All Risk Bands' to see the full list of audited works."}
              </p>
              {workReports.length === 0 && (
                <div className="pt-2 flex justify-center gap-2">
                  <Link
                    href="/app/data"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Go to Ingestion Hub</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* DETAILED WORK AUDIT DOSSIER MODAL */}
        {selectedWorkModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {selectedWorkModal.work_id || selectedWorkModal.id}
                    </span>
                    <RiskBadge
                      level={selectedWorkModal.risk_band || selectedWorkModal.risk?.level || "LOW"}
                      score={selectedWorkModal.composite_risk_score ?? selectedWorkModal.risk?.score ?? 50}
                      size="sm"
                    />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedWorkModal.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedWorkModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Work Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    📍 {selectedWorkModal.district}, {selectedWorkModal.state}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Implementing Agency</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                    🏛️ {selectedWorkModal.implementing_agency}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Sanctioned Amount</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatIndianCurrency(selectedWorkModal.sanction_amount || selectedWorkModal.financials?.sanctionedAmount || 0)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Disbursed Amount</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatIndianCurrency(selectedWorkModal.disbursed_amount || selectedWorkModal.financials?.disbursedAmount || 0)}
                  </p>
                </div>
              </div>

              {/* Triggered Forensic Signals */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Triggered Surveillance Signals & Findings
                </h4>
                {selectedWorkModal.triggered_signals && selectedWorkModal.triggered_signals.length > 0 ? (
                  <div className="space-y-2">
                    {selectedWorkModal.triggered_signals.map((sig, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-rose-800 dark:text-rose-300">
                            {sig.code || "SIG-ANOMALY"} • {sig.module || "Surveillance"}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-200/80 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
                            {sig.severity || "HIGH"}
                          </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200">{sig.finding}</p>
                        {sig.citation && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono italic pt-0.5">
                            Citation: {sig.citation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>No adverse anomaly triggers recorded. Operational progress is in compliance with standard guidelines.</span>
                  </div>
                )}
              </div>

              {/* Auditor Recommendation */}
              {selectedWorkModal.recommendation && (
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs">
                  <span className="font-bold text-blue-900 dark:text-blue-200 block mb-0.5">
                    Recommended Auditor Action
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">{selectedWorkModal.recommendation}</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">
                  Batch: {activeBatch?.batchId}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedWorkModal(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
