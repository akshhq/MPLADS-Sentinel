"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  FileText,
  FileCheck,
  SearchCode,
  BarChart3,
  Sparkles,
  Database,
  UploadCloud,
  ShieldCheck,
  ExternalLink,
  ScanLine,
  Users,
  HardHat,
  ClipboardCheck,
} from "lucide-react";
import { APP_NAME, APP_HINDI_NAME, SIH_PROBLEM_ID } from "@/lib/constants";
import { useAuth } from "@/lib/authContext";

export const Sidebar = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { profile } = useAuth();
  const role = profile?.role || "mospi_officer";

  // Build role-specific navigation menu
  const getNavItems = () => {
    switch (role) {
      case "system_admin":
        return [
          { label: "Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "User & RBAC Manager", href: "/app/command-center#admin-users", icon: Users, badge: "Admin", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "Master Projects", href: "/app/projects", icon: FolderKanban },
          { label: "Risk Intelligence", href: "/app/risk", icon: ShieldAlert, badge: "161", badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
          { label: "Uploaded Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Evidence Repository", href: "/app/evidence", icon: FileCheck },
          { label: "Investigations", href: "/app/investigations", icon: SearchCode, badge: "3 Urgent", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
          { label: "Analytics & Maps", href: "/app/analytics", icon: BarChart3 },
          { label: "AI Copilot", href: "/app/copilot", icon: Sparkles, badge: "AI", badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud, badge: "Ingest", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
        ];

      case "field_verification_officer":
        return [
          { label: "Field Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Assigned Field Inspections", href: "/app/projects", icon: ClipboardCheck, badge: "9 Tasks", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Uploaded Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Site Evidence & Geotag", href: "/app/evidence", icon: FileCheck, badge: "Upload", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud },
          { label: "Field Inquiry Notes", href: "/app/investigations", icon: SearchCode },
        ];

      case "implementing_agency":
        return [
          { label: "Agency Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Executed Works", href: "/app/projects", icon: HardHat, badge: "26 Works", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "Uploaded Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Contractor Invoices & Evidence", href: "/app/evidence", icon: FileCheck, badge: "Upload", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud, badge: "Upload", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
        ];

      case "mp":
        return [
          { label: "Constituency Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Constituency Works", href: "/app/projects", icon: FolderKanban },
          { label: "Uploaded Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Constituency Analytics", href: "/app/analytics", icon: BarChart3 },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud },
          { label: "AI Project Copilot", href: "/app/copilot", icon: Sparkles, badge: "AI", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
        ];

      case "state_nodal_authority":
        return [
          { label: "State Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Statewide Projects", href: "/app/projects", icon: FolderKanban },
          { label: "Uploaded Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "State Risk Alerts", href: "/app/risk", icon: ShieldAlert, badge: "State", badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
          { label: "Evidence Repository", href: "/app/evidence", icon: FileCheck },
          { label: "Audit Investigations", href: "/app/investigations", icon: SearchCode },
          { label: "State Analytics & Maps", href: "/app/analytics", icon: BarChart3 },
          { label: "AI Copilot", href: "/app/copilot", icon: Sparkles, badge: "AI", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud },
        ];

      case "investigator":
        return [
          { label: "Vigilance Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Investigation Dossiers", href: "/app/investigations", icon: SearchCode, badge: "Active Cases", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
          { label: "Uploaded Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Risk Anomaly Signals", href: "/app/risk", icon: ShieldAlert, badge: "161 Flags", badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
          { label: "Layout Similarity Studio", href: "/app/risk/documents/compare", icon: ScanLine, badge: "OCR", badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
          { label: "Evidence Chain Repository", href: "/app/evidence", icon: FileCheck },
          { label: "Forensic Copilot", href: "/app/copilot", icon: Sparkles, badge: "AI", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud },
        ];

      case "mospi_officer":
      default:
        return [
          { label: "Command Center", href: "/app/command-center", icon: LayoutDashboard },
          { label: "Master Projects", href: "/app/projects", icon: FolderKanban },
          { label: "Uploaded Reports", href: "/app/reports", icon: FileText, badge: "Reports", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
          { label: "Risk Intelligence", href: "/app/risk", icon: ShieldAlert, badge: "161", badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
          { label: "Layout Similarity Studio", href: "/app/risk/documents/compare", icon: ScanLine, badge: "OCR", badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
          { label: "Evidence Repository", href: "/app/evidence", icon: FileCheck },
          { label: "Investigations", href: "/app/investigations", icon: SearchCode, badge: "3 Urgent", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
          { label: "Analytics & Maps", href: "/app/analytics", icon: BarChart3 },
          { label: "AI Copilot", href: "/app/copilot", icon: Sparkles, badge: "AI", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
          { label: "e-SAKSHI Ingestion Hub", href: "/app/data", icon: UploadCloud, badge: "Ingest", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 h-screen flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800">
        <Link href="/app/command-center" onClick={onCloseMobile} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                {APP_NAME}
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-1 py-0.2 rounded border border-blue-200 dark:border-blue-800">
                {APP_HINDI_NAME}
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400">
              MoSPI DIID • {SIH_PROBLEM_ID}
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {profile?.role_label || "Active Module"}
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/app/command-center" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : item.badgeColor || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer: Public Portal Links & Status */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50/60 dark:hover:bg-slate-800 transition-colors"
        >
          <span>Public Explainer Portal</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        <div className="p-2.5 rounded-xl bg-blue-50/40 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 flex items-center gap-2 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="truncate">
            <p className="font-semibold text-slate-700 dark:text-slate-300 leading-tight">
              Cloud Storage Active
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              supabase://datasets/
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
