import { useMemo } from 'react';
import { Influencer } from '@/lib/api/types';
import { parseFollowerCount } from '@/lib/utils/parseFollowerCount';

export type SortOrder = 'asc' | 'desc';

export interface PaginationOptions {
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginatedResult {
  sortedInfluencers: Influencer[];
  paginatedInfluencers: Influencer[];
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

/**
 * Custom hook for sorting influencer data by follower count
 * @param influencers - Array of influencer data
 * @param sortOrder - Sort order: 'asc' for ascending, 'desc' for descending
 * @returns Sorted array of influencers
 */
export const useSortedInfluencers = (
  influencers: Influencer[] | undefined,
  sortOrder: SortOrder
) => {
  return useMemo(() => {
    if (!influencers) return [];
    
    // Create a copy of the array to avoid mutating the original
    const sortedInfluencers = [...influencers].sort((a, b) => {
      // Parse follower counts using the parseFollowerCount utility
      const aFollowers = parseFollowerCount(a.followers);
      const bFollowers = parseFollowerCount(b.followers);
      
      // Sort based on the specified order
      if (sortOrder === 'asc') {
        return aFollowers - bFollowers;
      } else {
        return bFollowers - aFollowers;
      }
    });
    
    return sortedInfluencers;
  }, [influencers, sortOrder]);
};

/**
 * Custom hook for sorting and paginating influencer data
 * @param influencers - Array of influencer data
 * @param sortOrder - Sort order: 'asc' for ascending, 'desc' for descending
 * @param currentPage - Current page number (1-based)
 * @param itemsPerPage - Number of items per page
 * @returns Object containing sorted data, paginated data, and pagination info
 */
export const useSortedAndPaginatedInfluencers = (
  influencers: Influencer[] | undefined,
  sortOrder: SortOrder,
  currentPage: number,
  itemsPerPage: number
): PaginatedResult => {
  return useMemo(() => {
    if (!influencers) {
      return {
        sortedInfluencers: [],
        paginatedInfluencers: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage
      };
    }
    
    // Create a copy of the array to avoid mutating the original
    const sortedInfluencers = [...influencers].sort((a, b) => {
      // Parse follower counts using the parseFollowerCount utility
      const aFollowers = parseFollowerCount(a.followers);
      const bFollowers = parseFollowerCount(b.followers);
      
      // Sort based on the specified order
      if (sortOrder === 'asc') {
        return aFollowers - bFollowers;
      } else {
        return bFollowers - aFollowers;
      }
    });
    
    // Compute total pages
    const totalPages = Math.ceil(sortedInfluencers.length / itemsPerPage);
    
    // Slice the array for pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedInfluencers = sortedInfluencers.slice(start, end);
    
    return {
      sortedInfluencers,
      paginatedInfluencers,
      totalPages,
      currentPage,
      itemsPerPage
    };
  }, [influencers, sortOrder, currentPage, itemsPerPage]);
};
