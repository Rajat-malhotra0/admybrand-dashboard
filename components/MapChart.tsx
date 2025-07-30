"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import * as d3 from "d3";
import { RefreshCw } from "lucide-react";
import Card from "./Card";
import MapLegend from "./MapLegend";
import { getUserCountColorByBucket, getUserCountColorByScale } from "../lib/utils/colorUtils";
import { useTheme } from "@/contexts/ThemeContext";

interface CountryData {
  id: string;
  name: string;
  userCount: number;
}

interface MapChartProps {
  width?: number;
  height?: number;
  onCountryClick?: (countryIsoCode: string) => void;
  countriesWithData?: string[]; // ISO codes of countries with data
}

// Sample country data with user counts for choropleth visualization
const countryData: CountryData[] = [
  { id: "CAN", name: "Canada", userCount: 87142 },
  { id: "DEU", name: "Germany", userCount: 90069 },
  { id: "IDN", name: "Indonesia", userCount: 120904 },
  { id: "URY", name: "Uruguay", userCount: 85321 },
];


const MapChart: React.FC<MapChartProps> = ({ width = 800, height = 400, onCountryClick, countriesWithData = [] }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [worldData, setWorldData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dimensions, setDimensions] = useState({ width, height });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset zoom function
  const resetZoom = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) {
      return;
    }
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(zoomRef.current.transform, d3.zoomIdentity.scale(1));
  }, []);

  // Load world data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch("/data/world-countries.geojson");
        if (!response.ok) {
          throw new Error("Failed to load world data");
        }
        const data = await response.json();
        setWorldData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading world data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(
          `Failed to load map data: ${errorMessage}. Please try again later.`,
        );
        setIsLoading(false);
      }
    };
    loadWorldData();
  }, []);

  // Draw the map
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!svgRef.current || !worldData || isLoading) return;
    if (!worldData?.features?.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up SVG dimensions
    svg
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Create projection with better world coverage
    const projection = d3
      .geoNaturalEarth1()
      .translate([width / 2, height / 2])
      .scale(Math.min(width, height) / 4.3);

    // Create path generator
    const path = d3.geoPath().projection(projection);

    // Add subtle grid pattern definition
    const defs = svg.append("defs");
    const pattern = defs
      .append("pattern")
      .attr("id", "subtle-grid")
      .attr("width", 30)
      .attr("height", 30)
      .attr("patternUnits", "userSpaceOnUse");

    // Horizontal grid lines
    pattern
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 30)
      .attr("y2", 0)
      .attr("stroke", "rgba(0,0,0,0.03)")
      .attr("stroke-width", 0.5);

    // Vertical grid lines
    pattern
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", 30)
      .attr("stroke", "rgba(0,0,0,0.03)")
      .attr("stroke-width", 0.5);

    // Add clean background with subtle grid - transparent for dark theme
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", isDark ? "transparent" : "url(#subtle-grid)");

    // Create main group for map elements
    const mapGroup = svg.append("g").attr("class", "map-group");

    // Create zoom behavior (after mapGroup is created)
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        const { transform } = event;
        mapGroup.attr("transform", transform.toString());
      });

    // Apply zoom behavior to SVG
    svg.call(zoom);

    // Set initial zoom level to show complete world
    const initialTransform = d3.zoomIdentity.scale(1);
    svg.call(zoom.transform, initialTransform);

    // Store zoom behavior for reset functionality
    zoomRef.current = zoom;

    // Create a lookup map for marker values by country name and ISO code
    const countryUserData: Record<string, number> = {};
    countryData.forEach(data => {
      countryUserData[data.name] = data.userCount;
      countryUserData[data.id] = data.userCount;
    });

    // Draw countries
    mapGroup
      .selectAll(".country")
      .data(worldData.features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        const isoCode = d?.id ?? "";
        
        // Check if country has data in the backend
        const hasData = countriesWithData.includes(isoCode);
        
        // Use theme-aware colors
        if (hasData) {
          return isDark ? "rgb(96, 165, 250)" : "rgb(59, 130, 246)"; // Primary blue adapted for theme
        } else {
          return isDark ? "rgb(75, 85, 99)" : "rgb(226, 232, 240)"; // Gray adapted for theme
        }
      })
      .attr("stroke", isDark ? "#1f2937" : "#ffffff") // Dark stroke for dark theme
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .attr("aria-label", (d: any) => {
        const isoCode = d?.id ?? "";
        const countryName = d?.properties?.name ?? "";
        const hasData = countriesWithData.includes(isoCode);
        
        return hasData 
          ? `${countryName}: Has campaign data. Click for more details.`
          : `${countryName}: No campaign data available. Click for more details.`;
      })
      .on("mouseenter", function (event, d: any) {
        const isoCode = d?.id ?? "";
        const countryName = d?.properties?.name ?? "";
        const hasData = countriesWithData.includes(isoCode);
        
        // Update fill color on hover with theme awareness
        const baseColor = hasData 
          ? (isDark ? "rgb(96, 165, 250)" : "rgb(59, 130, 246)")
          : (isDark ? "rgb(75, 85, 99)" : "rgb(226, 232, 240)");
        const hoverColor = d3.color(baseColor)?.darker(0.2)?.toString() || baseColor;
        d3.select(this).transition().duration(200).attr("fill", hoverColor);
        
        // Show tooltip
        const tooltipContent = hasData 
          ? `${countryName}\nHas campaign data\nISO: ${isoCode}`
          : `${countryName}\nNo campaign data\nISO: ${isoCode}`;
        
        setTooltip({
          x: event.clientX,
          y: event.clientY,
          content: tooltipContent
        });
      })
      .on("mousemove", function (event, d: any) {
        // Update tooltip position
        if (tooltip) {
          setTooltip(prev => prev ? {
            ...prev,
            x: event.clientX,
            y: event.clientY
          } : null);
        }
      })
      .on("mouseleave", function (event, d: any) {
        const isoCode = d?.id ?? "";
        const hasData = countriesWithData.includes(isoCode);
        const fillColor = hasData 
          ? (isDark ? "rgb(96, 165, 250)" : "rgb(59, 130, 246)")
          : (isDark ? "rgb(75, 85, 99)" : "rgb(226, 232, 240)");
        d3.select(this).transition().duration(200).attr("fill", fillColor);
        
        // Hide tooltip
        setTooltip(null);
      })
      .on("click", function (event, d: any) {
        const isoCode = d?.id ?? "";
        const countryName = d?.properties?.name ?? "";
        const userCount = countryUserData[isoCode] || countryUserData[countryName] || 0;
        
        // Log click event for debugging/future functionality
        console.log("Country clicked:", {
          country: countryName,
          isoCode,
          userCount,
          coordinates: d.geometry ? d3.geoCentroid(d) : null
        });
        
        // Call the callback to update stats with ISO code if available
        if (onCountryClick && isoCode) {
          onCountryClick(isoCode);
        }
      })
