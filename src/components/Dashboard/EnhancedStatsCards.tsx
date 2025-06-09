
import React from 'react';
import { TrendingUp, TrendingDown, Eye, MousePointer, Phone, MapPin, MessageSquare, FileText, Image, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { setPeriod } from '../../store/slices/dashboardSlice';
import { cn } from '../../lib/utils';

export const EnhancedStatsCards: React.FC = () => {
  const { 
    viewsThisMonth, 
    clicksThisMonth, 
    callsThisMonth, 
    directionsThisMonth,
    messagesThisMonth,
    totalPosts,
    mediaPosts,
    reviewsResponded,
    qaAnswered,
    selectedPeriod
  } = useAppSelector((state) => state.dashboard);
  
  const dispatch = useAppDispatch();

  const stats = [
    {
      title: 'Profile Views',
      value: viewsThisMonth.toLocaleString(),
      change: '+12.3%',
      isPositive: true,
      icon: Eye,
      description: 'vs last period'
    },
    {
      title: 'Website Clicks',
      value: clicksThisMonth.toLocaleString(),
      change: '+8.7%',
      isPositive: true,
      icon: MousePointer,
      description: 'vs last period'
    },
    {
      title: 'Phone Calls',
      value: callsThisMonth.toLocaleString(),
      change: '+15.2%',
      isPositive: true,
      icon: Phone,
      description: 'vs last period'
    },
    {
      title: 'Directions',
      value: directionsThisMonth.toLocaleString(),
      change: '-2.1%',
      isPositive: false,
      icon: MapPin,
      description: 'vs last period'
    },
    {
      title: 'Messages',
      value: messagesThisMonth.toLocaleString(),
      change: '+5.4%',
      isPositive: true,
      icon: MessageSquare,
      description: 'vs last period'
    },
    {
      title: 'Total Posts',
      value: totalPosts.toLocaleString(),
      change: '+18.9%',
      isPositive: true,
      icon: FileText,
      description: 'vs last period'
    },
    {
      title: 'Media Posts',
      value: mediaPosts.toLocaleString(),
      change: '+22.1%',
      isPositive: true,
      icon: Image,
      description: 'vs last period'
    },
    {
      title: 'Reviews Responded',
      value: reviewsResponded.toLocaleString(),
      change: '+7.8%',
      isPositive: true,
      icon: MessageSquare,
      description: 'vs last period'
    },
    {
      title: 'Q&A Answered',
      value: qaAnswered.toLocaleString(),
      change: '+12.5%',
      isPositive: true,
      icon: HelpCircle,
      description: 'vs last period'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Performance Overview</h2>
        <Select value={selectedPeriod} onValueChange={(value) => dispatch(setPeriod(value))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 days</SelectItem>
            <SelectItem value="30d">30 days</SelectItem>
            <SelectItem value="90d">90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
};
