"use client";

import React from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import Sidebar from "@/components/Sidebar";
import { Users, Plus, Search, Filter } from "lucide-react";

export default function TeamPage() {
  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Team Management
            </h1>
            <p className="text-gray-600 mt-2">
              Coordinate and manage your team members and their roles
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search team members..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Team Management Coming Soon
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Organize your team for collaboration and productivity with our upcoming 
            team management tools.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
            <span>• Team roles</span>
            <span>• Access controls</span>
            <span>• Collaboration insights</span>
            <span>• Project tracking</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