;

  }, [worldData, width, height, isLoading, onCountryClick, countriesWithData, isDark]);

  if (isLoading) {
    return (
      <Card className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Global User Distribution</h2>
        </div>
        <div className="flex items-center justify-center flex-1 min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Global User Distribution</h2>
        </div>
        <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Global User Distribution</h2>
      </div>
      <div className="relative flex-1 min-h-[400px] border rounded-md overflow-hidden bg-white">
        {/* Campaign Reach Data Overlay - Left Side - Hidden on mobile */}
        <div 
          className="absolute top-0 left-0 w-32 h-full bg-surface-elevated/95 backdrop-blur-sm border-r border-border z-10 flex-col justify-center space-y-3 p-3 hidden md:flex"
          role="complementary"
          aria-label="Campaign statistics summary"
        >
          {/* Campaign Reach */}
          <div className="text-center" role="group" aria-labelledby="campaign-reach-label">
            <p id="campaign-reach-label" className="text-xs text-text-muted mb-1">Campaign Reach</p>
            <p className="text-lg font-bold text-text-primary" aria-label="12 countries reached">12</p>
            <p className="text-xs text-text-muted" aria-hidden="true">country</p>
          </div>

          {/* User Reached */}
          <div className="text-center" role="group" aria-labelledby="user-reached-label">
            <p id="user-reached-label" className="text-xs text-text-muted mb-1">User Reached</p>
            <p className="text-sm font-bold text-text-primary" aria-label="180,807,839 users reached">180,807,839</p>
            <p className="text-xs text-text-muted" aria-hidden="true">user</p>
          </div>

          {/* Period */}
          <div className="text-center" role="group" aria-labelledby="period-label">
            <p id="period-label" className="text-xs text-text-muted mb-1">Period</p>
            <p className="text-lg font-bold text-text-primary" aria-label="9 months campaign period">9</p>
            <p className="text-xs text-text-muted" aria-hidden="true">month</p>
          </div>

          {/* Last Updated */}
          <div className="text-center">
            <p className="text-xs text-text-muted mb-2" aria-label="Data last updated 2 seconds ago">Updated 2s ago</p>
            <button 
              className="flex items-center justify-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors text-xs mx-auto"
              aria-label="Refresh campaign data"
            >
              <RefreshCw className="w-3 h-3" aria-hidden="true" />
              <span>Click to refresh</span>
            </button>
          </div>
        </div>
        
        <svg
          ref={svgRef}
          className="w-full h-full"
          role="img"
          aria-labelledby="map-title"
          aria-describedby="map-description"
          style={{
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <title id="map-title">Interactive world map showing user distribution by country</title>
          <desc id="map-description">
            World map visualization displaying user count data across different countries. 
            Countries are colored according to user count ranges. Use mouse to zoom and pan. 
            Hover over countries to see detailed information.
          </desc>
        </svg>
        <button
          onClick={resetZoom}
          className="absolute top-2 right-2 bg-surface-elevated text-xs px-2 py-1 rounded shadow hover:bg-surface transition-colors"
        >
          Reset Zoom
        </button>
        <div className="absolute bottom-2 right-2 text-xs text-text-muted bg-surface-elevated px-2 py-1 rounded shadow">
          🌍 Interactive World Map
        </div>
        
        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 bg-surface text-text-primary text-xs rounded px-2 py-1 shadow-lg pointer-events-none whitespace-pre-line"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MapChart;
