
import React from 'react';
import { MoreVertical, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { GoogleAccountAvatar } from './GoogleAccountAvatar';

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

interface GoogleAccountsTableProps {
  accounts: GoogleAccount[];
  onManageListings: (accountId: string) => void;
  onRefresh: (accountId: string) => void;
  onDelete: (accountId: string) => void;
}

export const GoogleAccountsTable: React.FC<GoogleAccountsTableProps> = ({
  accounts,
  onManageListings,
  onRefresh,
  onDelete
}) => {
  return (
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
          {accounts.map((account) => (
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
                    onClick={() => onRefresh(account.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onManageListings(account.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    View
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                    onClick={() => onDelete(account.id)}
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
                      <DropdownMenuItem onClick={() => onManageListings(account.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Manage Listings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRefresh(account.id)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => onDelete(account.id)}>
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
  );
};
