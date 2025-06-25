
import React from 'react';
import { Zap, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface GoogleAccountsEmptyStateProps {
  onAddAccount: () => void;
}

export const GoogleAccountsEmptyState: React.FC<GoogleAccountsEmptyStateProps> = ({
  onAddAccount
}) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Zap className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts connected</h3>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Click 'Add New Account' to sync your Google Business Profile.
      </p>
      <Button onClick={onAddAccount} className="flex items-center gap-2 mx-auto">
        <Plus className="h-4 w-4" />
        Add New Account
      </Button>
    </div>
  );
};
