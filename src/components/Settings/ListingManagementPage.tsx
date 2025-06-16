
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';

interface Listing {
  id: string;
  name: string;
  address: string;
  status: 'Live' | 'Disabled' | 'Error';
  isEnabled: boolean;
  lastSynced: string;
  badge?: string;
  categories?: string[];
}

const mockListings: Listing[] = [
  {
    id: '1',
    name: 'KSoft Solutions – Pune Office',
    address: '123 IT Park, Pune, Maharashtra 411001',
    status: 'Live',
    isEnabled: true,
    lastSynced: '1 hour ago',
    badge: 'Optimized',
    categories: ['Software Company', 'IT Services']
  },
  {
    id: '2',
    name: 'KSoft Solutions – Mumbai Branch',
    address: '456 Business District, Mumbai, Maharashtra 400001',
    status: 'Live',
    isEnabled: true,
    lastSynced: '30 minutes ago',
    categories: ['Software Company']
  },
  {
    id: '3',
    name: 'KSoft Solutions – Delhi Office',
    address: '789 Tech Hub, New Delhi, Delhi 110001',
    status: 'Disabled',
    isEnabled: false,
    lastSynced: '2 days ago',
    badge: 'Needs Review',
    categories: ['Software Company', 'IT Services']
  },
  {
    id: '4',
    name: 'KSoft Solutions – Bangalore Center',
    address: '321 Silicon Valley, Bangalore, Karnataka 560001',
    status: 'Error',
    isEnabled: false,
    lastSynced: '3 hours ago',
    categories: ['Software Company']
  }
];

interface ListingManagementPageProps {
  onBack: () => void;
}

export const ListingManagementPage: React.FC<ListingManagementPageProps> = ({ onBack }) => {
  const [listings, setListings] = useState(mockListings);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  const handleToggleListing = (listingId: string) => {
    setListings(prev => 
      prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, isEnabled: !listing.isEnabled, status: !listing.isEnabled ? 'Live' : 'Disabled' }
          : listing
      )
    );
    
    toast({
      title: "Listing updated",
      description: "Sync status has been changed successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-green-100 text-green-800';
      case 'Disabled':
        return 'bg-gray-100 text-gray-800';
      case 'Error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Optimized':
        return 'bg-blue-100 text-blue-800';
      case 'Needs Review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = listings.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sub Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Page Content */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Manage Listings</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Enable or disable visibility of your business locations across Google to manage search presence and performance.
          </p>
        </div>

        {/* Listings */}
        <div className="space-y-4">
          {currentListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {listing.name}
                      </h3>
                      <Badge variant="outline" className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                      {listing.badge && (
                        <Badge variant="outline" className={getBadgeColor(listing.badge)}>
                          {listing.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{listing.address}</p>
                    
                    {listing.categories && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {listing.categories.map((category, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">Synced {listing.lastSynced}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Enable Sync</span>
                      <Switch
                        checked={listing.isEnabled}
                        onCheckedChange={() => handleToggleListing(listing.id)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-700">per page</span>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};
