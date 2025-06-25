
import React, { useState, useMemo } from 'react';
import { Search, Plus, Grid3X3, List, Zap, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { GoogleAccountCard } from './GoogleAccountCard';
import { GoogleAccountListView } from './GoogleAccountListView';
import { GoogleAccountPagination } from './GoogleAccountPagination';
import { AddAccountModal } from './AddAccountModal';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { useGoogleAccounts } from '../../hooks/useGoogleAccounts';

// Transform API data to match component expectations
const transformGoogleAccount = (apiAccount: any) => ({
  ...apiAccount,
  name: apiAccount.name || apiAccount.email.split('@')[0] || 'Unknown',
  connectedListings: apiAccount.connectedListings.map((name: string, index: number) => ({
    id: `${apiAccount.id}-${index}`,
    name,
    address: 'Address not available',
    status: 'connected' as const,
    type: 'Restaurant' as const,
  })),
});

export const ManageGoogleAccountPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  // Use debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    accounts: apiAccounts,
    totalActiveListings,
    totalAccounts,
    pagination,
    loading,
    error,
    refetch,
  } = useGoogleAccounts({
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm,
    sortOrder: 'asc',
  });

  // Transform API accounts to match component interface
  const accounts = useMemo(() => 
    apiAccounts.map(transformGoogleAccount), 
    [apiAccounts]
  );

  const handleManageListings = (accountId: string) => {
    navigate(`/settings/listings/${accountId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Manage Google Account</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Connect and monitor your Google Business Profiles to maximize local visibility and SEO performance.
        </p>
      </div>

      {/* Top Controls Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search accounts by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Active Listings Badge */}
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 w-fit">
              Active Listings: {totalActiveListings}/100
            </Badge>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-between">
            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            {/* View Switcher */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Add New Account Button */}
            <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add New Account</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800 text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && accounts.length === 0 ? (
        <div className="space-y-4">
          {viewMode === 'list' ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Account</TableHead>
                    <TableHead className="text-center">Total Listings</TableHead>
                    <TableHead className="text-center">Connected Listings</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Skeleton className="h-4 w-8 mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Skeleton className="h-4 w-8 mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Skeleton className="h-8 w-8 mx-auto" />
                      </td>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : accounts.length > 0 ? (
        <>
          {/* Account Cards Grid/List */}
          {viewMode === 'list' ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Account</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">Total Listings</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">Connected Listings</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <GoogleAccountListView
                      key={account.id}
                      account={account}
                      onManageListings={handleManageListings}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mb-6">
              {accounts.map((account) => (
                <GoogleAccountCard
                  key={account.id}
                  account={account}
                  viewMode={viewMode}
                  onManageListings={handleManageListings}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.total_pages && pagination.total_pages > 1 && (
            <GoogleAccountPagination
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              hasNext={pagination.has_next || false}
              hasPrev={pagination.has_prev || false}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No accounts found' : 'No accounts connected'}
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {searchTerm 
              ? `No accounts match "${searchTerm}". Try a different search term.`
              : "Click 'Add New Account' to sync your Google Business Profile."
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              Add New Account
            </Button>
          )}
        </div>
      )}

      {/* Add Account Modal */}
      <AddAccountModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
};
