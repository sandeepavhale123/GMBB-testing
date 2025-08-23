import React from 'react';
import { ManageGroups } from '@/multiDashboardLayout/pages/ManageGroups';

export const ManageGroupsWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <div className="[&>div]:!p-0 [&>div]:!max-w-none [&>div]:!mx-0">
        <ManageGroups />
      </div>
    </div>
  );
};