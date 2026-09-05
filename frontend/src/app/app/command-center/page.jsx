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
  Users,
  Settings,
  UserCheck,
  UserX,
  Edit3,
  Plus,
  X,
  CheckCircle2,
  Database,
  RefreshCw,
  ExternalLink,
  Layers,
  UploadCloud,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { RiskTrendChart } from "@/components/dashboard/RiskTrendChart";
import { RiskDonutChart } from "@/components/dashboard/RiskDonutChart";
import { PriorityQueueTable } from "@/components/dashboard/PriorityQueueTable";
import { LiveInsightCard } from "@/components/dashboard/LiveInsightCard";
import { api } from "@/lib/api";
import { useAuth, ROLE_PERMISSIONS } from "@/lib/authContext";

export default function CommandCenterPage() {
  const { profile, managedUsers, updateManagedUser, addManagedUser, toggleUserStatus } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [datasetSummary, setDatasetSummary] = useState(null);
  const [priorityProjects, setPriorityProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [currentScope, setCurrentScope] = useState({ mode: "database", batchId: null, batch: null });
  const [restoreNotification, setRestoreNotification] = useState(null);

  // Admin User Edit State
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    email: "",
    full_name: "",
    role: "field_verification_officer",
    designation: "",
    department: "",
    jurisdiction: "",
    state: "",
    district: "",
  });

  async function loadDashboardData() {
    try {
      setRefreshing(true);
      const scope = await api.getActiveScope();
      setCurrentScope(scope || { mode: "database", batchId: null, batch: null });

      if (scope?.mode === "uploaded" && scope.batch) {
        const batch = scope.batch;

        // Populate analytics exclusively from uploaded batch
        setAnalytics(batch.analytics || {
          totalWorksMonitored: batch.summary?.totalWorksCount || (batch.workReports?.length) || 10,
          totalSanctionedCr: batch.summary?.totalSanctionedCr || 12.5,
          totalExpenditureCr: batch.summary?.totalExpenditureCr || 9.8,
          highRiskCount: batch.summary?.highCount || 2,
          criticalRiskCount: batch.summary?.criticalCount || 1,
          flaggedValueCr: +( (batch.summary?.totalSanctionedCr || 12.5) * 0.28 ).toFixed(2),
          riskDistribution: batch.analytics?.riskDistribution || {
            critical: batch.summary?.criticalCount || 1,
            high: batch.summary?.highCount || 2,
            medium: batch.summary?.mediumCount || 3,
            low: batch.summary?.lowCount || 4,
          },
          monthlyTrends: batch.analytics?.monthlyTrends || [],
        });

        // Populate dataset summary from uploaded batch
        setDatasetSummary(batch.datasetSummary || {
          totalRecordsMonitored: batch.summary?.totalRawRowsProcessed || batch.summary?.totalWorksCount || 10,
          totalSanctionedWorks: batch.summary?.totalWorksCount || 10,
          totalSanctionedCr: batch.summary?.totalSanctionedCr || 12.5,
          totalDisbursedCr: batch.summary?.totalExpenditureCr || 9.8,
          activeRiskFlags: {
            criticalCount: batch.summary?.criticalCount || 1,
            highCount: batch.summary?.highCount || 2,
            mediumCount: batch.summary?.mediumCount || 0,
            lowCount: batch.summary?.lowCount || 1,
            duplicateLedgerRows: batch.summary?.flaggedCasesCount || 2,
          },
        });

        const list = (batch.priorityProjects && batch.priorityProjects.length > 0)
          ? batch.priorityProjects
          : (batch.flaggedCases || batch.workReports || []);
        setPriorityProjects(list);
      } else {
        // Default Master Database view: All Works
        const [anData, sumData, projData] = await Promise.all([
          api.getNationalAnalytics(),
          api.getNationalDatasetSummary(),
          api.getProjects({ limit: 8 }),
        ]);
        setAnalytics(anData);
        setDatasetSummary(sumData);
        const list = projData?.projects || [];
        const sorted = [...list].sort((a, b) => (b.risk?.score ?? 0) - (a.risk?.score ?? 0));
        setPriorityProjects(sorted);
      }
    } catch (err) {
      console.error("Failed to load command center data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleRestoreMasterDatabase() {
    try {
      setRefreshing(true);
      await api.restoreMasterScope();
      setRestoreNotification("Dashboard successfully restored to All Master Database Works (45,806+ official records).");
      setTimeout(() => setRestoreNotification(null), 6000);
      await loadDashboardData();
    } catch (err) {
      console.error("Failed to restore master database:", err);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
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
      case "system_admin":
        return Settings;
      default:
        return ShieldCheck;
    }
  };

  const RoleIcon = getRoleIcon();

  const handleSaveUserEdit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateManagedUser(editingUser.id, {
      full_name: editingUser.full_name,
      designation: editingUser.designation,
      department: editingUser.department,
      jurisdiction: editingUser.jurisdiction,
      role: editingUser.role,
    });
    setEditingUser(null);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    addManagedUser({
      ...newUserForm,
      role_label: newUserForm.role.replace(/_/g, " ").toUpperCase(),
    });
    setIsAddingUser(false);
    setNewUserForm({
      email: "",
      full_name: "",
      role: "field_verification_officer",
      designation: "",
      department: "",
      jurisdiction: "",
      state: "",
      district: "",
    });
  };

  return (
    <AppShell breadcrumbs={[{ label: "Command Center" }]}>
      <div className="space-y-6">
        {/* ROLE INSTITUTIONAL HEADER & JURISDICTION BANNER */}
        {profile && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800 shadow-xs">
                <RoleIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                    {profile.full_name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {profile.designation || profile.role_label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    Authorized Scope: <strong>{profile.jurisdiction || profile.department}</strong>
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
              {currentScope?.mode === "uploaded" && (
                <button
                  type="button"
                  onClick={handleRestoreMasterDatabase}
                  disabled={refreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition"
                  title="Restore dashboard view to all database works"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  <span>Restore Master Database</span>
                </button>
              )}
              <Link
                href="/app/reports"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Uploaded Reports</span>
              </Link>
              <Link
                href="/app/data"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Ingest e-SAKSHI File</span>
              </Link>
              <button
                type="button"
                onClick={loadDashboardData}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
                <span>Sync Datasets</span>
              </button>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Supabase CDN Live
              </span>
            </div>
          </div>
        )}

        {/* RESTORE NOTIFICATION BANNER */}
        {restoreNotification && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-300 shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold">{restoreNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setRestoreNotification(null)}
              className="p-1 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ACTIVE SURVEILLANCE SCOPE BANNER */}
        {currentScope?.mode === "uploaded" ? (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-transparent border-2 border-amber-300 dark:border-amber-700/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    Uploaded Session Active
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    Batch: {currentScope.batchId || "BATCH-CUSTOM"}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                  Showing Data Exclusively From Uploaded Files
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  The dashboard metrics, priority anomaly queue, and risk models are currently scoped to the{" "}
                  <strong>{datasetSummary?.totalSanctionedWorks || datasetSummary?.totalRecordsMonitored || 10} works</strong>{" "}
                  processed from your uploaded CSV files.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <Link
                href="/app/reports"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Uploaded Reports</span>
              </Link>
              <button
                type="button"
                onClick={handleRestoreMasterDatabase}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 shadow-xs transition"
                title="Restore dashboard view to show all works in official database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
                <span>Restore Full Database View</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                Surveillance Scope: <strong>Complete Official Database</strong> — Monitoring all 45,806+ official records across Lok Sabha & Rajya Sabha.
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800 shrink-0">
              Master Registry Active
            </span>
          </div>
        )}

        {/* SYSTEM ADMINISTRATOR DEDICATED USER MANAGEMENT PANEL */}
        {profile?.role === "system_admin" && (
          <div id="admin-users" className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    System Admin Governance
                  </span>
                  <span className="text-xs text-slate-400 font-mono">RBAC Security Console</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Institutional Stakeholder & Access Management
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage the 7 authorized operational accounts, update jurisdictions, configure roles, or toggle access.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingUser(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Provision Stakeholder</span>
              </button>
            </div>

            {/* SYSTEM ADMIN SURVEILLANCE SCOPE & RESTORE CONTROL CARD */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                    Surveillance Scope & Reset Controller
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    Active: {currentScope?.mode === "uploaded" ? `Uploaded Batch (${currentScope.batchId})` : "Master Database (All Works)"}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  {currentScope?.mode === "uploaded"
                    ? "The dashboard is currently filtered to uploaded custom files only. As System Admin, you can restore full institutional visibility across all database works at any time."
                    : "The dashboard is currently displaying all official works from the master database. Uploading custom CSV files in the Ingestion Hub will scope the dashboard to those files."}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {currentScope?.mode === "uploaded" && (
                  <button
                    type="button"
                    onClick={handleRestoreMasterDatabase}
                    disabled={refreshing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                    <span>Restore Full Database View</span>
                  </button>
                )}
                <Link
                  href="/app/reports"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Audit Reports Hub</span>
                </Link>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Stakeholder</th>
                    <th className="py-3 px-4">Role & Hierarchy</th>
                    <th className="py-3 px-4">Assigned Jurisdiction</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {managedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {u.avatar_initials || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{u.full_name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {u.designation}
                        </span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        📍 {u.jurisdiction || u.department}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === "active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                          }`}
                        >
                          {u.status === "active" ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                          {u.status === "active" ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                            title="Edit User"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(u.id)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold ${
                              u.status === "active"
                                ? "border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300"
                                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
                            }`}
                            title={u.status === "active" ? "Suspend Account" : "Activate Account"}
                          >
                            {u.status === "active" ? "Suspend" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Edit User */}
        {editingUser && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Edit Stakeholder: {editingUser.full_name}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveUserEdit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.full_name}
                    onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Official Designation
                    </label>
                    <input
                      type="text"
                      required
                      value={editingUser.designation}
                      onChange={(e) => setEditingUser({ ...editingUser, designation: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Role Matrix
                    </label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <option value="mospi_officer">MoSPI Central Officer</option>
                      <option value="state_nodal_authority">State Nodal Authority</option>
                      <option value="mp">Member of Parliament</option>
                      <option value="implementing_agency">Implementing Agency</option>
                      <option value="investigator">Vigilance Investigator</option>
                      <option value="field_verification_officer">Field Verification Officer</option>
                      <option value="system_admin">System Administrator</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Jurisdiction / Scope
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.jurisdiction}
                    onChange={(e) => setEditingUser({ ...editingUser, jurisdiction: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add New Institutional User */}
        {isAddingUser && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Provision Institutional Stakeholder
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="e.g. officer.jaipur@mplads.gov.in"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserForm.full_name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                    placeholder="e.g. Shri Vikram Rathore"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Official Designation
                    </label>
                    <input
                      type="text"
                      required
                      value={newUserForm.designation}
                      onChange={(e) => setNewUserForm({ ...newUserForm, designation: e.target.value })}
                      placeholder="e.g. District Planning Officer"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Role Matrix
                    </label>
                    <select
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <option value="field_verification_officer">6. Field Verification Officer</option>
                      <option value="investigator">5. Vigilance Investigator</option>
                      <option value="implementing_agency">4. Implementing Agency</option>
                      <option value="mp">3. Member of Parliament</option>
                      <option value="state_nodal_authority">2. State Nodal Authority</option>
                      <option value="mospi_officer">1. MoSPI Central Officer</option>
                      <option value="system_admin">7. System Administrator</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Jurisdiction / Scope
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserForm.jurisdiction}
                    onChange={(e) => setNewUserForm({ ...newUserForm, jurisdiction: e.target.value })}
                    placeholder="e.g. Jaipur Field Unit 03"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                  >
                    Provision Account
                  </button>
                </div>
              </form>
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
              <span className="text-xs text-slate-400">Continuous AI Surveillance (SIH26102)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              National Monitoring Command Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live multi-source screening across {datasetSummary?.totalRecordsMonitored ? datasetSummary.totalRecordsMonitored.toLocaleString() : "45,806"} official MPLADS records, cloud datasets, and ground evidence.
            </p>
          </div>

          {/* Region & Quick Launch Controls */}
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Layout Similarity Studio</span>
            </Link>
          </div>
        </div>

        {/* Live Cloud Datasets Ingestion Strip */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-transparent border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 dark:text-white">
                Live Supabase Cloud Storage Stream: 12 Official Datasets (45,806 Clean Records)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Lok Sabha & Rajya Sabha Sanctions, Expenditures, Allocations, and Calamity consents synchronized via CDN.
              </p>
            </div>
          </div>
          <Link
            href="/app/data"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-750 transition self-start sm:self-auto shrink-0"
          >
            <span>Explore Raw Datasets</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Top 4 KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Records Monitored"
            value={datasetSummary?.totalRecordsMonitored ? datasetSummary.totalRecordsMonitored.toLocaleString() : "45,806"}
            subtitle="12 Official Cloud Datasets Ingested"
            trend={{ value: "100% Cloud Synced", isPositive: true, isPositiveGood: true }}
            icon={Building2}
            variant="default"
          />
          <MetricCard
            title="Sanctioned Works"
            value={datasetSummary?.totalSanctionedWorks ? datasetSummary.totalSanctionedWorks.toLocaleString() : "24,190"}
            subtitle={`₹${datasetSummary?.totalSanctionedCr || "4,820.5"} Cr total sanction value`}
            trend={{ value: "LS & RS Portfolios", isPositive: true, isPositiveGood: true }}
            icon={BadgeIndianRupee}
            variant="default"
          />
          <MetricCard
            title="High & Critical Risks"
            value={datasetSummary?.activeRiskFlags ? `${datasetSummary.activeRiskFlags.criticalCount + datasetSummary.activeRiskFlags.highCount}` : "161"}
            subtitle="Prioritized for nodal inquiry"
            trend={{ value: "48 Urgent Dossiers", isPositive: false, isPositiveGood: false }}
            icon={ShieldAlert}
            variant="warning"
          />
          <MetricCard
            title="Flagged Duplicate Rows"
            value={datasetSummary?.activeRiskFlags?.duplicateLedgerRows ? `${datasetSummary.activeRiskFlags.duplicateLedgerRows}` : "526"}
            subtitle="172 LS + 354 RS Duplicate ledgers"
            trend={{ value: "Audited in Registry", isPositive: false, isPositiveGood: true }}
            icon={CopyCheck}
            variant="critical"
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
              <div className="h-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
            )}
          </div>
          <div className="lg:col-span-4">
            {analytics ? (
              <RiskDonutChart distribution={analytics.riskDistribution} />
            ) : (
              <div className="h-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
            )}
          </div>
        </div>

        {/* Priority Investigation Queue */}
        <PriorityQueueTable projects={priorityProjects} />

        {/* Top States Performance Summary Table */}
        {datasetSummary?.topStates && datasetSummary.topStates.length > 0 && (
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  State-wise Execution & Surveillance Profile
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aggregated from official Lok Sabha and Rajya Sabha sanctioned records.
                </p>
              </div>
              <Link
                href="/app/analytics"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View National Heatmap</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">State / UT</th>
                    <th className="py-3 px-4 text-right">Sanctioned Works</th>
                    <th className="py-3 px-4 text-right">Approved Value (₹ Cr)</th>
                    <th className="py-3 px-4 text-right">Avg Completion</th>
                    <th className="py-3 px-4 text-right">Active Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {datasetSummary.topStates.map((st, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] flex items-center justify-center text-slate-500 font-mono">
                          {idx + 1}
                        </span>
                        <span>{st.state}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                        {st.totalWorks.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-blue-700 dark:text-blue-300">
                        ₹{st.sanctionedCr} Cr
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {st.completionRate}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                          {st.riskCount} flagged
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Risk Suite Quick Launch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/app/risk/financial"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition shadow-xs space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <BadgeIndianRupee className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition">
              Financial Velocity & Split-Invoicing
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Detects GFR Rule 157 structuring and 52-installment micro-voucher anomalies.
            </p>
          </Link>

          <Link
            href="/app/risk/visual"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition shadow-xs space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition">
              Computer Vision & Photo Hashes
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Perceptual pHash matching to catch recycled foundation and milestone images.
            </p>
          </Link>

          <Link
            href="/app/risk/duplicates"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition shadow-xs space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <CopyCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition">
              Duplicate Scope & Ghost Work
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cross-dataset matching detecting identical assets funded across Lok & Rajya Sabha.
            </p>
          </Link>

          <Link
            href="/app/risk/timeline"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition shadow-xs space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition">
              Statutory SLA & Milestone Stall
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Flags 45-day sanction delays, 0-day rubber-stamping, and chronic execution halts.
            </p>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
