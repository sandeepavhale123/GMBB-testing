
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Building2, Star, FileText, MessageSquare } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';
import { useListingContext } from '@/context/ListingContext';

export const BusinessOverview: React.FC = () => {
  const { totalBusinesses, totalPosts, totalReviews, avgRating } = useAppSelector(
    (state) => state.dashboard
  );
  const { selectedListing } = useListingContext();

  const listingName = selectedListing?.name || "KSoft Solution";

  const overview = [
    {
      title: 'Total Businesses',
      value: totalBusinesses,
      icon: Building2,
      color: 'text-primary'
    },
    {
      title: 'Published Posts',
      value: totalPosts,
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Total Reviews',
      value: totalReviews,
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      title: 'Average Rating',
      value: avgRating.toFixed(1),
      icon: Star,
      color: 'text-primary'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Business Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Key metrics for {listingName}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {overview.map((item) => (
            <div key={item.title} className="text-center p-4 rounded-lg bg-accent/20">
              <div className="flex justify-center mb-2">
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
