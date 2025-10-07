
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { MousePointer, Navigation, Phone, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface CustomerActionsChartProps {
  isLoadingSummary: boolean;
  isLoadingVisibility: boolean;
  visibilityTrends: any;
  summary: any;
}

export const CustomerActionsChart: React.FC<CustomerActionsChartProps> = ({
  isLoadingSummary,
  isLoadingVisibility,
  visibilityTrends,
  summary,
}) => {
  const customerActionsChartData = [
    {
      name: 'Website',
      value: visibilityTrends?.summary?.total_website_views || 0
    },
    {
      name: 'Direction',
      value: visibilityTrends?.summary?.total_direction_views || 0
    },
    {
      name: 'Messages',
      value: visibilityTrends?.summary?.total_message_views || 0
    },
    {
      name: 'Calls',
      value: visibilityTrends?.summary?.total_calls_views || 0
    }
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Customer Actions</CardTitle>
        <p className="text-sm text-gray-600">Actions taken by customers on your profile.</p>
      </CardHeader>
      <CardContent>
        {isLoadingSummary || isLoadingVisibility ? (
          <Skeleton className="h-64" />
        ) : (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerActionsChartData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    name="Actions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-600">Website: {visibilityTrends?.summary?.total_website_views || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Messages: {visibilityTrends?.summary?.total_message_views || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-600">Directions: {visibilityTrends?.summary?.total_direction_views || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Calls: {visibilityTrends?.summary?.total_calls_views || 0}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
