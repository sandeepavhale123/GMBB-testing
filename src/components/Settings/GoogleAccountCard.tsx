
import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, RefreshCw, Eye } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

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

interface GoogleAccountCardProps {
  account: GoogleAccount;
  viewMode: 'grid' | 'list';
  onManageListings?: (accountId: string) => void;
}

export const GoogleAccountCard: React.FC<GoogleAccountCardProps> = ({
  account,
  viewMode,
  onManageListings
}) => {
  const [isEnabled, setIsEnabled] = useState(account.isEnabled);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="grid grid-cols-12 gap-4 items-center p-4 text-sm">
          {/* Account Column */}
          <div className="col-span-4 flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={account.avatar || ''} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                {getInitials(account.name)}
              </AvatarFallback>
            </Avatar>
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
                <Avatar key={index} className="h-6 w-6 border-2 border-white">
                  <AvatarFallback className="text-xs bg-gray-200 text-gray-600">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
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
              onClick={() => onManageListings?.(account.id)}
              className="text-gray-600 hover:text-gray-900"
            >
              View
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
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
  }

  // Grid view
  return (
    <Card className="transition-all duration-200 hover:shadow-md border border-gray-200">
      <CardContent className="p-6">
        {/* Header with Avatar, Name and Actions */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={account.avatar || ''} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                {getInitials(account.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{account.name}</h3>
              <p className="text-sm text-gray-500">{account.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
              className="data-[state=checked]:bg-blue-500"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
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

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{account.listings}</div>
            <div className="text-sm text-gray-500">Listings in Account</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{account.activeListings}</div>
            <div className="text-sm text-gray-500">Active Listings</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(account.activeListings / account.listings) * 100}%` }}
            />
          </div>
        </div>

        {/* Team Members */}
        <div className="flex items-center justify-center">
          <div className="flex -space-x-1">
            {account.teamMembers.slice(0, 3).map((member, index) => (
              <Avatar key={index} className="h-8 w-8 border-2 border-white">
                <AvatarFallback className="text-xs bg-gray-200 text-gray-600">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {account.teamMembers.length > 3 && (
              <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-white font-medium">
                  +{account.teamMembers.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
