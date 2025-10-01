import React, { useState, useEffect } from 'react';
import { Gallery } from '@/components/Media/Gallery';
import { CreatePostModal } from '@/components/Posts/CreatePostModal';
import { MediaUploadModal } from '@/components/Media/MediaUploadModal';
import { useMediaContext } from '@/context/MediaContext';

const GalleryPage: React.FC = () => {
  const { shouldOpenCreatePost, shouldOpenMediaUpload, clearSelection } = useMediaContext();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false);

  useEffect(() => {
    if (shouldOpenCreatePost) {
      setIsCreatePostOpen(true);
    }
  }, [shouldOpenCreatePost]);

  useEffect(() => {
    if (shouldOpenMediaUpload) {
      setIsMediaUploadOpen(true);
    }
  }, [shouldOpenMediaUpload]);

  const handleCloseCreatePost = () => {
    setIsCreatePostOpen(false);
    clearSelection();
  };

  const handleCloseMediaUpload = () => {
    setIsMediaUploadOpen(false);
    clearSelection();
  };

  const handleMediaUpload = (mediaItems: any[]) => {
    // Handle successful media upload
    console.log('Media uploaded:', mediaItems);
    handleCloseMediaUpload();
  };

  return (
    <>
      <Gallery enableMultiSelect={true} maxSelectionLimit={5} />
      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={handleCloseCreatePost}
      />
      <MediaUploadModal
        isOpen={isMediaUploadOpen}
        onClose={handleCloseMediaUpload}
        onUpload={handleMediaUpload}
      />
    </>
  );
};

export { GalleryPage };