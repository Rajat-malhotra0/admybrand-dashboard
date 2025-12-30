"use client";

import React from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import Sidebar from "@/components/Sidebar";
import { Settings, Save, Bell, Shield, User, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Customize your dashboard and manage your preferences
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Settings Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage your personal information and profile preferences.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <span>• Account information</span><br />
              <span>• Profile picture</span><br />
              <span>• Contact details</span><br />
              <span>• Bio and preferences</span>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage your security settings and authentication preferences.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <span>• Password management</span><br />
              <span>• Two-factor authentication</span><br />
              <span>• Login sessions</span><br />
              <span>• Privacy controls</span>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Control how and when you receive notifications from the platform.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <span>• Email notifications</span><br />
              <span>• Push notifications</span><br />
              <span>• Alert preferences</span><br />
              <span>• Notification frequency</span>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Customize the look and feel of your dashboard interface.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <span>• Theme selection</span><br />
              <span>• Color preferences</span><br />
              <span>• Layout options</span><br />
              <span>• Dashboard widgets</span>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Settings className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Advanced Settings Coming Soon
          </h3>
          <p className="text-blue-700">
            We're working on bringing you comprehensive settings management with all the features listed above.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
