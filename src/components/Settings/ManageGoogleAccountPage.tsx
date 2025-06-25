import React, { useState } from 'react';
import { Search, Plus, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { GoogleAccountAvatar } from './GoogleAccountAvatar';
import { AddAccountModal } from './AddAccountModal';
import { MoreVertical, Edit, Trash2, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface ConnectedListing {
  id: string;
  name: string;
  address: string;
  status: 'connected' | 'disconnected' | 'pending';
  type: 'Restaurant' | 'Retail' | 'Service' | 'Healthcare';
}

interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  listings: number;
  activeListings: number;
  lastSynced: string;
  isEnabled: boolean;
  visibilityScore: number;
  reviewResponseRate: number;
  keywordsTracked: number;
  qaResponseHealth: number;
  connectedListings: ConnectedListing[];
}

const mockAccounts: GoogleAccount[] = [{
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
  connectedListings: [{
    id: '1',
    name: 'Downtown Bistro',
    address: '123 Main St, City',
    status: 'connected',
    type: 'Restaurant'
  }, {
    id: '2',
    name: 'Coffee Corner',
    address: '456 Oak Ave, City',
    status: 'connected',
    type: 'Restaurant'
  }, {
    id: '3',
    name: 'Pizza Palace',
    address: '789 Pine St, City',
    status: 'pending',
    type: 'Restaurant'
  }]
}, {
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
  connectedListings: [{
    id: '4',
    name: 'Chain Location A',
    address: '100 Business Blvd, City',
    status: 'connected',
    type: 'Restaurant'
  }, {
    id: '5',
    name: 'Chain Location B',
    address: '200 Commerce St, City',
    status: 'connected',
    type: 'Restaurant'
  }, {
    id: '6',
    name: 'Chain Location C',
    address: '300 Trade Ave, City',
    status: 'disconnected',
    type: 'Restaurant'
  }, {
    id: '7',
    name: 'Chain Location D',
    address: '400 Market St, City',
    status: 'connected',
    type: 'Restaurant'
  }]
}];

export const ManageGoogleAccountPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  
  const handleManageListings = (accountId: string) => {
    navigate(`/settings/listings/${accountId}`);
  };

  const handleRefresh = (accountId: string) => {
    console.log('Refresh account:', accountId);
  };

  const handleDelete = (accountId: string) => {
    console.log('Delete account:', accountId);
  };
  
  const totalActiveListings = mockAccounts.reduce((sum, account) => sum + account.activeListings, 0);
  
  const filteredAccounts = mockAccounts.filter(account => {
    return account.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           account.email.toLowerCase().includes(searchTerm.toLowerCase());
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
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            {/* Add New Account Button */}
            <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add New Account</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Google Accounts Table */}
      {filteredAccounts.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Account</TableHead>
                <TableHead className="font-semibold text-gray-900">Total Listings</TableHead>
                <TableHead className="font-semibold text-gray-900">Connected Listings</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <GoogleAccountAvatar name={account.name} avatar={account.avatar} />
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{account.name}</h3>
                        <p className="text-gray-500 text-xs truncate">{account.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">{account.listings}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">{account.activeListings}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                        onClick={() => handleRefresh(account.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleManageListings(account.id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                        onClick={() => handleDelete(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleManageListings(account.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Manage Listings
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRefresh(account.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(account.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
      <AddAccountModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
};
