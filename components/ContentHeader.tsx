"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

interface ContentHeaderProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  avatar?: string;
  avatarBg?: string;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  title = "Blue Chips Chicago",
  description = "Diam nullam quis nunc et pretium augue",
  showBackButton = true,
  avatar = "BC",
  avatarBg = "bg-red-500",
}) => {
  return (
    <div className="flex items-center space-x-4">
      {showBackButton && (
        <button className="p-2 hover:bg-surface-elevated rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-muted" />
        </button>
      )}
      <div className="flex items-center space-x-3">
        <div
          className={`w-12 h-12 ${avatarBg} rounded-full flex items-center justify-center`}
        >
          <span className="text-white font-bold text-lg">{avatar}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          <p className="text-sm text-text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
