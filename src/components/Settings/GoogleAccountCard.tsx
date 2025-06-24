
import React from 'react';
import { GoogleAccountListView } from './GoogleAccountListView';
import { GoogleAccountGridView } from './GoogleAccountGridView';

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
  if (viewMode === 'list') {
    return (
      <GoogleAccountListView
        account={account}
        onManageListings={onManageListings}
      />
    );
  }

  return (
    <GoogleAccountGridView
      account={account}
      onManageListings={onManageListings}
    />
  );
};
