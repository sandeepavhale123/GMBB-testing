
import React from 'react';
import { Store } from 'lucide-react';
import { Card, CardContent } from './card';

interface NoListingSelectedProps {
  title?: string;
  description?: string;
  showIcon?: boolean;
}

export const NoListingSelected: React.FC<NoListingSelectedProps> = ({
  title = "No Listing Selected",
  description = "Please select a business listing to view the dashboard.",
  showIcon = true
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <CardContent className="p-8 text-center">
          {showIcon && (
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Store className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600">
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
