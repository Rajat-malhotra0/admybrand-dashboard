'use client';

import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="min-h-screen bg-bg-secondary dashboard-bg">
      {/* Sidebar - Hidden on mobile, visible on lg+ screens */}
      <div className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-sidebar">
        {sidebar}
      </div>

      {/* Main content - Responsive padding */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
