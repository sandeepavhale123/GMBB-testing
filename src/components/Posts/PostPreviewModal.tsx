
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { PostPreview } from './PostPreview';
import { PostPreviewErrorBoundary } from './PostPreviewErrorBoundary';

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    description: string;
    ctaButton: string;
    ctaUrl: string;
    image: File | string | null;
    platforms: string[];
  };
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Post Preview</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <PostPreviewErrorBoundary>
            <PostPreview data={data} />
          </PostPreviewErrorBoundary>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
