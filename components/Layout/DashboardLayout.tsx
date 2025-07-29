'use client';

import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarClassName?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  sidebar, 
  sidebarClassName = '' 
}) => {
  return (
    <div className="min-h-screen bg-bg-secondary dashboard-bg">
      {/* Left Column: Fixed-width sidebar container */}
      <div className={`hidden lg:flex w-64 flex-col fixed inset-y-0 z-sidebar overflow-y-auto ${sidebarClassName}`}>
        {sidebar}
      </div>

      {/* Right Column: Main content area */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
