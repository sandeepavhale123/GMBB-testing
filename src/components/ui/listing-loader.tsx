
import React from 'react';
import { Loader } from './loader';

interface ListingLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export const ListingLoader: React.FC<ListingLoaderProps> = ({ isLoading, children }) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader size="lg" text="Loading..." />
    </div>
  );
};
