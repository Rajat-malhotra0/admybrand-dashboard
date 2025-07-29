"use client";

import React from "react";
import Card from "../Card";

interface DemographicData {
  label: string;
  male: number;
  female: number;
}

interface DemographicChartProps {
  title: string;
  data: DemographicData[];
}

const DemographicChart: React.FC<DemographicChartProps> = ({ title, data }) => {
  return (
    <Card hover>
      <h3 className="text-lg font-semibold text-text-primary mb-6 tech-accent">
        {title}
      </h3>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-text-secondary">Male</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm text-text-secondary">Female</span>
        </div>
      </div>

      {/* Horizontal Stacked Bars */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const total = item.male + item.female;
          const malePercent = total > 0 ? (item.male / total) * 100 : 0;
          const femalePercent = total > 0 ? (item.female / total) * 100 : 0;

          return (
            <div key={index} className="flex items-center space-x-3">
              {/* Age label */}
              <div className="w-12 text-sm text-text-secondary text-center flex-shrink-0">
                {item.label}
              </div>

              {/* Stacked bar container */}
              <div className="flex-1">
                {/* Flex row with 100% width containing male and female sections */}
                <div
                  className="flex w-full rounded-md overflow-hidden"
                  style={{ height: "12px" }}
                >
                  {/* Male section (blue) */}
                  <div
                    className="bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${malePercent}%` }}
                  ></div>

                  {/* Female section (green) */}
                  <div
                    className="bg-green-500 transition-all duration-500 ease-out"
                    style={{ width: `${femalePercent}%` }}
                  ></div>
                </div>

                {/* Percentage labels */}
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-text-secondary">
                    Male: {item.male}%
                  </span>
                  <span className="text-xs text-text-secondary">
                    Female: {item.female}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DemographicChart;
