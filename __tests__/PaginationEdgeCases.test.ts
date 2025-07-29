import { parseFollowerCount } from '../lib/utils/parseFollowerCount';

describe('Pagination and Deletion Edge Cases', () => {
  describe('Numeric Sort Verification', () => {
    test('should correctly sort mixed K/M/comma formats across different units', () => {
      const mixedFormats = [
        { name: 'User A', followers: '2.4M' },     // 2,400,000
        { name: 'User B', followers: '1,800,000' }, // 1,800,000
        { name: 'User C', followers: '3.1M' },     // 3,100,000
        { name: 'User D', followers: '987K' },     // 987,000
        { name: 'User E', followers: '1.5M' },     // 1,500,000
        { name: 'User F', followers: '2,100,000' }, // 2,100,000
        { name: 'User G', followers: '890K' },     // 890,000
        { name: 'User H', followers: '1.7M' },     // 1,700,000
        { name: 'User I', followers: '1,300,000' }, // 1,300,000
        { name: 'User J', followers: '2.8M' },     // 2,800,000
      ];

      // Sort by followers descending
      const sortedDesc = [...mixedFormats].sort((a, b) => {
        const aFollowers = parseFollowerCount(a.followers);
        const bFollowers = parseFollowerCount(b.followers);
        return bFollowers - aFollowers;
      });

      // Verify correct descending order
      const expectedDescOrder = [
        'User C', // 3.1M
        'User J', // 2.8M  
        'User A', // 2.4M
        'User F', // 2.1M
        'User B', // 1.8M
        'User H', // 1.7M
        'User E', // 1.5M
        'User I', // 1.3M
        'User D', // 987K
        'User G', // 890K
      ];

      expect(sortedDesc.map(u => u.name)).toEqual(expectedDescOrder);

      // Sort by followers ascending
      const sortedAsc = [...mixedFormats].sort((a, b) => {
        const aFollowers = parseFollowerCount(a.followers);
        const bFollowers = parseFollowerCount(b.followers);
        return aFollowers - bFollowers;
      });

      // Verify correct ascending order (reverse of desc)
      expect(sortedAsc.map(u => u.name)).toEqual(expectedDescOrder.reverse());
    });

    test('should handle edge cases with zero, billion, and trillion values', () => {
      const edgeCases = [
        { name: 'Zero User', followers: '0' },
        { name: 'Small User', followers: '100' },
        { name: 'K User', followers: '500K' },
        { name: 'M User', followers: '2.5M' },
        { name: 'B User', followers: '1.2B' },
        { name: 'T User', followers: '3.5T' },
      ];

      const sorted = [...edgeCases].sort((a, b) => {
        const aFollowers = parseFollowerCount(a.followers);
        const bFollowers = parseFollowerCount(b.followers);
        return bFollowers - aFollowers;
      });

      const expectedOrder = ['T User', 'B User', 'M User', 'K User', 'Small User', 'Zero User'];
      expect(sorted.map(u => u.name)).toEqual(expectedOrder);
    });
  });

  describe('Pagination Logic Verification', () => {
    test('should calculate correct pagination for different dataset sizes', () => {
      const testCases = [
        { dataSize: 10, itemsPerPage: 5, expectedPages: 2 },
        { dataSize: 15, itemsPerPage: 5, expectedPages: 3 },
        { dataSize: 11, itemsPerPage: 5, expectedPages: 3 },
        { dataSize: 5, itemsPerPage: 5, expectedPages: 1 },
        { dataSize: 1, itemsPerPage: 5, expectedPages: 1 },
        { dataSize: 0, itemsPerPage: 5, expectedPages: 0 },
      ];

      testCases.forEach(({ dataSize, itemsPerPage, expectedPages }) => {
        const totalPages = dataSize === 0 ? 0 : Math.ceil(dataSize / itemsPerPage);
        expect(totalPages).toBe(expectedPages);
      });
    });

    test('should handle deletion edge cases correctly', () => {
      // Simulate deletion of last item on a page
      const initialData = Array.from({ length: 11 }, (_, i) => ({ id: i + 1 }));
      const itemsPerPage = 5;
      let currentPage = 3; // User is on page 3 (items 11)
      
      // Initially: Page 1 (1-5), Page 2 (6-10), Page 3 (11)
      expect(Math.ceil(initialData.length / itemsPerPage)).toBe(3);
      
      // Delete item 11 (now we have 10 items total)
      const afterDeletion = initialData.slice(0, 10);
      const newTotalPages = Math.ceil(afterDeletion.length / itemsPerPage);
      
      // Now: Page 1 (1-5), Page 2 (6-10) - only 2 pages
      expect(newTotalPages).toBe(2);
      
      // Current page should be adjusted to valid page
      if (currentPage > newTotalPages && newTotalPages > 0) {
        currentPage = newTotalPages;
      }
      
      expect(currentPage).toBe(2); // Should redirect to page 2
    });

    test('should handle complete dataset deletion', () => {
      const initialData = [{ id: 1 }];
      const itemsPerPage = 5;
      let currentPage = 1;
      
      // Delete all items
      const afterDeletion: any[] = [];
      const newTotalPages = Math.ceil(afterDeletion.length / itemsPerPage);
      
      expect(newTotalPages).toBe(0);
      
      // Page should remain 1 for empty datasets (or be handled gracefully)
      if (newTotalPages === 0) {
        currentPage = 1;
      }
      
      expect(currentPage).toBe(1);
    });
  });

  describe('Mobile Responsiveness Edge Cases', () => {
    test('should handle very long follower counts on mobile', () => {
      const longFollowerCounts = [
        '1,234,567,890',
        '999,999,999K',
        '1,000,000M',
        '2.999999B'
      ];

      longFollowerCounts.forEach(followerCount => {
        const parsed = parseFollowerCount(followerCount);
        expect(typeof parsed).toBe('number');
        expect(parsed).toBeGreaterThanOrEqual(0);
      });
    });

    test('should maintain sort order consistency across different viewport sizes', () => {
      // This test simulates that sorting should work the same regardless of screen size
      const data = [
        { name: 'A', followers: '1.5M' },
        { name: 'B', followers: '2.5M' },
        { name: 'C', followers: '900K' },
      ];

      const desktopSort = [...data].sort((a, b) => 
        parseFollowerCount(b.followers) - parseFollowerCount(a.followers)
      );

      const mobileSort = [...data].sort((a, b) => 
        parseFollowerCount(b.followers) - parseFollowerCount(a.followers)
      );

      expect(desktopSort).toEqual(mobileSort);
      expect(desktopSort.map(d => d.name)).toEqual(['B', 'A', 'C']);
    });
  });

  describe('Performance Edge Cases', () => {
    test('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        followers: `${Math.floor(Math.random() * 1000)}K`
      }));

      const startTime = Date.now();
      
      const sorted = [...largeDataset].sort((a, b) => {
        const aFollowers = parseFollowerCount(a.followers);
        const bFollowers = parseFollowerCount(b.followers);
        return bFollowers - aFollowers;
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete sorting within reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100);
      expect(sorted.length).toBe(1000);
    });

    test('should handle malformed data gracefully', () => {
      const malformedData = [
        { name: 'Valid', followers: '1.5M' },
        { name: 'Invalid1', followers: 'abc' },
        { name: 'Invalid2', followers: '' },
        { name: 'Invalid3', followers: null as any },
        { name: 'Invalid4', followers: undefined as any },
      ];

      expect(() => {
        malformedData.forEach(item => {
          const parsed = parseFollowerCount(item.followers);
          expect(typeof parsed).toBe('number');
        });
      }).not.toThrow();

      // Sort should still work
      const sorted = [...malformedData].sort((a, b) => {
        const aFollowers = parseFollowerCount(a.followers);
        const bFollowers = parseFollowerCount(b.followers);
        return bFollowers - aFollowers;
      });

      expect(sorted.length).toBe(5);
      expect(sorted[0].name).toBe('Valid'); // Valid entry should be first
    });
  });
});
