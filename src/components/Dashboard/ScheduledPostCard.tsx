
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Eye } from 'lucide-react';

interface ScheduledPostCardProps {
  onApprovePost: () => void;
}

export const ScheduledPostCard: React.FC<ScheduledPostCardProps> = ({ onApprovePost }) => {
  const scheduledPost = {
    id: '1',
    title: 'Weekend Special Offer',
    content: 'Join us this weekend for 20% off all menu items! Perfect time to try our seasonal specialties.',
    scheduledDate: '2024-06-12 10:00 AM',
    platforms: ['Google My Business', 'Facebook']
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Scheduled Post
          </div>
          <Button variant="link" className="text-sm p-0 h-auto">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-1">{scheduledPost.title}</h4>
            <p className="text-xs text-gray-600 mb-2">{scheduledPost.content.substring(0, 60)}...</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{scheduledPost.scheduledDate}</span>
            </div>
          </div>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={onApprovePost}
          >
            <Eye className="w-4 h-4 mr-2" />
            Approve Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
