
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { PostCard } from './PostCard';
import { PostListItem } from './PostListItem';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Trash2 } from 'lucide-react';

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
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleSelectPost = (postId: string, isSelected: boolean) => {
    const newSelectedPosts = new Set(selectedPosts);
    if (isSelected) {
      newSelectedPosts.add(postId);
    } else {
      newSelectedPosts.delete(postId);
    }
    setSelectedPosts(newSelectedPosts);
  };

  const handleSelectAll = () => {
    if (selectedPosts.size === posts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts.map(post => post.id)));
    }
  };

  const handleDeleteSelected = () => {
    console.log('Deleting posts:', Array.from(selectedPosts));
    // Here you would implement the actual delete logic
    setSelectedPosts(new Set());
    setIsSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedPosts(new Set());
  };

  return (
    <>
      {/* Single Row Layout: Total Posts Count and Selection Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Total Posts: {posts.length}
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={toggleSelectionMode}
            size="sm"
          >
            {isSelectionMode ? 'Cancel Selection' : 'Select Posts'}
          </Button>
          
          {isSelectionMode && (
            <>
              <Button
                variant="outline"
                onClick={handleSelectAll}
                size="sm"
              >
                {selectedPosts.size === posts.length ? 'Deselect All' : 'Select All'}
              </Button>

              {selectedPosts.size > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected ({selectedPosts.size})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Posts</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedPosts.size} selected post{selectedPosts.size > 1 ? 's' : ''}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSelected}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          )}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              isSelectionMode={isSelectionMode}
              isSelected={selectedPosts.has(post.id)}
              onSelect={handleSelectPost}
            />
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
