import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MediaItemType {
  url: string;
  title: string;
  source: 'local' | 'ai' | 'gallery';
  type: 'image' | 'video';
}

interface MediaContextType {
  selectedMedia: MediaItemType | null;
  selectedMediaItems: MediaItemType[];
  shouldOpenCreatePost: boolean;
  shouldOpenMediaUpload: boolean;
  setSelectedMedia: (media: MediaItemType | null) => void;
  triggerCreatePost: (media: MediaItemType) => void;
  triggerMediaUpload: (media: MediaItemType) => void;
  triggerMultiMediaUpload: (mediaItems: MediaItemType[]) => void;
  clearSelection: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaContextType['selectedMedia']>(null);
  const [selectedMediaItems, setSelectedMediaItems] = useState<MediaItemType[]>([]);
  const [shouldOpenCreatePost, setShouldOpenCreatePost] = useState(false);
  const [shouldOpenMediaUpload, setShouldOpenMediaUpload] = useState(false);

  const triggerCreatePost = (media: MediaItemType) => {
    setSelectedMedia(media);
    setSelectedMediaItems([]);
    setShouldOpenCreatePost(true);
  };

  const triggerMediaUpload = (media: MediaItemType) => {
    setSelectedMedia(media);
    setSelectedMediaItems([]);
    setShouldOpenMediaUpload(true);
  };

  const triggerMultiMediaUpload = (mediaItems: MediaItemType[]) => {
    setSelectedMedia(null);
    setSelectedMediaItems(mediaItems);
    setShouldOpenMediaUpload(true);
  };

  const clearSelection = () => {
    setSelectedMedia(null);
    setSelectedMediaItems([]);
    setShouldOpenCreatePost(false);
    setShouldOpenMediaUpload(false);
  };

  return (
    <MediaContext.Provider
      value={{
        selectedMedia,
        selectedMediaItems,
        shouldOpenCreatePost,
        shouldOpenMediaUpload,
        setSelectedMedia,
        triggerCreatePost,
        triggerMediaUpload,
        triggerMultiMediaUpload,
        clearSelection,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMediaContext = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMediaContext must be used within a MediaProvider');
  }
  return context;
};