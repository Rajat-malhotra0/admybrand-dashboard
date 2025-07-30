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
    <div className="min-h-screen bg-bg-secondary dashboard-bg">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-overlay bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-header bg-surface-elevated border-b border-border px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 fixed inset-y-0 left-0 z-sidebar
        w-64 flex flex-col transition-transform duration-300 ease-in-out
        overflow-y-auto sidebar-scroll
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
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10">
        {/* Mobile header spacer */}
        <div className="lg:hidden h-16" />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
