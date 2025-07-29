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

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  description,
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className="p-0 tech-accent" hover>
      <div className="flex items-center justify-between p-md md:p-lg">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-secondary truncate">
            {title}
          </p>
          <p className="text-xl md:text-2xl font-bold text-text-primary mt-xs md:mt-sm mono">
            {formatValue(value)}
          </p>
          {description && (
            <p className="text-xs md:text-sm text-text-muted mt-xs">
              {description}
            </p>
          )}
          {change && (
            <div className="flex items-center mt-xs md:mt-sm">
              {change.type === "increase" ? (
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-success mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-error mr-1" />
              )}
              <span
                className={`text-xs md:text-sm font-medium mono ${
                  change.type === "increase" ? "text-success" : "text-error"
                }`}
              >
                {change.type === "increase" ? "+" : "-"}
                {change.value}%
              </span>
              <span className="text-xs md:text-sm text-text-muted ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-sm p-sm md:p-md bg-primary/10 rounded-lg flex-shrink-0">
            <div className="w-5 h-5 md:w-6 md:h-6 text-primary">{icon}</div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
