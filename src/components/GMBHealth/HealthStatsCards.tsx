import React from 'react';
import { Card, CardContent } from '../ui/card';
import { CircularProgress } from '../ui/circular-progress';

const healthStats = [
  { label: 'Business Name', value: 100, color: 'text-green-600' },
  { label: 'Business Category', value: 100, color: 'text-green-600' },
  { label: 'Phone Number', value: 100, color: 'text-green-600' },
  { label: 'Business Description', value: 85, color: 'text-blue-600' },
  { label: 'Business Hours', value: 90, color: 'text-purple-600' },
  { label: 'Business Photos', value: 75, color: 'text-emerald-600' }
];

export const HealthStatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {healthStats.map((stat, index) => (
        <Card key={index} className="border border-border">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <CircularProgress 
              value={stat.value} 
              size={60} 
              strokeWidth={6}
              className={stat.color}
            >
              <span className="text-sm font-semibold">{stat.value}%</span>
            </CircularProgress>
            <p className="text-xs text-muted-foreground mt-2 leading-tight">
              {stat.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};