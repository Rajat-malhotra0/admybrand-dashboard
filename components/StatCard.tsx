import React from 'react';
import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  description 
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className="p-0 tech-accent" hover>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-2 mono">
            {formatValue(value)}
          </p>
          {description && (
            <p className="text-sm text-text-muted mt-1">{description}</p>
          )}
          {change && (
            <div className="flex items-center mt-2">
              {change.type === 'increase' ? (
                <TrendingUp className="w-4 h-4 text-success mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-error mr-1" />
              )}
              <span
                className={`text-sm font-medium mono ${
                  change.type === 'increase' ? 'text-success' : 'text-error'
                }`}
              >
                {change.type === 'increase' ? '+' : '-'}{change.value}%
              </span>
              <span className="text-sm text-text-muted ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 p-3 bg-sky-400/10 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;