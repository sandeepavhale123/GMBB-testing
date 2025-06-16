
import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';

interface Listing {
  id: string;
  name: string;
  address: string;
  storeCode: string;
  groupName: string;
  state: string;
  status: 'Active' | 'Inactive';
  logo?: string;
}

const mockListings: Listing[] = [
  {
    id: '1',
    name: 'Ksoft Software solution',
    address: 'Chikhalthana MIDC, Chhatrapati Sambhaji Nagar, 431001, Maharashtra.',
    storeCode: '#458752',
    groupName: 'Group name',
    state: 'Mararastra',
    status: 'Active',
    logo: '🖥️'
  },
  {
    id: '2',
    name: 'SUN POLYMERS-431203',
    address: 'Chikhalthana MIDC, Chhatrapati Sambhaji Nagar, 431001, Maharashtra.',
    storeCode: '#458752',
    groupName: 'Group name',
    state: 'Mararastra',
    status: 'Active',
    logo: '🏭'
  },
  {
    id: '3',
    name: 'श्री पाकुमार महादेव आश्रम जैन गुरुकुल',
    address: 'Chikhalthana MIDC, Chhatrapati Sambhaji Nagar, 431001, Maharashtra.',
    storeCode: '#458752',
    groupName: 'Group name',
    state: 'Mararastra',
    status: 'Inactive',
    logo: '🕉️'
  },
  {
    id: '4',
    name: 'CitationBuilderPro',
    address: 'Chikhalthana MIDC, Chhatrapati Sambhaji Nagar, 431001, Maharashtra.',
    storeCode: '#458752',
    groupName: 'Group name',
    state: 'Mararastra',
    status: 'Inactive',
    logo: '📝'
  }
];

interface ListingManagementPageProps {
  onBack: () => void;
}

export const ListingManagementPage: React.FC<ListingManagementPageProps> = ({ onBack }) => {
  const [listings, setListings] = useState(mockListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  const handleToggleStatus = (listingId: string) => {
    setListings(prev => 
      prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: listing.status === 'Active' ? 'Inactive' : 'Active' }
          : listing
      )
    );
    
    toast({
      title: "Listing updated",
      description: "Status has been changed successfully.",
    });
  };

  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = filteredListings.slice(startIndex, endIndex);
  const activeListings = listings.filter(l => l.status === 'Active').length;

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

        {/* Top Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Active Listings Badge */}
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 w-fit">
                Active Listings: {activeListings}/100
              </Badge>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">LISTINGS</TableHead>
                <TableHead className="font-semibold text-gray-700">STORE CODE</TableHead>
                <TableHead className="font-semibold text-gray-700">GROUP NAME</TableHead>
                <TableHead className="font-semibold text-gray-700">STATE</TableHead>
                <TableHead className="font-semibold text-gray-700">STATUS</TableHead>
                <TableHead className="font-semibold text-gray-700">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentListings.map((listing) => (
                <TableRow key={listing.id} className="hover:bg-gray-50">
                  <TableCell className="py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {listing.logo}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{listing.name}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{listing.address}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-600 font-medium">{listing.storeCode}</TableCell>
                  <TableCell className="text-gray-600">{listing.groupName}</TableCell>
                  <TableCell className="text-gray-600">{listing.state}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={listing.status === 'Active' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }
                    >
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={listing.status === 'Active' ? 'destructive' : 'default'}
                      onClick={() => handleToggleStatus(listing.id)}
                      className="min-w-20"
                    >
                      {listing.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
