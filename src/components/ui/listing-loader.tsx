
import React from 'react';
import { Loader2 } from 'lucide-react';

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
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};
