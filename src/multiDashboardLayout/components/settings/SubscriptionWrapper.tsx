import React from 'react';
import { SubscriptionPage } from '@/components/Settings/SubscriptionPage';

export const SubscriptionWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <div className="[&>div]:!p-0 [&>div]:!max-w-none [&>div]:!mx-0">
        <SubscriptionPage />
      </div>
    </div>
  );
};