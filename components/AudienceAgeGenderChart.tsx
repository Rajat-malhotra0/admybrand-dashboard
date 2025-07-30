"use client";

import React from "react";
import Card from "./Card";
import { useTheme } from "@/contexts/ThemeContext";

interface AudienceData {
  label: string;
  male: number;
  female: number;
}

interface AudienceAgeGenderChartProps {
  title?: string;
  data: AudienceData[];
  className?: string;
  showNoDataMessage?: boolean;
}

const AudienceAgeGenderChart: React.FC<AudienceAgeGenderChartProps> = ({
  title = "Audience Age & Gender Demographics",
  data,
  className,
  showNoDataMessage = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // If showing no data message and no data provided, show empty state
  if (showNoDataMessage && data.length === 0) {
    return (
      <Card hover className={className}>
        <h2 className="text-lg font-semibold text-text-primary mb-6">
          Audience Age & Gender
        </h2>
        <div className="flex items-center justify-center py-12">
          <p className="text-text-muted text-sm">No data yet</p>
        </div>
      </Card>
    );
  }

  // Find the maximum value to scale the bars
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.male, item.female)),
  );

  return (
    <Card hover className={className}>
      <h2 className="text-lg font-semibold text-text-primary mb-6">
        Audience Age & Gender
      </h2>

      {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-sm"></div>
            <span className="text-sm text-text-muted">Male</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span className="text-sm text-text-muted">Female</span>
          </div>
        </div>

      {/* Chart */}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            {/* Age label */}
            <div className="w-12 text-sm text-text-muted text-center flex-shrink-0">
              {item.label}
            </div>

            {/* Male bar (left side) */}
            <div className="flex-1 flex justify-end pr-2">
              <div
                className="flex items-center justify-end"
                style={{ width: "100%" }}
              >
                <div
                  className="h-6 bg-primary rounded-r transition-all duration-500 ease-out"
                  style={{
                    width: `${(item.male / maxValue) * 100}%`,
                    minWidth: item.male > 0 ? "2px" : "0px",
                  }}
                />
              </div>
            </div>

            {/* Center divider */}
            <div className="w-px bg-border h-8 mx-2 flex-shrink-0"></div>

            {/* Female bar (right side) */}
            <div className="flex-1 flex justify-start pl-2">
              <div className="flex items-center" style={{ width: "100%" }}>
                <div
                  className="h-6 bg-green-500 rounded-l transition-all duration-500 ease-out"
                  style={{
                    width: `${(item.female / maxValue) * 100}%`,
                    minWidth: item.female > 0 ? "2px" : "0px",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scale indicators */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="relative">
          {/* Create a layout that mirrors the chart structure */}
          <div className="flex items-center">
            {/* Age label space */}
            <div className="w-12 flex-shrink-0"></div>
            
            {/* Male side scale */}
            <div className="flex-1 flex justify-between pr-2 text-xs text-text-muted">
              <span>100k</span>
              <span>75k</span>
              <span>50k</span>
              <span>25k</span>
            </div>
            
            {/* Center with 0 */}
            <div className="w-2 flex justify-center">
              <span className="text-xs text-text-muted">0</span>
            </div>
            
            {/* Female side scale */}
            <div className="flex-1 flex justify-between pl-2 text-xs text-text-muted">
              <span>25k</span>
              <span>50k</span>
              <span>75k</span>
              <span>100k</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AudienceAgeGenderChart;
