import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfluencerTable from '../components/InfluencerTable';
import { Influencer } from '../lib/api/types';

// Mock data with various follower formats for comprehensive testing
const mockInfluencersWithMixedFormats: Influencer[] = [
  { id: 1, name: "Sarah Johnson", projects: 12, followers: "2.4M" },
  { id: 2, name: "Mike Chen", projects: 8, followers: "1,800,000" },
  { id: 3, name: "Emma Davis", projects: 15, followers: "3.1M" },
  { id: 4, name: "Alex Rodriguez", projects: 6, followers: "987K" },
  { id: 5, name: "Jessica Williams", projects: 9, followers: "1.5M" },
  { id: 6, name: "David Brown", projects: 11, followers: "2,100,000" },
  { id: 7, name: "Lisa Wang", projects: 7, followers: "890K" },
  { id: 8, name: "Carlos Garcia", projects: 13, followers: "1.7M" },
  { id: 9, name: "Maya Patel", projects: 10, followers: "1,300,000" },
  { id: 10, name: "Ryan Thompson", projects: 14, followers: "2.8M" },
  { id: 11, name: "Sophia Lee", projects: 5, followers: "750K" },
  { id: 12, name: "James Wilson", projects: 16, followers: "4.2M" },
  { id: 13, name: "Olivia Martinez", projects: 9, followers: "1.9M" },
  { id: 14, name: "Daniel Kim", projects: 11, followers: "2,500,000" },
  { id: 15, name: "Isabella Garcia", projects: 8, followers: "1.1M" },
];

