
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
    <div className="relative">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600 font-medium">Loading listing...</p>
        </div>
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
};
