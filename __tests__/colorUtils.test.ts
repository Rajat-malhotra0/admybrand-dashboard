import {
  getUserCountColorByBucket,
  getUserCountColorByScale,
  getUserCountBucketLabel,
  generateColorLegend,
  DEFAULT_USER_COUNT_BUCKETS,
  COLOR_SCHEMES,
  BucketConfig
} from '../lib/utils/colorUtils';

describe('Color Utilities for Choropleth Maps', () => {
  describe('getUserCountColorByBucket', () => {
    it('returns correct color for different user count ranges', () => {
      expect(getUserCountColorByBucket(500)).toBe('#f0f9ff'); // 0-1K range
      expect(getUserCountColorByBucket(2500)).toBe('#bae6fd'); // 1K-5K range
      expect(getUserCountColorByBucket(15000)).toBe('#7dd3fc'); // 5K-25K range
      expect(getUserCountColorByBucket(50000)).toBe('#38bdf8'); // 25K-100K range
      expect(getUserCountColorByBucket(250000)).toBe('#0ea5e9'); // 100K-500K range
      expect(getUserCountColorByBucket(750000)).toBe('#0284c7'); // 500K+ range
    });

    it('handles edge cases correctly', () => {
      expect(getUserCountColorByBucket(0)).toBe('#f0f9ff'); // Exactly 0
      expect(getUserCountColorByBucket(-100)).toBe('#f0f9ff'); // Negative numbers
      expect(getUserCountColorByBucket(1000)).toBe('#bae6fd'); // Boundary value (1K)
      expect(getUserCountColorByBucket(500000)).toBe('#0284c7'); // Boundary value (500K)
    });

    it('works with custom buckets', () => {
      const customBuckets: BucketConfig[] = [
        { min: 0, max: 100, color: '#fee2e2', label: '0-100' },
        { min: 100, max: 1000, color: '#fca5a5', label: '100-1K' },
        { min: 1000, max: Number.MAX_SAFE_INTEGER, color: '#dc2626', label: '1K+' },
      ];

      expect(getUserCountColorByBucket(50, customBuckets)).toBe('#fee2e2');
      expect(getUserCountColorByBucket(500, customBuckets)).toBe('#fca5a5');
      expect(getUserCountColorByBucket(5000, customBuckets)).toBe('#dc2626');
    });
  });

  describe('getUserCountColorByScale', () => {
    it('returns interpolated colors for quantitative scale', () => {
      const color1 = getUserCountColorByScale(0);
      const color2 = getUserCountColorByScale(500000);
      const color3 = getUserCountColorByScale(1000000);

      // Should return different colors for different values
      expect(color1).not.toBe(color2);
      expect(color2).not.toBe(color3);

      // Should return hex color strings
      expect(color1).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(color2).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(color3).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('handles edge cases for quantitative scale', () => {
      const minColor = getUserCountColorByScale(-100);
      const maxColor = getUserCountColorByScale(2000000); // Above max

      expect(minColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(maxColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  describe('getUserCountBucketLabel', () => {
    it('returns correct labels for user count ranges', () => {
      expect(getUserCountBucketLabel(500)).toBe('0-1K');
      expect(getUserCountBucketLabel(2500)).toBe('1K-5K');
      expect(getUserCountBucketLabel(15000)).toBe('5K-25K');
      expect(getUserCountBucketLabel(50000)).toBe('25K-100K');
      expect(getUserCountBucketLabel(250000)).toBe('100K-500K');
      expect(getUserCountBucketLabel(750000)).toBe('500K+');
    });

    it('handles edge cases for labels', () => {
      expect(getUserCountBucketLabel(0)).toBe('0-1K');
      expect(getUserCountBucketLabel(-100)).toBe('0-1K');
      expect(getUserCountBucketLabel(1000)).toBe('1K-5K');
    });
  });

  describe('generateColorLegend', () => {
    it('generates legend items from default buckets', () => {
      const legend = generateColorLegend();
      
      expect(legend).toHaveLength(DEFAULT_USER_COUNT_BUCKETS.length);
      expect(legend[0]).toEqual({ color: '#f0f9ff', label: '0-1K' });
      expect(legend[1]).toEqual({ color: '#bae6fd', label: '1K-5K' });
      expect(legend[legend.length - 1]).toEqual({ color: '#0284c7', label: '500K+' });
    });

    it('generates legend items from custom buckets', () => {
      const customBuckets: BucketConfig[] = [
        { min: 0, max: 50, color: '#fff', label: 'Low' },
        { min: 50, max: Number.MAX_SAFE_INTEGER, color: '#000', label: 'High' },
      ];

      const legend = generateColorLegend(customBuckets);
      
      expect(legend).toHaveLength(2);
      expect(legend[0]).toEqual({ color: '#fff', label: 'Low' });
      expect(legend[1]).toEqual({ color: '#000', label: 'High' });
    });
  });

  describe('COLOR_SCHEMES', () => {
    it('contains all expected color schemes', () => {
      expect(COLOR_SCHEMES.BLUES).toBeDefined();
      expect(COLOR_SCHEMES.GREENS).toBeDefined();
      expect(COLOR_SCHEMES.ORANGES).toBeDefined();
      expect(COLOR_SCHEMES.PURPLES).toBeDefined();
    });

    it('all color schemes have interpolators and buckets', () => {
      Object.values(COLOR_SCHEMES).forEach(scheme => {
        expect(scheme.interpolator).toBeDefined();
        expect(scheme.buckets).toBeDefined();
        expect(Array.isArray(scheme.buckets)).toBe(true);
        expect(scheme.buckets.length).toBeGreaterThan(0);
      });
    });

    it('works with different color schemes', () => {
      const blueColor = getUserCountColorByBucket(15000, COLOR_SCHEMES.BLUES.buckets);
      const greenColor = getUserCountColorByBucket(15000, COLOR_SCHEMES.GREENS.buckets);
      const orangeColor = getUserCountColorByBucket(15000, COLOR_SCHEMES.ORANGES.buckets);
      const purpleColor = getUserCountColorByBucket(15000, COLOR_SCHEMES.PURPLES.buckets);

      // All should return valid hex colors
      [blueColor, greenColor, orangeColor, purpleColor].forEach(color => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });

      // Colors should be different for different schemes
      expect(blueColor).not.toBe(greenColor);
      expect(greenColor).not.toBe(orangeColor);
      expect(orangeColor).not.toBe(purpleColor);
    });
  });

  describe('Integration with choropleth maps', () => {
    it('simulates choropleth data processing', () => {
      // Simulate country data for choropleth
      const countryData = [
        { id: 'CAN', name: 'Canada', userCount: 87142 },
        { id: 'DEU', name: 'Germany', userCount: 90069 },
        { id: 'IDN', name: 'Indonesia', userCount: 120904 },
        { id: 'URY', name: 'Uruguay', userCount: 85321 },
      ];

      // Create lookup map as done in MapChart
      const countryUserData: Record<string, number> = {};
      countryData.forEach(data => {
        countryUserData[data.name] = data.userCount;
        countryUserData[data.id] = data.userCount;
      });

      // Test color assignment
      expect(getUserCountColorByBucket(countryUserData['Canada'])).toBe('#7dd3fc'); // 5K-25K range
      expect(getUserCountColorByBucket(countryUserData['CAN'])).toBe('#7dd3fc'); // Same for ISO code
      expect(getUserCountColorByBucket(countryUserData['Indonesia'])).toBe('#38bdf8'); // 25K-100K range
      
      // Test missing country
      expect(countryUserData['Unknown'] || 0).toBe(0);
    });
  });
});
