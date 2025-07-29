import { useState, useEffect } from 'react';

export interface UsePaginationProps {
  initialPage?: number;
  initialItemsPerPage?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  resetToFirstPage: () => void;
}

/**
 * Custom hook for managing pagination state
 * Automatically resets currentPage to 1 whenever itemsPerPage changes
 * @param initialPage - Initial page number (default: 1)
 * @param initialItemsPerPage - Initial items per page (default: 10)
 * @returns Object containing pagination state and setters
 */
export const usePagination = ({
  initialPage = 1,
  initialItemsPerPage = 10
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

  // Reset currentPage to 1 whenever itemsPerPage changes to avoid out-of-range pages
  const setItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPageState(newItemsPerPage);
    setCurrentPage(1);
  };

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    resetToFirstPage
  };
};
