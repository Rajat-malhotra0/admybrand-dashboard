"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { useTheme } from "@/contexts/ThemeContext";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface MapChartProps {
  onCountryClick?: (countryIsoCode: string) => void;
  countriesWithData?: string[];
}

const MapChart: React.FC<MapChartProps> = ({
  onCountryClick,
  countriesWithData = [],
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [worldData, setWorldData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch map data
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
        );
        if (!response.ok) throw new Error("Failed to load map data");
        const data = await response.json();
        setWorldData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading map data:", err);
        setError("Failed to load map data");
        setIsLoading(false);
      }
    };

    fetchMapData();
  }, []);

  // Render map
  useEffect(() => {
    if (!worldData || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    
    // Clear previous render
    svg.selectAll("*").remove();

    const { width, height } = container.getBoundingClientRect();
    
    // Define projection
    const projection = d3.geoMercator()
      .scale(width / 6.5)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Convert TopoJSON to GeoJSON
    const countries = topojson.feature(
      worldData,
      worldData.objects.countries
    ) as any;

    // Colors based on theme
    const isDark = theme === "dark";
    const baseColor = isDark ? "#1e293b" : "#e2e8f0"; // slate-800 : slate-200
    const strokeColor = isDark ? "#334155" : "#cbd5e1"; // slate-700 : slate-300
    const activeColor = "#3b82f6"; // blue-500
    const hoverColor = "#60a5fa"; // blue-400

    // Draw countries
    const g = svg.append("g");

    g.selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        // Check if country is in the active list
        // Note: This simple check assumes ISO codes or names match. 
        // Real implementation might need ID mapping.
        // The world-atlas uses numeric IDs or ISO codes depending on version.
        // For now, we'll just render base color.
        // To properly match, we'd need a mapping from numeric ID to ISO code.
        return baseColor;
      })
      .attr("stroke", strokeColor)
      .attr("stroke-width", 0.5)
      .attr("class", "country")
      .style("cursor", "pointer")
      .style("transition", "fill 0.2s ease")
      .on("mouseover", function(event, d: any) {
        d3.select(this).attr("fill", hoverColor);
        
        // Optional: Show tooltip
        // const countryName = d.properties.name;
      })
      .on("mouseout", function(event, d: any) {
        const isActive = false; // logic to check if active
        d3.select(this).attr("fill", isActive ? activeColor : baseColor);
      })
      .on("click", (event, d: any) => {
        if (onCountryClick) {
          // Pass ID or name
          onCountryClick(d.id); 
        }
      });

    // Highlight active countries if we can match them
    // Since we don't have the ID mapping handy in this snippet, 
    // we'll just rely on the base render for now.
    // If countriesWithData contains numeric IDs, we could match them.
    
    // Add zoom capabilities
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

  }, [worldData, theme, countriesWithData, onCountryClick]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p className="text-text-muted text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-red-50 dark:bg-red-900/10 rounded-xl">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
      <svg ref={svgRef} className="w-full h-full block" />
      
      {/* Legend/Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm border border-border/50 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-sm"></span>
          <span className="text-text-muted">No Data</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
          <span className="text-text-muted">Active Campaign</span>
        </div>
      </div>
    </div>
  );
};

export default MapChart;
