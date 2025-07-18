import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { setSelectedBusiness } from '../../store/slices/mediaSlice';
import { useListingContext } from '../../context/ListingContext';
import { MediaStatsCards } from './MediaStatsCards';
import { MediaStatsChart } from './MediaStatsChart';
import { MediaMostViewedCard } from './MediaMostViewedCard';
import { MediaLibraryCard } from './MediaLibraryCard';
import { MediaFilters } from './MediaFilters';
import { MediaUploadModal } from './MediaUploadModal';
import { AIMediaGenerationModal } from './AIMediaGenerationModal';
import { Button } from '../ui/button';
import { NoListingSelected } from '../ui/no-listing-selected';
import { Upload, Sparkles, Loader2 } from 'lucide-react';

export const MediaPage = () => {
  const dispatch = useAppDispatch();
  const { selectedListing, isInitialLoading } = useListingContext();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    if (selectedListing) {
      dispatch(setSelectedBusiness(selectedListing.id));
    }
  }, [dispatch, selectedListing]);

  // Show loading state during initial load
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // Show no listing state
  if (!selectedListing && !isInitialLoading) {
    return <NoListingSelected />;
  }

  return (
    <div className="space-y-6">
      <MediaStatsCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MediaStatsChart />
        <MediaMostViewedCard />
      </div>
      <MediaFilters />
      <MediaLibraryCard />

      <div className="flex justify-end gap-2">
        <Button onClick={() => setIsAiModalOpen(true)}>
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Media with AI
        </Button>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <AIMediaGenerationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
