
import React from 'react';
import { Building2 } from 'lucide-react';

interface NoListingSelectedProps {
  pageType: string;
}

export const NoListingSelected: React.FC<NoListingSelectedProps> = ({ pageType }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          No Listing Selected
        </h2>
        <p className="text-gray-600">
          Please select a business listing to view {pageType.toLowerCase()}.
        </p>
      </div>
    </div>
  );
};
