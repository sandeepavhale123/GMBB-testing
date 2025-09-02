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
    return <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/6"></div>
                  <div className="h-4 bg-muted rounded w-1/5"></div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Credits History</h1>
          <p className="text-muted-foreground">Track your credit usage across all ranking checks</p>
        </div>
        
      </div>

      {/* Summary Stats */}
      

      {/* Filters and Search */}
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search keywords..." value={searchTerm} onChange={e => handleSearchChange(e.target.value)} className="pl-10 w-full" />
              </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Keyword</th>
                  <th className="text-left py-3 px-4 font-medium">Credit Type</th>
                  <th className="text-left py-3 px-4 font-medium">Credit</th>
                  <th className="text-right py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {creditHistory.map(item => <tr key={item.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-muted-foreground">{item.keyword}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-muted-foreground">{item.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-muted-foreground">{item.credit}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-right">{item.date}</td>
                  </tr>)}
              </tbody>
            </table>
            
            {creditHistory.length === 0 && !isLoading && <div className="text-center py-8">
                <p className="text-muted-foreground">No credit history found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search</p>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
};