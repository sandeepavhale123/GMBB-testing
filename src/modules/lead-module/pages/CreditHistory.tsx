import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { History, CreditCard, Download, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { useCreditHistory, useLeadCredits, type CreditHistoryItem } from '@/api/leadApi';
import { useDebounce } from '@/hooks/useDebounce';
import { format } from 'date-fns';
const CreditHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const pageLimit = 10;

  const { data: creditHistoryData, isLoading, error } = useCreditHistory({
    page: currentPage,
    limit: pageLimit,
    search: debouncedSearchTerm,
  });

  const { data: creditsData, isLoading: creditsLoading, error: creditsError } = useLeadCredits();

  // Calculate credit metrics from API data
  const allowedCredit = creditsData?.data?.allowedCredit || 0;
  const remainingCredit = creditsData?.data?.remainingCredit || 0;
  const usedCredits = allowedCredit - remainingCredit;
  const usagePercentage = allowedCredit > 0 ? (usedCredits / allowedCredit) * 100 : 0;

  // Transform API data for display
  const transformTransaction = (item: CreditHistoryItem) => {
    return {
      id: item.id,
      type: item.report_type,
      credits: -parseInt(item.credits),
      cost: null,
      date: format(new Date(item.date), 'yyyy-MM-dd'),
      description: item.business_name,
    };
  };

  const transactions = creditHistoryData?.data?.history?.map(transformTransaction) || [];
  const pagination = creditHistoryData?.data?.pagination;
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 3;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > maxVisible) {
        pages.push("...");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - (maxVisible - 1)) {
        pages.push("...");
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load credit history</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Credit History</h1>
          <p className="text-muted-foreground">Track your credit usage and purchases</p>
        </div>
        <Button className="gap-2">
          <CreditCard className="w-4 h-4" />
          Buy Credits
        </Button>
      </div>

      {/* Credit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {creditsLoading ? (
              <div className="h-6 bg-muted rounded animate-pulse mb-1"></div>
            ) : creditsError ? (
              <div className="text-2xl font-bold text-muted-foreground">--</div>
            ) : (
              <div className="text-2xl font-bold">{remainingCredit.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {creditsLoading ? (
              <div className="h-6 bg-muted rounded animate-pulse mb-1"></div>
            ) : creditsError ? (
              <div className="text-2xl font-bold text-muted-foreground">--</div>
            ) : (
              <div className="text-2xl font-bold">{usedCredits.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground">Credits consumed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {creditsLoading ? (
              <div className="h-6 bg-muted rounded animate-pulse mb-1"></div>
            ) : creditsError ? (
              <div className="text-2xl font-bold text-muted-foreground">--</div>
            ) : (
              <div className="text-2xl font-bold">{allowedCredit.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground">Total credits</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Usage</CardTitle>
          <CardDescription>Your current credit consumption</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {creditsLoading ? (
              <>
                <div className="flex justify-between text-sm">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                </div>
                <div className="h-2 bg-muted rounded animate-pulse"></div>
              </>
            ) : creditsError ? (
              <div className="text-center py-4 text-muted-foreground">
                Unable to load credit usage data
              </div>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span>Used: {usedCredits.toLocaleString()} credits</span>
                  <span>Available: {remainingCredit.toLocaleString()} credits</span>
                </div>
                <Progress value={usagePercentage} className="w-full" />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credit History Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Credits History
              </CardTitle>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="relative w-full mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search keywords..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Keyword</th>
                    <th className="text-left py-3 px-4 font-medium">Report Type</th>
                    <th className="text-left py-3 px-4 font-medium">Credit</th>
                    <th className="text-right py-3 px-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 px-4">
                        <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 bg-muted rounded w-8 animate-pulse"></div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="h-4 bg-muted rounded w-20 animate-pulse ml-auto"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No credit history found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Try adjusting your search' : 'Your credit usage will appear here'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Keyword</th>
                      <th className="text-left py-3 px-4 font-medium">Report Type</th>
                      <th className="text-left py-3 px-4 font-medium">Credit</th>
                      <th className="text-right py-3 px-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-border/50 hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">
                          <span className="font-medium text-muted-foreground">
                            {transaction.description.split(' - ')[1] || transaction.description}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-muted-foreground">
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-muted-foreground">
                            {Math.abs(transaction.credits)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-right">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 flex justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={
                            currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      
                      {getPageNumbers().map((page, i) =>
                        typeof page === "number" ? (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={currentPage === page}
                              onClick={() => handlePageChange(page)}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={i}>
                            <span className="px-3 py-2 text-muted-foreground">
                              ...
                            </span>
                          </PaginationItem>
                        )
                      )}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={
                            currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>;
};
export default CreditHistory;