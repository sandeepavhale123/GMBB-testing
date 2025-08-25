import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
interface CreatePostCardProps {
  onCreatePost: () => void;
}
export const CreatePostCard: React.FC<CreatePostCardProps> = ({
  onCreatePost
}) => {
  return <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Create Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[230px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
        <img src="/lovable-uploads/056c9932-4b34-400d-a799-16d87f2db67d.png" alt="Attach image" className="w-[120px] h-[120px] object-fill" />
        </div>
        <Button className="w-full" onClick={onCreatePost}>
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </CardContent>
    </Card>;
};