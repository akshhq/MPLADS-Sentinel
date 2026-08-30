"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Camera, FileText, BadgeIndianRupee, MapPin, CheckCircle2, ArrowRight, } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { api } from "@/lib/api";
export default function EvidenceRepositoryPage() {
    const [evidenceList, setEvidenceList] = useState([]);
    const [selectedType, setSelectedType] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadEvidence() {
            setLoading(true);
            try {
                const list = await api.getEvidence({
                    type: selectedType !== "all" ? selectedType : undefined,
                    status: selectedStatus !== "all" ? selectedStatus : undefined,
                });
                setEvidenceList(list);
            }
            catch (err) {
                console.error("Failed to load evidence:", err);
            }
            finally {
                setLoading(false);
            }
        }
        loadEvidence();
    }, [selectedType, selectedStatus]);
    const filtered = evidenceList.filter((e) => {
        if (!search)
            return true;
        const q = search.toLowerCase();
        return (e.id.toLowerCase().includes(q) ||
            e.title.toLowerCase().includes(q) ||
            e.projectId.toLowerCase().includes(q) ||
            (e.projectTitle && e.projectTitle.toLowerCase().includes(q)));
    });
    return (<AppShell breadcrumbs={[{ label: "Evidence Repository" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                Authoritative Audit Repository
              </span>
              <span className="text-xs text-slate-400">Cryptographically Fingerprinted</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Evidence Repository & Provenance Chain
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore geotagged site photographs, OCR-scanned invoices, administrative sanctions, and treasury vouchers
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input type="text" placeholder="Search evidence by ID, project title, document type, or hash (e.g. 'EVD-IMG-001', 'Sanction', 'MPL-004821')..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Filter By:
            </span>

            {/* Type Filters */}
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none">
              <option value="all">All Evidence Types</option>
              <option value="image">📸 Photographs</option>
              <option value="document">📄 Invoices & Orders</option>
              <option value="payment">💰 Treasury Vouchers</option>
              <option value="certificate">📜 Certificates (UC)</option>
            </select>

            {/* Status Filters */}
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none">
              <option value="all">All Statuses</option>
              <option value="conflict">⚠ Flagged Conflict</option>
              <option value="verified">✓ Verified Authentic</option>
              <option value="review">⏳ Under Review</option>
            </select>

            {(selectedType !== "all" || selectedStatus !== "all" || search) && (<button onClick={() => {
                setSelectedType("all");
                setSelectedStatus("all");
                setSearch("");
            }} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors">
                Clear Filters
              </button>)}
          </div>
        </div>

        {/* Evidence List Grid */}
        {loading ? (<LoadingSkeleton variant="table" count={5}/>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => {
                const Icon = {
                    image: Camera,
                    document: FileText,
                    payment: BadgeIndianRupee,
                    certificate: CheckCircle2,
                    inspection: FileText,
                    gps: MapPin,
                    report: FileText,
                }[item.type] || FileText;
                const statusBadge = {
                    verified: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
                    conflict: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800",
                    review: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800",
                    missing: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
                }[item.status];
                return (<Link key={item.id} href={`/app/evidence/${item.id}`} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-600 shadow-sm transition-all flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                          <Icon className="w-4 h-4"/>
                        </div>
                        <span>{item.id}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge}`}>
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Linked Project: <strong className="font-mono text-slate-600 dark:text-slate-300">{item.projectId}</strong>
                      </p>
                    </div>

                    {item.findings && item.findings.length > 0 && (<div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-[11px] text-rose-700 dark:text-rose-300 space-y-0.5">
                        <span className="font-bold block">AI Flagged Finding:</span>
                        <p className="line-clamp-2 text-[10px]">{item.findings[0].description}</p>
                      </div>)}
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{item.provenance.sourceSystem.split(" ")[0]}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-sans font-bold flex items-center gap-1">
                      Inspect Record <ArrowRight className="w-3.5 h-3.5"/>
                    </span>
                  </div>
                </Link>);
            })}
          </div>)}
      </div>
    </AppShell>);
}
