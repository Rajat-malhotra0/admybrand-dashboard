import React from "react";
import Card from "../Card";
import { useTheme } from "@/contexts/ThemeContext";

interface BarChartData {
  range: string;
  male: number;
  female: number;
}

interface BarChartProps {
  title: string;
  data: BarChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ title, data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Default data if none provided
  const ageGroups =
    data.length > 0
      ? data
      : [
          { range: "+64", male: 8, female: 2 },
          { range: "55-64", male: 15, female: 8 },
          { range: "45-54", male: 25, female: 12 },
          { range: "35-44", male: 35, female: 20 },
          { range: "25-34", male: 45, female: 35 },
          { range: "15-24", male: 25, female: 15 },
        ];

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

      <div className="space-y-4">
        {/* Age Groups */}
        {ageGroups.map((group, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 group"
          >
            <div className="w-12 text-xs font-semibold text-text-muted text-right flex-shrink-0 group-hover:text-text-primary transition-colors">
              {group.range}
            </div>
            <div className="flex-1 flex items-center min-w-0">
              <div className="flex w-full max-w-xs h-5 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800">
                <div className="flex justify-end h-full" style={{ width: "50%" }}>
                  <div
                    className="bg-primary/80 group-hover:bg-primary h-full transition-all duration-500 ease-out relative"
                    style={{ width: `${group.male * 2}%` }}
                  ></div>
                </div>
                <div className="flex h-full" style={{ width: "50%" }}>
                  <div
                    className="bg-emerald-500/80 group-hover:bg-emerald-500 h-full transition-all duration-500 ease-out relative"
                    style={{ width: `${group.female * 2}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 text-xs font-medium text-text-muted w-20 flex-shrink-0">
              <span className="text-primary">{group.male}%</span>
              <span className="text-emerald-600">{group.female}%</span>
            </div>
          </div>
        ))}

        {/* Scale */}
        <div className="flex justify-between text-[10px] font-medium text-text-muted/50 mt-4 max-w-xs ml-12 md:ml-16 px-1">
          <span className="hidden md:inline">100</span>
          <span className="hidden md:inline">75</span>
          <span>50</span>
          <span className="hidden md:inline">25</span>
          <span>0</span>
          <span className="hidden md:inline">25</span>
          <span>50</span>
          <span className="hidden md:inline">75</span>
          <span className="hidden md:inline">100</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-md md:mt-lg pt-sm md:pt-md border-t border-border">
        <div className="flex flex-col md:flex-row md:justify-between text-xs md:text-sm text-text-muted space-y-1 md:space-y-0">
          <span className="mono">
            Total:{" "}
            {ageGroups.reduce((sum, item) => sum + item.male + item.female, 0)}%
          </span>
          <span className="mono">n=2,547</span>
        </div>
      </div>
    </Card>
  );
};

export default BarChart;
