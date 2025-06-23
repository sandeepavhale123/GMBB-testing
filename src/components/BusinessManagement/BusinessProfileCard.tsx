import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
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
    return <Card className="w-full">
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
            <div className="grid grid-cols-3 gap-8 mb-6">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>;
  }
  return (
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {/* Business Logo/Avatar - Updated to use profile photo */}
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              {businessInfo?.profile_photo ? (
                <img 
                  src={businessInfo.profile_photo} 
                  alt={`${businessInfo.name} profile`} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-bold text-2xl">
                  {businessInfo?.name?.charAt(0) || 'B'}
                </div>
              )}
            </div>
            
            {/* Business Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {businessInfo?.name || 'Business Name'}
                </h2>
                {businessInfo?.verification_status === 'verified' && (
                  <Check className="w-5 h-5 text-blue-500 bg-blue-100 rounded-full p-1" />
                )}
              </div>
              
              {/* Profile views and Position stats moved here */}
              <div className="flex items-center gap-6">
                <div className="bg-secondary p-2 rounded" style={{ width: '110px' }}> 
                  <div className="text-lg font-bold text-gray-900">
                    {statistics?.profile_views || 0}
                  </div>
                  <div className="text-xs text-gray-500">Profile views</div>
                </div>
                
                <div className="bg-secondary p-2 rounded" style={{ width: '110px' }}>
                  <div className="text-lg font-bold text-gray-900">
                    {statistics?.position || 0}
                  </div>
                  <div className="text-xs text-gray-500">Position</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons with Visibility after */}
          <div className="flex flex-col items-end gap-4">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm">
              Refresh
            </Button>
            
            {/* Visibility Section */}
            <div className="w-64">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">Visibility</div>
                <div className="text-sm font-medium text-gray-900">
                  {statistics?.visibility_score || 0}%
                </div>
              </div>
              <Progress value={statistics?.visibility_score || 0} className="h-2 bg-gray-200" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
