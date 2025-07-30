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
    <div className="flex flex-wrap items-center justify-between w-full gap-4">
      {/* Left side: Title and back button */}
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <button 
            className="p-2 hover:bg-surface-elevated rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-text-muted" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          <p className="text-sm text-text-muted">{subtitle}</p>
        </div>
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-surface-elevated rounded-lg hover:bg-surface transition-colors border border-border">
          <Calendar className="w-4 h-4 text-text-muted" />
          <span>Date Range</span>
        </button>
        <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-surface-elevated rounded-lg hover:bg-surface transition-colors border border-border">
          <Filter className="w-4 h-4 text-text-muted" />
          <span>Filters</span>
        </button>
        <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default ContentHeader;
