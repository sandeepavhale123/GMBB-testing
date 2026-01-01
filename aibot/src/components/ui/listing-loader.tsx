
import React from 'react';
import { Loader } from './loader';

interface ListingLoaderProps {
  isLoading: boolean;
  children?: React.ReactNode;
  loadingText?: string;
}

export const ListingLoader: React.FC<ListingLoaderProps> = ({ isLoading, children, loadingText = "Loading..." }) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader size="lg" text={loadingText} />
    </div>
  );
};
