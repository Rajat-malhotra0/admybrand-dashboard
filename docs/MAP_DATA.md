# Map Data Documentation

## Overview

This project uses a GeoJSON file containing world country polygons with reliable ISO-3166-1 Alpha-3 country codes for map visualizations.

## Data Source

**File**: `public/data/world-countries.geojson`  
**Source**: https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson  
**Format**: GeoJSON FeatureCollection  
**Projection**: WGS84 (EPSG:4326)

## Data Structure

Each country feature has the following structure:

```json
{
  "type": "Feature",
  "properties": {
    "name": "Country Name"
  },
  "geometry": {
    "type": "Polygon|MultiPolygon",
    "coordinates": [...]
  },
  "id": "ISO3"
}
```

## ISO-3166-1 Alpha-3 Codes

The `id` field contains ISO-3166-1 Alpha-3 country codes (3-letter codes). Examples:

- `"AFG"` - Afghanistan
- `"ALB"` - Albania  
- `"ARE"` - United Arab Emirates
- `"ARG"` - Argentina
- `"ARM"` - Armenia
- `"AUS"` - Australia
- `"AUT"` - Austria
- `"AZE"` - Azerbaijan
- `"BDI"` - Burundi
- `"BEL"` - Belgium
- `"BEN"` - Benin
- `"BFA"` - Burkina Faso
- `"BGD"` - Bangladesh
- `"BGR"` - Bulgaria
- `"BHS"` - The Bahamas
- `"BIH"` - Bosnia and Herzegovina
- `"BLR"` - Belarus
- `"BOL"` - Bolivia
- `"BRA"` - Brazil
- `"BRN"` - Brunei
- `"BTN"` - Bhutan
- `"BWA"` - Botswana
- `"CAF"` - Central African Republic
- `"CAN"` - Canada
- `"CHE"` - Switzerland
- `"CHL"` - Chile
- `"CHN"` - China
- `"CIV"` - Ivory Coast
- `"CMR"` - Cameroon
- `"COD"` - Democratic Republic of the Congo
- `"COG"` - Republic of the Congo
- `"COL"` - Colombia
- `"CRI"` - Costa Rica
- `"CUB"` - Cuba
- `"CYP"` - Cyprus
- `"CZE"` - Czech Republic
- `"DEU"` - Germany
- `"DJI"` - Djibouti
- `"DNK"` - Denmark
- `"DOM"` - Dominican Republic
- `"DZA"` - Algeria
- `"ECU"` - Ecuador
- `"EGY"` - Egypt
- `"ERI"` - Eritrea
- `"ESP"` - Spain

## Usage in React Components

### Basic Usage with D3.js

```typescript
// Load the GeoJSON data
const response = await fetch('/data/world-countries.geojson');
const worldData = await response.json();

// Access country features
worldData.features.forEach((feature: any) => {
  const isoCode = feature.id;        // e.g., "USA"
  const countryName = feature.properties.name; // e.g., "United States"
  const geometry = feature.geometry;  // Polygon/MultiPolygon coordinates
});
```

### Color Mapping by ISO Code

```typescript
const countryColorsByISO: Record<string, string> = {
  "USA": "#3b82f6",
  "CAN": "#10b981", 
  "MEX": "#f59e0b",
  "BRA": "#ef4444",
  "ARG": "#8b5cf6",
};

// Apply colors in D3
mapGroup
  .selectAll('.country')
  .data(worldData.features)
  .enter()
  .append('path')
  .attr('fill', (d: any) => {
    const isoCode = d.id;
    return countryColorsByISO[isoCode] || '#e5e7eb';
  });
```

### Data Filtering by ISO Code

```typescript
// Filter specific countries
const targetCountries = ['USA', 'CAN', 'MEX', 'BRA'];
const filteredFeatures = worldData.features.filter((feature: any) => 
  targetCountries.includes(feature.id)
);
```

## Verification

To verify the ISO codes in the dataset:

```bash
# Extract all ISO codes from the file
grep -o '"id":"[A-Z]\{3\}"' public/data/world-countries.geojson | sort | uniq
```

## Alternative Data Sources

If you need different map data or more detailed boundaries:

1. **Natural Earth**: https://www.naturalearthdata.com/
2. **OpenStreetMap**: https://osmdata.openstreetmap.de/
3. **World Bank**: https://datahelpdesk.worldbank.org/knowledgebase/articles/906519
4. **GADM**: https://gadm.org/

## License

The data is sourced from D3 Gallery examples and is likely derived from Natural Earth, which is public domain.
