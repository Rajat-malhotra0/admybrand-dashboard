import { parseFollowerCount } from '../lib/utils/parseFollowerCount';

describe('parseFollowerCount', () => {
  describe('Valid formatted inputs', () => {
    test('should parse K (thousands) suffix correctly', () => {
      expect(parseFollowerCount('1K')).toBe(1000);
      expect(parseFollowerCount('2.5K')).toBe(2500);
      expect(parseFollowerCount('980K')).toBe(980000);
      expect(parseFollowerCount('1.2K')).toBe(1200);
      expect(parseFollowerCount('0.5K')).toBe(500);
    });

    test('should parse M (millions) suffix correctly', () => {
      expect(parseFollowerCount('1M')).toBe(1000000);
      expect(parseFollowerCount('2.4M')).toBe(2400000);
      expect(parseFollowerCount('15.7M')).toBe(15700000);
      expect(parseFollowerCount('0.1M')).toBe(100000);
      expect(parseFollowerCount('100M')).toBe(100000000);
    });

    test('should parse B (billions) suffix correctly', () => {
      expect(parseFollowerCount('1B')).toBe(1000000000);
      expect(parseFollowerCount('1.5B')).toBe(1500000000);
      expect(parseFollowerCount('2.75B')).toBe(2750000000);
      expect(parseFollowerCount('0.1B')).toBe(100000000);
    });

    test('should parse T (trillions) suffix correctly', () => {
      expect(parseFollowerCount('1T')).toBe(1000000000000);
      expect(parseFollowerCount('2.5T')).toBe(2500000000000);
      expect(parseFollowerCount('0.5T')).toBe(500000000000);
    });

    test('should handle lowercase suffixes', () => {
      expect(parseFollowerCount('1k')).toBe(1000);
      expect(parseFollowerCount('2.4m')).toBe(2400000);
      expect(parseFollowerCount('1.5b')).toBe(1500000000);
      expect(parseFollowerCount('1t')).toBe(1000000000000);
    });

    test('should handle mixed case suffixes', () => {
      expect(parseFollowerCount('1K')).toBe(1000);
      expect(parseFollowerCount('2.4M')).toBe(2400000);
      expect(parseFollowerCount('1.5B')).toBe(1500000000);
      expect(parseFollowerCount('1T')).toBe(1000000000000);
    });
  });

  describe('Plain numbers', () => {
    test('should parse plain numbers without suffixes', () => {
      expect(parseFollowerCount('1000')).toBe(1000);
      expect(parseFollowerCount('12300')).toBe(12300);
      expect(parseFollowerCount('500')).toBe(500);
      expect(parseFollowerCount('0')).toBe(0);
      expect(parseFollowerCount('123')).toBe(123);
    });

    test('should parse numbers with commas', () => {
      expect(parseFollowerCount('1,000')).toBe(1000);
      expect(parseFollowerCount('12,300')).toBe(12300);
      expect(parseFollowerCount('1,234,567')).toBe(1234567);
      expect(parseFollowerCount('500,000')).toBe(500000);
      expect(parseFollowerCount('2,500,000')).toBe(2500000);
    });

    test('should parse decimal numbers', () => {
      expect(parseFollowerCount('1234.5')).toBe(1234.5);
      expect(parseFollowerCount('0.5')).toBe(0.5);
      expect(parseFollowerCount('999.99')).toBe(999.99);
    });

    test('should parse numbers with commas and decimals', () => {
      expect(parseFollowerCount('1,234.5')).toBe(1234.5);
      expect(parseFollowerCount('12,345.67')).toBe(12345.67);
    });
  });

  describe('Edge cases and invalid inputs', () => {
    test('should handle empty and whitespace strings', () => {
      expect(parseFollowerCount('')).toBe(0);
      expect(parseFollowerCount('   ')).toBe(0);
      expect(parseFollowerCount('\\t\\n')).toBe(0);
    });

    test('should handle null and undefined inputs', () => {
      expect(parseFollowerCount(null as any)).toBe(0);
      expect(parseFollowerCount(undefined as any)).toBe(0);
    });

    test('should handle non-string inputs', () => {
      expect(parseFollowerCount(123 as any)).toBe(0);
      expect(parseFollowerCount({} as any)).toBe(0);
      expect(parseFollowerCount([] as any)).toBe(0);
      expect(parseFollowerCount(true as any)).toBe(0);
    });

    test('should handle invalid string formats', () => {
      expect(parseFollowerCount('abc')).toBe(0);
      expect(parseFollowerCount('K1')).toBe(0);
      expect(parseFollowerCount('1.2.3K')).toBe(0);
      expect(parseFollowerCount('1MM')).toBe(0);
      expect(parseFollowerCount('1KB')).toBe(0);
      expect(parseFollowerCount('1X')).toBe(0);
    });

    test('should handle strings with extra characters', () => {
      expect(parseFollowerCount('1K followers')).toBe(0);
      expect(parseFollowerCount('~2.4M')).toBe(0);
      expect(parseFollowerCount('$1.5B')).toBe(0);
      expect(parseFollowerCount('1M+')).toBe(0);
    });

    test('should handle strings with leading/trailing whitespace', () => {
      expect(parseFollowerCount('  1K  ')).toBe(1000);
      expect(parseFollowerCount('\t2.4M\n')).toBe(2400000);
      expect(parseFollowerCount(' 12,300 ')).toBe(12300);
    });
  });

  describe('Ordering logic verification', () => {
    test('should maintain correct numerical ordering for K values', () => {
      const values = ['1K', '1.5K', '2K', '10K', '100K', '999K'];
      const parsed = values.map(parseFollowerCount);
      const sorted = [...parsed].sort((a, b) => a - b);
      expect(parsed).toEqual(sorted);
      expect(parsed).toEqual([1000, 1500, 2000, 10000, 100000, 999000]);
    });

    test('should maintain correct numerical ordering for M values', () => {
      const values = ['1M', '1.1M', '2M', '10M', '50M', '100M'];
      const parsed = values.map(parseFollowerCount);
      const sorted = [...parsed].sort((a, b) => a - b);
      expect(parsed).toEqual(sorted);
      expect(parsed).toEqual([1000000, 1100000, 2000000, 10000000, 50000000, 100000000]);
    });

    test('should maintain correct ordering across different units', () => {
      const values = ['999', '1K', '999K', '1M', '999M', '1B'];
      const parsed = values.map(parseFollowerCount);
      const sorted = [...parsed].sort((a, b) => a - b);
      expect(parsed).toEqual(sorted);
      expect(parsed).toEqual([999, 1000, 999000, 1000000, 999000000, 1000000000]);
    });

    test('should handle mixed formats in sorting', () => {
      const values = ['12,300', '1.5K', '2.4M', '980K', '1B', '500,000'];
      const parsed = values.map(parseFollowerCount);
      const expectedOrder = [12300, 1500, 500000, 980000, 2400000, 1000000000];
      
      // Sort the parsed values and check they match expected ascending order
      const sortedParsed = [...parsed].sort((a, b) => a - b);
      const expectedSorted = [...expectedOrder].sort((a, b) => a - b);
      expect(sortedParsed).toEqual(expectedSorted);
    });

    test('should handle edge cases in ordering', () => {
      const values = ['0', '100', '1K', '0.1M', '1M'];
      const parsed = values.map(parseFollowerCount);
      const sorted = [...parsed].sort((a, b) => a - b);
      expect(parsed).toEqual(sorted);
      expect(parsed).toEqual([0, 100, 1000, 100000, 1000000]);
    });
  });

  describe('Real-world examples', () => {
    test('should handle typical social media follower counts', () => {
      expect(parseFollowerCount('1.2K')).toBe(1200);      // Small influencer
      expect(parseFollowerCount('45.7K')).toBe(45700);    // Medium influencer
      expect(parseFollowerCount('2.1M')).toBe(2100000);   // Large influencer
      expect(parseFollowerCount('50M')).toBe(50000000);   // Celebrity
      expect(parseFollowerCount('1.5B')).toBe(1500000000); // Platform-wide stats
    });

    test('should handle formatted numbers with commas', () => {
      expect(parseFollowerCount('1,234')).toBe(1234);     // Small account
      expect(parseFollowerCount('12,500')).toBe(12500);   // Medium account
      expect(parseFollowerCount('125,000')).toBe(125000); // Large account
      expect(parseFollowerCount('1,250,000')).toBe(1250000); // Very large account
    });

    test('should ensure correct sorting of mixed real-world values', () => {
      const realWorldValues = [
        '1,234',      // 1,234
        '12.5K',      // 12,500
        '125K',       // 125,000
        '1.25M',      // 1,250,000
        '12.5M',      // 12,500,000
        '125M',       // 125,000,000
        '1.25B'       // 1,250,000,000
      ];
      
      const parsed = realWorldValues.map(parseFollowerCount);
      const sorted = [...parsed].sort((a, b) => a - b);
      
      // Should already be in ascending order
      expect(parsed).toEqual(sorted);
      expect(parsed).toEqual([
        1234,
        12500,
        125000,
        1250000,
        12500000,
        125000000,
        1250000000
      ]);
    });
  });
});
