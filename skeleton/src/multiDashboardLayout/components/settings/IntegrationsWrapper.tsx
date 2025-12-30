import React from 'react';
import { IntegrationsPage } from '@/components/Settings/IntegrationsPage';

export const IntegrationsWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <div className="[&>div]:!p-0 [&>div]:!max-w-none [&>div]:!mx-0">
        <IntegrationsPage />
      </div>
    </div>
  );
};