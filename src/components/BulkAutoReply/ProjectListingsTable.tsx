import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Trash2 } from 'lucide-react';

interface Listing {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'inactive';
  addedDate: string;
}

interface ProjectListingsTableProps {
  showAddModal: boolean;
  onCloseAddModal: () => void;
}

export const ProjectListingsTable: React.FC<ProjectListingsTableProps> = ({
  showAddModal,
  onCloseAddModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);

  // Mock listings data
  const allListings: Listing[] = [
    { id: '1', name: 'ABC Restaurant Downtown', platform: 'Google', status: 'active', addedDate: '2024-01-15' },
    { id: '2', name: 'Best Pizza Place', platform: 'Yelp', status: 'active', addedDate: '2024-01-14' },
    { id: '3', name: 'Coffee Corner Cafe', platform: 'Google', status: 'inactive', addedDate: '2024-01-13' },
    { id: '4', name: 'Fine Dining Experience', platform: 'TripAdvisor', status: 'active', addedDate: '2024-01-12' },
    { id: '5', name: 'Quick Burger Joint', platform: 'Google', status: 'active', addedDate: '2024-01-11' },
  ];

  const filteredListings = allListings.filter(listing =>
    listing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = filteredListings.slice(startIndex, endIndex);

  const handleDeleteListing = (listingId: string) => {
    console.log('Deleting listing:', listingId);
    // Handle delete logic here
  };

  const handleAddListing = (selectedListings: string[]) => {
    console.log('Adding listings:', selectedListings);
    onCloseAddModal();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Project Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => {}} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Listing
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing Name</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentListings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No listings found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentListings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium">{listing.name}</TableCell>
                      <TableCell>{listing.platform}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          listing.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>{listing.addedDate}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Listing</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove "{listing.name}" from this project? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteListing(listing.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Listing Modal */}
      <AddListingModal 
        open={showAddModal}
        onOpenChange={onCloseAddModal}
        onAddListings={handleAddListing}
      />
    </>
  );
};

// Add Listing Modal Component
interface AddListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddListings: (listingIds: string[]) => void;
}

const AddListingModal: React.FC<AddListingModalProps> = ({
  open,
  onOpenChange,
  onAddListings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListings, setSelectedListings] = useState<string[]>([]);

  // Mock available listings
  const availableListings = [
    { id: 'a1', name: 'New Restaurant XYZ', platform: 'Google' },
    { id: 'a2', name: 'Trendy Bar & Grill', platform: 'Yelp' },
    { id: 'a3', name: 'Family Diner', platform: 'TripAdvisor' },
    { id: 'a4', name: 'Sushi Express', platform: 'Google' },
  ];

  const filteredAvailableListings = availableListings.filter(listing =>
    listing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleSelection = (listingId: string) => {
    setSelectedListings(prev =>
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const handleAdd = () => {
    onAddListings(selectedListings);
    setSelectedListings([]);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Listings to Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search available listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border rounded-lg max-h-64 overflow-y-auto">
            {filteredAvailableListings.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No listings available
              </div>
            ) : (
              <div className="divide-y">
                {filteredAvailableListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleToggleSelection(listing.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedListings.includes(listing.id)}
                      onChange={() => handleToggleSelection(listing.id)}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{listing.name}</p>
                      <p className="text-sm text-gray-500">{listing.platform}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              {selectedListings.length} listing(s) selected
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAdd}
                disabled={selectedListings.length === 0}
              >
                Add Selected
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};