import React from "react";
import Card from "./Card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
  description?: string;
}

import { useScreenSize } from "@/hooks/useScreenSize";

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  description,
}) => {
  const { isMobile, isTablet } = useScreenSize();
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className={`
      ${isMobile ? 'p-4' : 'p-6'} 
      bg-white border border-gray-200 
      hover:shadow-md transition-shadow 
      touch-target
      ${isMobile ? 'min-h-[120px]' : 'min-h-[140px]'}
    `}>
      <div className={`flex flex-col ${isMobile ? 'space-y-2' : 'space-y-3'}`}>
        {/* Icon and Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && (
              <div className={`
                ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} 
                bg-orange-100 rounded-lg 
                flex items-center justify-center flex-shrink-0
              `}>
                <div className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-orange-600`}>
                  {icon}
                </div>
              </div>
            )}
          </div>
          <div className="text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="12" cy="5" r="1"/>
              <circle cx="12" cy="19" r="1"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <p className={`
          ${isMobile ? 'text-xs' : 'text-sm'} 
          text-gray-500 font-medium text-responsive-sm
        `}>
          {title}
        </p>

        {/* Value */}
        <p className={`
          ${isMobile ? 'text-xl' : 'text-2xl'} 
          font-bold text-gray-900 mono text-responsive-xl
        `}>
          {formatValue(value)}
        </p>

        {/* Description */}
        {description && (
          <p className={`
            ${isMobile ? 'text-xs' : 'text-sm'} 
            text-gray-400 text-responsive-sm
          `}>
            {description}
          </p>
        )}

        {/* Change indicator */}
        {change && (
          <div className="flex items-center">
            {change.type === "increase" ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm font-medium ${
                change.type === "increase" ? "text-green-500" : "text-red-500"
              }`}
            >
              {change.type === "increase" ? "+" : "-"}
              {change.value}%
            </span>
            <span className="text-sm text-gray-400 ml-1">
              vs last month
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
