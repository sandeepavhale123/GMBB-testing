import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Gallery } from "@/components/Media/Gallery";
import { CreatePostModal } from "@/components/Posts/CreatePostModal";
import { MediaUploadModal } from "@/components/Media/MediaUploadModal";
import { useMediaContext } from "@/context/MediaContext";
import { isSingleListingRoute } from "@/utils/routeUtils";

const GalleryPage: React.FC = () => {
  const location = useLocation();
  const { shouldOpenCreatePost, shouldOpenMediaUpload, clearSelection } =
    useMediaContext();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false);

  // Single listing page: allow multi-select with limit 5
  const isSingleListing = isSingleListingRoute(location.pathname);
  const enableMultiSelect = isSingleListing;
  const maxSelectionLimit = isSingleListing ? 5 : 1;

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
    handleCloseMediaUpload();
  };

  return (
    <>
      <Gallery
        enableMultiSelect={enableMultiSelect}
        maxSelectionLimit={maxSelectionLimit}
      />
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={handleCloseCreatePost}
      />
      <MediaUploadModal
        isOpen={isMediaUploadOpen}
        onClose={handleCloseMediaUpload}
        onUpload={handleMediaUpload}
        enableMultiSelect={enableMultiSelect}
        maxSelectionLimit={maxSelectionLimit}
      />
    </>
  );
};

export default GalleryPage;
