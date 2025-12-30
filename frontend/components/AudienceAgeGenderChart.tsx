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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-text-primary tracking-tight">
          Audience Age & Gender
        </h2>
        
        {/* Legend */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
            <span className="text-xs font-medium text-text-muted">Male</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
            <span className="text-xs font-medium text-text-muted">Female</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-5">
        {data.map((item, index) => (
          <div key={index} className="flex items-center group">
            {/* Age label */}
            <div className="w-12 text-xs font-semibold text-text-muted text-center flex-shrink-0 group-hover:text-text-primary transition-colors">
              {item.label}
            </div>

            {/* Male bar (left side) */}
            <div className="flex-1 flex justify-end pr-3">
              <div
                className="flex items-center justify-end"
                style={{ width: "100%" }}
              >
                <div
                  className="h-5 bg-primary/80 group-hover:bg-primary rounded-l-md transition-all duration-500 ease-out relative"
                  style={{
                    width: `${(item.male / maxValue) * 100}%`,
                    minWidth: item.male > 0 ? "2px" : "0px",
                  }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute top-0 left-0 -translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none mr-1">
                    {item.male}%
                  </div>
                </div>
              </div>
            </div>

            {/* Center divider */}
            <div className="w-px bg-border/50 h-8 mx-1 flex-shrink-0"></div>

            {/* Female bar (right side) */}
            <div className="flex-1 flex justify-start pl-3">
              <div className="flex items-center" style={{ width: "100%" }}>
                <div
                  className="h-5 bg-emerald-500/80 group-hover:bg-emerald-500 rounded-r-md transition-all duration-500 ease-out relative"
                  style={{
                    width: `${(item.female / maxValue) * 100}%`,
                    minWidth: item.female > 0 ? "2px" : "0px",
                  }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute top-0 right-0 translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none ml-1">
                    {item.female}%
                  </div>
                </div>
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
