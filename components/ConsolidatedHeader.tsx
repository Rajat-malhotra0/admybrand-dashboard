"use client";

import React from "react";
import { Search, Bell, MoreVertical } from "lucide-react";

const ConsolidatedHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between w-full bg-white px-6 py-4 border-b border-gray-100">
      {/* Left side - Expanded Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search something"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
          />
        </div>
      </div>

      {/* Right side - Status, Created date, User Controls */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-600">Active</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">Created on</span>
          <span className="text-sm font-medium text-gray-900">
            August 20, 2021
          </span>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>
        
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">J</span>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ConsolidatedHeader;
