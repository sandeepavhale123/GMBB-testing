
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

interface VisibilityTrendsCardProps {
  isLoadingVisibility: boolean;
  visibilityTrends: any;
  summary: any;
}

export const VisibilityTrendsCard: React.FC<VisibilityTrendsCardProps> = ({
  isLoadingVisibility,
  visibilityTrends,
  summary,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Visibility Trends Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingVisibility ? (
          <div className="space-y-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Total Search Views</span>
                <span className="text-2xl font-bold text-primary">
                  {visibilityTrends?.summary.total_search_views || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Trend: {visibilityTrends?.summary.search_trend || 'stable'}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Total Maps Views</span>
                <span className="text-2xl font-bold text-red-600">
                  {visibilityTrends?.summary.total_maps_views || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Trend: {visibilityTrends?.summary.maps_trend || 'stable'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Total Views</span>
                <span className="text-2xl font-bold text-gray-900">
                  {summary?.visibility_summary.total_views || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Combined search and maps visibility
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
