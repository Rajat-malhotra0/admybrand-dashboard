"use client";

import React, { useState } from "react";
import InfluencerTable from "@/components/InfluencerTable";
import { useInfluencers } from "@/hooks/useInfluencers";
import { usePlatformInfluencers } from "@/hooks/usePlatformInfluencers";
import { SortOrder } from "@/hooks/useSortedInfluencers";
import { Influencer } from "@/lib/api/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Example component demonstrating InfluencerTable with sorting functionality
 * Shows how to:
 * 1. Control sort order from parent component
 * 2. Use data from different sources (general vs platform-specific)
 * 3. Provide sort controls to users
 */
const InfluencerTableWithSortingExample: React.FC = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('LinkedIn');
  const [useGeneralData, setUseGeneralData] = useState(false);

  // Get data from different sources based on selection
  const { data: generalInfluencers, isLoading: generalLoading } = useInfluencers(sortOrder);
  const { data: platformInfluencers, isLoading: platformLoading } = usePlatformInfluencers(
    selectedPlatform, 
    sortOrder
  );

  const influencers = useGeneralData ? generalInfluencers : platformInfluencers;
  const isLoading = useGeneralData ? generalLoading : platformLoading;

  const platforms = ['LinkedIn', 'Instagram', 'Facebook'];

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Influencer Table with Sorting</h2>
        
        {/* Controls */}
        <div className="mb-6 space-y-4">
          {/* Data Source Selection */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Data Source:</label>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="platform-data"
                name="dataSource"
                checked={!useGeneralData}
                onChange={() => setUseGeneralData(false)}
                className="rounded"
              />
              <label htmlFor="platform-data" className="text-sm">Platform Specific</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="general-data"
                name="dataSource"
                checked={useGeneralData}
                onChange={() => setUseGeneralData(true)}
                className="rounded"
              />
              <label htmlFor="general-data" className="text-sm">General Data</label>
            </div>
          </div>

          {/* Platform Selection (only when using platform data) */}
          {!useGeneralData && (
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Platform:</label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sort Order Selection */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Sort by followers:</label>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
              <SelectTrigger className="w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">High → Low</SelectItem>
                <SelectItem value="asc">Low → High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">Loading influencers...</p>
          </div>
        )}

        {/* Status Information */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Current Settings:</strong>
          </p>
          <ul className="text-xs text-gray-600 mt-1 space-y-1">
            <li>• Data Source: {useGeneralData ? 'General' : `Platform (${selectedPlatform})`}</li>
            <li>• Sort Order: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}</li>
            <li>• Total Influencers: {influencers?.length || 0}</li>
          </ul>
        </div>

        {/* The InfluencerTable component with sorting applied */}
        <InfluencerTable 
          influencers={influencers} 
          sortOrder={sortOrder}
        />
      </div>

      {/* Technical Details */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">How This Works</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>Sorting Logic:</strong> The sorting is implemented using the `parseFollowerCount` utility
            which correctly parses strings like "2.4M", "980K", "12,300" into numeric values for accurate comparison.
          </p>
          <p>
            <strong>Data Flow:</strong> On every influencer list change or `sortOrder` update, 
            the hooks automatically sort a copy of the influencer array by the numeric result of `parseFollowerCount`.
          </p>
          <p>
            <strong>Performance:</strong> Sorting is memoized using `useMemo` to prevent unnecessary recalculations
            unless the data or sort order actually changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfluencerTableWithSortingExample;
