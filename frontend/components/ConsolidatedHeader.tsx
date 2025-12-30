"use client";

import React, { useState } from "react";
import { Search, Bell, TrendingUp, BarChart3, Zap } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const ConsolidatedHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="flex items-center justify-between w-full bg-surface/80 backdrop-blur-md px-6 py-4 border-b border-border/50 sticky top-0 z-50 transition-all duration-300">
      {/* Left side - Brand and Search */}
      <div className="flex items-center space-x-6 flex-1">
        {/* ADmyBRAND Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg shadow-primary/20">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-text-primary tracking-tight">ADmyBRAND</h1>
            <p className="text-xs text-text-muted font-medium">Insights Platform</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns, influencers, or metrics..."
              className="w-full pl-10 pr-4 py-2.5 border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 focus:bg-white transition-all duration-200 text-text-primary text-sm"
            />
          </div>
        </div>
      </div>

      {/* Right side - Analytics Status and User Controls */}
      <div className="flex items-center space-x-4">
        {/* Real-time Analytics Status */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">Live Analytics</span>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">+12.5% CTR</span>
          </div>
        </div>
        
        <div className="h-8 w-px bg-border/50 mx-2"></div>

        <ThemeToggle />

        {/* Notifications */}
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative group" title="Notifications">
          <Bell className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
        </button>
        
        {/* User Avatar */}
        <div className="flex items-center space-x-3 pl-2 border-l border-border/50">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
            <span className="text-white font-bold text-xs">AM</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-text-primary">Agency Manager</p>
            <p className="text-xs text-text-muted">Digital Marketing Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedHeader;
