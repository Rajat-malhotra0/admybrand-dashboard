import React from "react";
import Card from "./Card";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useScreenSize } from "@/hooks/useScreenSize";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
  link?: string;
  primaryColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  link,
  primaryColor = "blue",
}) => {
  const { isMobile } = useScreenSize();

  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  const colorClasses = {
    background: `bg-${primaryColor}-50 dark:bg-${primaryColor}-900/30`,
    text: `text-${primaryColor}-600 dark:text-${primaryColor}-400`,
    changeText: change?.type === "increase" ? "text-green-600" : "text-red-600",
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow p-5 flex flex-col justify-between min-h-[160px]`}>
      {/* Top row: Icon and Title */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${colorClasses.background}`}>
          <div className={colorClasses.text}>{icon}</div>
        </div>
        {change && (
          <div className="flex items-center text-sm font-medium">
            {change.type === "increase" ? (
              <TrendingUp className={`w-4 h-4 mr-1 ${colorClasses.changeText}`} />
            ) : (
              <TrendingDown className={`w-4 h-4 mr-1 ${colorClasses.changeText}`} />
            )}
            <span className={colorClasses.changeText}>{change.value}%</span>
          </div>
        )}
      </div>

      {/* Middle row: Value */}
      <div>
        <p className="text-sm text-text-muted font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-text-primary mono">
          {formatValue(value)}
        </p>
      </div>

      {/* Bottom row: Link */}
      {link && (
        <a href={link} className="flex items-center text-sm text-blue-600 hover:underline">
          View Details <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      )}
    </Card>
  );
};

export default StatCard;
