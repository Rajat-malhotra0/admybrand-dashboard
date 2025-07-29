"use client";

import React from "react";
import Card from "./Card";

interface AudienceData {
  label: string;
  male: number;
  female: number;
}

interface AudienceAgeGenderChartProps {
  title?: string;
  data: AudienceData[];
  className?: string;
}

const AudienceAgeGenderChart: React.FC<AudienceAgeGenderChartProps> = ({
  title = "Audience Age & Gender Demographics",
  data,
  className,
}) => {
  // Find the maximum value to scale the bars
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.male, item.female)),
  );

  return (
    <Card hover className={className}>
      <h2 className="text-lg font-semibold text-text-primary mb-6 tech-accent">
        Audience Age & Gender
      </h2>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-chart-1 rounded-sm"></div>
          <span className="text-sm text-text-secondary">Male</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-chart-2 rounded-sm"></div>
          <span className="text-sm text-text-secondary">Female</span>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            {/* Age label */}
            <div className="w-12 text-sm text-text-secondary text-center flex-shrink-0">
              {item.label}
            </div>

            {/* Male bar (left side) */}
            <div className="flex-1 flex justify-end pr-2">
              <div
                className="flex items-center justify-end"
                style={{ width: "100%" }}
              >
                <div
                  className="h-6 bg-chart-1 rounded-r transition-all duration-500 ease-out"
                  style={{
                    width: `${(item.male / maxValue) * 100}%`,
                    minWidth: item.male > 0 ? "2px" : "0px",
                  }}
                />
              </div>
            </div>

            {/* Center divider */}
            <div className="w-px bg-slate-300 h-8 mx-1 flex-shrink-0"></div>

            {/* Female bar (right side) */}
            <div className="flex-1 flex justify-start pl-2">
              <div className="flex items-center" style={{ width: "100%" }}>
                <div
                  className="h-6 bg-chart-2 rounded-l transition-all duration-500 ease-out"
                  style={{
                    width: `${(item.female / maxValue) * 100}%`,
                    minWidth: item.female > 0 ? "2px" : "0px",
                  }}
                />
              </div>
            </div>

            {/* Percentage labels to the right */}
            <div className="ml-4 flex items-center text-xs mono flex-shrink-0">
              <span className="text-chart-1 font-medium">{item.male}%</span>
              <span className="text-text-muted mx-1">|</span>
              <span className="text-chart-2 font-medium">{item.female}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Scale indicators */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex justify-center">
          <div className="flex items-center space-x-8 text-xs text-text-muted">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AudienceAgeGenderChart;
