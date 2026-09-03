"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Database,
  Search,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileText,
  Camera,
  BadgeIndianRupee,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  Fingerprint,
  Info,
  Clock,
  Building2,
  Lock,
  UserCheck,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { formatIndianCurrency } from "@/lib/formatters";
import { useAuth } from "@/lib/authContext";

// Pre-packaged official e-SAKSHI demo test files for 1-click evaluation
const DEMO_PRESETS = [
  {
    id: "bill_overclaim",
    label: "RA Bill #4 (Cost Inflation +31.4%)",
    category: "contractor_bill",
    icon: BadgeIndianRupee,
    fileName: "eSAKSHI_RA_Bill_04_RCC_Structural.pdf",
    fileSize: "2.4 MB",
    projectId: "MPL-004821",
    projectTitle: "Construction of Multipurpose Community Hall at Village Khera",
    description: "Measurement Book voucher claiming ₹14,200/cum vs CPWD ceiling ₹10,800/cum.",
  },
  {
    id: "photo_reused",
    label: "Foundation Site Photo (99.4% dHash Match)",
    category: "site_photo",
    icon: Camera,
    fileName: "Site_Foundation_Casting_Geotagged.jpg",
    fileSize: "3.8 MB",
    projectId: "MPL-004821",
    projectTitle: "Construction of Multipurpose Community Hall at Village Khera",
    description: "Inspection photo matching archived project in North West Delhi with 18.7km coordinate offset.",
  },
  {
    id: "pfms_advance",
    label: "PFMS Treasury Voucher (Premature Release)",
    category: "pfms_voucher",
    icon: FileText,
    fileName: "PFMS_Treasury_Release_Voucher_02.pdf",
    fileSize: "1.2 MB",
    projectId: "MPL-004821",
    projectTitle: "Construction of Multipurpose Community Hall at Village Khera",
    description: "88% fund disbursement recorded while certified physical progress is only 52%.",
  },
  {
    id: "batch_csv",
    label: "Sanctioned Works Registry Batch (Duplicate Scope)",
    category: "registry_csv",
    icon: Database,
    fileName: "eSAKSHI_Works_Sanctioned_Batch_2026.csv",
    fileSize: "4.1 MB",
    projectId: "MPL-004821",
    projectTitle: "Construction of Multipurpose Community Hall at Village Khera",
    description: "Official scheme CSV triggering <450m proximity duplicate cluster against MPL-004822.",
  },
];

