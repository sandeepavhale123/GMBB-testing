
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
  const customerActionsChartData = visibilityTrends?.chart_data?.map((item: any) => ({
    name: item.name,
    website: item.website || 0,
    direction: item.direction || 0,
    messages: item.messages || 0,
    calls: item.calls || 0
  })) || [];
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
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="website" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                    name="Website"
                  />
                  <Bar 
                    dataKey="direction" 
                    fill="#f97316" 
                    radius={[4, 4, 0, 0]}
                    name="Direction"
                  />
                  <Bar 
                    dataKey="messages" 
                    fill="#22c55e" 
                    radius={[4, 4, 0, 0]}
                    name="Messages"
                  />
                  <Bar 
                    dataKey="calls" 
                    fill="#a855f7" 
                    radius={[4, 4, 0, 0]}
                    name="Calls"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
