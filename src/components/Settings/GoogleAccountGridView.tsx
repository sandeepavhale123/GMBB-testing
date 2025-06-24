
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
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

interface GoogleAccountGridViewProps {
  account: GoogleAccount;
  onManageListings?: (accountId: string) => void;
}

export const GoogleAccountGridView: React.FC<GoogleAccountGridViewProps> = ({
  account,
  onManageListings
}) => {
  const [isEnabled, setIsEnabled] = useState(account.isEnabled);

  const handleCardClick = () => {
    onManageListings?.(account.id);
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md border border-gray-200 cursor-pointer" onClick={handleCardClick}>
      <CardContent className="p-4">
        {/* Row 1: Account Profile (left) + Toggle & Delete (right) */}
        <div className="flex items-center justify-between mb-3">
          <GoogleAccountAvatar name={account.name} avatar={account.avatar} size="lg" />
          <div className="flex items-center space-x-2">
            <Switch
              checked={isEnabled}
              onCheckedChange={(checked) => {
                setIsEnabled(checked);
              }}
              className="data-[state=checked]:bg-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                // Handle delete action
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Row 2: User Name & Email */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-base mb-1">{account.name}</h3>
          <p className="text-sm text-gray-500">{account.email}</p>
        </div>

        {/* Row 3: Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900">{account.listings}</div>
            <div className="text-xs text-gray-500">Total Listings</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900">{account.activeListings}</div>
            <div className="text-xs text-gray-500">Enabled Listings</div>
          </div>
        </div>

        {/* Row 4: Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Enabled Progress</span>
            <span className="text-xs text-gray-700 font-medium">
              {Math.round((account.activeListings / account.listings) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(account.activeListings / account.listings) * 100}%` }}
            />
          </div>
        </div>

        {/* Row 5: Listing Profile Avatars */}
        <div className="flex items-center justify-center">
          <div className="flex -space-x-1">
            {account.teamMembers.slice(0, 4).map((member, index) => (
              <GoogleAccountAvatar key={index} name={member.name} avatar={null} size="sm" />
            ))}
            {account.teamMembers.length > 4 && (
              <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-white font-medium">
                  +{account.teamMembers.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
