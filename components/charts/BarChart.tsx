import React from 'react';
import Card from '../Card';

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
  // Default data if none provided
  const ageGroups = data.length > 0 ? data : [
    { range: '+64', male: 8, female: 2 },
    { range: '55-64', male: 15, female: 8 },
    { range: '45-54', male: 25, female: 12 },
    { range: '35-44', male: 35, female: 20 },
    { range: '25-34', male: 45, female: 35 },
    { range: '15-24', male: 25, female: 15 },
  ];

  return (
    <Card hover>
      <h3 className="text-base md:text-lg font-semibold text-text-primary mb-md md:mb-lg tech-accent">{title}</h3>
      
      <div className="space-y-sm md:space-y-md">
        {/* Legend */}
        <div className="flex items-center space-x-md mb-md">
          <div className="flex items-center space-x-xs">
            <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
            <span className="text-xs md:text-sm text-text-secondary">Male</span>
          </div>
          <div className="flex items-center space-x-xs">
            <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
            <span className="text-xs md:text-sm text-text-secondary">Female</span>
          </div>
        </div>
        
        {/* Age Groups */}
        {ageGroups.map((group, index) => (
          <div key={index} className="flex items-center space-x-sm md:space-x-md">
            <div className="w-12 md:w-16 text-xs md:text-sm text-text-secondary text-right flex-shrink-0">
              {group.range}
            </div>
            <div className="flex-1 flex items-center min-w-0">
              <div className="flex w-full max-w-xs">
                <div className="flex justify-end" style={{ width: '50%' }}>
                  <div 
                    className="bg-chart-1 h-4 md:h-6 rounded-l transition-all duration-500 ease-out"
                    style={{ width: `${group.male * 2}%` }}
                  ></div>
                </div>
                <div className="flex" style={{ width: '50%' }}>
                  <div 
                    className="bg-chart-2 h-4 md:h-6 rounded-r transition-all duration-500 ease-out"
                    style={{ width: `${group.female * 2}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex space-x-sm text-xs md:text-sm text-text-secondary w-16 md:w-20 flex-shrink-0 mono">
              <span>{group.male}%</span>
              <span>{group.female}%</span>
            </div>
          </div>
        ))}
        
        {/* Scale */}
        <div className="flex justify-between text-xs text-text-muted mt-md max-w-xs ml-12 md:ml-16 mono">
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
          <span className="mono">Total: {ageGroups.reduce((sum, item) => sum + item.male + item.female, 0)}%</span>
          <span className="mono">n=2,547</span>
        </div>
      </div>
    </Card>
  );
};

export default BarChart;