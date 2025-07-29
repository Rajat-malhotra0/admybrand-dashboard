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
  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    { label: 'Sports', value: 85 },
    { label: 'Technology', value: 70 },
    { label: 'Fashion', value: 60 },
    { label: 'Travel', value: 75 },
    { label: 'Food', value: 80 },
    { label: 'Music', value: 65 },
  ];

  const center = 110;
  const maxRadius = 70;
  const levels = 5;
  const size = 220;
  
  // Calculate points for the data polygon
  const calculatePoint = (value: number, index: number) => {
    const angle = (index * 2 * Math.PI) / chartData.length - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Calculate label positions
  const calculateLabelPoint = (index: number) => {
    const angle = (index * 2 * Math.PI) / chartData.length - Math.PI / 2;
    const radius = maxRadius + 20;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  const dataPoints = chartData.map((item, index) => calculatePoint(item.value, index));
  const pathData = `M ${dataPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`;

  return (
    <Card hover>
      <h3 className="text-base md:text-lg font-semibold text-text-primary mb-md md:mb-lg tech-accent">{title}</h3>
      <div className="flex justify-center">
        <svg width={size} height={size} className="overflow-visible" viewBox={`0 0 ${size} ${size}`}>
          {/* Grid levels */}
          {Array.from({ length: levels }, (_, i) => (
            <g key={i}>
              <polygon
                points={chartData.map((_, index) => {
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
          {chartData.map((_, index) => {
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
            fill="rgba(59, 130, 246, 0.15)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#3b82f6"
            />
          ))}
          
          {/* Labels */}
          {chartData.map((item, index) => {
            const labelPoint = calculateLabelPoint(index);
            return (
              <text
                key={index}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs"
                fill="#64748b"
              >
                <tspan x={labelPoint.x} dy="-6">{item.label}</tspan>
                <tspan x={labelPoint.x} dy="12" className="font-medium" fill="#1e293b">
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