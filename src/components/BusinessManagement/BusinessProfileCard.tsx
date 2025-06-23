
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MoreHorizontal, Check } from 'lucide-react';
import type { BusinessInfo, BusinessStatistics } from '../../types/businessInfoTypes';

interface BusinessProfileCardProps {
  businessInfo: BusinessInfo | null;
  statistics: BusinessStatistics | null;
  isLoading?: boolean;
}

export const BusinessProfileCard: React.FC<BusinessProfileCardProps> = ({
  businessInfo,
  statistics,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Business Logo/Avatar */}
            <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              {businessInfo?.name?.charAt(0) || 'B'}
            </div>
            
            {/* Business Info */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {businessInfo?.name || 'Business Name'}
                </h2>
                {businessInfo?.verification_status === 'verified' && (
                  <Check className="w-5 h-5 text-blue-500 bg-blue-100 rounded-full p-1" />
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm">
              Edit GMB Access
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
