"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import * as d3 from "d3";
import Card from "./Card";

interface MapMarker {
  id: string;
  name: string;
  value: number;
  coordinates: [number, number];
}

interface MapChartProps {
  width?: number;
  height?: number;
}

// Sample data for markers
const markers: MapMarker[] = [
  { id: "ca", name: "Canada", coordinates: [-106.3468, 56.1304], value: 87142 },
  { id: "de", name: "Germany", coordinates: [10.4515, 51.1657], value: 90069 },
  {
    id: "id",
    name: "Indonesia",
    coordinates: [113.9213, -0.7893],
    value: 120904,
  },
  {
    id: "uy",
    name: "Uruguay",
    coordinates: [-55.7658, -32.5228],
    value: 85321,
  },
];

// Country colors
const countryColors: Record<string, string> = {
  Canada: "#3b82f6",
  Germany: "#10b981",
  Indonesia: "#f59e0b",
  Uruguay: "#8b5cf6",
};

const MapChart: React.FC<MapChartProps> = ({ width = 800, height = 500 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [worldData, setWorldData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        const response = await fetch(
          "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
        );
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

    // Draw countries
    mapGroup
      .selectAll(".country")
      .data(worldData.features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        const countryName = d?.properties?.NAME ?? "";
        return countryColors[countryName] || "rgb(226, 232, 240)";
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d: any) {
        const countryName = d?.properties?.NAME ?? "";
        const baseColor = countryColors[countryName] || "rgb(226, 232, 240)";
        const hoverColor =
          d3.color(baseColor)?.darker(0.2)?.toString() || baseColor;
        d3.select(this).transition().duration(200).attr("fill", hoverColor);
      })
      .on("mouseleave", function (event, d: any) {
        const countryName = d?.properties?.NAME ?? "";
        const fillColor = countryColors[countryName] || "rgb(226, 232, 240)";
        d3.select(this).transition().duration(200).attr("fill", fillColor);
      });

    // Add markers
    const markerColors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
    ];

    markers.forEach((marker, index) => {
      const point = projection(marker.coordinates);
      if (!point) return;

      const markerGroup = mapGroup
        .append("g")
        .attr("class", "marker")
        .attr("transform", `translate(${point[0]}, ${point[1]})`);

      // Add flagged style marker
      const markerBox = markerGroup
        .append("g")
        .attr("transform", "translate(-30, -40)");

      markerBox
        .append("rect")
        .attr("width", 90)
        .attr("height", 40)
        .attr("fill", "rgba(15, 23, 42, 0.9)")
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

      // Country flag and name
      markerBox
        .append("text")
        .attr("x", 20)
        .attr("y", 20)
        .attr("fill", "#fff")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .text(marker.name);

      // User count
      markerBox
        .append("text")
        .attr("x", 20)
        .attr("y", 35)
        .attr("fill", "#94a3b8")
        .attr("font-size", "10px")
        .text(`${marker.value.toLocaleString()} users`);
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
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{
            cursor: "grab",
            touchAction: "none",
          }}
        />
        <button
          onClick={resetZoom}
          className="absolute top-2 left-2 bg-white text-xs px-2 py-1 rounded shadow hover:bg-gray-100 transition-colors"
        >
          Reset Zoom
        </button>
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
          🌍 Interactive World Map
        </div>
      </div>
    </Card>
  );
};

export default MapChart;
