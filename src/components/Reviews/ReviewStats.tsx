
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
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
