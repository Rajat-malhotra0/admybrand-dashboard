import { useMemo } from 'react';
import { Lead } from '@/lib/api/types';
import { parseFollowerCount } from '@/lib/utils/parseFollowerCount';

export type SortOrder = 'asc' | 'desc';

export interface PaginationOptions {
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginatedResult {
  sortedLeads: Lead[];
  paginatedLeads: Lead[];
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

/**
 * Custom hook for sorting lead data by follower count
 * @param leads - Array of lead data
 * @param sortOrder - Sort order: 'asc' for ascending, 'desc' for descending
 * @returns Sorted array of leads
 */
export const useSortedLeads = (
  leads: Lead[] | undefined,
  sortOrder: SortOrder
) => {
  return useMemo(() => {
    if (!leads) return [];
    
    // Create a copy of the array to avoid mutating the original
    const sortedLeads = [...leads].sort((a, b) => {
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
    
    return sortedLeads;
  }, [leads, sortOrder]);
};

/**
 * Custom hook for sorting and paginating lead data
 * @param leads - Array of lead data
 * @param sortOrder - Sort order: 'asc' for ascending, 'desc' for descending
 * @param currentPage - Current page number (1-based)
 * @param itemsPerPage - Number of items per page
 * @returns Object containing sorted data, paginated data, and pagination info
 */
export const useSortedAndPaginatedLeads = (
  leads: Lead[] | undefined,
  sortOrder: SortOrder,
  currentPage: number,
  itemsPerPage: number
): PaginatedResult => {
  return useMemo(() => {
    if (!leads) {
      return {
        sortedLeads: [],
        paginatedLeads: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage
      };
    }
    
    // Create a copy of the array to avoid mutating the original
    const sortedLeads = [...leads].sort((a, b) => {
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
    const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);
    
    // Slice the array for pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedLeads = sortedLeads.slice(start, end);
    
    return {
      sortedLeads,
      paginatedLeads,
      totalPages,
      currentPage,
      itemsPerPage
    };
  }, [leads, sortOrder, currentPage, itemsPerPage]);
};
