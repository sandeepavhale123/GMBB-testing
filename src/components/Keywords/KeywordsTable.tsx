import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Checkbox } from '../ui/checkbox';
import { MoreVertical, Eye, Trash, RefreshCw } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface Keyword {
  id: string;
  keyword: string;
  date: string;
  solv: string;
  atrp: string;
  atr: string;
  status: string;
}

interface KeywordsTableProps {
  keywords: Keyword[];
  currentPage: number;
  totalPages: number;
  totalKeywords: number;
  perPage: number;
  onDeleteKeyword: (ids: string[]) => void;
  onPageChange: (page: number) => void;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  listingId: string;
  deleteLoading?: boolean;
}

export const KeywordsTable: React.FC<KeywordsTableProps> = ({
  keywords,
  currentPage,
  totalPages,
  totalKeywords,
  perPage,
  onDeleteKeyword,
  onPageChange,
  loading,
  error,
  onRefresh,
  listingId,
  deleteLoading = false
}) => {
  const navigate = useNavigate();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const startIndex = (currentPage - 1) * 10;
  const endIndex = Math.min(startIndex + 10, totalKeywords);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedKeywords(keywords.map(k => k.id));
    } else {
      setSelectedKeywords([]);
    }
  };

  const handleSelectKeyword = (keywordId: string, checked: boolean) => {
    if (checked) {
      setSelectedKeywords(prev => [...prev, keywordId]);
    } else {
      setSelectedKeywords(prev => prev.filter(id => id !== keywordId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedKeywords.length > 0) {
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    onDeleteKeyword(selectedKeywords);
    setSelectedKeywords([]);
    setIsDeleteDialogOpen(false);
  };

  const isAllSelected = keywords.length > 0 && selectedKeywords.length === keywords.length;
  const isPartiallySelected = selectedKeywords.length > 0 && selectedKeywords.length < keywords.length;

  const handleViewRank = (keyword: Keyword) => {
    navigate(`/geo-ranking/${listingId}?keyword=${keyword.id}`);
  };

  const formatDate = (dateString: string) => {
    // Simple date formatting - you can enhance this
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'active' || statusLower === 'completed') {
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    } else if (statusLower === 'pending') {
      return <Badge variant="secondary">Pending</Badge>;
    } else if (statusLower === 'failed') {
      return <Badge variant="destructive">Failed</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No keywords found</p>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedKeywords.length > 0 && (
        <div className="mb-4 flex items-center gap-4 p-4 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedKeywords.length} keyword{selectedKeywords.length !== 1 ? 's' : ''} selected
          </span>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleBulkDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="w-4 h-4 mr-2" />
                    Delete Selected
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selectedKeywords.length} keyword{selectedKeywords.length !== 1 ? 's' : ''}? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedKeywords([])}
          >
            Clear Selection
          </Button>
        </div>
      )}

      <div className="bg-white rounded-lg">
        
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all keywords"
                className={isPartiallySelected ? "data-[state=checked]:bg-primary" : ""}
              />
            </TableHead>
            <TableHead className="w-16">Sr. No</TableHead>
            <TableHead>Keyword</TableHead>
            <TableHead className="text-center">ATR</TableHead>
            <TableHead className="text-center">ATRP</TableHead>
            <TableHead className="text-center">SOLV</TableHead>
            <TableHead className="text-center">Added On</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((keyword, index) => (
            <TableRow key={keyword.id}>
              <TableCell>
                <Checkbox
                  checked={selectedKeywords.includes(keyword.id)}
                  onCheckedChange={(checked) => handleSelectKeyword(keyword.id, checked as boolean)}
                  aria-label={`Select keyword ${keyword.keyword}`}
                />
              </TableCell>
              <TableCell className="font-medium">
                {startIndex + index + 1}
              </TableCell>
              <TableCell className="font-medium">{keyword.keyword}</TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="cursor-help">{keyword.atr || 'N/A'}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average True Range</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="cursor-help">{keyword.atrp || 'N/A'}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average True Range Percentage</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="cursor-help">{keyword.solv || 'N/A'}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Solvability Score</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">{formatDate(keyword.date)}</TableCell>
              <TableCell className="text-center">
                {getStatusBadge(keyword.status)}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewRank(keyword)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Rank
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSelectKeyword(keyword.id, true)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Select for Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, totalKeywords)} of {totalKeywords} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
        </div>
    </div>
  );
};