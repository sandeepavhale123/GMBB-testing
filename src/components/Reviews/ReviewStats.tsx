
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { MessageSquare, Clock, Bot, User } from 'lucide-react';

export const ReviewStats: React.FC = () => {
  const stats = [
    {
      title: 'Total Reviews',
      value: '282',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending Replies',
      value: '12',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'AI Replies',
      value: '156',
      icon: Bot,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Manual Replies',
      value: '114',
      icon: User,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-white border border-gray-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1 truncate">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
