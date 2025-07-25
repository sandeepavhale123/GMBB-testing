import React from 'react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { Download, Eye, Trash2, Info, Loader2, RefreshCw } from 'lucide-react';
import { Keyword } from './KeywordsPage';

interface KeywordsTableProps {
  keywords: Keyword[];
  onExport: (format: 'csv' | 'json') => void;
  onDeleteKeyword: (keywordId: string) => void;
  currentPage: number;
  totalPages: number;
  totalKeywords: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const KeywordsTable: React.FC<KeywordsTableProps> = ({
  keywords,
  onExport,
  onDeleteKeyword,
  currentPage,
  totalPages,
  totalKeywords,
  onPageChange,
  loading,
  error,
  onRefresh
}) => {
  const startIndex = (currentPage - 1) * 10;
  const endIndex = Math.min(startIndex + 10, totalKeywords);

  const handleViewRank = (keyword: Keyword) => {
    // This would typically navigate to a detailed view or open a modal
    console.log('View rank for:', keyword.keyword);
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800', 
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <TooltipProvider>
      <div className="bg-white rounded-lg shadow">
        {/* Table Header with Export Options */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Keywords List</h2>
            {error && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="text-red-600 hover:text-red-800"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={loading || keywords.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('json')}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Table */}
        {!error && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Sr. No</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead className="w-24">
                    <div className="flex items-center gap-1">
                      ATR
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Average Rank Position</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead className="w-24">
                    <div className="flex items-center gap-1">
                      ATRP
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Average Total Rank Position</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead className="w-24">
                    <div className="flex items-center gap-1">
                      SOLV
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share of Local Voice</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead className="w-32">Added On</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-24 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                    </TableCell>
                  </TableRow>
                ) : keywords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No keywords found. Add some keywords to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  keywords.map((keyword, index) => (
                    <TableRow key={keyword.id}>
                      <TableCell className="font-medium">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {keyword.keyword}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {parseFloat(keyword.atr).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {parseFloat(keyword.atrp).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {parseFloat(keyword.solv).toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(keyword.date)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(keyword.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewRank(keyword)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteKeyword(keyword.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!error && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {endIndex} of {totalKeywords} entries
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => onPageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        onClick={() => onPageChange(pageNumber)}
                        isActive={pageNumber === currentPage}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => onPageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};