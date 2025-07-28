import React from 'react';
import Card from '../Card';

interface BarChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  title: string;
  data: BarChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ title, data }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-20 text-sm text-text-secondary text-right">
              {item.label}
            </div>
            <div className="flex-1 relative">
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
            <div className="w-12 text-sm font-medium text-text-primary text-right">
              {item.value}%
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm text-text-muted">
          <span>Total Responses: {data.reduce((sum, item) => sum + item.value, 0)}%</span>
          <span>Sample Size: 2,547</span>
        </div>
      </div>
    </Card>
  );
};

export default BarChart;