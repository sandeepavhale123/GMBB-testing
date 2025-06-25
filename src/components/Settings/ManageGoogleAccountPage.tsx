
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAccountsHeader } from './GoogleAccountsHeader';
import { GoogleAccountsSearchBar } from './GoogleAccountsSearchBar';
import { GoogleAccountsTable } from './GoogleAccountsTable';
import { GoogleAccountsEmptyState } from './GoogleAccountsEmptyState';
import { AddAccountModal } from './AddAccountModal';

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
      <GoogleAccountsHeader />
      
      <GoogleAccountsSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalActiveListings={totalActiveListings}
        onAddAccount={() => setShowAddModal(true)}
      />

      {filteredAccounts.length > 0 ? (
        <GoogleAccountsTable
          accounts={filteredAccounts}
          onManageListings={handleManageListings}
          onRefresh={handleRefresh}
          onDelete={handleDelete}
        />
      ) : (
        <GoogleAccountsEmptyState onAddAccount={() => setShowAddModal(true)} />
      )}

      <AddAccountModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
};
