"use client";

import React from "react";
import { Plus } from "lucide-react";

interface Influencer {
  id: number;
  name: string;
  projects: number;
  followers: string;
}

interface InfluencerTableProps {
  influencers: Influencer[];
}

const InfluencerTable: React.FC<InfluencerTableProps> = ({ influencers }) => {
  return (
    <div className="space-y-4">
      {/* Header with [+Add] button */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">[+Add]</span>
      </div>

      {/* Influencer List */}
      <div className="space-y-2">
        {influencers.map((influencer) => (
          <div
            key={influencer.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm">o</span>
              <span className="text-sm">{influencer.name}</span>
            </div>
            <span className="text-sm font-medium">{influencer.followers}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfluencerTable;
