
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

interface TopSearchQueriesCardProps {
  isLoading: boolean;
  summary: any;
}

export const TopSearchQueriesCard: React.FC<TopSearchQueriesCardProps> = ({
  isLoading,
  summary,
}) => {
  // Mock data for top search queries - this would come from the API
  const topQueries = summary?.top_search_queries || [
    { query: 'restaurant near me', impressions: 2847, clicks: 234, ctr: 8.2, trend: 'up' },
    { query: 'best pizza delivery', impressions: 1923, clicks: 189, ctr: 9.8, trend: 'up' },
    { query: 'italian restaurant', impressions: 1456, clicks: 112, ctr: 7.7, trend: 'down' },
    { query: 'food delivery', impressions: 1234, clicks: 98, ctr: 7.9, trend: 'up' },
    { query: 'pasta restaurant', impressions: 987, clicks: 76, ctr: 7.7, trend: 'down' },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Top Search Queries
        </CardTitle>
        <p className="text-sm text-gray-600">Most popular search terms that led customers to your business</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {topQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{query.query}</span>
                    {query.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{query.impressions} impressions</span>
                    <span>{query.clicks} clicks</span>
                    <span className="font-medium">{query.ctr}% CTR</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">#{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
