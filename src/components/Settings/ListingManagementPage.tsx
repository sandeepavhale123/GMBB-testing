import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ListingStatisticsCards } from './ListingStatisticsCards';
import { ListingSearchFilters } from './ListingSearchFilters';
import { ListingsTable } from './ListingsTable';
import { useToast } from '@/hooks/use-toast';
interface ListingManagementPageProps {
  accountId: string;
}
export const ListingManagementPage: React.FC<ListingManagementPageProps> = ({
  accountId
}) => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterActive, setFilterActive] = useState('all');
  const handleBack = () => {
    navigate('/settings/google-account');
  };

  // Mock data with updated structure including profile_image, address, and zipcode
  const [mockListings, setMockListings] = useState([{
    id: '1',
    name: 'Downtown Restaurant',
    store_code: 'DR001',
    group_name: 'Restaurant Group A',
    state: 'New York',
    status: 'verified' as const,
    isActive: true,
    profile_image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100',
    address: '123 Main Street, Downtown',
    zipcode: '10001'
  }, {
    id: '2',
    name: 'Uptown Bistro',
    store_code: 'UB002',
    group_name: 'Restaurant Group A',
    state: 'New York',
    status: 'pending' as const,
    isActive: true,
    profile_image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100',
    address: '456 Broadway Avenue, Uptown',
    zipcode: '10025'
  }, {
    id: '3',
    name: 'Midtown Cafe',
    store_code: 'MC003',
    group_name: 'Cafe Group B',
    state: 'California',
    status: 'verified' as const,
    isActive: false,
    profile_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100',
    address: '789 Central Park West',
    zipcode: '90210'
  }, {
    id: '4',
    name: 'Sunset Diner',
    store_code: 'SD004',
    group_name: 'Diner Group C',
    state: 'Texas',
    status: 'suspended' as const,
    isActive: false,
    address: '321 Sunset Boulevard, West End',
    zipcode: '75001'
  }, {
    id: '5',
    name: 'Harbor View Restaurant',
    store_code: 'HVR005',
    group_name: 'Restaurant Group A',
    state: 'Florida',
    status: 'verified' as const,
    isActive: true,
    profile_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100',
    address: '987 Harbor Drive, Waterfront',
    zipcode: '33101'
  }]);

  // Filter listings based on search, status, and active state
  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) || listing.store_code.toLowerCase().includes(searchTerm.toLowerCase()) || listing.group_name.toLowerCase().includes(searchTerm.toLowerCase()) || listing.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || listing.status === filterStatus;
    const matchesActive = filterActive === 'all' || filterActive === 'active' && listing.isActive || filterActive === 'inactive' && !listing.isActive;
    return matchesSearch && matchesStatus && matchesActive;
  });

  // Calculate statistics
  const totalListings = mockListings.length;
  const activeListings = mockListings.filter(l => l.isActive).length;
  const inactiveListings = mockListings.filter(l => !l.isActive).length;
  const handleViewListing = (listingId: string) => {
    // Navigate to the individual listing page
    navigate(`/business-info/${listingId}`);
    const listing = mockListings.find(l => l.id === listingId);
    if (listing) {
      toast({
        title: "Opening Listing",
        description: `Opening ${listing.name} listing page.`
      });
    }
    console.log(`Navigating to listing page for listing ${listingId}`);
  };
  const handleToggleListing = (listingId: string, isActive: boolean) => {
    setMockListings(prev => prev.map(listing => listing.id === listingId ? {
      ...listing,
      isActive
    } : listing));
    const listing = mockListings.find(l => l.id === listingId);
    if (listing) {
      toast({
        title: isActive ? "Listing Enabled" : "Listing Disabled",
        description: `${listing.name} has been ${isActive ? 'enabled' : 'disabled'}.`
      });
    }
    console.log(`Toggled listing ${listingId} to ${isActive ? 'active' : 'inactive'}`);
  };
  return <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-6">
        
        
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Manage Listings - Account {accountId}
          </h2>
          
        </div>
      </div>

      {/* Statistics Cards */}
      <ListingStatisticsCards totalListings={totalListings} activeListings={activeListings} inactiveListings={inactiveListings} />

      {/* Search and Filters */}
      <ListingSearchFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} filterStatus={filterStatus} onFilterChange={setFilterStatus} filterActive={filterActive} onActiveFilterChange={setFilterActive} />

      {/* Listings Table */}
      <ListingsTable listings={filteredListings} onViewListing={handleViewListing} onToggleListing={handleToggleListing} />

      {/* Results count */}
      {searchTerm || filterStatus !== 'all' ? <div className="mt-4 text-sm text-gray-600">
          Showing {filteredListings.length} of {totalListings} listings
        </div> : null}
    </div>;
};