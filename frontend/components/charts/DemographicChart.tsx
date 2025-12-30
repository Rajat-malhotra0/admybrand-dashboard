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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-primary tracking-tight">
          {title}
        </h3>

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

      {/* Horizontal Stacked Bars */}
      <div className="space-y-5">
        {data.map((item, index) => {
          const total = item.male + item.female;
          const malePercent = total > 0 ? (item.male / total) * 100 : 0;
          const femalePercent = total > 0 ? (item.female / total) * 100 : 0;

          return (
            <div key={index} className="flex items-center space-x-3 group">
              {/* Age label */}
              <div className="w-12 text-xs font-semibold text-text-muted text-center flex-shrink-0 group-hover:text-text-primary transition-colors">
                {item.label}
              </div>

              {/* Stacked bar container */}
              <div className="flex-1">
                {/* Flex row with 100% width containing male and female sections */}
                <div
                  className="flex w-full rounded-full overflow-hidden h-3 bg-slate-100 dark:bg-slate-800"
                >
                  {/* Male section (blue) */}
                  <div
                    className="bg-primary/80 group-hover:bg-primary transition-all duration-500 ease-out relative"
                    style={{ width: `${malePercent}%` }}
                  ></div>

                  {/* Female section (green) */}
                  <div
                    className="bg-emerald-500/80 group-hover:bg-emerald-500 transition-all duration-500 ease-out relative"
                    style={{ width: `${femalePercent}%` }}
                  ></div>
                </div>

                {/* Percentage labels */}
                <div className="flex justify-between mt-1.5 px-1">
                  <span className="text-[10px] font-medium text-text-muted group-hover:text-primary transition-colors">
                    Male: {item.male}%
                  </span>
                  <span className="text-[10px] font-medium text-text-muted group-hover:text-emerald-600 transition-colors">
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
