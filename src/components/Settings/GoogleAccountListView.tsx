
import React from 'react';
import { RefreshCw, Trash2, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
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

interface GoogleAccountListViewProps {
  account: GoogleAccount;
  onManageListings?: (accountId: string) => void;
  onRefresh?: (accountId: string) => void;
  onDelete?: (accountId: string) => void;
}

export const GoogleAccountListView: React.FC<GoogleAccountListViewProps> = ({
  account,
  onManageListings,
  onRefresh,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    return account.isEnabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <tr className="hover:bg-gray-50 border-b">
      {/* Account Column */}
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <GoogleAccountAvatar name={account.name} avatar={account.avatar} />
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{account.name}</p>
            <p className="text-sm text-gray-500 truncate">{account.email}</p>
          </div>
        </div>
      </td>

      {/* Total Listings */}
      <td className="p-4 text-center">
        <span className="font-medium text-gray-900">{account.listings}</span>
      </td>

      {/* Connected Count */}
      <td className="p-4 text-center">
        <span className="font-medium text-gray-900">{account.activeListings}</span>
      </td>

      {/* Status */}
      <td className="p-4">
        <Badge 
          variant="secondary" 
          className={`${getStatusColor(account.isEnabled ? 'active' : 'inactive')} border-0 font-medium`}
        >
          {account.isEnabled ? 'Active' : 'Inactive'}
        </Badge>
      </td>

      {/* Last Synced */}
      <td className="p-4 text-sm text-gray-600">
        {account.lastSynced}
      </td>

      {/* Actions */}
      <td className="p-4">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onManageListings?.(account.id)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
            title="View Account"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRefresh?.(account.id)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-green-600"
            title="Refresh Account"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(account.id)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
            title="Delete Account"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
