import * as d3 from "d3";

/**
 * Color scale configuration for user metrics
 */
export interface ColorScaleConfig {
  /** Minimum value for the scale */
  min: number;
  /** Maximum value for the scale */
  max: number;
  /** D3 color interpolator function */
  interpolator: (t: number) => string;
  /** Whether to use logarithmic scaling */
  logScale?: boolean;
}

/**
 * Discrete bucket configuration for user metrics
 */
export interface BucketConfig {
  /** Lower bound (inclusive) */
  min: number;
  /** Upper bound (exclusive, except for the last bucket) */
  max: number;
  /** Hex color for this bucket */
  color: string;
  /** Display label for this bucket */
  label: string;
}

/**
 * Default discrete buckets for user counts
 */
export const DEFAULT_USER_COUNT_BUCKETS: BucketConfig[] = [
  { min: 0, max: 1000, color: "#f0f9ff", label: "0-1K" },
  { min: 1000, max: 5000, color: "#bae6fd", label: "1K-5K" },
  { min: 5000, max: 25000, color: "#7dd3fc", label: "5K-25K" },
  { min: 25000, max: 100000, color: "#38bdf8", label: "25K-100K" },
  { min: 100000, max: 500000, color: "#0ea5e9", label: "100K-500K" },
  { min: 500000, max: Number.MAX_SAFE_INTEGER, color: "#0284c7", label: "500K+" },
];

/**
 * Default quantitative color scale configuration
 */
export const DEFAULT_QUANTITATIVE_SCALE: ColorScaleConfig = {
  min: 0,
  max: 1000000, // 1 million users
  interpolator: d3.interpolateBlues,
  logScale: false,
};

/**
 * Maps a user count to a color using discrete buckets.
 *
 * @param userCount - The number of users in a country.
 * @param buckets - Array of bucket configurations. Defaults to DEFAULT_USER_COUNT_BUCKETS.
 * @returns A hex color representing the user count.
 */
export function getUserCountColorByBucket(
  userCount: number,
  buckets: BucketConfig[] = DEFAULT_USER_COUNT_BUCKETS
): string {
  // Handle edge cases
  if (userCount < 0) return buckets[0]?.color || "#f0f9ff";
  
  // Find the appropriate bucket
  for (const bucket of buckets) {
    if (userCount >= bucket.min && (userCount < bucket.max || bucket.max === Number.MAX_SAFE_INTEGER)) {
      return bucket.color;
    }
  }
  
  // Fallback to the last bucket color
  return buckets[buckets.length - 1]?.color || "#0284c7";
}

/**
 * Maps a user count to a color using a quantitative scale.
 *
 * @param userCount - The number of users in a country.
 * @param config - Color scale configuration. Defaults to DEFAULT_QUANTITATIVE_SCALE.
 * @returns A hex color representing the user count.
 */
export function getUserCountColorByScale(
  userCount: number,
  config: ColorScaleConfig = DEFAULT_QUANTITATIVE_SCALE
): string {
  // Handle edge cases
  if (userCount <= 0) return config.interpolator(0);
  if (userCount >= config.max) return config.interpolator(1);
  
  let normalizedValue: number;
  
  if (config.logScale) {
    // Use logarithmic scaling for better visualization of large ranges
    const logMin = Math.log(Math.max(config.min, 1));
    const logMax = Math.log(config.max);
    const logValue = Math.log(Math.max(userCount, 1));
    normalizedValue = (logValue - logMin) / (logMax - logMin);
  } else {
    // Linear scaling
    normalizedValue = (userCount - config.min) / (config.max - config.min);
  }
  
  // Clamp to [0, 1] range
  normalizedValue = Math.max(0, Math.min(1, normalizedValue));
  
  return config.interpolator(normalizedValue);
}

/**
 * Gets the bucket label for a given user count.
 *
 * @param userCount - The number of users in a country.
 * @param buckets - Array of bucket configurations. Defaults to DEFAULT_USER_COUNT_BUCKETS.
 * @returns The label for the bucket containing the user count.
 */
export function getUserCountBucketLabel(
  userCount: number,
  buckets: BucketConfig[] = DEFAULT_USER_COUNT_BUCKETS
): string {
  // Handle edge cases
  if (userCount < 0) return buckets[0]?.label || "0";
  
  // Find the appropriate bucket
  for (const bucket of buckets) {
    if (userCount >= bucket.min && (userCount < bucket.max || bucket.max === Number.MAX_SAFE_INTEGER)) {
      return bucket.label;
    }
  }
  
  // Fallback to the last bucket label
  return buckets[buckets.length - 1]?.label || "500K+";
}

/**
 * Generates a legend for the color scale.
 *
 * @param buckets - Array of bucket configurations. Defaults to DEFAULT_USER_COUNT_BUCKETS.
 * @returns Array of legend items with color and label.
 */
export function generateColorLegend(
  buckets: BucketConfig[] = DEFAULT_USER_COUNT_BUCKETS
): Array<{ color: string; label: string }> {
  return buckets.map(bucket => ({
    color: bucket.color,
    label: bucket.label,
  }));
}

/**
 * Alternative color schemes for different use cases
 */
export const COLOR_SCHEMES = {
  /** Blue color scheme (default) */
  BLUES: {
    interpolator: d3.interpolateBlues,
    buckets: DEFAULT_USER_COUNT_BUCKETS,
  },
  /** Green color scheme for positive metrics */
  GREENS: {
    interpolator: d3.interpolateGreens,
    buckets: [
      { min: 0, max: 1000, color: "#f0fdf4", label: "0-1K" },
      { min: 1000, max: 5000, color: "#bbf7d0", label: "1K-5K" },
      { min: 5000, max: 25000, color: "#86efac", label: "5K-25K" },
      { min: 25000, max: 100000, color: "#4ade80", label: "25K-100K" },
      { min: 100000, max: 500000, color: "#22c55e", label: "100K-500K" },
      { min: 500000, max: Number.MAX_SAFE_INTEGER, color: "#16a34a", label: "500K+" },
    ] as BucketConfig[],
  },
  /** Orange/Red color scheme for engagement metrics */
  ORANGES: {
    interpolator: d3.interpolateOranges,
    buckets: [
      { min: 0, max: 1000, color: "#fff7ed", label: "0-1K" },
      { min: 1000, max: 5000, color: "#fed7aa", label: "1K-5K" },
      { min: 5000, max: 25000, color: "#fdba74", label: "5K-25K" },
      { min: 25000, max: 100000, color: "#fb923c", label: "25K-100K" },
      { min: 100000, max: 500000, color: "#f97316", label: "100K-500K" },
      { min: 500000, max: Number.MAX_SAFE_INTEGER, color: "#ea580c", label: "500K+" },
    ] as BucketConfig[],
  },
  /** Purple color scheme for premium metrics */
  PURPLES: {
    interpolator: d3.interpolatePurples,
    buckets: [
      { min: 0, max: 1000, color: "#faf5ff", label: "0-1K" },
      { min: 1000, max: 5000, color: "#e9d5ff", label: "1K-5K" },
      { min: 5000, max: 25000, color: "#d8b4fe", label: "5K-25K" },
      { min: 25000, max: 100000, color: "#c084fc", label: "25K-100K" },
      { min: 100000, max: 500000, color: "#a855f7", label: "100K-500K" },
      { min: 500000, max: Number.MAX_SAFE_INTEGER, color: "#9333ea", label: "500K+" },
    ] as BucketConfig[],
  },
} as const;
