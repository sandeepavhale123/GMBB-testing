
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Calendar, Eye, MousePointer, Share } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  status: 'published' | 'draft' | 'scheduled' | 'failed';
  business: string;
  publishDate: string;
  engagement: {
    views: number;
    clicks: number;
    shares: number;
  };
}

interface PostViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

export const PostViewModal: React.FC<PostViewModalProps> = ({
  isOpen,
  onClose,
  post
}) => {
  if (!post) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Live';
      case 'scheduled':
        return 'Scheduled';
      case 'draft':
        return 'Draft';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Post Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Post Image Placeholder */}
          <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-medium">Post Image</span>
          </div>

          {/* Post Header */}
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 text-lg">{post.title}</h3>
            <Badge className={getStatusColor(post.status)}>
              {getStatusText(post.status)}
            </Badge>
          </div>

          {/* Post Content */}
          <p className="text-gray-600 text-sm leading-relaxed">{post.content}</p>

          {/* Post Meta */}
          <div className="flex items-center text-xs text-gray-500 gap-4">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(post.publishDate).toLocaleDateString()}
            </div>
            <span>{post.business}</span>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {post.engagement.views}
              </div>
              <div className="flex items-center">
                <MousePointer className="w-4 h-4 mr-1" />
                {post.engagement.clicks}
              </div>
              <div className="flex items-center">
                <Share className="w-4 h-4 mr-1" />
                {post.engagement.shares}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
