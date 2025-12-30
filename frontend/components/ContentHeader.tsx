"use client";

import React from "react";
import { ArrowLeft, Calendar, Filter, Share2 } from "lucide-react";

interface ContentHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  title = "Marketing Campaign Overview",
  subtitle = "Track performance metrics for your ongoing campaigns",
  showBackButton = true,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between w-full gap-4 mb-2">
      {/* Left side: Title and back button */}
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <button 
            className="p-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all duration-200 border border-transparent hover:border-border/50 hover:shadow-sm group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h1>
          <p className="text-sm text-text-muted font-medium">{subtitle}</p>
        </div>
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center space-x-3">
        <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-border/50 shadow-sm hover:shadow-md">
          <Calendar className="w-4 h-4 text-text-muted" />
          <span>Date Range</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-border/50 shadow-sm hover:shadow-md">
          <Filter className="w-4 h-4 text-text-muted" />
          <span>Filters</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default ContentHeader;
