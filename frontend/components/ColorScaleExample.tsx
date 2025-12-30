"use client";

import React from "react";
import {
  getUserCountColorByBucket,
  getUserCountColorByScale,
  getUserCountBucketLabel,
  generateColorLegend,
  COLOR_SCHEMES,
  DEFAULT_QUANTITATIVE_SCALE,
} from "../lib/utils/colorUtils";

interface ColorScaleExampleProps {
  userCounts?: number[];
  showQuantitative?: boolean;
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

const ColorScaleExample: React.FC<ColorScaleExampleProps> = ({
  userCounts = [0, 500, 1500, 7500, 50000, 150000, 750000],
  showQuantitative = false,
  colorScheme = "BLUES",
}) => {
  const selectedScheme = COLOR_SCHEMES[colorScheme];
  const legend = generateColorLegend(selectedScheme.buckets);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">
        Color Scale Example - {colorScheme} Scheme
      </h3>
      
      {/* Color Legend */}
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3">Color Legend</h4>
        <div className="flex flex-wrap gap-2">
          {legend.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample User Counts */}
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3">
          Sample User Counts - {showQuantitative ? "Quantitative" : "Bucket"} Coloring
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userCounts.map((count, index) => {
            const color = showQuantitative
              ? getUserCountColorByScale(count, {
                  ...DEFAULT_QUANTITATIVE_SCALE,
                  interpolator: selectedScheme.interpolator,
                })
              : getUserCountColorByBucket(count, selectedScheme.buckets);
            
            const label = getUserCountBucketLabel(count, selectedScheme.buckets);
            
            return (
              <div
                key={index}
                className="p-4 rounded-lg border"
                style={{ backgroundColor: color }}
              >
                <div className="text-sm font-medium text-gray-900">
                  {count.toLocaleString()} users
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  Bucket: {label}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Color: {color}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh Example
        </button>
      </div>
    </div>
  );
};

export default ColorScaleExample;
