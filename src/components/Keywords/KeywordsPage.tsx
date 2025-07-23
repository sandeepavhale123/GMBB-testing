
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { AddKeywordModal } from './AddKeywordModal';
import { KeywordsTable } from './KeywordsTable';
import { KeywordsPagination } from './KeywordsPagination';
import { useKeywordsPage } from '../../hooks/useKeywordsPage';
import { useListingContext } from '../../context/ListingContext';

export const KeywordsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedListing } = useListingContext();
  
  const {
    keywords,
    loading,
    error,
    currentPage,
    totalPages,
    handleAddKeywords,
    handleCheckRanks,
    handleExport,
    handlePageChange
  } = useKeywordsPage(selectedListing?.id || '');

  if (!selectedListing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No Business Selected</h3>
          <p className="text-muted-foreground">Please select a business to view keywords.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Keywords</h1>
          <p className="text-muted-foreground">
            Manage and track keyword rankings for {selectedListing.name}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Keyword
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <KeywordsTable
        keywords={keywords}
        loading={loading}
        onExport={handleExport}
      />

      <KeywordsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AddKeywordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddKeywords={handleAddKeywords}
        onCheckRanks={handleCheckRanks}
      />
    </div>
  );
};
