
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Listing {
  id: string;
  name: string;
  store_code: string;
  group_name: string;
  state: string;
  status: 'verified' | 'pending' | 'suspended';
  isActive: boolean;
  profile_image?: string;
  address: string;
  zipcode: string;
}

interface ListingsTableProps {
  listings: Listing[];
  onToggleListing: (listingId: string, isActive: boolean) => void;
}

export const ListingsTable: React.FC<ListingsTableProps> = ({ listings, onToggleListing }) => {
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

  const truncateAddress = (address: string, maxLength: number = 25) => {
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-medium text-gray-700">Profile</TableHead>
            <TableHead className="font-medium text-gray-700">Name</TableHead>
            <TableHead className="font-medium text-gray-700">Address</TableHead>
            <TableHead className="font-medium text-gray-700">Store code</TableHead>
            <TableHead className="font-medium text-gray-700">Group name</TableHead>
            <TableHead className="font-medium text-gray-700">State</TableHead>
            <TableHead className="font-medium text-gray-700">Status</TableHead>
            <TableHead className="font-medium text-gray-700">Enable/Disable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
              <TableCell className="w-16">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={listing.profile_image} alt={listing.name} />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                    {listing.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium text-gray-900">{listing.name}</TableCell>
              <TableCell className="text-gray-600">
                <div className="flex flex-col">
                  <span className="text-sm">{truncateAddress(listing.address)}</span>
                  <span className="text-xs text-gray-500">{listing.zipcode}</span>
                </div>
              </TableCell>
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
                <Switch
                  checked={listing.isActive}
                  onCheckedChange={(checked) => onToggleListing(listing.id, checked)}
                  disabled={listing.status === 'suspended'}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
