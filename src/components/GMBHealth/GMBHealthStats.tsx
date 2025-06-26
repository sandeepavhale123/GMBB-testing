
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { CircularProgress } from '../ui/circular-progress';
import { Star, MessageSquare, HelpCircle, Camera, FileText, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  isProgress?: boolean;
  progressValue?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isProgress, progressValue }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: color }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            {isProgress ? (
              <div className="flex items-center gap-3">
                <CircularProgress value={progressValue || 0} size={40} strokeWidth={4} className="text-green-500">
                  <span className="text-xs font-bold">{progressValue}%</span>
                </CircularProgress>
              </div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            )}
          </div>
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20`, color }}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const GMBHealthStats: React.FC = () => {
  const stats = [
    {
      title: 'GMB Health Score',
      value: 83,
      icon: <TrendingUp className="h-5 w-5" />,
      color: '#10B981',
      isProgress: true,
      progressValue: 83,
    },
    {
      title: 'No. of Reviews',
      value: 8,
      icon: <MessageSquare className="h-5 w-5" />,
      color: '#3B82F6',
    },
    {
      title: 'Q&A',
      value: 0,
      icon: <HelpCircle className="h-5 w-5" />,
      color: '#EF4444',
    },
    {
      title: 'GMB Avg Rating',
      value: '5.0',
      icon: <Star className="h-5 w-5" />,
      color: '#F59E0B',
    },
    {
      title: 'No. of Photos',
      value: 14,
      icon: <Camera className="h-5 w-5" />,
      color: '#8B5CF6',
    },
    {
      title: 'No. of Posts',
      value: 69,
      icon: <FileText className="h-5 w-5" />,
      color: '#06B6D4',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
