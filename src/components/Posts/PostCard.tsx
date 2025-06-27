import React, { useState } from 'react';
import { Calendar, Trash2, Copy, Eye, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter } from '../ui/card';
import { PostViewModal } from './PostViewModal';

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
  searchUrl?: string;
  media?: {
    images: string;
  };
  tags?: string;
}

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Debug logging to check post status
  console.log('PostCard - Post ID:', post.id, 'Status:', post.status, 'Post:', post);

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

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        {/* Post Image */}
        <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden relative">
          {post.media?.images ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500 text-sm font-medium">Image not available</span>
                </div>
              ) : (
                <img 
                  src={post.media.images} 
                  alt="Post" 
                  className="w-full h-full object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-500 text-sm font-medium">Image not available</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {post.title || 'Untitled Post'}
            </h3>
            <Badge className={getStatusColor(post.status)}>
              {getStatusText(post.status)}
            </Badge>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
          
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(post.publishDate).toLocaleDateString()}
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="text-xs text-blue-600 mb-2">
              {post.tags}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between">
         
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setIsViewModalOpen(true)}
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Copy className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <PostViewModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        post={post}
      />
    </>
  );
};
