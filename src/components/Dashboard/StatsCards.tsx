
import React from 'react';
import { TrendingUp, TrendingDown, Eye, MousePointer, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAppSelector } from '../../hooks/useRedux';
import { cn } from '../../lib/utils';

export const StatsCards: React.FC = () => {
  const { viewsThisMonth, clicksThisMonth, callsThisMonth, directionsThisMonth } = useAppSelector(
    (state) => state.dashboard
  );

  const stats = [
    {
      title: 'Profile Views',
      value: viewsThisMonth.toLocaleString(),
      change: '+12.3%',
      isPositive: true,
      icon: Eye,
      description: 'vs last month'
    },
    {
      title: 'Website Clicks',
      value: clicksThisMonth.toLocaleString(),
      change: '+8.7%',
      isPositive: true,
      icon: MousePointer,
      description: 'vs last month'
    },
    {
      title: 'Phone Calls',
      value: callsThisMonth.toLocaleString(),
      change: '+15.2%',
      isPositive: true,
      icon: Phone,
      description: 'vs last month'
    },
    {
      title: 'Directions',
      value: directionsThisMonth.toLocaleString(),
      change: '-2.1%',
      isPositive: false,
      icon: MapPin,
      description: 'vs last month'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {stat.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span
                className={cn(
                  "font-medium",
                  stat.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {stat.change}
              </span>
              <span className="text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
