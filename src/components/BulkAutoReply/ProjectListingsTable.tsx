import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Search, Plus, Trash2 } from 'lucide-react';
interface Location {
  id: string;
  locationName: string;
  zipCode: string;
  google_account_id: string;
  name: string;
  setting: string;
  setting_type: string;
}
interface ProjectListingsTableProps {
  showAddModal: boolean;
  onCloseAddModal: () => void;
  listingDetails?: Location[];
}
export const ProjectListingsTable: React.FC<ProjectListingsTableProps> = ({
  showAddModal,
  onCloseAddModal,
  listingDetails = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const filteredLocations = listingDetails.filter(location => location.locationName.toLowerCase().includes(searchQuery.toLowerCase()));
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLocations = filteredLocations.slice(startIndex, endIndex);
  const handleDeleteLocation = (locationId: string) => {
    console.log('Deleting location:', locationId);
    // Handle delete logic here
  };
  const handleAddLocation = (selectedLocations: string[]) => {
    console.log('Adding locations:', selectedLocations);
    onCloseAddModal();
  };
  return <>
      <Card>
        <CardContent className="mt-[20px]">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search locations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Button onClick={() => {}} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Location
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Zip Code</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLocations.length === 0 ? <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No locations found
                    </TableCell>
                  </TableRow> : currentLocations.map(location => <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.locationName}</TableCell>
                      <TableCell>{location.zipCode || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Location</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove "{location.locationName}" from this project? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteLocation(location.id)} className="bg-red-600 hover:bg-red-700">
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>)}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                  
                  {Array.from({
                length: totalPages
              }, (_, i) => i + 1).map(page => <PaginationItem key={page}>
                      <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page} className="cursor-pointer">
                        {page}
                      </PaginationLink>
                    </PaginationItem>)}
                  
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>}
        </CardContent>
      </Card>

      {/* Add Location Modal */}
      <AddLocationModal open={showAddModal} onOpenChange={onCloseAddModal} onAddLocations={handleAddLocation} />
    </>;
};

// Add Location Modal Component
interface AddLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLocations: (locationIds: string[]) => void;
}
const AddLocationModal: React.FC<AddLocationModalProps> = ({
  open,
  onOpenChange,
  onAddLocations
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Mock available locations
  const availableLocations = [{
    id: 'a1',
    name: 'New Restaurant XYZ',
    platform: 'Google'
  }, {
    id: 'a2',
    name: 'Trendy Bar & Grill',
    platform: 'Yelp'
  }, {
    id: 'a3',
    name: 'Family Diner',
    platform: 'TripAdvisor'
  }, {
    id: 'a4',
    name: 'Sushi Express',
    platform: 'Google'
  }];
  const filteredAvailableLocations = availableLocations.filter(location => location.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleToggleSelection = (locationId: string) => {
    setSelectedLocations(prev => prev.includes(locationId) ? prev.filter(id => id !== locationId) : [...prev, locationId]);
  };
  const handleAdd = () => {
    onAddLocations(selectedLocations);
    setSelectedLocations([]);
    setSearchQuery('');
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Locations to Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search available locations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>

          <div className="border rounded-lg max-h-64 overflow-y-auto">
            {filteredAvailableLocations.length === 0 ? <div className="p-4 text-center text-gray-500">
                No locations available
              </div> : <div className="divide-y">
                {filteredAvailableLocations.map(location => <div key={location.id} className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer" onClick={() => handleToggleSelection(location.id)}>
                    <input type="checkbox" checked={selectedLocations.includes(location.id)} onChange={() => handleToggleSelection(location.id)} className="rounded" />
                    <div className="flex-1">
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-gray-500">{location.platform}</p>
                    </div>
                  </div>)}
              </div>}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              {selectedLocations.length} location(s) selected
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={selectedLocations.length === 0}>
                Add Selected
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};