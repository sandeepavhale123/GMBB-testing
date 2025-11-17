import React, { useState, useEffect, Suspense } from "react";
import { useLocation } from "react-router-dom";
// import { Gallery } from "@/components/Media/Gallery";
// import { CreatePostModal } from "@/components/Posts/CreatePostModal";
// import { MediaUploadModal } from "@/components/Media/MediaUploadModal";
import { useMediaContext } from "@/context/MediaContext";
import { isSingleListingRoute } from "@/utils/routeUtils";

import { lazyImport } from "@/utils/lazyImport";

// Lazy imports
const Gallery = lazyImport(() =>
  import("@/components/Media/Gallery").then((mod) => ({ default: mod.Gallery }))
);
const CreatePostModal = lazyImport(() =>
  import("@/components/Posts/CreatePostModal").then((mod) => ({
    default: mod.CreatePostModal,
  }))
);
const MediaUploadModal = lazyImport(() =>
  import("@/components/Media/MediaUploadModal").then((mod) => ({
    default: mod.MediaUploadModal,
  }))
);

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
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </>
  );
};

export default GalleryPage;
