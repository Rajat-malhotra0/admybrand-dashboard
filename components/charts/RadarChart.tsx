'use client';

import React from 'react';
import Card from '../Card';

interface RadarChartData {
  label: string;
  value: number;
}

interface RadarChartProps {
  title: string;
  data: RadarChartData[];
}

const RadarChart: React.FC<RadarChartProps> = ({ title, data }) => {
  const center = 120;
  const maxRadius = 100;
  const levels = 5;
  
  // Calculate points for the data polygon
  const calculatePoint = (value: number, index: number) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Calculate label positions
  const calculateLabelPoint = (index: number) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
    const radius = maxRadius + 20;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  const dataPoints = data.map((item, index) => calculatePoint(item.value, index));
  const pathData = `M ${dataPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6">{title}</h3>
      <div className="flex justify-center">
        <svg width="240" height="240" className="overflow-visible">
          {/* Grid levels */}
          {Array.from({ length: levels }, (_, i) => (
            <g key={i}>
              <polygon
                points={data.map((_, index) => {
                  const point = calculatePoint(((i + 1) / levels) * 100, index);
                  return `${point.x},${point.y}`;
                }).join(' ')}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            </g>
          ))}
          
          {/* Grid lines */}
          {data.map((_, index) => {
            const point = calculatePoint(100, index);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Data polygon */}
          <path
            d={pathData}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="rgb(59, 130, 246)"
            />
          ))}
          
          {/* Labels */}
          {data.map((item, index) => {
            const labelPoint = calculateLabelPoint(index);
            return (
              <text
                key={index}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-current text-text-secondary"
              >
                <tspan x={labelPoint.x} dy="0">{item.label}</tspan>
                <tspan x={labelPoint.x} dy="12" className="font-medium text-text-primary">
                  {item.value}%
                </tspan>
              </text>
            );
          })}
        </svg>
      </div>
    </Card>
  );
};

export default RadarChart;