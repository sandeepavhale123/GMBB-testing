import React from 'react';
import { useParams } from 'react-router-dom';
import { ListingManagementPage } from '@/components/Settings/ListingManagementPage';

export const ListingManagementWrapper: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  
  if (!accountId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Account ID is required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="[&>div]:!p-0 [&>div]:!max-w-none [&>div]:!mx-0">
        <ListingManagementPage accountId={accountId} />
      </div>
    </div>
  );
};