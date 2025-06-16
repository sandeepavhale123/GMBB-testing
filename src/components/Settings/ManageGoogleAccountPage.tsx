import React, { useState } from 'react';
import { Search, Plus, Grid3X3, List, Zap } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { GoogleAccountCard } from './GoogleAccountCard';
import { AddAccountModal } from './AddAccountModal';

const mockAccounts = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@restaurant.com',
    avatar: null,
    listings: 9,
    activeListings: 3,
    lastSynced: '2 hours ago',
    isEnabled: true,
    visibilityScore: 85,
    reviewResponseRate: 92,
    keywordsTracked: 15,
    qaResponseHealth: 78,
    teamMembers: [
      { name: 'Sarah Wilson', role: 'Manager' },
      { name: 'Mike Chen', role: 'Editor' }
    ]
  },
  {
    id: '2',
    name: 'Restaurant Chain Corp',
    email: 'admin@chainrestaurant.com',
    avatar: null,
    listings: 24,
    activeListings: 18,
    lastSynced: '1 hour ago',
    isEnabled: true,
    visibilityScore: 78,
    reviewResponseRate: 85,
    keywordsTracked: 32,
    qaResponseHealth: 65,
    teamMembers: [
      { name: 'David Kim', role: 'Admin' },
      { name: 'Lisa Wang', role: 'Manager' },
      { name: 'Tom Brown', role: 'Editor' }
    ]
  }
];

interface ManageGoogleAccountPageProps {
  onManageListings: (accountId: string) => void;
}

export const ManageGoogleAccountPage: React.FC<ManageGoogleAccountPageProps> = ({
  onManageListings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  const totalActiveListings = mockAccounts.reduce((sum, account) => sum + account.activeListings, 0);

  const filteredAccounts = mockAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') return matchesSearch && account.isEnabled;
    if (filterStatus === 'inactive') return matchesSearch && !account.isEnabled;
    
    return matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Manage Google Account</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Connect and monitor your Google Business Profiles to maximize local visibility and SEO performance.
        </p>
      </div>

      {/* Top Controls Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
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

            {/* Filter Dropdown */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="sync-failed">Sync Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-between">
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

      {/* Account Cards Grid */}
      {filteredAccounts.length > 0 ? (
        <div className={`grid gap-4 sm:gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredAccounts.map((account) => (
            <GoogleAccountCard
              key={account.id}
              account={account}
              viewMode={viewMode}
              onManageListings={onManageListings}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts connected</h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Click 'Add New Account' to sync your Google Business Profile.
          </p>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 mx-auto">
            <Plus className="h-4 w-4" />
            Add New Account
          </Button>
        </div>
      )}

      {/* Add Account Modal */}
      <AddAccountModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
};
