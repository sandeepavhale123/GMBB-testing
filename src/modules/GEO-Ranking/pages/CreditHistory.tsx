import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Download, Calendar, CreditCard } from 'lucide-react';
import { useCreditHistory } from '../hooks/useCreditHistory';

export const CreditHistory: React.FC = () => {
  const { 
    creditHistory, 
    isLoading, 
    currentPage, 
    searchTerm, 
    handlePageChange, 
    handleSearchChange 
  } = useCreditHistory();

  const totalCreditsUsed = creditHistory.reduce((sum, item) => sum + item.credit, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/6"></div>
                  <div className="h-4 bg-muted rounded w-1/5"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Credits History</h1>
          <p className="text-muted-foreground">Track your credit usage across all ranking checks</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Credits Used</p>
                <p className="text-2xl font-bold text-foreground">{totalCreditsUsed}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Checks</p>
                <p className="text-2xl font-bold text-foreground">{creditHistory.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Credits/Check</p>
                <p className="text-2xl font-bold text-foreground">
                  {creditHistory.length > 0 ? Math.round((totalCreditsUsed / creditHistory.length) * 10) / 10 : 0}
                </p>
              </div>
              <Search className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Credit Usage History</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search keywords..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Keyword</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Credit</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {creditHistory.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">{item.keyword}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground">{item.credit}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {creditHistory.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No credit history found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};