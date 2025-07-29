import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MapChart from '../components/MapChart';

// Mock fetch for GeoJSON data
global.fetch = jest.fn();

// Mock D3 selection and other D3 methods
jest.mock('d3', () => ({
  select: jest.fn(() => ({
    selectAll: jest.fn(() => ({
      remove: jest.fn(),
    })),
    attr: jest.fn().mockReturnThis(),
    append: jest.fn(() => ({
      attr: jest.fn().mockReturnThis(),
      append: jest.fn().mockReturnThis(),
    })),
  })),
  geoNaturalEarth1: jest.fn(() => ({
    translate: jest.fn().mockReturnThis(),
    scale: jest.fn().mockReturnThis(),
  })),
  geoPath: jest.fn(() => ({
    projection: jest.fn(),
  })),
  zoom: jest.fn(() => ({
    scaleExtent: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
  })),
  zoomIdentity: {
    scale: jest.fn(),
  },
}));

const mockGeoJSONData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "CAN",
      properties: { name: "Canada" },
      geometry: {
        type: "Polygon",
        coordinates: [[[-100, 50], [-90, 50], [-90, 60], [-100, 60], [-100, 50]]]
      }
    },
    {
      type: "Feature", 
      id: "DEU",
      properties: { name: "Germany" },
      geometry: {
        type: "Polygon",
        coordinates: [[[8, 47], [15, 47], [15, 55], [8, 55], [8, 47]]]
      }
    }
  ]
};

describe('MapChart Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockGeoJSONData,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<MapChart />);
    expect(screen.getByText('Global User Distribution')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { hidden: true })).toBeInTheDocument();
  });

  it('loads GeoJSON data and renders map', async () => {
    render(<MapChart />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/data/world-countries.geojson');
    });

    expect(screen.getByRole('img', { name: /interactive world map/i })).toBeInTheDocument();
  });

  it('renders map legend components', async () => {
    render(<MapChart />);
    
    await waitFor(() => {
      expect(screen.getByText('Global User Distribution')).toBeInTheDocument();
    });

    // Check for legend presence (though specific legend content is tested in MapLegend.test.tsx)
    const mapContainer = screen.getByRole('img', { name: /interactive world map/i }).parentElement;
    expect(mapContainer).toBeInTheDocument();
  });

  it('renders campaign statistics overlay', async () => {
    render(<MapChart />);
    
    await waitFor(() => {
      expect(screen.getByText('Campaign Reach')).toBeInTheDocument();
      expect(screen.getByText('User Reached')).toBeInTheDocument();
      expect(screen.getByText('Period')).toBeInTheDocument();
    });
  });

  it('handles error state when GeoJSON fails to load', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<MapChart />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load map data/)).toBeInTheDocument();
    });
  });

  it('renders reset zoom button', async () => {
    render(<MapChart />);
    
    await waitFor(() => {
      expect(screen.getByText('Reset Zoom')).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', async () => {
    render(<MapChart />);
    
    await waitFor(() => {
      const svg = screen.getByRole('img', { name: /interactive world map/i });
      expect(svg).toHaveAttribute('aria-labelledby', 'map-title');
      expect(svg).toHaveAttribute('aria-describedby', 'map-description');
    });
  });
});
