import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { History, CreditCard, Download, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { useCreditHistory, type CreditHistoryItem } from '@/api/leadApi';
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

  const currentCredits = 1075;
  const creditLimit = 2000;
  const usagePercentage = (creditLimit - currentCredits) / creditLimit * 100;

  // Transform API data for display
  const transformTransaction = (item: CreditHistoryItem) => {
    const reportTypeMap: Record<string, { type: string; description: string }> = {
      'GMBAUDIT': { type: 'Usage', description: 'GMB Audit Report' },
      'ONPAGE': { type: 'Usage', description: 'On-Page SEO Report' },
      'CITATION': { type: 'Usage', description: 'Citation Report' },
      'PROSPECT': { type: 'Usage', description: 'Prospect Report' },
    };

    const mapped = reportTypeMap[item.report_type] || { type: 'Usage', description: 'Report Generation' };
    
    return {
      id: item.id,
      type: mapped.type,
      credits: -parseInt(item.credits),
      cost: null,
      date: format(new Date(item.date), 'yyyy-MM-dd'),
      description: `${mapped.description} - ${item.business_name}`,
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
            <div className="text-2xl font-bold">{currentCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Usage</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">425</div>
            <p className="text-xs text-muted-foreground">Credits consumed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchased</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,500</div>
            <p className="text-xs text-muted-foreground">All time credits</p>
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
            <div className="flex justify-between text-sm">
              <span>Used: {(creditLimit - currentCredits).toLocaleString()} credits</span>
              <span>Available: {currentCredits.toLocaleString()} credits</span>
            </div>
            <Progress value={usagePercentage} className="w-full" />
          </div>
          
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Transaction History
              </CardTitle>
              <CardDescription>Detailed credit purchase and usage history</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
          
          {/* Search Input */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-muted"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-48"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Try adjusting your search term' : 'Your transaction history will appear here'}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'Purchase' ? 'bg-green-100 text-green-600' : 
                        transaction.type === 'Usage' ? 'bg-red-100 text-red-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {transaction.type === 'Purchase' ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : transaction.type === 'Usage' ? (
                          <TrendingDown className="w-5 h-5" />
                        ) : (
                          <CreditCard className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">Transaction ID: {transaction.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className={`font-medium ${transaction.credits > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.credits > 0 ? '+' : ''}{transaction.credits.toLocaleString()} credits
                          </p>
                          {transaction.cost && <p className="text-sm text-muted-foreground">{transaction.cost}</p>}
                        </div>
                        <Badge variant={
                          transaction.type === 'Purchase' ? 'default' : 
                          transaction.type === 'Usage' ? 'destructive' : 
                          'secondary'
                        }>
                          {transaction.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{transaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-border gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * pageLimit) + 1} to {Math.min(currentPage * pageLimit, pagination?.total || 0)} of {pagination?.total || 0} transactions
                  </p>
                  
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
                            <span className="px-3 py-2 text-muted-foreground">...</span>
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