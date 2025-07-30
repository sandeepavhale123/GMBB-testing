
import React, { useState, useEffect } from 'react';
import { Gallery } from '@/components/Media/Gallery';
import { CreatePostModal } from '@/components/Posts/CreatePostModal';
import { useMediaContext } from '@/context/MediaContext';

const GalleryPage: React.FC = () => {
  const { shouldOpenCreatePost, clearSelection } = useMediaContext();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    if (shouldOpenCreatePost) {
      setIsCreatePostOpen(true);
    }
  }, [shouldOpenCreatePost]);

  const handleCloseCreatePost = () => {
    setIsCreatePostOpen(false);
    clearSelection();
  };

  return (
    <>
      <Gallery />
      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={handleCloseCreatePost}
      />
    </>
  );
};

export default GalleryPage;
