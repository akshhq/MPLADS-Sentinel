"use client";
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
export const AppShell = ({ children, breadcrumbs, contextProjectId, contextCaseId, }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (<div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (<div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setMobileMenuOpen(false)}/>
          <div className="relative w-64 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)}/>
          </div>
        </div>)}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <TopNav breadcrumbs={breadcrumbs} onOpenMobileMenu={() => setMobileMenuOpen(true)} contextProjectId={contextProjectId} contextCaseId={contextCaseId}/>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>
    </div>);
};
