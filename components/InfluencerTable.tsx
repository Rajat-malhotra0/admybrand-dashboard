"use client";

import React from "react";
import { User } from "lucide-react";
import Card from "./Card";
import { Influencer } from "@/lib/api/types";

interface InfluencerTableProps {
  influencers?: Influencer[];
}

const InfluencerTable: React.FC<InfluencerTableProps> = ({
  influencers = [],
}) => {
  // Default data if none provided
  const tableData =
    influencers.length > 0
      ? influencers
      : [
          { id: "1", name: "Sarah Johnson", projects: "12", followers: "2.3M" },
          { id: "2", name: "Mike Chen", projects: "8", followers: "1.8M" },
          { id: "3", name: "Emma Davis", projects: "15", followers: "3.1M" },
          { id: "4", name: "Alex Rodriguez", projects: "6", followers: "987K" },
        ];

  return (
    <Card hover>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-md md:mb-lg gap-sm">
        <h3 className="text-base md:text-lg font-semibold text-text-primary tech-accent">
          Influencer
        </h3>
        <button className="text-primary hover:text-primary-dark transition-colors flex items-center text-sm">
          <span>+ Add Influencer</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-sm md:px-md py-xs md:py-sm text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                NAME
              </th>
              <th className="px-sm md:px-md py-xs md:py-sm text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                PROJECTS
              </th>
              <th className="px-sm md:px-md py-xs md:py-sm text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                FOLLOWER
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {tableData.map((influencer) => (
              <tr
                key={influencer.id}
                className="hover:bg-bg-tertiary transition-colors"
              >
                <td className="px-sm md:px-md py-sm md:py-md whitespace-nowrap">
                  <div className="flex items-center space-x-sm md:space-x-md">
                    <div className="flex-shrink-0 h-6 w-6 md:h-8 md:w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs md:text-sm font-medium text-text-primary truncate">
                        {influencer.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-sm md:px-md py-sm md:py-md whitespace-nowrap">
                  <div className="text-xs md:text-sm text-text-primary mono">
                    {influencer.projects}
                  </div>
                </td>
                <td className="px-sm md:px-md py-sm md:py-md whitespace-nowrap">
                  <div className="text-xs md:text-sm text-text-primary mono">
                    {influencer.followers}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default InfluencerTable;
