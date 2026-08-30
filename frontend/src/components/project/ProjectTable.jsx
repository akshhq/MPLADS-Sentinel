"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, ArrowUpDown, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { RiskBadge } from "../common/RiskBadge";
import { formatIndianCurrency } from "@/lib/formatters";
export const ProjectTable = ({ projects, total }) => {
    const [sortField, setSortField] = useState("risk");
    const [sortAsc, setSortAsc] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const handleSort = (field) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        }
        else {
            setSortField(field);
            setSortAsc(false);
        }
    };
    const sortedProjects = [...projects].sort((a, b) => {
        let aVal = "";
        let bVal = "";
        if (sortField === "risk") {
            aVal = a.risk.score;
            bVal = b.risk.score;
        }
        else if (sortField === "sanctioned") {
            aVal = a.financials.sanctionedAmount;
            bVal = b.financials.sanctionedAmount;
        }
        else {
            const field = sortField;
            const rawA = a[field];
            const rawB = b[field];
            aVal = typeof rawA === "string" || typeof rawA === "number" ? rawA : "";
            bVal = typeof rawB === "string" || typeof rawB === "number" ? rawB : "";
        }
        if (aVal < bVal)
            return sortAsc ? -1 : 1;
        if (aVal > bVal)
            return sortAsc ? 1 : -1;
        return 0;
    });
    const totalPages = Math.ceil(sortedProjects.length / pageSize) || 1;
    const paginatedProjects = sortedProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const exportCSV = () => {
        const headers = "Project ID,Title,Category,State,District,Sanctioned (INR),Financial Progress (%),Physical Progress (%),Risk Score,Risk Level\n";
        const rows = projects
            .map((p) => `"${p.id}","${p.title.replace(/"/g, '""')}","${p.category}","${p.state}","${p.district}",${p.financials.sanctionedAmount},${p.financialProgress},${p.physicalProgress},${p.risk.score},"${p.risk.level}"`)
            .join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `MPLADS_Sentinel_Projects_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (<div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Table Top Controls */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Showing <strong className="text-slate-900 dark:text-white">{projects.length}</strong> of{" "}
          <strong className="text-slate-900 dark:text-white">{total}</strong> projects matching active filters
        </p>

        <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold">
          <Download className="w-3.5 h-3.5"/>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">
                <button onClick={() => handleSort("id")} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                  <span>Project ID</span>
                  <ArrowUpDown className="w-3 h-3"/>
                </button>
              </th>
              <th className="px-4 py-3 max-w-sm">Work Description & Category</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">
                <button onClick={() => handleSort("sanctioned")} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                  <span>Sanctioned</span>
                  <ArrowUpDown className="w-3 h-3"/>
                </button>
              </th>
              <th className="px-4 py-3">Progress (Fin vs Phy)</th>
              <th className="px-4 py-3">
                <button onClick={() => handleSort("risk")} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                  <span>Composite Risk</span>
                  <ArrowUpDown className="w-3 h-3"/>
                </button>
              </th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedProjects.map((project) => (<tr key={project.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors group cursor-pointer">
                {/* ID */}
                <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  <Link href={`/app/projects/${project.id}`} className="hover:underline">
                    {project.id}
                  </Link>
                </td>

                {/* Description & Category */}
                <td className="px-4 py-3.5 max-w-xs">
                  <Link href={`/app/projects/${project.id}`} className="block">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {project.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {project.category} • {project.implementingAgency}
                    </p>
                  </Link>
                </td>

                {/* Location */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
                    <span>{project.district}, {project.state}</span>
                  </div>
                </td>

                {/* Sanctioned Amount */}
                <td className="px-4 py-3.5 whitespace-nowrap font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {formatIndianCurrency(project.financials.sanctionedAmount)}
                </td>

                {/* Progress Gap Bar */}
                <td className="px-4 py-3.5 min-w-[140px]">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Fin: <strong className="font-mono">{project.financialProgress}%</strong></span>
                      <span>Phy: <strong className="font-mono">{project.physicalProgress}%</strong></span>
                    </div>
                    {/* Visual mini-bar */}
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="bg-blue-600 h-full" style={{ width: `${project.financialProgress}%` }} title={`Financial Progress: ${project.financialProgress}%`}/>
                      <div className="bg-emerald-500 h-full" style={{ width: `${project.physicalProgress}%` }} title={`Physical Progress: ${project.physicalProgress}%`}/>
                    </div>
                    {Math.abs(project.financialProgress - project.physicalProgress) >= 25 && (<span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block">
                        Gap: {Math.abs(project.financialProgress - project.physicalProgress)}% points
                      </span>)}
                  </div>
                </td>

                {/* Risk */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <RiskBadge level={project.risk.level} score={project.risk.score} size="sm"/>
                </td>

                {/* Action */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <Link href={`/app/projects/${project.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-900 hover:text-white dark:hover:bg-blue-600 transition-all shadow-xs">
                    <span>Digital Twin</span>
                    <ArrowRight className="w-3.5 h-3.5"/>
                  </Link>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ChevronLeft className="w-4 h-4"/>
          </button>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>);
};
