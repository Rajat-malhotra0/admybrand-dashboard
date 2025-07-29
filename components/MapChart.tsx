"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import * as d3 from "d3";
import { RefreshCw } from "lucide-react";
import Card from "./Card";
import MapLegend from "./MapLegend";
import { getUserCountColorByBucket, getUserCountColorByScale } from "../lib/utils/colorUtils";

interface CountryData {
  id: string;
  name: string;
  userCount: number;
}

interface MapChartProps {
  width?: number;
  height?: number;
}

// Sample country data with user counts for choropleth visualization
const countryData: CountryData[] = [
  { id: "CAN", name: "Canada", userCount: 87142 },
  { id: "DEU", name: "Germany", userCount: 90069 },
  { id: "IDN", name: "Indonesia", userCount: 120904 },
  { id: "URY", name: "Uruguay", userCount: 85321 },
];


const MapChart: React.FC<MapChartProps> = ({ width = 800, height = 400 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [worldData, setWorldData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dimensions, setDimensions] = useState({ width, height });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  
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
      .call(zoomRef.current.transform, d3.zoomIdentity.scale(1.5));
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

    // Create projection with better initial zoom
    const projection = d3
      .geoNaturalEarth1()
      .translate([width / 2, height / 2])
      .scale(Math.min(width, height) / 4.5);

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

    // Add clean background with subtle grid
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#subtle-grid)");

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

    // Set initial zoom level (1.5x zoom)
    const initialTransform = d3.zoomIdentity.scale(1.5);
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
        // Try to get user count by ISO code first, then by name
        const isoCode = d?.id ?? "";
        const countryName = d?.properties?.name ?? "";
        const userCount = countryUserData[isoCode] || countryUserData[countryName] || 0;
        
        // Use our color utility if we have data, otherwise use default gray
        return userCount > 0 ? getUserCountColorByBucket(userCount) : "rgb(226, 232, 240)";
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .attr("role", "button")
      .attr("tabindex", "0")
      .attr("aria-label", (d: any) => {
        const isoCode = d?.id ?? "";
        const countryName = d?.properties?.name ?? "";
        const userCount = countryUserData[isoCode] || countryUserData[countryName] || 0;
        
        return userCount > 0 
          ? `${countryName}: ${userCount.toLocaleString()} users. Click for more details.`
          : `${countryName}: No user data available. Click for more details.`;
      })
      .on("mouseenter", function (event, d: any) {
        const isoCode = d?.id ?? "";
        const countryName = d?.properties?.name ?? "";
        const userCount = countryUserData[isoCode] || countryUserData[countryName] || 0;
        
        // Update fill color on hover
        const baseColor = userCount > 0 ? getUserCountColorByBucket(userCount) : "rgb(226, 232, 240)";
        const hoverColor = d3.color(baseColor)?.darker(0.2)?.toString() || baseColor;
        d3.select(this).transition().duration(200).attr("fill", hoverColor);
        
        // Show tooltip
        const tooltipContent = userCount > 0 
          ? `${countryName}\n${userCount.toLocaleString()} users\nISO: ${isoCode}`
          : `${countryName}\nNo data available\nISO: ${isoCode}`;
        
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
        const countryName = d?.properties?.name ?? "";
        const userCount = countryUserData[isoCode] || countryUserData[countryName] || 0;
        const fillColor = userCount > 0 ? getUserCountColorByBucket(userCount) : "rgb(226, 232, 240)";
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
        
        // Future: Could open detailed view, filter data, etc.
      })
      .on("keydown", function (event, d: any) {
        // Handle keyboard accessibility
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          // Trigger the same action as click
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          this.dispatchEvent(clickEvent);
        }
      })
      .on("focus", function (event, d: any) {
        // Visual focus indicator
        const isoCode = d?.id ?? "";
        const countryName = d?.properties?.name ?? "";
        const userCount = countryUserData[isoCode] || countryUserData[countryName] || 0;
        
        // Add focus styling
        d3.select(this)
          .attr("stroke", "#2563eb")
          .attr("stroke-width", 2);
        
        // Announce to screen readers
        const announcement = userCount > 0 
          ? `Focused on ${countryName} with ${userCount.toLocaleString()} users`
          : `Focused on ${countryName} with no user data`;
        
        // Create temporary announcement element for screen readers
        const announcement_el = document.createElement('div');
        announcement_el.setAttribute('aria-live', 'polite');
        announcement_el.setAttribute('aria-atomic', 'true');
        announcement_el.style.position = 'absolute';
        announcement_el.style.left = '-10000px';
        announcement_el.textContent = announcement;
        document.body.appendChild(announcement_el);
        
        setTimeout(() => {
          document.body.removeChild(announcement_el);
        }, 1000);
      })
      .on("blur", function (event, d: any) {
        // Remove focus styling
        d3.select(this)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 0.5);
      });

  }, [worldData, width, height, isLoading]);

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
          className="absolute top-0 left-0 w-32 h-full bg-white/95 backdrop-blur-sm border-r border-gray-200 z-10 flex-col justify-center space-y-3 p-3 hidden md:flex"
          role="complementary"
          aria-label="Campaign statistics summary"
        >
          {/* Campaign Reach */}
          <div className="text-center" role="group" aria-labelledby="campaign-reach-label">
            <p id="campaign-reach-label" className="text-xs text-gray-500 mb-1">Campaign Reach</p>
            <p className="text-lg font-bold text-gray-900" aria-label="12 countries reached">12</p>
            <p className="text-xs text-gray-400" aria-hidden="true">country</p>
          </div>

          {/* User Reached */}
          <div className="text-center" role="group" aria-labelledby="user-reached-label">
            <p id="user-reached-label" className="text-xs text-gray-500 mb-1">User Reached</p>
            <p className="text-sm font-bold text-gray-900" aria-label="180,807,839 users reached">180,807,839</p>
            <p className="text-xs text-gray-400" aria-hidden="true">user</p>
          </div>

          {/* Period */}
          <div className="text-center" role="group" aria-labelledby="period-label">
            <p id="period-label" className="text-xs text-gray-500 mb-1">Period</p>
            <p className="text-lg font-bold text-gray-900" aria-label="9 months campaign period">9</p>
            <p className="text-xs text-gray-400" aria-hidden="true">month</p>
          </div>

          {/* Last Updated */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2" aria-label="Data last updated 2 seconds ago">Updated 2s ago</p>
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
          className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded shadow hover:bg-gray-100 transition-colors"
        >
          Reset Zoom
        </button>
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
          🌍 Interactive World Map
        </div>
        
        {/* Map Legend - Desktop */}
        <MapLegend position="top-right" className="hidden md:block" />
        
        {/* Map Legend - Mobile (Compact) */}
        <MapLegend position="bottom-left" compact={true} className="block md:hidden" />
        
        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg pointer-events-none whitespace-pre-line"
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
