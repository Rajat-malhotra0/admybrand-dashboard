"use client";

import React from "react";
import Card from "../Card";
import { useTheme } from "@/contexts/ThemeContext";

interface RadarChartData {
  label: string;
  value: number;
}

interface RadarChartProps {
  title: string;
  data: RadarChartData[];
  showNoDataMessage?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({ title, data, showNoDataMessage = false }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // If showing no data message and no data provided, show empty state
  if (showNoDataMessage && data.length === 0) {
    return (
      <Card hover>
        <h3 className="text-base md:text-lg font-semibold text-text-primary mb-md md:mb-lg tech-accent">
          {title}
        </h3>
        <div className="flex items-center justify-center py-12">
          <p className="text-text-muted text-sm">No data yet</p>
        </div>
      </Card>
    );
  }
  
  // Default data if none provided
  const chartData =
    data.length > 0
      ? data
      : [
          { label: "Sports", value: 85 },
          { label: "Technology", value: 70 },
          { label: "Fashion", value: 60 },
          { label: "Travel", value: 75 },
          { label: "Food", value: 80 },
          { label: "Music", value: 65 },
        ];

  const center = 180;
  const maxRadius = 100;
  const levels = 5;
  const size = 360;

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
    const radius = maxRadius + 30;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  const dataPoints = chartData.map((item, index) =>
    calculatePoint(item.value, index),
  );
  const pathData = `M ${dataPoints.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;

  return (
    <Card hover>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-primary tracking-tight">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 rounded-full bg-primary"></span>
          <span className="text-xs text-text-muted font-medium">Engagement</span>
        </div>
      </div>
      <div className="flex justify-center items-center min-h-[380px] relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full transform scale-75"></div>
        
        <svg
          width="100%"
          height="100%"
          className="max-w-[360px] max-h-[360px] w-full h-full relative z-10"
          viewBox={`0 0 ${size} ${size}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid levels */}
          {Array.from({ length: levels }, (_, i) => (
            <g key={i}>
              <polygon
                points={chartData
                  .map((_, index) => {
                    const point = calculatePoint(
                      ((i + 1) / levels) * 100,
                      index,
                    );
                    return `${point.x},${point.y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="currentColor"
                className="text-border/50"
                strokeWidth="1"
                strokeDasharray={i === levels - 1 ? "0" : "4 4"}
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
                stroke="currentColor"
                className="text-border/50"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <path
            d={pathData}
            fill="currentColor"
            className="text-primary/20"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="2"
          />

          {/* Data points */}
          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              className="fill-primary stroke-white dark:stroke-slate-800"
              strokeWidth="2"
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
                className="text-xs font-medium"
              >
                <tspan x={labelPoint.x} dy="-6" className="fill-text-muted">
                  {item.label}
                </tspan>
                <tspan
                  x={labelPoint.x}
                  dy="14"
                  className="font-bold fill-text-primary"
                >
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
