"use client";

import React from "react";
import { generateColorLegend, DEFAULT_USER_COUNT_BUCKETS, BucketConfig } from "../lib/utils/colorUtils";

interface MapLegendProps {
  /** Custom buckets to use for the legend. Defaults to DEFAULT_USER_COUNT_BUCKETS */
  buckets?: BucketConfig[];
  /** Position of the legend. Defaults to 'bottom-right' */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Title for the legend */
  title?: string;
  /** Whether to show the legend in compact mode */
  compact?: boolean;
  /** Custom className for styling */
  className?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({
  buckets = DEFAULT_USER_COUNT_BUCKETS,
  position = 'bottom-right',
  title = "User Count",
  compact = false,
  className = ""
}) => {
  const legend = generateColorLegend(buckets);

  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 z-20 ${className}`}
      role="img"
      aria-label={`Map legend showing ${title.toLowerCase()} color scale from ${legend[0]?.label} to ${legend[legend.length - 1]?.label}`}
    >
      {/* Legend Title */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-800" id="map-legend-title">
          {title}
        </h3>
      </div>

      {/* Legend Items */}
      <div 
        className={`${compact ? 'flex flex-wrap gap-1' : 'space-y-1'}`}
        role="list"
        aria-labelledby="map-legend-title"
      >
        {legend.map((item, index) => {
          // Calculate contrast color for text
          const hexColor = item.color;
          const rgb = hexColor.substring(1).match(/.{1,2}/g);
          const luminance = rgb ? 
            (0.299 * parseInt(rgb[0], 16) + 0.587 * parseInt(rgb[1], 16) + 0.114 * parseInt(rgb[2], 16)) / 255 
            : 0.5;
          const textColor = luminance > 0.5 ? '#000000' : '#ffffff';
          
          return (
            <div 
              key={index} 
              className={`flex items-center ${compact ? 'text-xs' : 'text-sm'}`}
              role="listitem"
            >
              <div
                className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} rounded border border-gray-300 mr-2 flex-shrink-0`}
                style={{ 
                  backgroundColor: item.color,
                  // Ensure minimum contrast ratio of 3:1 for the border
                  borderColor: luminance > 0.8 ? '#9ca3af' : '#d1d5db'
                }}
                role="img"
                aria-label={`Color indicator for ${item.label} users`}
              />
              <span 
                className="text-gray-700 font-medium"
                aria-label={`${item.label} users range`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500" aria-label="Legend instructions">
          Hover over countries to see exact values
        </p>
      </div>
    </div>
  );
};

export default MapLegend;
