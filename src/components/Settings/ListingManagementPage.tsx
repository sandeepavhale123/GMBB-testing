
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ListingStatisticsCards } from './ListingStatisticsCards';
import { ListingSearchFilters } from './ListingSearchFilters';
import { ListingsTable } from './ListingsTable';

interface ListingManagementPageProps {
  accountId: string;
}

export const ListingManagementPage: React.FC<ListingManagementPageProps> = ({ accountId }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleBack = () => {
    navigate('/settings/google-account');
  };

  // Mock data with updated structure
  const mockListings = [
    {
      id: '1',
      name: 'Downtown Restaurant',
      store_code: 'DR001',
      group_name: 'Restaurant Group A',
      state: 'New York',
      status: 'verified' as const
    },
    {
      id: '2',
      name: 'Uptown Bistro',
      store_code: 'UB002',
      group_name: 'Restaurant Group A',
      state: 'New York',
      status: 'pending' as const
    },
    {
      id: '3',
      name: 'Midtown Cafe',
      store_code: 'MC003',
      group_name: 'Cafe Group B',
      state: 'California',
      status: 'verified' as const
    },
    {
      id: '4',
      name: 'Sunset Diner',
      store_code: 'SD004',
      group_name: 'Diner Group C',
      state: 'Texas',
      status: 'suspended' as const
    },
    {
      id: '5',
      name: 'Harbor View Restaurant',
      store_code: 'HVR005',
      group_name: 'Restaurant Group A',
      state: 'Florida',
      status: 'verified' as const
    }
  ];

  // Filter listings based on search and status
  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.store_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.group_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || listing.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalListings = mockListings.length;
  const verifiedListings = mockListings.filter(l => l.status === 'verified').length;
  const managedListings = mockListings.filter(l => l.status !== 'suspended').length;

  const handleManageListing = (listingId: string) => {
    console.log('Managing listing:', listingId);
    // TODO: Navigate to individual listing management page
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Google Accounts
        </Button>
        
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Manage Listings - Account {accountId}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage individual business listings for this Google account.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <ListingStatisticsCards
        totalListings={totalListings}
        verifiedListings={verifiedListings}
        managedListings={managedListings}
      />

      {/* Search and Filters */}
      <ListingSearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {/* Listings Table */}
      <ListingsTable
        listings={filteredListings}
        onManageListing={handleManageListing}
      />

      {/* Results count */}
      {searchTerm || filterStatus !== 'all' ? (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredListings.length} of {totalListings} listings
        </div>
      ) : null}
    </div>
  );
};
