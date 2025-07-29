# Color Utilities for User Metrics

This module provides utilities for mapping user counts/activity to colors for data visualization, specifically designed for map charts and other visualizations.

## Features

- **Discrete Buckets**: Map user counts to predefined color buckets (e.g., 0-1K, 1K-5K, etc.)
- **Quantitative Scale**: Use D3 color interpolators for smooth color transitions
- **Multiple Color Schemes**: Blue (default), Green, Orange, and Purple themes
- **Flexible Configuration**: Customizable buckets and color scales
- **Legend Support**: Generate legends for color scales

## Quick Start

```typescript
import { 
  getUserCountColorByBucket, 
  getUserCountColorByScale,
  COLOR_SCHEMES 
} from '../lib/utils/colorUtils';

// Using discrete buckets (recommended for most use cases)
const color = getUserCountColorByBucket(15000); // Returns "#7dd3fc" for 5K-25K range

// Using quantitative scale
const color2 = getUserCountColorByScale(15000); // Returns smooth interpolated color
```

## Functions

### `getUserCountColorByBucket(userCount, buckets?)`

Maps a user count to a color using discrete buckets.

**Parameters:**
- `userCount` (number): The number of users
- `buckets` (BucketConfig[], optional): Array of bucket configurations

**Returns:** Hex color string

**Example:**
```typescript
const color = getUserCountColorByBucket(7500); 
// Returns "#7dd3fc" (5K-25K bucket)
```

### `getUserCountColorByScale(userCount, config?)`

Maps a user count to a color using a quantitative scale.

**Parameters:**
- `userCount` (number): The number of users  
- `config` (ColorScaleConfig, optional): Scale configuration

**Returns:** Hex color string

**Example:**
```typescript
const color = getUserCountColorByScale(75000, {
  min: 0,
  max: 100000,
  interpolator: d3.interpolateBlues,
  logScale: true
});
```

### `getUserCountBucketLabel(userCount, buckets?)`

Gets the bucket label for a user count.

**Example:**
```typescript
const label = getUserCountBucketLabel(15000); // Returns "5K-25K"
```

### `generateColorLegend(buckets?)`

Generates legend items for the color scale.

**Returns:** Array of `{ color: string, label: string }`

## Color Schemes

### BLUES (Default)
Blue color scheme suitable for general user metrics:
- 0-1K: Very light blue (#f0f9ff)
- 1K-5K: Light blue (#bae6fd)
- 5K-25K: Medium blue (#7dd3fc)
- 25K-100K: Bright blue (#38bdf8)
- 100K-500K: Strong blue (#0ea5e9)
- 500K+: Dark blue (#0284c7)

### GREENS
Green color scheme for positive metrics like growth:
```typescript
import { COLOR_SCHEMES } from '../lib/utils/colorUtils';
const greenColor = getUserCountColorByBucket(userCount, COLOR_SCHEMES.GREENS.buckets);
```

### ORANGES
Orange/Red color scheme for engagement metrics:
```typescript
const orangeColor = getUserCountColorByBucket(userCount, COLOR_SCHEMES.ORANGES.buckets);
```

### PURPLES
Purple color scheme for premium metrics:
```typescript
const purpleColor = getUserCountColorByBucket(userCount, COLOR_SCHEMES.PURPLES.buckets);
```

## Usage in Choropleth Maps

```typescript
// In your map component
import { getUserCountColorByBucket } from '../lib/utils/colorUtils';

// Define country data for choropleth visualization
interface CountryData {
  id: string;
  name: string;
  userCount: number;
}

const countryData: CountryData[] = [
  { id: "CAN", name: "Canada", userCount: 87142 },
  { id: "DEU", name: "Germany", userCount: 90069 },
  // ... more countries
];

// Create lookup for country user data
const countryUserData: Record<string, number> = {};
countryData.forEach(data => {
  countryUserData[data.name] = data.userCount;
  countryUserData[data.id] = data.userCount;
});

// Apply choropleth colors to country paths
.attr("fill", (d: any) => {
  const isoCode = d?.id ?? "";
  const countryName = d?.properties?.name ?? "";
  const userCount = countryUserData[isoCode] || countryUserData[countryName] || 0;
  
  return userCount > 0 ? getUserCountColorByBucket(userCount) : "rgb(226, 232, 240)";
})
```

## Custom Buckets

You can define custom buckets for specific use cases:

```typescript
const customBuckets: BucketConfig[] = [
  { min: 0, max: 100, color: "#fee2e2", label: "0-100" },
  { min: 100, max: 1000, color: "#fca5a5", label: "100-1K" },
  { min: 1000, max: 10000, color: "#f87171", label: "1K-10K" },
  { min: 10000, max: Number.MAX_SAFE_INTEGER, color: "#dc2626", label: "10K+" },
];

const color = getUserCountColorByBucket(5000, customBuckets);
```

## Performance Notes

- Bucket-based coloring is faster than quantitative scaling
- Use quantitative scaling for smooth transitions in animations
- Cache color calculations for large datasets
- Consider using logarithmic scaling for wide ranges

## TypeScript Support

All functions are fully typed with TypeScript interfaces:

```typescript
interface BucketConfig {
  min: number;
  max: number;
  color: string;
  label: string;
}

interface ColorScaleConfig {
  min: number;
  max: number;
  interpolator: (t: number) => string;
  logScale?: boolean;
}
```
