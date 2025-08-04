import React from 'react';
import { BrandingPage } from '@/components/Settings/BrandingPage';

export const BrandingWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <div className="[&>div]:!p-0 [&>div]:!max-w-none [&>div]:!mx-0">
        <BrandingPage />
      </div>
    </div>
  );
};