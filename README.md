# Admin Dashboard - Choropleth Map Implementation

A responsive admin dashboard built with Next.js, featuring an interactive choropleth world map for visualizing user distribution data.

## Features

### Interactive Choropleth Map
- **Color-coded countries**: Countries are colored based on user count ranges using a sophisticated color bucket system
- **Interactive zoom & pan**: Mouse/touch controls for exploring the map
- **Responsive design**: Optimized layouts for desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Real-time tooltips**: Hover over countries to see detailed user statistics

### Data Visualization
- **Discrete color buckets**: User counts mapped to predefined color ranges (0-1K, 1K-5K, etc.)
- **Multiple color schemes**: Blue (default), Green, Orange, and Purple themes available
- **Dynamic legend**: Color legend adapts to screen size with compact mobile version
- **Campaign statistics overlay**: Key metrics displayed alongside the map

## Technology Stack

- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with responsive design patterns
- **Maps**: D3.js for choropleth visualization and GeoJSON processing
- **Data**: World countries GeoJSON with ISO-3166-1 Alpha-3 codes
- **Testing**: Jest with React Testing Library
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd admin_dash/project

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Map Implementation

### Choropleth Data Structure

```typescript
interface CountryData {
  id: string;        // ISO-3166-1 Alpha-3 code (e.g., "CAN", "DEU")
  name: string;      // Country name (e.g., "Canada", "Germany")
  userCount: number; // Number of users in this country
}
```

### Color Mapping System

The map uses a discrete bucket system for consistent and accessible color coding:

- **0-1K users**: Very light blue (#f0f9ff)
- **1K-5K users**: Light blue (#bae6fd)
- **5K-25K users**: Medium blue (#7dd3fc)
- **25K-100K users**: Bright blue (#38bdf8)
- **100K-500K users**: Strong blue (#0ea5e9)
- **500K+ users**: Dark blue (#0284c7)

### Responsive Design

- **Desktop (1024px+)**: Full map with campaign statistics sidebar and desktop legend
- **Tablet (768-1023px)**: Optimized layout with adjusted spacing
- **Mobile (<768px)**: Campaign statistics hidden, compact legend, touch-optimized interactions

## Testing

### Unit Tests
```bash
npm run test
```

Tests cover:
- Component rendering and state management
- Color utility functions and bucket calculations
- Accessibility features and ARIA attributes
- Responsive behavior and mobile optimizations
- Data processing and choropleth coloring logic

### Coverage Report
```bash
npm run test:coverage
```

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: ARIA labels, roles, and live regions
- **High Contrast**: Color choices meet WCAG 2.1 AA contrast requirements
- **Focus Management**: Clear focus indicators and logical tab order
- **Responsive Text**: Scalable font sizes and touch targets

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm run test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Performance Considerations

- **Lazy Loading**: Map component is dynamically imported to reduce initial bundle size
- **Efficient Rendering**: D3.js selections optimized for smooth interactions
- **Data Caching**: Country data and GeoJSON cached after initial load
- **Bundle Optimization**: Next.js automatic code splitting and optimization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- World countries GeoJSON data from Natural Earth
- D3.js community for choropleth mapping patterns
- Tailwind CSS for responsive design utilities
- React Testing Library for accessibility-focused testing approaches
