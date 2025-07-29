"use client";

import React from "react";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function TestApiConnection() {
  const { data, error, isLoading, isError } = useDashboardData();

  if (isLoading) {
    return (
      <div className="p-4 border border-blue-200 bg-blue-50 rounded">
        <h3 className="font-semibold text-blue-800">API Connection Test</h3>
        <p className="text-blue-600">Loading data from API...</p>
      </div>
    );
  }

  if (isError || error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded">
        <h3 className="font-semibold text-red-800">API Connection Test - ERROR</h3>
        <p className="text-red-600">Failed to connect to backend API</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-red-700">Error Details</summary>
          <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
            {error ? JSON.stringify(error, null, 2) : "Unknown error"}
          </pre>
        </details>
      </div>
    );
  }

  if (data) {
    return (
      <div className="p-4 border border-green-200 bg-green-50 rounded">
        <h3 className="font-semibold text-green-800">API Connection Test - SUCCESS</h3>
        <p className="text-green-600">Successfully retrieved data from backend API</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-green-700">Data Summary</summary>
          <div className="mt-2 text-sm text-green-600 space-y-1">
            <p>Campaign Stats: {data.campaignStats?.length || 0} items</p>
            <p>Influencers: {data.influencerData?.length || 0} items</p>
            <p>Demographics: {data.demographicsData?.length || 0} items</p>
            <p>Interests: {data.interestsData?.length || 0} items</p>
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 bg-gray-50 rounded">
      <h3 className="font-semibold text-gray-800">API Connection Test</h3>
      <p className="text-gray-600">No data received</p>
    </div>
  );
}
