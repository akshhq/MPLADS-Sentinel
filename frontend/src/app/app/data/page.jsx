"use client";
import React, { useEffect, useState } from "react";
import { Database, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { formatIndianCurrency } from "@/lib/formatters";
export default function DataExplorerPage() {
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
            }
            catch (err) {
                console.error("Failed to load datasets:", err);
            }
            finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);
    const currentDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0];
    const filteredRows = currentDataset
        ? currentDataset.sampleRows.filter((row) => {
            if (!search)
                return true;
            const q = search.toLowerCase();
            return Object.values(row).some((val) => String(val).toLowerCase().includes(q));
        })
        : [];
    return (<AppShell breadcrumbs={[{ label: "Data Explorer" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                Grounding Dataset Explorer
              </span>
              <span className="text-xs text-slate-400">eSAKSHI & PFMS Ingestion Logs</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              MPLADS Official Ingestion Data Explorer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect underlying raw data schemas across MP recommendations, administrative sanctions, and treasury disbursements
            </p>
          </div>
        </div>

        {/* Dataset Switcher Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {datasets.map((ds) => {
            const isSelected = ds.id === currentDataset?.id;
            return (<button key={ds.id} onClick={() => setSelectedDatasetId(ds.id)} className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${isSelected
                    ? "bg-blue-50/60 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className={`w-4 h-4 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}/>
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
              </button>);
        })}
        </div>

        {/* Data Table with Search */}
        {currentDataset && (<div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-5">
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"/>
                <input type="text" placeholder="Filter records in this schema..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"/>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    {currentDataset.columns.map((col) => (<th key={col.key} className="px-4 py-3 whitespace-nowrap">
                        {col.label}
                      </th>))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  {filteredRows.map((row, rIdx) => (<tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                      {currentDataset.columns.map((col) => (<td key={col.key} className="px-4 py-3 whitespace-nowrap">
                          {col.dataType === "currency" && typeof row[col.key] === "number"
                        ? formatIndianCurrency(row[col.key])
                        : String(row[col.key])}
                        </td>))}
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}
      </div>
    </AppShell>);
}
