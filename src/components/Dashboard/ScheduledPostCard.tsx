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
    platforms: ['Google My Business', 'Facebook'],
    image: '/placeholder.svg'
  }, {
    id: '2',
    title: 'New Menu Launch',
    content: 'Exciting new dishes are coming to our menu this week. Stay tuned for fresh flavors and seasonal ingredients.',
    scheduledDate: '2024-06-13 02:00 PM',
    platforms: ['Instagram', 'Facebook'],
    image: '/placeholder.svg'
  }, {
    id: '3',
    title: 'Customer Appreciation Day',
    content: 'Thank you to all our loyal customers! Join us for a special appreciation event with exclusive offers.',
    scheduledDate: '2024-06-14 09:00 AM',
    platforms: ['Google My Business'],
    image: '/placeholder.svg'
  }];
  return <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Scheduled Posts
          </div>
          <Button variant="link" className="text-sm p-0 h-auto">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Sr No.</TableHead>
              <TableHead className="w-20">Post Image</TableHead>
              <TableHead>Post Description</TableHead>
              <TableHead className="w-40">Scheduled Date</TableHead>
              <TableHead className="w-32">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledPosts.map((post, index) => <TableRow key={post.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <img src={post.image} alt={post.title} className="w-12 h-12 rounded-lg object-cover" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{post.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{post.content}</p>
                    <div className="flex gap-1 flex-wrap">
                      {post.platforms.map((platform, idx) => {})}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>{post.scheduledDate}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={onApprovePost}>
                    <Eye className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
};