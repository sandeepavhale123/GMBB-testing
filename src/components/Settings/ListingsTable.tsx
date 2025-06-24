
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';

interface Listing {
  id: string;
  name: string;
  store_code: string;
  group_name: string;
  state: string;
  status: 'verified' | 'pending' | 'suspended';
}

interface ListingsTableProps {
  listings: Listing[];
  onManageListing: (listingId: string) => void;
}

export const ListingsTable: React.FC<ListingsTableProps> = ({ listings, onManageListing }) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'suspended':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-medium text-gray-700">Name</TableHead>
            <TableHead className="font-medium text-gray-700">Store code</TableHead>
            <TableHead className="font-medium text-gray-700">Group name</TableHead>
            <TableHead className="font-medium text-gray-700">State</TableHead>
            <TableHead className="font-medium text-gray-700">Status</TableHead>
            <TableHead className="font-medium text-gray-700">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
              <TableCell className="font-medium text-gray-900">{listing.name}</TableCell>
              <TableCell className="text-gray-600">{listing.store_code}</TableCell>
              <TableCell className="text-gray-600">{listing.group_name}</TableCell>
              <TableCell className="text-gray-600">{listing.state}</TableCell>
              <TableCell>
                <Badge 
                  className={`${getStatusColor(listing.status)} border-0 font-medium`}
                >
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onManageListing(listing.id)}
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
