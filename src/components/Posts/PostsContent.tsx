
import React from 'react';
import { Button } from '../ui/button';
import { PostCard } from './PostCard';
import { PostListItem } from './PostListItem';

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

interface PostsContentProps {
  posts: Post[];
  viewMode: 'grid' | 'list';
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  onPageChange: (page: number) => void;
}

export const PostsContent: React.FC<PostsContentProps> = ({
  posts,
  viewMode,
  pagination,
  onPageChange
}) => {
  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border divide-y">
          {posts.map(post => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevious}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};
