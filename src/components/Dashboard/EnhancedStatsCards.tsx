
import React from 'react';
import { TrendingUp, TrendingDown, FileText, Image, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { setPeriod } from '../../store/slices/dashboardSlice';
import { cn } from '../../lib/utils';
import { useOverviewData } from '../../api/overviewApi';
import { useListingContext } from '@/context/ListingContext';
import { Skeleton } from '../ui/skeleton';

export const EnhancedStatsCards: React.FC = () => {
  const { selectedListing } = useListingContext();
  const { data: overviewData, loading } = useOverviewData(
    selectedListing?.id ? parseInt(selectedListing.id) : null
  );
  const dispatch = useAppDispatch();
  
  const stats = [
    {
      title: 'Total Posts',
      value: overviewData?.totalPosts?.toLocaleString() || '0',
      change: '+18.9%',
      isPositive: true,
      icon: FileText,
      description: 'vs last period',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Total Media',
      value: overviewData?.totalMedia?.toLocaleString() || '0',
      change: '+22.1%',
      isPositive: true,
      icon: Image,
      description: 'vs last period',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Total Reviews',
      value: overviewData?.totalReview?.toLocaleString() || '0',
      change: '+7.8%',
      isPositive: true,
      icon: MessageSquare,
      description: 'vs last period',
      color: 'from-green-500 to-green-600'
    }
  ];
  
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="border-gray-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-xl" />
              </CardHeader>
              <CardContent className="pt-0">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Responsive grid - back to 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-200 border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">
                {stat.title}
              </CardTitle>
              <div className={cn("p-1.5 sm:p-2.5 rounded-xl shadow-sm bg-gradient-to-br", stat.color)}>
                <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="flex items-center gap-1 text-xs">
                {stat.isPositive ? (
                  <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-600" />
                )}
                <span className={cn("font-semibold", stat.isPositive ? "text-emerald-600" : "text-red-600")}>
                  {stat.change}
                </span>
                <span className="text-gray-500 font-medium hidden sm:inline">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
