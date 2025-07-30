"use client";

import React, { useState } from "react";
import { Search, Bell, TrendingUp, BarChart3, Zap } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const ConsolidatedHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="flex items-center justify-between w-full bg-surface-elevated px-6 py-4 border-b border-border rounded-lg">
      {/* Left side - Brand and Search */}
      <div className="flex items-center space-x-6 flex-1">
        {/* ADmyBRAND Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-text-primary">ADmyBRAND</h1>
            <p className="text-xs text-text-muted">Insights Platform</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns, influencers, or metrics..."
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-surface text-text-primary text-sm"
            />
          </div>
        </div>
      </div>

      {/* Right side - Analytics Status and User Controls */}
      <div className="flex items-center space-x-4">
        {/* Real-time Analytics Status */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Live Analytics</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-text-muted">+12.5% CTR</span>
          </div>
        </div>
        
        <ThemeToggle />

        {/* Notifications */}
        <button className="p-2 hover:bg-surface rounded-lg transition-colors relative" title="Notifications">
          <Bell className="w-5 h-5 text-text-muted" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </div>
        </button>
        
        {/* User Avatar */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AM</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-text-primary">Agency Manager</p>
            <p className="text-xs text-text-muted">Digital Marketing Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedHeader;
