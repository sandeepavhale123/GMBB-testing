import React from 'react';
import { Calendar, Edit, Trash2, Copy, Eye, MousePointer, Share } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

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

interface PostListItemProps {
  post: Post;
}

export const PostListItem: React.FC<PostListItemProps> = ({ post }) => {
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
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50">
      {/* Thumbnail */}
      <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-medium">IMG</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
          <Badge className={getStatusColor(post.status)}>
            {getStatusText(post.status)}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-1 mb-1">{post.content}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(post.publishDate).toLocaleDateString()}
          </div>
          <span>{post.business}</span>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center">
          <Eye className="w-3 h-3 mr-1" />
          {post.engagement.views}
        </div>
        <div className="flex items-center">
          <MousePointer className="w-3 h-3 mr-1" />
          {post.engagement.clicks}
        </div>
        <div className="flex items-center">
          <Share className="w-3 h-3 mr-1" />
          {post.engagement.shares}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Copy className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