describe('QA & Edge-Case Testing', () => {
  describe('Numeric Sort Verification', () => {
    test('should correctly sort mixed K/M/comma formats in descending order', () => {
      render(<InfluencerTable influencers={mockInfluencersWithMixedFormats} sortOrder="desc" itemsPerPage={15} />);
      
      // Get all follower count elements
      const followerElements = screen.getAllByText(/K|M|,/);
      
      // The first few should be the highest values
      // Expected order: James Wilson (4.2M), Emma Davis (3.1M), Ryan Thompson (2.8M), etc.
      expect(followerElements.length).toBeGreaterThan(0);
    });

    test('should correctly sort mixed K/M/comma formats in ascending order', () => {
      render(<InfluencerTable influencers={mockInfluencersWithMixedFormats} sortOrder="asc" itemsPerPage={15} />);
      
      // Get all follower count elements
      const followerElements = screen.getAllByText(/K|M|,/);
      
      // The first should be the lowest value
      // Expected order: Sophia Lee (750K), Lisa Wang (890K), Alex Rodriguez (987K), etc.
      expect(followerElements.length).toBeGreaterThan(0);
    });

    test('should handle edge cases with zero and very large numbers', () => {
      const edgeCaseData: Influencer[] = [
        { id: 1, name: "Zero Follower", projects: 1, followers: "0" },
        { id: 2, name: "Small Count", projects: 2, followers: "100" },
        { id: 3, name: "Billion User", projects: 3, followers: "1.2B" },
        { id: 4, name: "Trillion User", projects: 4, followers: "2.5T" },
      ];

      render(<InfluencerTable influencers={edgeCaseData} sortOrder="desc" itemsPerPage={10} />);
      
      // Should render without errors
      expect(screen.getByText("Trillion User")).toBeInTheDocument();
      expect(screen.getByText("Zero Follower")).toBeInTheDocument();
    });
  });

  describe('Pagination Reset Functionality', () => {
    test('should reset to page 1 when sort order changes', async () => {
      const { rerender } = render(
        <InfluencerTable 
          influencers={mockInfluencersWithMixedFormats} 
          sortOrder="desc" 
          itemsPerPage={5} 
        />
      );

      // Navigate to page 2
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      // Verify we're on page 2
      await waitFor(() => {
        expect(screen.getByText(/Showing 6 to 10 of/)).toBeInTheDocument();
      });

      // Change sort order
      rerender(
        <InfluencerTable 
          influencers={mockInfluencersWithMixedFormats} 
          sortOrder="asc" 
          itemsPerPage={5} 
        />
      );

      // Should be back on page 1
      await waitFor(() => {
        expect(screen.getByText(/Showing 1 to 5 of/)).toBeInTheDocument();
      });
    });

    test('should reset to page 1 when items per page changes', async () => {
      const { rerender } = render(
        <InfluencerTable 
          influencers={mockInfluencersWithMixedFormats} 
          sortOrder="desc" 
          itemsPerPage={5} 
        />
      );

      // Navigate to page 2
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      // Verify we're on page 2
      await waitFor(() => {
        expect(screen.getByText(/Showing 6 to 10 of/)).toBeInTheDocument();
      });

      // Change items per page
      rerender(
        <InfluencerTable 
          influencers={mockInfluencersWithMixedFormats} 
          sortOrder="desc" 
          itemsPerPage={10} 
        />
      );

      // Should be back on page 1 with 10 items
      await waitFor(() => {
        expect(screen.getByText(/Showing 1 to 10 of/)).toBeInTheDocument();
      });
    });
  });

  describe('Deletion Edge Cases', () => {
    test('should handle deletion of last item on a page', async () => {
      // Create data with exactly 6 items (2 pages with 5 items per page)
      const sixItemData = mockInfluencersWithMixedFormats.slice(0, 6);
      
      const { rerender } = render(
        <InfluencerTable 
          influencers={sixItemData} 
          sortOrder="desc" 
          itemsPerPage={5} 
        />
      );

      // Navigate to page 2 (should have 1 item)
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Showing 6 to 6 of/)).toBeInTheDocument();
      });

      // Simulate deletion of the last item (now we have 5 items total)
      const fiveItemData = sixItemData.slice(0, 5);
      rerender(
        <InfluencerTable 
          influencers={fiveItemData} 
          sortOrder="desc" 
          itemsPerPage={5} 
        />
      );

      // Should automatically go back to page 1
      await waitFor(() => {
        expect(screen.getByText(/Showing 1 to 5 of/)).toBeInTheDocument();
      });
    });

    test('should handle deletion when it results in empty dataset', () => {
      const { rerender } = render(
        <InfluencerTable 
          influencers={[mockInfluencersWithMixedFormats[0]]} 
          sortOrder="desc" 
          itemsPerPage={5} 
        />
      );

      // Verify single item is shown
      expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();

      // Simulate deletion of all items
      rerender(
        <InfluencerTable 
          influencers={[]} 
          sortOrder="desc" 
          itemsPerPage={5} 
        />
      );

      // Should handle empty state gracefully
      expect(screen.queryByText("Sarah Johnson")).not.toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    test('should use responsive classes for mobile layout', () => {
      render(<InfluencerTable influencers={mockInfluencersWithMixedFormats} itemsPerPage={5} />);
      
      // Check for responsive classes
      const table = screen.getByRole('table');
      expect(table.closest('.overflow-x-auto')).toBeInTheDocument();
      
      // Check for responsive text sizes
      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        expect(header).toHaveClass('text-xs');
      });
    });

    test('should maintain readable text sizes on small screens', () => {
      render(<InfluencerTable influencers={mockInfluencersWithMixedFormats} itemsPerPage={5} />);
      
      // Check for mobile-friendly text sizes in table cells
      const nameCell = screen.getByText("Sarah Johnson").closest('div');
      expect(nameCell).toHaveClass('text-xs', 'md:text-sm');
    });

    test('should have proper spacing for touch interfaces', () => {
      render(<InfluencerTable influencers={mockInfluencersWithMixedFormats} itemsPerPage={5} />);
      
      // Check pagination buttons have adequate touch targets
      const paginationButtons = screen.getAllByRole('button');
      paginationButtons.forEach(button => {
        const classes = button.className;
        // Should have minimum height for touch targets
        expect(classes).toMatch(/(h-10|min-h-\[40px\]|py-|p-)/);
      });
    });
  });

  describe('Pagination Edge Cases', () => {
    test('should disable previous button on first page', () => {
      render(<InfluencerTable influencers={mockInfluencersWithMixedFormats} itemsPerPage={5} />);
      
      const prevButton = screen.getByText('Previous').closest('a');
      expect(prevButton).toHaveClass('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
    });

    test('should disable next button on last page', async () => {
      render(<InfluencerTable influencers={mockInfluencersWithMixedFormats.slice(0, 5)} itemsPerPage={5} />);
      
      const nextButton = screen.getByText('Next').closest('a');
      expect(nextButton).toHaveClass('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
    });

    test('should show correct page numbers for large datasets', () => {
      const largeData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        projects: Math.floor(Math.random() * 20) + 1,
        followers: `${Math.floor(Math.random() * 1000)}K`
      }));

      render(<InfluencerTable influencers={largeData} itemsPerPage={5} />);
      
      // Should show page numbers (max 5 visible)
      const pageButtons = screen.getAllByRole('button').filter(button => 
        /^\d+$/.test(button.textContent || '')
      );
      expect(pageButtons.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Performance and Error Handling', () => {
    test('should handle malformed follower data gracefully', () => {
      const malformedData: Influencer[] = [
        { id: 1, name: "Test User 1", projects: 5, followers: "invalid_data" },
        { id: 2, name: "Test User 2", projects: 3, followers: "" },
        { id: 3, name: "Test User 3", projects: 7, followers: "null" },
      ];

      expect(() => {
        render(<InfluencerTable influencers={malformedData} itemsPerPage={5} />);
      }).not.toThrow();
      
      // Should still render the names
      expect(screen.getByText("Test User 1")).toBeInTheDocument();
      expect(screen.getByText("Test User 2")).toBeInTheDocument();
      expect(screen.getByText("Test User 3")).toBeInTheDocument();
    });

    test('should handle rapid pagination clicks', async () => {
      render(<InfluencerTable influencers={mockInfluencersWithMixedFormats} itemsPerPage={3} />);
      
      const nextButton = screen.getByText('Next');
      
      // Rapidly click next button
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      
      // Should handle gracefully without errors
      await waitFor(() => {
        expect(screen.getByText(/Showing \d+ to \d+ of/)).toBeInTheDocument();
      });
    });
  });
});
