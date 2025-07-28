'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import Card from './Card';

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
  { id: 'us', name: 'United States', coordinates: [-95, 40], value: 2547 },
  { id: 'uk', name: 'United Kingdom', coordinates: [0, 52], value: 1823 },
  { id: 'de', name: 'Germany', coordinates: [10, 51], value: 1456 },
  { id: 'fr', name: 'France', coordinates: [2, 46], value: 1234 },
  { id: 'jp', name: 'Japan', coordinates: [138, 36], value: 987 },
];

// Country colors
const countryColors: Record<string, string> = {
  'United States of America': 'rgb(59, 130, 246)',
  'United Kingdom': 'rgb(16, 185, 129)',
  'Germany': 'rgb(245, 158, 11)',
  'France': 'rgb(239, 68, 68)',
  'Japan': 'rgb(139, 92, 246)',
};

const MapChart: React.FC<MapChartProps> = ({ width = 800, height = 500 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [worldData, setWorldData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load world data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        if (!response.ok) {
          throw new Error('Failed to load world data');
        }
        const data = await response.json();
        setWorldData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading world data:', err);
        setError('Failed to load map data. Please try again later.');
        setIsLoading(false);
      }
    };
    loadWorldData();
  }, []);

  // Draw the map
  useEffect(() => {
    if (!svgRef.current || !worldData || isLoading) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    // Set up SVG dimensions
    svg
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`);
    
    // Create projection
    const projection = d3.geoNaturalEarth1()
      .translate([width / 2, height / 2])
      .scale(Math.min(width, height) / 6.5);
    
    // Create path generator
    const path = d3.geoPath().projection(projection);
    
    // Create zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        const { transform } = event;
        mapGroup.attr('transform', transform.toString());
      });
    
    // Apply zoom behavior to SVG
    svg.call(zoomBehavior);
    
    // Add grid pattern definition
    const defs = svg.append('defs');
    const pattern = defs.append('pattern')
      .attr('id', 'grid-pattern')
      .attr('width', 20)
      .attr('height', 20)
      .attr('patternUnits', 'userSpaceOnUse');
    
    pattern.append('path')
      .attr('d', 'M 20 0 L 0 0 0 20')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,0,0.04)')
      .attr('stroke-width', 0.5);
    
    // Add background with grid
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#grid-pattern)');
    
    // Create main group for map elements
    const mapGroup = svg.append('g').attr('class', 'map-group');
    
    // Draw countries
    mapGroup.selectAll('.country')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const countryName = d.properties.NAME;
        return countryColors[countryName] || 'rgb(226, 232, 240)';
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d: any) {
        const countryName = d.properties.NAME;
        const baseColor = countryColors[countryName] || 'rgb(226, 232, 240)';
        const hoverColor = d3.color(baseColor)?.darker(0.2)?.toString() || baseColor;
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', hoverColor);
      })
      .on('mouseleave', function(event, d: any) {
        const countryName = d.properties.NAME;
        const fillColor = countryColors[countryName] || 'rgb(226, 232, 240)';
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', fillColor);
      });
    
    // Add markers
    const markerColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    markers.forEach((marker, index) => {
      const point = projection(marker.coordinates);
      if (!point) return;
      
      const markerGroup = mapGroup.append('g')
        .attr('class', 'marker')
        .attr('transform', `translate(${point[0]}, ${point[1]})`);
      
      // Add main marker circle
      markerGroup.append('circle')
        .attr('r', 6)
        .attr('fill', markerColors[index % markerColors.length])
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .attr('class', 'marker-circle');
      
      // Add hover tooltip
      const tooltip = markerGroup.append('g')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .attr('transform', 'translate(10, -30)');
      
      tooltip.append('rect')
        .attr('width', marker.name.length * 8 + 40)
        .attr('height', 35)
        .attr('fill', 'rgba(15, 23, 42, 0.9)')
        .attr('rx', 6)
        .attr('ry', 6);
      
      tooltip.append('text')
        .attr('x', 20)
        .attr('y', 15)
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .text(marker.name);
      
      tooltip.append('text')
        .attr('x', 20)
        .attr('y', 28)
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .text(`${marker.value.toLocaleString()} users`);
      
      // Add interactions
      markerGroup
        .on('mouseenter', function() {
          d3.select(this).select('.marker-circle')
            .transition().duration(200)
            .attr('r', 8);
          
          d3.select(this).select('.tooltip')
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on('mouseleave', function() {
          d3.select(this).select('.marker-circle')
            .transition().duration(200)
            .attr('r', 6);
          
          d3.select(this).select('.tooltip')
            .transition().duration(200)
            .style('opacity', 0);
        });
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
        <div className="text-red-500 p-4 bg-red-50 rounded">
          {error}
        </div>
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
            cursor: 'grab',
            touchAction: 'none'
          }}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
          🌍 Interactive World Map
        </div>
      </div>
    </Card>
  );
};

export default MapChart;
