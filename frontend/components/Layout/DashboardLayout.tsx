"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarClassName?: string;
  reportRef?: React.RefObject<HTMLDivElement>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar,
  sidebarClassName = "",
  reportRef,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dashboard-bg transition-colors duration-300">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-overlay bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-header bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg text-text-primary">ADmyBRAND</span>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`
        ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        lg:translate-x-0 fixed inset-y-0 left-0 z-sidebar
        w-72 flex flex-col transition-transform duration-300 ease-out
        overflow-y-auto sidebar-scroll border-r border-border/50
        ${sidebarClassName}
      `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden absolute top-4 right-4 z-10">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-white hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {React.isValidElement(sidebar) ? React.cloneElement(sidebar as React.ReactElement<any>, { reportRef }) : sidebar}
      </div>

      {/* Main content area */}
      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10 transition-all duration-300">
        {/* Mobile header spacer */}
        <div className="lg:hidden h-16" />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
