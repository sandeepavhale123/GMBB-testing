
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

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
  const [visibleBars, setVisibleBars] = useState({
    website: true,
    direction: true,
    messages: true,
    calls: true
  });

  const toggleBar = (barName: 'website' | 'direction' | 'messages' | 'calls') => {
    setVisibleBars(prev => ({
      ...prev,
      [barName]: !prev[barName]
    }));
  };

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
            <div style={{ height: '306px' }}>
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
                  {visibleBars.website && (
                    <Bar 
                      dataKey="website" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]}
                      name="Website"
                    />
                  )}
                  {visibleBars.direction && (
                    <Bar 
                      dataKey="direction" 
                      fill="#f97316" 
                      radius={[4, 4, 0, 0]}
                      name="Direction"
                    />
                  )}
                  {visibleBars.messages && (
                    <Bar 
                      dataKey="messages" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                      name="Messages"
                    />
                  )}
                  {visibleBars.calls && (
                    <Bar 
                      dataKey="calls" 
                      fill="#a855f7" 
                      radius={[4, 4, 0, 0]}
                      name="Calls"
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center mt-4">
              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => toggleBar('website')}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
                    !visibleBars.website ? 'opacity-50' : ''
                  }`}
                  aria-pressed={visibleBars.website}
                  title={`${visibleBars.website ? 'Hide' : 'Show'} Website`}
                >
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
                  <span className={!visibleBars.website ? 'line-through' : ''}>
                    Website
                  </span>
                </button>
                <button
                  onClick={() => toggleBar('direction')}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
                    !visibleBars.direction ? 'opacity-50' : ''
                  }`}
                  aria-pressed={visibleBars.direction}
                  title={`${visibleBars.direction ? 'Hide' : 'Show'} Direction`}
                >
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }}></div>
                  <span className={!visibleBars.direction ? 'line-through' : ''}>
                    Direction
                  </span>
                </button>
                <button
                  onClick={() => toggleBar('messages')}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
                    !visibleBars.messages ? 'opacity-50' : ''
                  }`}
                  aria-pressed={visibleBars.messages}
                  title={`${visibleBars.messages ? 'Hide' : 'Show'} Messages`}
                >
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span className={!visibleBars.messages ? 'line-through' : ''}>
                    Messages
                  </span>
                </button>
                <button
                  onClick={() => toggleBar('calls')}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
                    !visibleBars.calls ? 'opacity-50' : ''
                  }`}
                  aria-pressed={visibleBars.calls}
                  title={`${visibleBars.calls ? 'Hide' : 'Show'} Calls`}
                >
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#a855f7' }}></div>
                  <span className={!visibleBars.calls ? 'line-through' : ''}>
                    Calls
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