export default function ESakshiIngestionPage() {
  const { profile } = useAuth();
  const role = profile?.role || "mospi_officer";

  // Filter presets authorized for current role per RBAC specification
  const authorizedPresets = DEMO_PRESETS.filter((p) => {
    if (role === "field_verification_officer") return p.category === "site_photo";
    if (role === "implementing_agency") return p.category === "contractor_bill";
    if (role === "mp") return p.category === "registry_csv";
    if (role === "state_nodal_authority") return p.category === "registry_csv" || p.category === "pfms_voucher";
    return true; // mospi_officer, investigator, system_admin
  });

  const authorizedCategories = [
    { value: "contractor_bill", label: "Invoices & Contractor RA Bills", roles: ["mospi_officer", "implementing_agency", "investigator", "state_nodal_authority", "system_admin"] },
    { value: "site_photo", label: "Geotagged Milestone Site Photographs", roles: ["mospi_officer", "field_verification_officer", "investigator", "state_nodal_authority", "system_admin"] },
    { value: "pfms_voucher", label: "PFMS Treasury Disbursement Vouchers", roles: ["mospi_officer", "state_nodal_authority", "investigator", "system_admin"] },
    { value: "sanction_order", label: "Administrative & Financial Sanction Orders", roles: ["mospi_officer", "mp", "state_nodal_authority", "investigator", "system_admin"] },
    { value: "registry_csv", label: "Master Scheme Dataset / Works CSV", roles: ["mospi_officer", "mp", "state_nodal_authority", "system_admin"] },
  ].filter((c) => c.roles.includes(role));

  const [activeTab, setActiveTab] = useState("upload"); // 'upload' | 'explorer'

  // Ingestion Form State
  const [selectedPreset, setSelectedPreset] = useState(authorizedPresets[0] || DEMO_PRESETS[0]);
  const [fileType, setFileType] = useState(authorizedPresets[0]?.category || DEMO_PRESETS[0].category);
  const [projectId, setProjectId] = useState(authorizedPresets[0]?.projectId || DEMO_PRESETS[0].projectId);
  const [projectTitle, setProjectTitle] = useState(authorizedPresets[0]?.projectTitle || DEMO_PRESETS[0].projectTitle);
  const [customFile, setCustomFile] = useState(null);
  const [fileName, setFileName] = useState(authorizedPresets[0]?.fileName || DEMO_PRESETS[0].fileName);
  const [fileSize, setFileSize] = useState(authorizedPresets[0]?.fileSize || DEMO_PRESETS[0].fileSize);

  // Pipeline Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [surveillanceResult, setSurveillanceResult] = useState(null);

  // Explorer Data State
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState("DS-REC-01");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const ds = await api.getDatasets();
        setDatasets(ds);
      } catch (err) {
        console.error("Failed to load datasets:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [role]);

  // Sync default preset when role switches
  useEffect(() => {
    if (authorizedPresets.length > 0) {
      const defaultP = authorizedPresets[0];
      setSelectedPreset(defaultP);
      setFileType(defaultP.category);
      setFileName(defaultP.fileName);
      setFileSize(defaultP.fileSize);
      setProjectId(defaultP.projectId);
      setProjectTitle(defaultP.projectTitle);
      setCustomFile(null);
      setSurveillanceResult(null);
    }
  }, [role]);

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setFileType(preset.category);
    setFileName(preset.fileName);
    setFileSize(preset.fileSize);
    setProjectId(preset.projectId);
    setProjectTitle(preset.projectTitle);
    setCustomFile(null);
    setSurveillanceResult(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomFile(file);
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setSelectedPreset(null);
      setSurveillanceResult(null);

      // Auto-detect category
      if (file.name.endsWith(".csv")) setFileType("registry_csv");
      else if (file.name.match(/\.(jpg|jpeg|png)$/i)) setFileType("site_photo");
      else if (file.name.toLowerCase().includes("voucher") || file.name.toLowerCase().includes("pfms")) setFileType("pfms_voucher");
      else setFileType("contractor_bill");
    }
  };

  const handleRunSurveillance = async () => {
    setIsProcessing(true);
    setSurveillanceResult(null);

    // Step-by-step progress simulation for realistic high-assurance surveillance
    setPipelineStep(1);
    await new Promise((r) => setTimeout(r, 650));

    setPipelineStep(2);
    await new Promise((r) => setTimeout(r, 700));

    setPipelineStep(3);
    await new Promise((r) => setTimeout(r, 750));

    setPipelineStep(4);
    await new Promise((r) => setTimeout(r, 600));

    try {
      let res;
      if (customFile) {
        const formData = new FormData();
        formData.append("file", customFile);
        formData.append("fileType", fileType);
        formData.append("projectId", projectId);
        formData.append("projectTitle", projectTitle);
        formData.append("fileName", fileName);
        formData.append("fileSize", fileSize);
        res = await api.ingestESakshiFile(formData);
      } else {
        res = await api.ingestESakshiFile({
          fileName,
          fileSize,
          fileType,
          projectId,
          projectTitle,
        });
      }
      setSurveillanceResult(res);
    } catch (err) {
      console.error("Surveillance Ingestion Error:", err);
    } finally {
      setIsProcessing(false);
      setPipelineStep(0);
    }
  };

  const currentDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0];
  const filteredRows = currentDataset
    ? currentDataset.sampleRows.filter((row) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return Object.values(row).some((val) => String(val).toLowerCase().includes(q));
      })
    : [];

  return (
    <AppShell breadcrumbs={[{ label: "e-SAKSHI Ingestion & Surveillance Hub" }]}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Institutional Positioning Banner */}
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/70 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/30 p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 rounded-full border border-blue-300 dark:border-blue-800">
                  e-SAKSHI Surveillance & Ingestion Layer
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Independent Verification • Does Not Replace e-SAKSHI
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                e-SAKSHI Project Lifecycle Ingestion Hub
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                <strong className="font-semibold text-slate-900 dark:text-white">Operational Paradigm: </strong>
                e-SAKSHI records administrative transactions and milestone workflows. MPLADS Sentinel acts as an independent AI-powered risk intelligence layer that audits, cross-verifies, and correlates evidence generated across the project lifecycle.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs">
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "upload"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Ingest e-SAKSHI Files</span>
              </button>
              <button
                onClick={() => setActiveTab("explorer")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "explorer"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>e-SAKSHI Master Registry</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stakeholder Jurisdictional & RBAC Data Scope Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-900 dark:bg-slate-950 text-slate-200 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs text-xs">
              {profile?.avatar_initials || "AS"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{profile?.full_name || "Authorized Official"}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                  {profile?.role_label || profile?.role?.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>Jurisdiction:</span>
                <strong className="text-slate-200 font-medium">{profile?.jurisdiction || "National Oversight (All India)"}</strong>
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Authorized Surveillance Scope
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {role === "field_verification_officer"
                ? "Physical Inspection Geotags & Site Photos"
                : role === "implementing_agency"
                ? "Assigned Works & Contractor RA Invoices"
                : role === "mp"
                ? "Constituency Sanction Register & Proposals"
                : role === "state_nodal_authority"
                ? "State Works, Calamity Ledger & PFMS Releases"
                : role === "investigator"
                ? "Flagged Inquiries & Fraud Collusion Dossiers"
                : "Full National Multi-Source PURVIEW (All Datasets)"}
            </span>
          </div>
        </div>

        {/* TAB 1: UPLOAD & INGESTION PORTAL */}
        {activeTab === "upload" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Upload Controls & 1-Click Presets */}
            <div className="lg:col-span-6 space-y-5">
              {/* 1-Click Quick Demo Presets */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      1-Click e-SAKSHI Demo Test Files
                    </h3>
                  </div>
                  <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    {authorizedPresets.length} Authorized Vector{authorizedPresets.length > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select an authorized e-SAKSHI lifecycle artifact for your role to verify how the 21-Module AI engine evaluates evidence:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {authorizedPresets.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = selectedPreset?.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-blue-50/80 dark:bg-blue-950/60 border-blue-500 dark:border-blue-500 shadow-xs"
                            : "bg-slate-50/60 dark:bg-slate-850/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`p-1.5 rounded-lg ${isSelected ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                            {preset.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {preset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ingestion Configuration Form */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    e-SAKSHI File Metadata & Scope Linking
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Target: {projectId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      e-SAKSHI Document Category
                    </label>
                    <select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {authorizedCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Project Digital Twin ID
                    </label>
                    <input
                      type="text"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Drag-and-Drop / File Picker Zone */}
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-950/40">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.csv,.xlsx,.jpg,.jpeg,.png,.json"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {customFile ? customFile.name : fileName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {customFile ? `${fileSize} • Click to replace file` : "Drag e-SAKSHI file here or click to browse local files"}
                      </p>
                    </div>
                    <span className="inline-block text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                      Supports PDF, CSV, GeoJPEG, PNG, MB Excel, PFMS Vouchers (Max 15MB)
                    </span>
                  </div>
                </div>

                {/* Execution Button */}
                <button
                  type="button"
                  onClick={handleRunSurveillance}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Running 21-Module AI Surveillance Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Run Sentinel Surveillance Verification</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Processing Timeline & Surveillance Findings */}
            <div className="lg:col-span-6 space-y-5">
              {/* Pipeline Multi-Stage Progress Animation */}
              {isProcessing && (
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Executing Real-Time Multi-Source Pipeline
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Step {pipelineStep} of 4
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${pipelineStep >= 1 ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" : "text-slate-400"}`}>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${pipelineStep >= 1 ? "text-blue-600" : "text-slate-300"}`} />
                      <span>[1/4] Validating e-SAKSHI schema & generating SHA-256 stamp</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${pipelineStep >= 2 ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" : "text-slate-400"}`}>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${pipelineStep >= 2 ? "text-blue-600" : "text-slate-300"}`} />
                      <span>[2/4] Cross-reconciling against PFMS Treasury & CPWD Cost Norms</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${pipelineStep >= 3 ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" : "text-slate-400"}`}>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${pipelineStep >= 3 ? "text-blue-600" : "text-slate-300"}`} />
                      <span>[3/4] Running Computer Vision (dHash 99.4%) & SBERT Entity Resolution</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${pipelineStep >= 4 ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" : "text-slate-400"}`}>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${pipelineStep >= 4 ? "text-blue-600" : "text-slate-300"}`} />
                      <span>[4/4] Synthesizing Multi-Vector Risk Score (0-100) & Evidence Dossier</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Surveillance Results Card */}
              {surveillanceResult && !isProcessing && (
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/80 p-5 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  {/* Top Status & Score Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          {surveillanceResult.data?.surveillanceOutcome?.priorityBand || "URGENT_AUDIT_QUEUE"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {surveillanceResult.data?.ingestionId}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                        Surveillance Anomalies Intercepted
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Linked Project: <strong className="text-slate-700 dark:text-slate-200 font-mono">{surveillanceResult.data?.targetProject?.id}</strong>
                      </p>
                    </div>

                    <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Composite Risk
                      </span>
                      <span className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400">
                        {surveillanceResult.data?.surveillanceOutcome?.compositeRiskScore}
                        <span className="text-xs text-slate-400 font-normal"> / 100</span>
                      </span>
                    </div>
                  </div>

                  {/* Cryptographic Provenance Fingerprint */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                        Tamper-Evident SHA-256 Digest
                      </span>
                      <span className="text-[10px] font-mono">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <p className="font-mono text-[10px] text-slate-700 dark:text-slate-300 break-all">
                      {surveillanceResult.data?.sha256Stamp}
                    </p>
                  </div>

                  {/* Intercepted Anomalies List */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Flagged Irregularities ({surveillanceResult.data?.surveillanceOutcome?.detectedAnomalies?.length || 0})
                    </h4>
                    {surveillanceResult.data?.surveillanceOutcome?.detectedAnomalies?.map((anomaly, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/30 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                            {anomaly.title}
                          </span>
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 uppercase">
                            {anomaly.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          {anomaly.detail}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Model: {anomaly.module}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Statutory Citations */}
                  <div className="space-y-1.5 pt-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Statutory Violations Cited
                    </h4>
                    <div className="space-y-1">
                      {surveillanceResult.data?.surveillanceOutcome?.statutoryCitations?.map((cit, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-relaxed">{cit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Links */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href={`/app/projects/${projectId}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                    >
                      <span>Open Project Twin</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/app/evidence"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Inspect in Evidence Vault</span>
                    </Link>
                    <Link
                      href={`/app/copilot?project=${projectId}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold hover:bg-purple-100 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Audit Copilot Query</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Idle Placeholder Info */}
              {!surveillanceResult && !isProcessing && (
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 text-center space-y-4 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Awaiting e-SAKSHI Ingestion Stream
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Upload any e-SAKSHI sanction order, measurement book bill, site photo, or scheme CSV, or select one of the 1-click test presets to trigger real-time AI verification.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleSelectPreset(authorizedPresets[0] || DEMO_PRESETS[0])}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Load Authorized Test Case ({authorizedPresets[0]?.label || "Demo Vector"})</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MASTER SCHEME DATASET EXPLORER */}
        {activeTab === "explorer" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Authorized Institutional Datasets ({datasets.length})
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                  Filtered for {profile?.role_label || profile?.role?.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Dataset Switcher Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {datasets.map((ds) => {
                const isSelected = ds.id === currentDataset?.id;
                return (
                  <button
                    key={ds.id}
                    onClick={() => setSelectedDatasetId(ds.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? "bg-blue-50/60 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-xs"
                        : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className={`w-4 h-4 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                        <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                          {ds.id}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {ds.totalRows.toLocaleString("en-IN")} Rows
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {ds.name}
                    </p>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {ds.sourceOfficialName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Data Table with Search */}
            {currentDataset && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {currentDataset.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {currentDataset.description}
                    </p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter records in this schema..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                      <tr>
                        {currentDataset.columns.map((col) => (
                          <th key={col.key} className="px-4 py-3 whitespace-nowrap">
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                      {filteredRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                          {currentDataset.columns.map((col) => (
                            <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                              {col.dataType === "currency" && typeof row[col.key] === "number"
                                ? formatIndianCurrency(row[col.key])
                                : String(row[col.key])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
