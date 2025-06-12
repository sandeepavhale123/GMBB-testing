
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface ScheduledPostCardProps {
  onApprovePost: () => void;
}

export const ScheduledPostCard: React.FC<ScheduledPostCardProps> = ({
  onApprovePost
}) => {
  const scheduledPosts = [{
    id: '1',
    title: 'Weekend Special Offer',
    content: 'Join us this weekend for 20% off all menu items! Perfect time to try our seasonal specialties.',
    scheduledDate: '2024-06-12 10:00 AM',
    image: '/placeholder.svg'
  }, {
    id: '2',
    title: 'New Menu Launch',
    content: 'Exciting new dishes are coming to our menu this week. Stay tuned for fresh flavors and seasonal ingredients.',
    scheduledDate: '2024-06-13 02:00 PM',
    image: '/placeholder.svg'
  }, {
    id: '3',
    title: 'Customer Appreciation Day',
    content: 'Thank you to all our loyal customers! Join us for a special appreciation event with exclusive offers.',
    scheduledDate: '2024-06-14 09:00 AM',
    image: '/placeholder.svg'
  }];
  
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Scheduled Posts</span>
          </div>
          <Button variant="link" className="text-xs sm:text-sm p-0 h-auto">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Post Image</TableHead>
                <TableHead>Post Description</TableHead>
                <TableHead className="w-40">Scheduled Date</TableHead>
                <TableHead className="w-32 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledPosts.map((post, index) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <img src={post.image} alt={post.title} className="w-12 h-12 rounded-lg object-cover" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{post.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{post.content}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{post.scheduledDate}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={onApprovePost}>
                      <Eye className="w-3 h-3 mr-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {scheduledPosts.map((post) => (
            <Card key={post.id} className="border border-gray-200">
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <img src={post.image} alt={post.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-sm text-gray-900 truncate">{post.title}</h4>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 flex-shrink-0" onClick={onApprovePost}>
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{post.scheduledDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
