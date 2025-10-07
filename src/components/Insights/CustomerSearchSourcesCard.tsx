import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface CustomerSearchSourcesCardProps {
  summary: any;
  isLoadingSummary: boolean;
}

export const CustomerSearchSourcesCard: React.FC<CustomerSearchSourcesCardProps> = ({
  summary,
  isLoadingSummary,
}) => {
  const totalSearches =
    (summary?.customer_actions?.desktop_search?.value || 0) +
    (summary?.customer_actions?.desktop_map?.value || 0) +
    (summary?.customer_actions?.mobile_search?.value || 0) +
    (summary?.customer_actions?.mobile_map?.value || 0);

  const chartData = [
    {
      name: 'Desktop search',
      value: summary?.customer_actions?.desktop_search?.value || 0,
      color: '#2563eb',
    },
    {
      name: 'Desktop map',
      value: summary?.customer_actions?.desktop_map?.value || 0,
      color: '#3b82f6',
    },
    {
      name: 'Mobile search',
      value: summary?.customer_actions?.mobile_search?.value || 0,
      color: '#60a5fa',
    },
    {
      name: 'Mobile map',
      value: summary?.customer_actions?.mobile_map?.value || 0,
      color: '#93c5fd',
    },
  ];

  if (isLoadingSummary) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = totalSearches > 0;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {!hasData ? (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Column 1: Title and Description */}
            <div className="flex flex-col justify-center space-y-3 lg:w-[65%]">
              <h3 className="text-lg font-semibold text-foreground">
                How Customers Search For Your Business
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Understanding how customers discover your business helps optimize your online presence. 
                This breakdown shows whether customers find you through search results or map views, 
                and whether they're using desktop or mobile devices to access your information.
              </p>
            </div>

            {/* Column 2: Donut Chart and Legend */}
            <div className="flex flex-col md:flex-row items-center gap-6 max-h-[200px] lg:w-[35%]">
              {/* Chart Section */}
              <div className="relative w-full md:w-[200px] h-[160px] md:h-[180px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Total */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{totalSearches}</span>
                  <span className="text-xs text-muted-foreground">Total Searches</span>
                </div>
              </div>

              {/* Legend Section */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-1 gap-3 w-full">
                {chartData.map((item, index) => {
                  const percentage = totalSearches > 0 
                    ? ((item.value / totalSearches) * 100).toFixed(1) 
                    : '0.0';
                  
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-foreground flex-1">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
