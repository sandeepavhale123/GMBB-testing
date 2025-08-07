import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BulkPostPreviewSection } from '@/components/BulkPost/BulkPostPreviewSection';
import { BulkPostTableSection } from '@/components/BulkPost/BulkPostTableSection';

export const BulkPostDetails: React.FC = () => {
  const { bulkId } = useParams<{ bulkId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/main-dashboard/bulk-posts');
  };

  if (!bulkId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Error</h1>
          <p className="text-destructive mb-4">Invalid bulk post ID</p>
          <button onClick={handleBack}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BulkPostPreviewSection bulkId={bulkId} onBack={handleBack} />
        <BulkPostTableSection bulkId={bulkId} />
      </div>
    </div>
  );
};