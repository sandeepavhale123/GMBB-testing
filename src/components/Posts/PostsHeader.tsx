
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface PostsHeaderProps {
  onCreatePost: () => void;
}

export const PostsHeader: React.FC<PostsHeaderProps> = ({ onCreatePost }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
      </div>
      <Button onClick={onCreatePost} className="bg-primary hover:bg-primary/90">
        <Plus className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">Create Post</span>
      </Button>
    </div>
  );
};
