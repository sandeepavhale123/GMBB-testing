
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface CreatePostCardProps {
  onCreatePost: () => void;
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({ onCreatePost }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Create Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Plus className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Create engaging posts</p>
          </div>
        </div>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          onClick={onCreatePost}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </CardContent>
    </Card>
  );
};
