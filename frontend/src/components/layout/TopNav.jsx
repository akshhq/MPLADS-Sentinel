"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Sparkles, Menu, ChevronDown, LogOut, Key, UploadCloud } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CommandPalette } from "./CommandPalette";
import { NotificationDrawer } from "./NotificationDrawer";
import { AskSentinelDrawer } from "./AskSentinelDrawer";
import { Breadcrumbs } from "../common/Breadcrumbs";
import { useAuth, DEMO_PERSONAS } from "@/lib/authContext";
export const TopNav = ({ breadcrumbs, onOpenMobileMenu, contextProjectId, contextCaseId, }) => {
    const { profile, switchPersona, signOut } = useAuth();
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isCopilotOpen, setIsCopilotOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (<>
      <header className="sticky top-0 z-30 h-16 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-6 flex items-center justify-between">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (<button onClick={onOpenMobileMenu} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Menu className="w-5 h-5"/>
            </button>)}

          {breadcrumbs && breadcrumbs.length > 0 ? (<Breadcrumbs items={breadcrumbs} className="hidden sm:flex"/>) : (<div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                MoSPI DIID
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                National Audit Command
              </span>
            </div>)}
        </div>

        {/* Right Action Icons & Search */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Quick Search trigger (Cmd+K) */}
          <button onClick={() => setIsCommandOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors">
            <Search className="w-3.5 h-3.5"/>
            <span className="hidden md:inline">Quick Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-500">
              ⌘K
            </kbd>
          </button>

          {/* Contextual Ask Sentinel AI Action */}
          <button onClick={() => setIsCopilotOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/80 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"/>
            <span className="hidden sm:inline">Ask Sentinel</span>
          </button>

          {/* Quick e-SAKSHI Ingest Action */}
          <Link href="/app/data" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors shadow-sm">
            <UploadCloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"/>
            <span className="hidden md:inline">Ingest e-SAKSHI</span>
          </Link>

          {/* Notifications Bell */}
          <button onClick={() => setIsNotifOpen(true)} className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Notifications">
            <Bell className="w-4 h-4"/>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"/>
          </button>

          {/* Dark / Light Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-left hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {profile?.avatar_initials || profile?.full_name?.substring(0, 2).toUpperCase() || "AS"}
              </div>
              <div className="hidden xl:block text-left text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {profile?.full_name || "Dr. Ananya Sharma"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {profile?.designation || "Senior Audit Officer"}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block"/>
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (<div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {profile?.full_name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{profile?.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 text-[9px] font-bold rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {profile?.role?.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <div className="p-2">
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Audit Persona
                  </p>
                  {Object.entries(DEMO_PERSONAS).map(([key, p]) => (<button key={key} onClick={() => {
                    switchPersona(key);
                    setIsUserMenuOpen(false);
                }} className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${profile?.role === key
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                      <span className="truncate">{p.full_name}</span>
                      <span className="text-[9px] opacity-70 ml-1">({p.role.split("_")[0]})</span>
                    </button>))}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <Link href="/login" onClick={() => setIsUserMenuOpen(false)} className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Key className="w-3.5 h-3.5 text-slate-400"/>
                    <span>Switch / Sign In Account</span>
                  </Link>

                  <button onClick={() => {
                signOut();
                setIsUserMenuOpen(false);
            }} className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors">
                    <LogOut className="w-3.5 h-3.5"/>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </header>

      {/* Slide-over Drawers & Modals */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)}/>
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)}/>
      <AskSentinelDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} contextProjectId={contextProjectId} contextCaseId={contextCaseId}/>
    </>);
};
