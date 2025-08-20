import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchEditLogs, setCurrentPage, setCurrentSearch } from '../../store/slices/editLogSlice';
import { transformEditLogs } from '../../utils/editLogTransform';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Calendar } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

interface EditLogTabProps {
  listingId: number;
}

export const EditLogTab: React.FC<EditLogTabProps> = ({ listingId }) => {
  const dispatch = useAppDispatch();
  const { data, isLoading, error, currentPage, currentSearch, limit } = useAppSelector(
    (state) => state.editLog
  );
  
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Fetch edit logs when component mounts or when dependencies change
  useEffect(() => {
    dispatch(fetchEditLogs({
      listingId,
      page: currentPage,
      limit,
      search: currentSearch,
    }));
  }, [dispatch, listingId, currentPage, currentSearch, limit]);

  // Handle search with debouncing
  const handleSearch = useCallback(() => {
    dispatch(setCurrentSearch(searchInput));
  }, [dispatch, searchInput]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const transformedLogs = data ? transformEditLogs(data.items) : [];
  const totalPages = data ? Math.ceil(data.pagination.total / data.pagination.limit) : 0;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">Failed to load edit logs</p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search edit logs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} variant="outline">
          Search
        </Button>
      </div>

      {/* Results Count */}
      {data && (
        <div className="text-sm text-muted-foreground">
          Showing {data.items.length} of {data.pagination.total} edit logs
        </div>
      )}

      {/* Edit Logs List */}
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                {i < 4 && <div className="w-px h-12 bg-muted mt-4"></div>}
              </div>
              <div className="flex-1 pb-8">
                <div className="h-4 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-24 mb-3"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : transformedLogs.length > 0 ? (
        <div className="space-y-0">
          {transformedLogs.map((log, index) => {
            const IconComponent = log.categoryIcon;
            return (
              <div key={log.id} className="flex gap-4 group">
                {/* Timeline Icon */}
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm ${log.categoryBgColor} ${log.categoryBorderColor}`}
                  >
                    <IconComponent 
                      className={`w-4 h-4 ${log.categoryIconColor}`}
                    />
                  </div>
                  {/* Connecting Line */}
                  {index < transformedLogs.length - 1 && (
                    <div 
                      className={`w-px h-12 mt-4 ${log.categoryBorderColor}`}
                    ></div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {log.formattedDate}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className={`text-xs font-medium ${log.categoryTextColor}`}>
                      {log.categoryLabel}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {log.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {currentSearch ? 'No edit logs found for your search' : 'No edit history available'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};