import React from 'react';
import { ManageGoogleAccountPage } from '@/components/Settings/ManageGoogleAccountPage';

export const ManageGoogleAccountWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <div className="[&>div]:!p-0 [&>div]:!max-w-none [&>div]:!mx-0">
        <ManageGoogleAccountPage />
      </div>
    </div>
  );
};