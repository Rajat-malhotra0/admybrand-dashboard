# Admin Dashboard - Influencer Marketing Analytics

A comprehensive admin dashboard built with Next.js for influencer marketing analytics, featuring interactive world maps, real-time data visualization, and campaign performance tracking across multiple social media platforms.

## Dashboard Usage Guide

Access to the application is provided via the designated link. While optimized for larger displays, the dashboard maintains full functionality across all screen sizes.

### Key Features:

- **Data Management**: Direct data addition and modification are supported via the admin sidebar.
- **Real-time Updates**: All data changes are reflected instantaneously.
- **Theme Customization**: Users can select between dark and light theme options.
- **Pagination**: Has been applied to make the tables look clean.
- **Data Sorting**: The leads table supports data sorting for enhanced usability.

## Features

### Interactive World Map
- **Country-based Analytics**: Click on countries to view platform-specific campaign data
- **Color-coded Visualization**: Countries highlighted based on user engagement data
- **Real-time Data Updates**: Map interactions trigger instant data refresh
- **Responsive Design**: Optimized for all screen sizes with touch support
- **Campaign Reach Visualization**: Visual representation of global campaign performance

### Multi-Platform Analytics
- **LinkedIn, Instagram, Facebook**: Comprehensive analytics across major social platforms
- **Campaign Performance Metrics**: Track reach, engagement, impressions, and conversions
- **Demographic Insights**: Age and gender distribution analysis
- **Interest Targeting**: Top follower interests with dynamic percentage tracking

### Lead Management
- **Comprehensive Lead Database**: 60+ influencer profiles across multiple countries
- **Advanced Filtering**: Filter leads by platform, country, and engagement metrics
- **Pagination Support**: Clean table presentation with 5 leads per page
- **Sortable Columns**: Sort by follower count, engagement rate, and other metrics
- **Export Capabilities**: Generate PDF reports of lead data and analytics

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

## Export PDF Reports

### How to Export

1. **Locate the Export Button**: Find the "Download PDF" button in the dashboard interface
2. **Click to Generate**: Click the button to start the PDF generation process
3. **Wait for Processing**: The system will capture the current dashboard state
4. **Download Automatically**: The PDF will be automatically downloaded to your default downloads folder

### What's Included in the PDF

- **Interactive Map**: Current choropleth map view with all country colorings
- **Legend**: Color legend showing user count ranges and corresponding colors
- **Statistics**: Campaign statistics and key metrics displayed on the dashboard
- **Metadata**: Export timestamp and dashboard configuration details

### Environment Considerations

#### CORS and Image Handling
- **External Images**: If your dashboard displays external images or icons, ensure CORS headers are properly configured
- **Base64 Conversion**: Images are automatically converted to base64 format for PDF embedding
- **Fallback Handling**: Missing or blocked images will be replaced with placeholder content

#### Large Data Sets
- **Memory Usage**: Large datasets (>10MB) may cause increased memory usage during PDF generation
- **Processing Time**: Complex maps with many countries may take 3-5 seconds to process
- **Browser Limits**: Very large exports may hit browser memory limits (>100MB datasets)
- **Optimization**: Consider filtering or paginating data for better performance

#### Browser Compatibility
- **Modern Browsers**: PDF export works best in Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Pop-up Blockers**: Ensure pop-up blockers allow downloads from your domain
- **JavaScript Required**: PDF export requires JavaScript to be enabled

### Troubleshooting PDF Export

**If PDF export fails:**
1. Check browser console for error messages
2. Ensure sufficient browser memory (close other tabs if needed)
3. Try refreshing the page and exporting again
4. For large datasets, consider reducing the data scope

**If images are missing in PDF:**
1. Verify CORS headers are set for external image domains
2. Check that image URLs are accessible from the client
3. Consider hosting images on the same domain as the application

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
