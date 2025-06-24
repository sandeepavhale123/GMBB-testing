
import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { GoogleAccountAvatar } from './GoogleAccountAvatar';

interface TeamMember {
  name: string;
  role: string;
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
  teamMembers: TeamMember[];
}

interface GoogleAccountListViewProps {
  account: GoogleAccount;
  onManageListings?: (accountId: string) => void;
}

export const GoogleAccountListView: React.FC<GoogleAccountListViewProps> = ({
  account,
  onManageListings
}) => {
  const [isEnabled, setIsEnabled] = useState(account.isEnabled);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleCardClick = () => {
    onManageListings?.(account.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
      <div className="grid grid-cols-12 gap-4 items-center p-4 text-sm">
        {/* Account Column */}
        <div className="col-span-4 flex items-center space-x-3">
          <GoogleAccountAvatar name={account.name} avatar={account.avatar} />
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{account.name}</h3>
            <p className="text-gray-500 text-xs truncate">{account.email}</p>
          </div>
        </div>

        {/* Listings in Account */}
        <div className="col-span-2 text-center">
          <span className="font-medium text-gray-900">{account.listings}</span>
        </div>

        {/* Active Listings */}
        <div className="col-span-2 flex justify-center">
          <div className="flex -space-x-1">
            {account.teamMembers.slice(0, 3).map((member, index) => (
              <GoogleAccountAvatar key={index} name={member.name} avatar={null} size="sm" />
            ))}
            {account.teamMembers.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-white font-medium">
                  +{account.teamMembers.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Column */}
        <div className="col-span-4 flex items-center justify-end space-x-3">
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            className="data-[state=checked]:bg-blue-500"
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onManageListings?.(account.id);
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onManageListings?.(account.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Manage Listings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
