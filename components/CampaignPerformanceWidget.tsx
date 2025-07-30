"use client";

import React, { useState, useMemo } from "react";
import Card from "./Card";
import { TrendingUp, Eye, MousePointer, DollarSign, Users, Target, Calendar } from "lucide-react";
import ScheduleReportModal from "./ScheduleReportModal";

interface CampaignMetric {
  name: string;
  value: string | number;
  change: number;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

interface CampaignStat {
  id: number;
  title: string;
  value: string;
  icon: string;
  description?: string;
}

interface CampaignPerformanceWidgetProps {
  className?: string;
  campaignStats?: CampaignStat[];
  platform?: string;
  country?: string;
  reportRef?: React.RefObject<HTMLDivElement>;
  disabled?: boolean;
}

const CampaignPerformanceWidget: React.FC<CampaignPerformanceWidgetProps> = ({ 
  className = "", 
  campaignStats = [],
  platform = "LinkedIn",
  country = "Global",
  reportRef,
  disabled = false
}) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate dynamic metrics from campaign stats
  const metrics: CampaignMetric[] = useMemo(() => {
    // Default metric structure with "No data" values
    const noDataMetrics = [
      {
        name: "Total Impressions",
        value: "No data",
        change: 0,
        trend: "up" as const,
        icon: <Eye className="w-5 h-5" />,
        color: "blue"
      },
      {
        name: "Click-Through Rate",
        value: "No data",
        change: 0,
        trend: "up" as const,
        icon: <MousePointer className="w-5 h-5" />,
        color: "green"
      },
      {
        name: "Cost Per Click",
        value: "No data",
        change: 0,
        trend: "up" as const,
        icon: <DollarSign className="w-5 h-5" />,
        color: "purple"
      },
      {
        name: "Reach",
        value: "No data",
        change: 0,
        trend: "up" as const,
        icon: <Users className="w-5 h-5" />,
        color: "orange"
      }
    ];

    // If no campaign stats provided, return "No data" metrics
    if (!campaignStats || campaignStats.length === 0) {
      return noDataMetrics;
    }

    // Generate metrics from campaign stats
    const generatedMetrics: CampaignMetric[] = [];
    
    campaignStats.forEach((stat, index) => {
      const colors = ["blue", "green", "purple", "orange"];
      const icons = [
        <Eye className="w-5 h-5" />,
        <MousePointer className="w-5 h-5" />,
        <DollarSign className="w-5 h-5" />,
        <Users className="w-5 h-5" />
      ];
      
      // Extract percentage from description if available
      const descMatch = stat.description?.match(/([+-]?\d+\.?\d*)%/);
      const changeValue = descMatch ? parseFloat(descMatch[1]) : 0;
      
      let metricName = stat.title;
      let metricValue = stat.value;
      
      // Map common titles to performance metrics
      switch(stat.title.toLowerCase()) {
        case 'total reach':
          metricName = "Total Impressions";
          break;
        case 'engagement':
          metricName = "Click-Through Rate";
          // Only convert to percentage if it's a number and doesn't already have %
          if (!metricValue.includes('%') && !isNaN(parseInt(metricValue))) {
            metricValue = `${(parseInt(metricValue) / 1000).toFixed(1)}%`;
          }
          break;
        case 'impressions':
          metricName = "Total Impressions";
          break;
        case 'conversions':
          metricName = "Reach";
          break;
      }
      
      generatedMetrics.push({
        name: metricName,
        value: metricValue,
        change: Math.abs(changeValue),
        trend: changeValue >= 0 ? "up" : "down",
        icon: icons[index % icons.length],
        color: colors[index % colors.length]
      });
    });
    
    // If we have less than 4 metrics, fill remaining slots with "No data"
    while (generatedMetrics.length < 4) {
      const remainingIndex = generatedMetrics.length;
      const baseMetricNames = [
        "Cost Per Click",
        "Conversion Rate", 
        "Return on Ad Spend",
        "Audience Reach"
      ];
      
      const colors = ["blue", "green", "purple", "orange"];
      const icons = [
        <Eye className="w-5 h-5" />,
        <MousePointer className="w-5 h-5" />,
        <DollarSign className="w-5 h-5" />,
        <Users className="w-5 h-5" />
      ];
      
      generatedMetrics.push({
        name: baseMetricNames[remainingIndex],
        value: "No data",
        change: 0,
        trend: "up",
        icon: icons[remainingIndex % icons.length],
        color: colors[remainingIndex % colors.length]
      });
    }
    
    return generatedMetrics.slice(0, 4); // Ensure we only return 4 metrics
  }, [campaignStats]);

  const getColorClasses = (color: string) => ({
    bg: `bg-${color}-50 dark:bg-${color}-900/30`,
    text: `text-${color}-600 dark:text-${color}-400`,
    border: `border-${color}-200 dark:border-${color}-800`
  });

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Campaign Performance</h3>
            <p className="text-sm text-text-muted">Real-time advertising metrics</p>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-surface-elevated rounded-lg p-1">
          {["24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === range
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const colors = getColorClasses(metric.color);
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 border-dashed ${colors.border} hover:border-solid transition-all`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <div className={colors.text}>{metric.icon}</div>
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  <TrendingUp 
                    className={`w-3 h-3 ${metric.trend === "down" ? "rotate-180" : ""}`} 
                  />
                  <span>{metric.change}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-text-muted font-medium">{metric.name}</p>
                <p className="text-xl font-bold text-text-primary">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Report</span>
        </button>
        <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-surface-elevated rounded-lg hover:bg-surface transition-colors border border-border">
          <TrendingUp className="w-4 h-4" />
          <span>View Trends</span>
        </button>
      </div>
      
      {/* Schedule Report Modal */}
      {reportRef && (
        <ScheduleReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reportRef={reportRef}
          platform={platform}
          country={country === 'Global' ? null : country}
          disabled={disabled}
        />
      )}
    </Card>
  );
};

export default CampaignPerformanceWidget;
