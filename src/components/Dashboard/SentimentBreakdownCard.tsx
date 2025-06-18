
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const SentimentBreakdownCard: React.FC = () => {
  const sentimentData = [
    { name: 'Positive', value: 86, fill: '#10b981' },
    { name: 'Neutral', value: 10, fill: '#6b7280' },
    { name: 'Negative', value: 4, fill: '#ef4444' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sentiment breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-4">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={sentimentData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={30} 
                  outerRadius={60} 
                  dataKey="value" 
                  startAngle={90} 
                  endAngle={450}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Positive</span>
            </div>
            <div className="font-semibold">86 %</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Neutral</span>
            </div>
            <div className="font-semibold">10 %</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Negative</span>
            </div>
            <div className="font-semibold">4 %</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
