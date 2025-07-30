import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MediaContextType {
  selectedMedia: {
    url: string;
    title: string;
    source: 'local' | 'ai';
  } | null;
  shouldOpenCreatePost: boolean;
  shouldOpenMediaUpload: boolean;
  setSelectedMedia: (media: { url: string; title: string; source: 'local' | 'ai' } | null) => void;
  triggerCreatePost: (media: { url: string; title: string; source: 'local' | 'ai' }) => void;
  triggerMediaUpload: (media: { url: string; title: string; source: 'local' | 'ai' }) => void;
  clearSelection: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaContextType['selectedMedia']>(null);
  const [shouldOpenCreatePost, setShouldOpenCreatePost] = useState(false);
  const [shouldOpenMediaUpload, setShouldOpenMediaUpload] = useState(false);

  const triggerCreatePost = (media: { url: string; title: string; source: 'local' | 'ai' }) => {
    setSelectedMedia(media);
    setShouldOpenCreatePost(true);
  };

  const triggerMediaUpload = (media: { url: string; title: string; source: 'local' | 'ai' }) => {
    setSelectedMedia(media);
    setShouldOpenMediaUpload(true);
  };

  const clearSelection = () => {
    setSelectedMedia(null);
    setShouldOpenCreatePost(false);
    setShouldOpenMediaUpload(false);
  };

  return (
    <MediaContext.Provider
      value={{
        selectedMedia,
        shouldOpenCreatePost,
        shouldOpenMediaUpload,
        setSelectedMedia,
        triggerCreatePost,
        triggerMediaUpload,
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