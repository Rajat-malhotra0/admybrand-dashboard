"use client";

import React, { useMemo, useState, useEffect } from "react";
import { User, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Card from "./Card";
import { Influencer } from "@/lib/api/types";
import { useSortedInfluencers, SortOrder } from "@/hooks/useSortedInfluencers";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface InfluencerTableProps {
  influencers?: Influencer[];
  sortOrder?: SortOrder;
  itemsPerPage?: number;
  onSortOrderChange?: (order: SortOrder) => void;
}

const InfluencerTable: React.FC<InfluencerTableProps> = ({
  influencers = [],
  sortOrder = 'desc',
  itemsPerPage = 5,
  onSortOrderChange,
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  // Internal sort state if no external handler provided
  const [internalSortOrder, setInternalSortOrder] = useState<SortOrder>(sortOrder);
  const currentSortOrder = onSortOrderChange ? sortOrder : internalSortOrder;

  // Default data if none provided - expanded for demonstration
  const defaultInfluencers: Influencer[] = [
    { id: 1, name: "Sarah Johnson", projects: 12, followers: "2.3M" },
    { id: 2, name: "Mike Chen", projects: 8, followers: "1.8M" },
    { id: 3, name: "Emma Davis", projects: 15, followers: "3.1M" },
    { id: 4, name: "Alex Rodriguez", projects: 6, followers: "987K" },
    { id: 5, name: "Jessica Williams", projects: 9, followers: "1.5M" },
    { id: 6, name: "David Brown", projects: 11, followers: "2.1M" },
    { id: 7, name: "Lisa Wang", projects: 7, followers: "890K" },
    { id: 8, name: "Carlos Garcia", projects: 13, followers: "1.7M" },
    { id: 9, name: "Maya Patel", projects: 10, followers: "1.3M" },
    { id: 10, name: "Ryan Thompson", projects: 14, followers: "2.8M" },
  ];

  const sourceData = influencers.length > 0 ? influencers : defaultInfluencers;
  
  // Sort the influencer data based on sortOrder
  const sortedInfluencers = useSortedInfluencers(sourceData, currentSortOrder);

  // Reset pagination when sort order or data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentSortOrder, sourceData]);

  // Handle sort order changes
  const handleSortChange = () => {
    const newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    if (onSortOrderChange) {
      onSortOrderChange(newOrder);
    } else {
      setInternalSortOrder(newOrder);
    }
  };

  // Ensure current page is valid when data changes
  const totalPages = Math.ceil(sortedInfluencers.length / itemsPerPage);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Pagination calculations (totalPages already calculated above)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInfluencers = sortedInfluencers.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNext = () => {
    handlePageChange(currentPage + 1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <Card hover>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-md md:mb-lg gap-sm">
        <h3 className="text-base md:text-lg font-semibold text-text-primary tech-accent">
          Influencer
        </h3>
          <button className="text-primary-rgb hover:text-primary-rgb-dark dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center text-sm">
          <span>+ Add Influencer</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-surface-elevated">
            <tr>
              <th className="px-sm md:px-md py-xs md:py-sm text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                NAME
              </th>
              <th className="px-sm md:px-md py-xs md:py-sm text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                PROJECTS
              </th>
              <th 
                className="px-sm md:px-md py-xs md:py-sm text-left text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-primary-rgb transition-colors select-none"
                onClick={handleSortChange}
              >
                <div className="flex items-center gap-1">
                  FOLLOWERS
                  {currentSortOrder === 'asc' ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : currentSortOrder === 'desc' ? (
                    <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {paginatedInfluencers.map((influencer) => (
              <tr
                key={influencer.id}
                className="hover:bg-surface-elevated transition-colors"
              >
                <td className="px-sm md:px-md py-sm md:py-md whitespace-nowrap">
                  <div className="flex items-center space-x-sm md:space-x-md">
                    <div className="flex-shrink-0 h-6 w-6 md:h-8 md:w-8 bg-primary-rgb/10 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 md:w-4 md:h-4 text-primary-rgb dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs md:text-sm font-medium text-text-primary truncate">
                        {influencer.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-sm md:px-md py-sm md:py-md whitespace-nowrap">
                  <div className="text-xs md:text-sm text-text-primary mono">
                    {influencer.projects}
                  </div>
                </td>
                <td className="px-sm md:px-md py-sm md:py-md whitespace-nowrap">
                  <div className="text-xs md:text-sm text-text-primary mono">
                    {influencer.followers}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 border-t border-border pt-4">
          <Pagination className="w-full">
            <PaginationContent className="flex justify-center items-center gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  onClick={handlePrevious}
                  className={`cursor-pointer ${
                    currentPage === 1 
                      ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                      : 'hover:bg-accent'
                  }`}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className={`cursor-pointer min-w-[40px] h-10 ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'hover:bg-accent border-border'
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={handleNext}
                  className={`cursor-pointer ${
                    currentPage === totalPages 
                      ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                      : 'hover:bg-accent'
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          {/* Page info */}
          <div className="mt-3 text-center">
            <p className="text-sm text-text-muted">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedInfluencers.length)} of {sortedInfluencers.length} influencers
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default InfluencerTable;
