
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MousePointer, Navigation, Phone, MessageSquare, Monitor, MapPin, Smartphone } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const InsightsCard: React.FC = () => {
  const { 
    clicksThisMonth, 
    directionsThisMonth, 
    callsThisMonth, 
    messagesThisMonth,
    searchBreakdown 
  } = useAppSelector((state) => state.dashboard);

  const insights = [
    {
      icon: MousePointer,
      label: 'Website Cli...',
      value: clicksThisMonth,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Navigation,
      label: 'Directions',
      value: directionsThisMonth,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Phone,
      label: 'Phone Calls',
      value: callsThisMonth,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      value: messagesThisMonth,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Monitor,
      label: 'Desktop Se...',
      value: searchBreakdown.desktop,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      icon: MapPin,
      label: 'Desktop Ma...',
      value: 14,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Smartphone,
      label: 'Mobile Sear...',
      value: searchBreakdown.mobile,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      icon: MapPin,
      label: 'Mobile Maps',
      value: 36,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Insights</CardTitle>
          <span className="text-sm font-medium text-gray-500">Last 30 Days</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-10 h-10 ${insight.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <insight.icon className={`w-5 h-5 ${insight.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500 truncate mb-1">{insight.label}</p>
                <p className="text-xl font-bold text-gray-900">{insight.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
