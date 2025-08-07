import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBulkMediaDetails } from '@/hooks/useBulkMediaDetails';
import { useDebounce } from '@/hooks/useDebounce';
import { BulkMediaPreviewSection } from '@/components/BulkMedia/BulkMediaPreviewSection';
import { BulkMediaTableSection } from '@/components/BulkMedia/BulkMediaTableSection';
export const BulkMediaDetails: React.FC = () => {
  const { bulkId } = useParams<{ bulkId: string }>();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  
  const {
    bulkMedia,
    medias,
    pagination,
    loading,
    error,
    deleteMedia,
    refresh,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    search,
    setSearch,
    status,
    setStatus
  } = useBulkMediaDetails(bulkId || '');

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 500);

  // Update search in hook when debounced value changes
  useEffect(() => {
    setSearch(debouncedSearch);
    setCurrentPage(1); // Reset to first page when searching
  }, [debouncedSearch, setSearch, setCurrentPage]);

  // Reset page when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [status, setCurrentPage]);

  const handleBack = () => {
    navigate('/main-dashboard/bulk-media');
  };
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-muted rounded"></div>
          <div className="lg:col-span-2 h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading media details: {error}</p>
        <Button onClick={refresh} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Page Header - Minimal spacing */}
      <div className="mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">View Details</h1>
          <p className="text-sm text-muted-foreground">View details of the selected bulk media</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Media Preview (Static) */}
        <BulkMediaPreviewSection bulkMedia={bulkMedia} />

        {/* Right Column - Media Listings Table (Dynamic) */}
        <BulkMediaTableSection
          medias={medias}
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          deleteMedia={deleteMedia}
          refresh={refresh}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      </div>
    </div>
  );
};