
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const ProgressDonutChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'manual' | 'genie'>('manual');

  const data = [
    { name: 'Manual', value: 66.7, color: '#1e3a8a' },
    { name: 'Genie', value: 30.2, color: '#3b82f6' },
    { name: 'Other', value: 3.1, color: '#93c5fd' }
  ];

  const centerValue = data.find(item => item.name === 'Manual')?.value || 66.7;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Progress</CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </div>
          <div className="flex gap-1 rounded-lg border p-1">
            <Button
              variant={activeTab === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('all')}
              className="text-xs px-3 py-1 h-auto"
            >
              All
            </Button>
            <Button
              variant={activeTab === 'manual' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('manual')}
              className="text-xs px-3 py-1 h-auto"
            >
              Manual
            </Button>
            <Button
              variant={activeTab === 'genie' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('genie')}
              className="text-xs px-3 py-1 h-auto"
            >
              Genie
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-80 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{centerValue}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
